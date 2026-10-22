class AuthSession {
  const AuthSession({
    required this.accessToken,
    required this.companyId,
    required this.email,
    required this.employeeName,
  });

  final String accessToken;
  final String companyId;
  final String email;
  final String employeeName;

  Map<String, Object?> toJson() => {
    'accessToken': accessToken,
    'companyId': companyId,
    'email': email,
    'employeeName': employeeName,
  };

  factory AuthSession.fromJson(Map<String, dynamic> json) => AuthSession(
    accessToken: json['accessToken'] as String,
    companyId: json['companyId'] as String,
    email: json['email'] as String,
    employeeName: json['employeeName'] as String,
  );
}

class StockProduct {
  const StockProduct({
    required this.id,
    required this.name,
    required this.barcode,
    required this.quantity,
    this.sku,
    this.description,
  });

  final String id;
  final String name;
  final String? barcode;
  final int quantity;
  final String? sku;
  final String? description;
}

class PurchaseLine {
  const PurchaseLine({required this.productId, required this.quantity});

  final String productId;
  final int quantity;
}
