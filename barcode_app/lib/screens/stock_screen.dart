import 'package:flutter/material.dart';

import '../models.dart';
import '../services/smartstock_api.dart';
import '../widgets/theme_mode_menu.dart';
import 'barcode_scanner_screen.dart';

class StockScreen extends StatefulWidget {
  const StockScreen({
    required this.service,
    required this.session,
    required this.onLogout,
    required this.themeMode,
    required this.onThemeModeChanged,
    super.key,
  });

  final SmartStockService service;
  final AuthSession session;
  final Future<void> Function() onLogout;
  final ThemeMode themeMode;
  final ValueChanged<ThemeMode> onThemeModeChanged;

  @override
  State<StockScreen> createState() => _StockScreenState();
}

class _StockScreenState extends State<StockScreen> {
  final _barcodeController = TextEditingController();
  List<StockProduct> _products = const [];
  final Map<String, int> _basket = {};
  bool _isLoading = true;
  bool _isSubmitting = false;
  String? _loadError;

  int get _totalUnits =>
      _basket.values.fold(0, (total, value) => total + value);

  @override
  void initState() {
    super.initState();
    _loadProducts();
  }

  @override
  void dispose() {
    _barcodeController.dispose();
    super.dispose();
  }

  Future<void> _loadProducts() async {
    setState(() {
      _isLoading = true;
      _loadError = null;
    });
    try {
      final products = await widget.service.fetchProducts(widget.session);
      if (mounted) setState(() => _products = products);
    } catch (error) {
      if (mounted) setState(() => _loadError = error.toString());
    } finally {
      if (mounted) setState(() => _isLoading = false);
    }
  }

  void _addBarcode(String rawValue) {
    final barcode = rawValue.trim();
    if (barcode.isEmpty) return;
    final matches = _products
        .where((product) => product.barcode?.trim() == barcode)
        .toList(growable: false);
    if (matches.isEmpty) {
      _showMessage('No SmartStock product matches that barcode.');
      return;
    }
    if (matches.length > 1) {
      _showMessage(
        'This barcode matches more than one product. Ask a manager to check it.',
      );
      return;
    }
    _addProduct(matches.single);
    _barcodeController.clear();
  }

  void _addProduct(StockProduct product) {
    setState(() {
      _basket.update(product.id, (quantity) => quantity + 1, ifAbsent: () => 1);
    });
    _showMessage('${product.name} added to the purchase list.');
  }

  Future<void> _browseProducts() async {
    final product = await showModalBottomSheet<StockProduct>(
      context: context,
      isScrollControlled: true,
      useSafeArea: true,
      backgroundColor: Colors.transparent,
      builder: (context) => FractionallySizedBox(
        heightFactor: 0.85,
        child: _ProductPickerSheet(products: _products),
      ),
    );
    if (product != null && mounted) _addProduct(product);
  }

  Future<void> _openScanner() async {
    final barcode = await Navigator.of(context).push<String>(
      MaterialPageRoute(builder: (_) => const BarcodeScannerScreen()),
    );
    if (barcode != null && mounted) _addBarcode(barcode);
  }

  void _changeQuantity(StockProduct product, int change) {
    final quantity = (_basket[product.id] ?? 0) + change;
    setState(() {
      if (quantity <= 0) {
        _basket.remove(product.id);
      } else {
        _basket[product.id] = quantity;
      }
    });
  }

  Future<void> _confirmPurchase() async {
    if (_basket.isEmpty || _isSubmitting) return;
    final receipt = _products
        .where((product) => _basket.containsKey(product.id))
        .map((product) => (product: product, quantity: _basket[product.id]!))
        .toList(growable: false);
    setState(() => _isSubmitting = true);
    try {
      await widget.service.recordPurchase(
        widget.session,
        receipt
            .map(
              (line) => PurchaseLine(
                productId: line.product.id,
                quantity: line.quantity,
              ),
            )
            .toList(growable: false),
      );
      if (!mounted) return;
      final receivedQuantities = {
        for (final line in receipt) line.product.id: line.quantity,
      };
      setState(() {
        _basket.clear();
        _products = _products
            .map(
              (product) => StockProduct(
                id: product.id,
                name: product.name,
                barcode: product.barcode,
                description: product.description,
                sku: product.sku,
                quantity:
                    product.quantity + (receivedQuantities[product.id] ?? 0),
              ),
            )
            .toList(growable: false);
        _isSubmitting = false;
      });
      await _showReceipt(receipt);
    } catch (error) {
      if (mounted) {
        setState(() => _isSubmitting = false);
        _showMessage('Purchase was not confirmed: $error');
      }
    }
  }

