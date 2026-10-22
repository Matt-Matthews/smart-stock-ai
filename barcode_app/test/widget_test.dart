import 'dart:convert';

import 'package:barcode_app/main.dart';
import 'package:barcode_app/models.dart';
import 'package:barcode_app/services/smartstock_api.dart';
import 'package:barcode_app/theme_preferences.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';

void main() {
  test('sends the login access token as a Bearer token to GraphQL', () async {
    final session = AuthSession(
      accessToken: 'signed-access-token',
      companyId: 'company-1',
      email: 'employee@example.com',
      employeeName: 'Taylor Employee',
    );
    final client = MockClient((request) async {
      expect(request.headers['authorization'], 'Bearer signed-access-token');
      expect(request.url.path, '/api/v1/graphql');
      return http.Response(
        jsonEncode({
          'data': {'itemsByCompany': [], 'inventoryByCompany': []},
        }),
        200,
      );
    });
    final service = SmartStockApi(
      apiBaseUrl: 'https://api.example.com/api/v1',
      client: client,
    );

    await service.fetchProducts(session);

    client.close();
  });

  testWidgets('requires employee login before showing inventory', (
    WidgetTester tester,
  ) async {
    await tester.pumpWidget(
      SmartStockApp(
        service: _FakeSmartStockService(),
        themeModeStore: _MemoryThemeModeStore(),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.text('Welcome Back'), findsOneWidget);
    expect(find.text('Receive stock'), findsNothing);
    expect(find.byKey(const Key('email-field')), findsOneWidget);
    expect(find.text('SmartStock API URL'), findsNothing);
  });

  testWidgets(
    'adds a scanned product to the list before purchase confirmation',
    (WidgetTester tester) async {
      final service = _FakeSmartStockService();
      await tester.pumpWidget(
        SmartStockApp(
          service: service,
          themeModeStore: _MemoryThemeModeStore(),
        ),
      );
      await tester.pumpAndSettle();

      await tester.enterText(
        find.byKey(const Key('email-field')),
        'employee@example.com',
      );
      await tester.enterText(
        find.byKey(const Key('password-field')),
        'password',
      );
      await tester.tap(find.text('Sign in'));
      await tester.pumpAndSettle();

      expect(find.text('Receive stock'), findsOneWidget);
      expect(service.recordedPurchases, isEmpty);

      await tester.enterText(
        find.byKey(const Key('barcode-field')),
        '0012345678905',
      );
      await tester.tap(find.text('Add'));
      await tester.pumpAndSettle();

      await tester.scrollUntilVisible(
        find.byKey(const Key('confirm-purchase-button')),
        300,
        scrollable: find.byType(Scrollable).first,
      );
      await tester.pumpAndSettle();
      expect(find.text('Organic oat milk'), findsOneWidget);
      expect(find.text('Confirm purchase · 1 unit'), findsOneWidget);
      expect(service.recordedPurchases, isEmpty);

      await tester.tap(find.byKey(const Key('confirm-purchase-button')));
      await tester.pump(const Duration(milliseconds: 100));
      await tester.pumpAndSettle();

      expect(service.recordedPurchases, hasLength(1));
      expect(service.recordedPurchases.single.single.productId, 'product-1');
      expect(service.recordedPurchases.single.single.quantity, 1);
      expect(find.text('Purchase confirmed'), findsOneWidget);
      expect(find.text('Organic oat milk'), findsOneWidget);
    },
  );

  testWidgets('adds a product from the searchable product list', (
    WidgetTester tester,
  ) async {
    final service = _FakeSmartStockService();
    await tester.pumpWidget(
      SmartStockApp(service: service, themeModeStore: _MemoryThemeModeStore()),
    );
    await tester.pumpAndSettle();

    await tester.enterText(
      find.byKey(const Key('email-field')),
      'employee@example.com',
    );
    await tester.enterText(find.byKey(const Key('password-field')), 'password');
    await tester.tap(find.text('Sign in'));
    await tester.pumpAndSettle();

    await tester.tap(find.byKey(const Key('browse-products-button')));
    await tester.pumpAndSettle();
    expect(find.text('Choose a product'), findsOneWidget);

    await tester.enterText(
      find.byKey(const Key('product-search-field')),
      'cereal sku-002',
    );
    await tester.pumpAndSettle();

    expect(find.text('Granola cereal'), findsOneWidget);
    expect(find.text('Organic oat milk'), findsNothing);
    await tester.tap(find.byKey(const Key('product-option-product-2')));
    await tester.pumpAndSettle();

    await tester.scrollUntilVisible(
      find.byKey(const Key('basket-product-product-2')),
      300,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.scrollUntilVisible(
      find.byKey(const Key('confirm-purchase-button')),
      300,
      scrollable: find.byType(Scrollable).first,
    );
    await tester.pumpAndSettle();
    expect(find.text('Granola cereal'), findsOneWidget);
    expect(find.text('Confirm purchase · 1 unit'), findsOneWidget);
    expect(service.recordedPurchases, isEmpty);
  });

  testWidgets('switches and remembers system, light, and dark appearances', (
    WidgetTester tester,
  ) async {
    final preferences = _MemoryThemeModeStore();
    await tester.pumpWidget(
      SmartStockApp(
        service: _FakeSmartStockService(),
        themeModeStore: preferences,
      ),
    );
    await tester.pumpAndSettle();

    for (final mode in ThemeMode.values) {
      await tester.tap(find.byKey(const Key('theme-mode-menu')));
      await tester.pumpAndSettle();
      await tester.tap(
        find.text(switch (mode) {
          ThemeMode.system => 'System',
          ThemeMode.light => 'Light',
          ThemeMode.dark => 'Dark',
        }),
      );
      await tester.pumpAndSettle();

      expect(
        tester.widget<MaterialApp>(find.byType(MaterialApp)).themeMode,
        mode,
      );
      expect(preferences.mode, mode);
    }
  });
}

class _FakeSmartStockService implements SmartStockService {
  final recordedPurchases = <List<PurchaseLine>>[];

  @override
  Future<List<StockProduct>> fetchProducts(AuthSession session) async => const [
    StockProduct(
      id: 'product-1',
      name: 'Organic oat milk',
      barcode: '0012345678905',
      quantity: 8,
    ),
    StockProduct(
      id: 'product-2',
      name: 'Granola cereal',
      barcode: null,
      sku: 'SKU-002',
      quantity: 3,
    ),
  ];

  @override
  Future<AuthSession> login({
    required String email,
    required String password,
  }) async => AuthSession(
    accessToken: 'test-token',
    companyId: 'company-1',
    email: email,
    employeeName: 'Taylor Employee',
  );

  @override
  Future<void> recordPurchase(
    AuthSession session,
    List<PurchaseLine> items,
  ) async {
    recordedPurchases.add(items);
  }

  @override
  Future<void> logout() async {}

  @override
  Future<AuthSession?> restoreSession() async => null;
}

class _MemoryThemeModeStore implements ThemeModeStore {
  ThemeMode mode = ThemeMode.system;

  @override
  Future<ThemeMode> load() async => mode;

  @override
  Future<void> save(ThemeMode newMode) async {
    mode = newMode;
  }
}
