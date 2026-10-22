import 'dart:convert';

import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;

import '../models.dart';

abstract interface class SmartStockService {
  Future<AuthSession?> restoreSession();
  Future<AuthSession> login({required String email, required String password});
  Future<List<StockProduct>> fetchProducts(AuthSession session);
  Future<void> recordPurchase(AuthSession session, List<PurchaseLine> items);
  Future<void> logout();
}

class SmartStockApi implements SmartStockService {
  SmartStockApi({
    required this.apiBaseUrl,
    http.Client? client,
    FlutterSecureStorage? secureStorage,
  }) : _client = client ?? http.Client(),
       _secureStorage = secureStorage ?? const FlutterSecureStorage();

  static const _sessionKey = 'smartstock_session';

  final http.Client _client;
  final FlutterSecureStorage _secureStorage;
  final String apiBaseUrl;

  @override
  Future<AuthSession?> restoreSession() async {
    final encoded = await _secureStorage.read(key: _sessionKey);
    if (encoded == null) return null;
    final data = jsonDecode(encoded) as Map<String, dynamic>;
    return AuthSession.fromJson(data);
  }

  @override
  Future<AuthSession> login({
    required String email,
    required String password,
  }) async {
    final baseUrl = _normalizeBaseUrl(apiBaseUrl);
    final uri = Uri.parse('$baseUrl/auth/login');
    final credentials = base64Encode(utf8.encode('$email:$password'));
    final response = await _client.post(
      uri,
      headers: {'Authorization': 'Basic $credentials'},
    );
    final body = _decodeResponse(response);
    final data = body['data'] as Map<String, dynamic>?;
    final accessToken = data?['accessToken'] as String?;
    if (accessToken == null || accessToken.isEmpty) {
      throw const SmartStockApiException(
        'The server did not return an access token.',
      );
    }

    final tokenPayload = _decodeJwtPayload(accessToken);
    final tokenUser = tokenPayload['user'] as Map<String, dynamic>? ?? {};
    final responseUser = data?['user'] as Map<String, dynamic>? ?? {};
    final company = responseUser['company'] as Map<String, dynamic>? ?? {};
    final companyId =
        tokenUser['company_id'] as String? ??
        tokenUser['companyId'] as String? ??
        responseUser['company_id'] as String? ??
        company['id'] as String?;
    if (companyId == null || companyId.isEmpty) {
      throw const SmartStockApiException(
        'Your account is not linked to a SmartStock company.',
      );
    }

    final session = AuthSession(
      accessToken: accessToken,
      companyId: companyId,
      email: responseUser['email'] as String? ?? email,
      employeeName: _employeeName(responseUser, tokenUser),
    );
    await _secureStorage.write(
      key: _sessionKey,
      value: jsonEncode(session.toJson()),
    );
    return session;
  }

  @override
  Future<List<StockProduct>> fetchProducts(AuthSession session) async {
    const query = r'''
      query CompanyProducts($companyId: String!, $company_id: String!) {
        itemsByCompany(companyId: $companyId) {
          id
          name
          description
          barcode
          sku
        }
        inventoryByCompany(company_id: $company_id) {
          item_id
          quantity
        }
      }
    ''';
    final data = await _graphql(session, query, {
      'companyId': session.companyId,
      'company_id': session.companyId,
    });
    final inventoryByItem = <String, int>{};
    for (final entry in data['inventoryByCompany'] as List<dynamic>) {
      final inventory = entry as Map<String, dynamic>;
      inventoryByItem[inventory['item_id'] as String] =
          inventory['quantity'] as int;
    }

    return (data['itemsByCompany'] as List<dynamic>)
        .map((entry) {
          final item = entry as Map<String, dynamic>;
          final id = item['id'] as String;
          return StockProduct(
            id: id,
            name: item['name'] as String,
            description: item['description'] as String?,
            barcode: item['barcode'] as String?,
            sku: item['sku'] as String?,
            quantity: inventoryByItem[id] ?? 0,
          );
        })
        .toList(growable: false);
  }