  Future<void> _showReceipt(
    List<({StockProduct product, int quantity})> receipt,
  ) {
    return showDialog<void>(
      context: context,
      builder: (context) => AlertDialog(
        icon: Icon(
          Icons.check_circle_outline,
          color: Theme.of(context).colorScheme.primary,
        ),
        title: const Text('Purchase confirmed'),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Received and added to inventory:'),
            const SizedBox(height: 12),
            ...receipt.map(
              (line) => Padding(
                padding: const EdgeInsets.symmetric(vertical: 4),
                child: Row(
                  children: [
                    Expanded(child: Text(line.product.name)),
                    Text('× ${line.quantity}'),
                  ],
                ),
              ),
            ),
          ],
        ),
        actions: [
          FilledButton(
            onPressed: () => Navigator.of(context).pop(),
            child: const Text('Done'),
          ),
        ],
      ),
    );
  }

  void _showMessage(String message) {
    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(SnackBar(content: Text(message)));
  }

  Future<void> _confirmSignOut() async {
    final shouldSignOut = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Sign out?'),
        content: const Text('Your unconfirmed scan list will be cleared.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(false),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () => Navigator.of(context).pop(true),
            child: const Text('Sign out'),
          ),
        ],
      ),
    );
    if (shouldSignOut == true) await widget.onLogout();
  }

  @override
  Widget build(BuildContext context) {
    final employeeName = widget.session.employeeName;
    final colors = Theme.of(context).colorScheme;
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(7),
              child: Image.asset(
                'assets/transparent-logo.png',
                width: 30,
                height: 30,
                fit: BoxFit.contain,
              ),
            ),
            const SizedBox(width: 9),
            const Text(
              'SmartStock AI',
              style: TextStyle(fontWeight: FontWeight.w700),
            ),
          ],
        ),
        actions: [
          ThemeModeMenu(
            mode: widget.themeMode,
            onChanged: widget.onThemeModeChanged,
          ),
          IconButton(
            tooltip: 'Sign out',
            onPressed: _confirmSignOut,
            icon: const Icon(Icons.logout),
          ),
          const SizedBox(width: 4),
        ],
      ),
      body: SafeArea(
        child: RefreshIndicator(
          onRefresh: _loadProducts,
          child: ListView(
            padding: const EdgeInsets.fromLTRB(20, 12, 20, 34),
            children: [
              Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Hi, $employeeName',
                          style: TextStyle(
                            color: colors.onSurfaceVariant,
                            fontSize: 14,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        const SizedBox(height: 5),
                        Text(
                          'Receive stock',
                          style: Theme.of(context).textTheme.headlineMedium
                              ?.copyWith(
                                fontWeight: FontWeight.w800,
                                letterSpacing: -0.8,
                              ),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    width: 44,
                    height: 44,
                    decoration: BoxDecoration(
                      color: colors.primaryContainer,
                      borderRadius: BorderRadius.circular(15),
                    ),
                    child: Icon(
                      Icons.inventory_2_outlined,
                      color: colors.onPrimaryContainer,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 10),
              Text(
                'Scan products from a purchase, review the list, then add them to inventory.',
                style: TextStyle(
                  color: colors.onSurfaceVariant,
                  height: 1.45,
                ),
              ),
              const SizedBox(height: 22),
              _SummaryCard(
                productCount: _basket.length,
                totalUnits: _totalUnits,
              ),
              const SizedBox(height: 25),
              Text(
                'Add products',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.w700,
                  letterSpacing: -0.3,
                ),
              ),
              const SizedBox(height: 12),
              SizedBox(
                height: 60,
                child: FilledButton.icon(
                  onPressed: _isLoading || _loadError != null
                      ? null
                      : _openScanner,
                  icon: const Icon(Icons.qr_code_scanner),
                  label: const Text(
                    'Scan barcode',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.w700),
                  ),
                ),
              ),
              const SizedBox(height: 9),
              SizedBox(
                height: 52,
                child: OutlinedButton.icon(
                  key: const Key('browse-products-button'),
                  onPressed: _isLoading || _loadError != null
                      ? null
                      : _browseProducts,
                  icon: const Icon(Icons.search),
                  label: const Text('Choose from product list'),
                ),
              ),
              const SizedBox(height: 11),
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      key: const Key('barcode-field'),
                      controller: _barcodeController,
                      textInputAction: TextInputAction.done,
                      onSubmitted: _addBarcode,
                      decoration: const InputDecoration(
                        hintText: 'Enter barcode manually',
                        prefixIcon: Icon(Icons.keyboard_outlined),
                        contentPadding: EdgeInsets.symmetric(vertical: 14),
                      ),
                    ),
                  ),
                  const SizedBox(width: 9),
                  SizedBox(
                    height: 54,
                    child: OutlinedButton(
                      onPressed: _isLoading || _loadError != null
                          ? null
                          : () => _addBarcode(_barcodeController.text),
                      child: const Text('Add'),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 29),
              Row(
                children: [
                  Expanded(
                    child: Text(
                      'Products in this purchase',
                      style: Theme.of(context).textTheme.titleLarge?.copyWith(
                        fontWeight: FontWeight.w700,
                        letterSpacing: -0.3,
                      ),
                    ),
                  ),
                  Text(
                    '${_basket.length} ${_basket.length == 1 ? 'item' : 'items'}',
                    style: TextStyle(
                      color: colors.onSurfaceVariant,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              if (_isLoading)
                const Padding(
                  padding: EdgeInsets.all(28),
                  child: Center(child: CircularProgressIndicator()),
                )
              else if (_loadError != null)
                _LoadErrorCard(message: _loadError!, onRetry: _loadProducts)
              else if (_basket.isEmpty)
                const _EmptyBasket()
              else
                ..._products
                    .where((product) => _basket.containsKey(product.id))
                    .map(
                      (product) => _ProductCard(
                        key: Key('basket-product-${product.id}'),
                        product: product,
                        quantity: _basket[product.id]!,
                        onDecrease: () => _changeQuantity(product, -1),
                        onIncrease: () => _changeQuantity(product, 1),
                      ),
                    ),
              const SizedBox(height: 18),
              SizedBox(
                height: 54,
                child: FilledButton(
                  key: const Key('confirm-purchase-button'),
                  onPressed: _basket.isEmpty || _isSubmitting
                      ? null
                      : _confirmPurchase,
                  child: _isSubmitting
                      ? const SizedBox(
                          height: 22,
                          width: 22,
                          child: CircularProgressIndicator(
                            color: Colors.white,
                            strokeWidth: 2,
                          ),
                        )
                      : Text(
                          'Confirm purchase · $_totalUnits ${_totalUnits == 1 ? 'unit' : 'units'}',
                          style: const TextStyle(fontWeight: FontWeight.w700),
                        ),
                ),
              ),
              const SizedBox(height: 11),
              Center(
                child: Text(
                  'Stock changes only after you confirm.',
                  style: TextStyle(
                    color: colors.onSurfaceVariant,
                    fontSize: 12,
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _ProductPickerSheet extends StatefulWidget {
  const _ProductPickerSheet({required this.products});

  final List<StockProduct> products;

  @override
  State<_ProductPickerSheet> createState() => _ProductPickerSheetState();
}

class _ProductPickerSheetState extends State<_ProductPickerSheet> {
  final _searchController = TextEditingController();
  String _searchQuery = '';

  List<StockProduct> get _filteredProducts {
    final query = _searchQuery.trim().toLowerCase();
    if (query.isEmpty) return widget.products;
    final terms = query.split(RegExp(r'\s+'));
    return widget.products
        .where(
          (product) {
            final searchableText =
                '${product.name} ${product.sku ?? ''} ${product.barcode ?? ''}'
                    .toLowerCase();
            return terms.every(searchableText.contains);
          },
        )
        .toList(growable: false);
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;
    final products = _filteredProducts;
    return Material(
      color: colors.surface,
      borderRadius: const BorderRadius.vertical(top: Radius.circular(24)),
      clipBehavior: Clip.antiAlias,
      child: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(22, 20, 22, 14),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Row(
                  children: [
                    Expanded(
                      child: Text(
                        'Choose a product',
                        style: Theme.of(context).textTheme.titleLarge?.copyWith(
                          fontSize: 21,
                          fontWeight: FontWeight.w700,
                        ),
                      ),
                    ),
                    IconButton(
                      key: const Key('close-product-picker-button'),
                      tooltip: 'Close product list',
                      onPressed: () => Navigator.of(context).pop(),
                      icon: const Icon(Icons.close),
                    ),
                  ],
                ),
                const SizedBox(height: 4),
                Text(
                  'Find the item manually and add it to this purchase.',
                  style: TextStyle(color: colors.onSurfaceVariant),
                ),
                const SizedBox(height: 16),
                TextField(
                  key: const Key('product-search-field'),
                  controller: _searchController,
                  autofocus: true,
                  onChanged: (value) => setState(() => _searchQuery = value),
                  decoration: InputDecoration(
                    hintText: 'Search name, SKU or barcode',
                    prefixIcon: const Icon(Icons.search),
                    suffixIcon: _searchQuery.isEmpty
                        ? null
                        : IconButton(
                            tooltip: 'Clear search',
                            onPressed: () {
                              _searchController.clear();
                              setState(() => _searchQuery = '');
                            },
                            icon: const Icon(Icons.close),
                          ),
                  ),
                ),
              ],
            ),
          ),
          Expanded(
            child: products.isEmpty
                ? Center(
                    child: Padding(
                      padding: const EdgeInsets.all(24),
                      child: Text(
                        widget.products.isEmpty
                            ? 'No products are available for this company.'
                            : 'No products match your search.',
                        textAlign: TextAlign.center,
                        style: TextStyle(color: colors.onSurfaceVariant),
                      ),
                    ),
                  )
                : ListView.separated(
                    padding: const EdgeInsets.fromLTRB(16, 0, 16, 20),
                    itemCount: products.length,
                    separatorBuilder: (_, _) => const SizedBox(height: 8),
                    itemBuilder: (context, index) {
                      final product = products[index];
                      return Material(
                        color: colors.surface,
                        borderRadius: BorderRadius.circular(14),
                        child: ListTile(
                          key: Key('product-option-${product.id}'),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(14),
                            side: BorderSide(color: colors.outlineVariant),
                          ),
                          onTap: () => Navigator.of(context).pop(product),
                          leading: Container(
                            width: 40,
                            height: 40,
                            decoration: BoxDecoration(
                              color: colors.primaryContainer,
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: Icon(
                              Icons.inventory_2_outlined,
                              color: colors.onPrimaryContainer,
                            ),
                          ),
                          title: Text(
                            product.name,
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                            style: TextStyle(
                              color: colors.onSurface,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          subtitle: Text(
                            [
                              if (product.sku?.isNotEmpty ?? false)
                                'SKU ${product.sku}',
                              'In stock ${product.quantity}',
                            ].join(' · '),
                          ),
                          trailing: Icon(
                            Icons.add_circle_outline,
                            color: colors.primary,
                          ),
                        ),
                      );
                    },
                  ),
          ),
        ],
      ),
    );
  }
}

class _SummaryCard extends StatelessWidget {
  const _SummaryCard({required this.productCount, required this.totalUnits});

  final int productCount;
  final int totalUnits;

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: colors.primaryContainer,
        borderRadius: BorderRadius.circular(18),
      ),
      child: Row(
        children: [
          Container(
            width: 46,
            height: 46,
            decoration: BoxDecoration(
              color: colors.surface.withValues(alpha: 0.88),
              borderRadius: BorderRadius.circular(14),
            ),
            child: Icon(
              Icons.shopping_bag_outlined,
              color: colors.onPrimaryContainer,
            ),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  '$productCount ${productCount == 1 ? 'product' : 'products'} ready',
                  style: TextStyle(
                    color: colors.onPrimaryContainer,
                    fontWeight: FontWeight.w700,
                  ),
                ),
                const SizedBox(height: 3),
                Text(
                  '$totalUnits total ${totalUnits == 1 ? 'unit' : 'units'}',
                  style: TextStyle(
                    color: colors.onPrimaryContainer.withValues(alpha: 0.8),
                    fontSize: 13,
                  ),
                ),
              ],
            ),
          ),
          Icon(
            Icons.arrow_forward_ios,
            size: 15,
            color: colors.onPrimaryContainer,
          ),
        ],
      ),
    );
  }
}

class _EmptyBasket extends StatelessWidget {
  const _EmptyBasket();

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 24),
      decoration: BoxDecoration(
        color: colors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: colors.outlineVariant),
      ),
      child: Column(
        children: [
          Icon(Icons.qr_code_2, size: 34, color: colors.onSurfaceVariant),
          const SizedBox(height: 9),
          const Text(
            'Your scan list is empty',
            style: TextStyle(fontWeight: FontWeight.w600),
          ),
          const SizedBox(height: 4),
          Text(
            'Scan or enter a product barcode to get started.',
            textAlign: TextAlign.center,
            style: TextStyle(color: colors.onSurfaceVariant, fontSize: 13),
          ),
        ],
      ),
    );
  }
}

