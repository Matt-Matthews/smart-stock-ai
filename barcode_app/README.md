# SmartStock Barcode App

Flutter app for employees to sign in, scan product barcodes, review a purchase list, and confirm received stock into SmartStock inventory.

## Run

1. Start the SmartStock service and make its API reachable from the device.
2. Set `API_BASE_URL` in `barcode_app/.env`. It defaults to `http://10.0.2.2:5000/api/v1` for the Android emulator. Use a reachable address for a physical device and your server's HTTPS URL for deployed environments. `.env.example` shows the expected format.
3. From `barcode_app`, run `flutter pub get` and `flutter run`.
4. Sign in with an employee account, scan or enter barcodes, or choose a product from the searchable product list if scanning fails. Adjust quantities as needed, then confirm the purchase.

The app authenticates through `/auth/login`, reads the signed-in company's products and current inventory through GraphQL, and submits a purchase using the `recordPurchase` mutation. The service validates the access token, restricts the purchase to the employee's company, and records purchase transactions and stock changes in one database transaction.

Camera access is requested only when opening the barcode scanner. The API URL is loaded from `.env` and is not editable in the app. The access token is stored using platform secure storage and removed when the employee signs out. `.env` is bundled into the client app, so it should contain configuration such as the API URL, never credentials or other secrets.

The appearance menu on the sign-in and stock screens supports system, light, and dark themes. Your selection is saved in platform secure storage.