  @override
  Future<void> recordPurchase(
    AuthSession session,
    List<PurchaseLine> items,
  ) async {
    const mutation = r'''
      mutation RecordPurchase($companyId: String!, $items: [PurchaseItemInput!]!) {
        recordPurchase(company_id: $companyId, items: $items) {
          id
          quantity
          type
        }
      }
    ''';
    await _graphql(session, mutation, {
      'companyId': session.companyId,
      'items': items
          .map((item) => {'item_id': item.productId, 'quantity': item.quantity})
          .toList(growable: false),
    });
  }

  @override
  Future<void> logout() async {
    await _secureStorage.delete(key: _sessionKey);
  }

  Future<Map<String, dynamic>> _graphql(
    AuthSession session,
    String query,
    Map<String, Object?> variables,
  ) async {
    final uri = Uri.parse('${_normalizeBaseUrl(apiBaseUrl)}/graphql');
    final response = await _client.post(
      uri,
      headers: {
        'Authorization': 'Bearer ${session.accessToken}',
        'Content-Type': 'application/json',
      },
      body: jsonEncode({'query': query, 'variables': variables}),
    );
    final body = _decodeResponse(response);
    final errors = body['errors'] as List<dynamic>?;
    if (errors != null && errors.isNotEmpty) {
      final error = errors.first as Map<String, dynamic>;
      throw SmartStockApiException(
        error['message'] as String? ?? 'The SmartStock request failed.',
      );
    }
    final data = body['data'] as Map<String, dynamic>?;
    if (data == null) {
      throw const SmartStockApiException(
        'The server returned an empty response.',
      );
    }
    return data;
  }

  Map<String, dynamic> _decodeResponse(http.Response response) {
    final decoded = jsonDecode(response.body);
    final body = decoded is Map<String, dynamic>
        ? decoded
        : <String, dynamic>{};
    if (response.statusCode < 200 || response.statusCode >= 300) {
      throw SmartStockApiException(
        body['message'] as String? ??
            body['error'] as String? ??
            'SmartStock returned HTTP ${response.statusCode}.',
      );
    }
    if (body['status'] == 'error') {
      throw SmartStockApiException(
        body['message'] as String? ?? 'The SmartStock request failed.',
      );
    }
    return body;
  }

  String _normalizeBaseUrl(String value) {
    final trimmed = value.trim().replaceFirst(RegExp(r'/+$'), '');
    final uri = Uri.tryParse(trimmed);
    if (uri == null ||
        (uri.scheme != 'http' && uri.scheme != 'https') ||
        uri.host.isEmpty ||
        uri.hasQuery ||
        uri.hasFragment) {
      throw const SmartStockApiException(
        'Enter a valid API URL, such as https://your-server/api/v1.',
      );
    }
    return trimmed;
  }

  Map<String, dynamic> _decodeJwtPayload(String token) {
    final parts = token.split('.');
    if (parts.length != 3) {
      throw const SmartStockApiException(
        'The server returned an invalid access token.',
      );
    }
    try {
      final normalized = base64Url.normalize(parts[1]);
      final decoded = jsonDecode(utf8.decode(base64Url.decode(normalized)));
      if (decoded is Map<String, dynamic>) return decoded;
    } on FormatException {
      throw const SmartStockApiException(
        'The server returned an invalid access token.',
      );
    }
    throw const SmartStockApiException(
      'The server returned an invalid access token.',
    );
  }

  String _employeeName(
    Map<String, dynamic> responseUser,
    Map<String, dynamic> tokenUser,
  ) {
    final firstName =
        responseUser['firstName'] as String? ??
        tokenUser['firstName'] as String? ??
        tokenUser['first_name'] as String? ??
        '';
    final lastName =
        responseUser['lastName'] as String? ??
        tokenUser['lastName'] as String? ??
        tokenUser['last_name'] as String? ??
        '';
    final fullName = '$firstName $lastName'.trim();
    return fullName.isEmpty
        ? responseUser['email'] as String? ?? 'Employee'
        : fullName;
  }
}

class SmartStockApiException implements Exception {
  const SmartStockApiException(this.message);

  final String message;

  @override
  String toString() => message;
}