class _ProductCard extends StatelessWidget {
  const _ProductCard({
    required this.product,
    required this.quantity,
    required this.onDecrease,
    required this.onIncrease,
    super.key,
  });

  final StockProduct product;
  final int quantity;
  final VoidCallback onDecrease;
  final VoidCallback onIncrease;

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;
    return Container(
      margin: const EdgeInsets.only(bottom: 10),
      padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 13),
      decoration: BoxDecoration(
        color: colors.surface,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: colors.outlineVariant),
      ),
      child: Row(
        children: [
          Container(
            width: 42,
            height: 42,
            decoration: BoxDecoration(
              color: colors.secondaryContainer,
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(
              Icons.inventory_2_outlined,
              color: colors.onSecondaryContainer,
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  product.name,
                  maxLines: 2,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    color: colors.onSurface,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  '${product.barcode ?? product.sku ?? 'Product'} · in stock ${product.quantity}',
                  style: TextStyle(
                    color: colors.onSurfaceVariant,
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          ),
          IconButton(
            tooltip: 'Remove one ${product.name}',
            visualDensity: VisualDensity.compact,
            onPressed: onDecrease,
            icon: const Icon(Icons.remove_circle_outline),
          ),
          Text(
            '$quantity',
            style: const TextStyle(fontWeight: FontWeight.w700),
          ),
          IconButton(
            tooltip: 'Add one ${product.name}',
            visualDensity: VisualDensity.compact,
            onPressed: onIncrease,
            icon: const Icon(Icons.add_circle_outline),
          ),
        ],
      ),
    );
  }
}

class _LoadErrorCard extends StatelessWidget {
  const _LoadErrorCard({required this.message, required this.onRetry});

  final String message;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    final colors = Theme.of(context).colorScheme;
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: colors.errorContainer,
        borderRadius: BorderRadius.circular(14),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Could not load products',
            style: TextStyle(
              color: colors.onErrorContainer,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 5),
          Text(message, style: TextStyle(color: colors.onErrorContainer)),
          const SizedBox(height: 10),
          TextButton.icon(
            onPressed: onRetry,
            icon: const Icon(Icons.refresh),
            label: const Text('Try again'),
          ),
        ],
      ),
    );
  }
}
