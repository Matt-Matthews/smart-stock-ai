import 'package:flutter/material.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';

import 'models.dart';
import 'screens/login_screen.dart';
import 'screens/stock_screen.dart';
import 'services/smartstock_api.dart';
import 'theme_preferences.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await dotenv.load(fileName: '.env');
  runApp(SmartStockApp(apiBaseUrl: dotenv.env['API_BASE_URL']));
}

class SmartStockApp extends StatefulWidget {
  const SmartStockApp({
    super.key,
    this.service,
    this.apiBaseUrl,
    this.themeModeStore,
  });

  final SmartStockService? service;
  final String? apiBaseUrl;
  final ThemeModeStore? themeModeStore;

  @override
  State<SmartStockApp> createState() => _SmartStockAppState();
}

class _SmartStockAppState extends State<SmartStockApp> {
  final _messengerKey = GlobalKey<ScaffoldMessengerState>();
  late final SmartStockService _service =
      widget.service ?? SmartStockApi(apiBaseUrl: widget.apiBaseUrl ?? '');
  late final ThemeModeStore _themeModeStore =
      widget.themeModeStore ?? const SecureThemeModeStore();
  late Future<AuthSession?> _session = _service.restoreSession();
  ThemeMode _themeMode = ThemeMode.system;

  @override
  void initState() {
    super.initState();
    _restoreThemeMode();
  }

  Future<void> _restoreThemeMode() async {
    try {
      final mode = await _themeModeStore.load();
      if (mounted) setState(() => _themeMode = mode);
    } catch (error) {
      if (mounted) {
        _messengerKey.currentState?.showSnackBar(
          SnackBar(content: Text('Could not load appearance setting: $error')),
        );
      }
    }
  }

  Future<void> _setThemeMode(ThemeMode mode) async {
    try {
      await _themeModeStore.save(mode);
      if (mounted) setState(() => _themeMode = mode);
    } catch (error) {
      if (mounted) {
        _messengerKey.currentState
          ?..hideCurrentSnackBar()
          ..showSnackBar(
            SnackBar(
              content: Text('Could not save appearance setting: $error'),
            ),
          );
      }
    }
  }

  Future<void> _signOut() async {
    await _service.logout();
    if (mounted) {
      setState(() {
        _session = Future.value(null);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'SmartStock',
      debugShowCheckedModeBanner: false,
      scaffoldMessengerKey: _messengerKey,
      theme: _buildTheme(Brightness.light),
      darkTheme: _buildTheme(Brightness.dark),
      themeMode: _themeMode,
      home: FutureBuilder<AuthSession?>(
        future: _session,
        builder: (context, snapshot) {
          if (snapshot.connectionState != ConnectionState.done) {
            return const Scaffold(
              body: Center(child: CircularProgressIndicator()),
            );
          }
          if (snapshot.hasError) {
            return _StartupError(
              message: snapshot.error.toString(),
              onRetry: () => setState(() {
                _session = _service.restoreSession();
              }),
            );
          }

          final session = snapshot.data;
          if (session == null) {
            return LoginScreen(
              service: _service,
              themeMode: _themeMode,
              onThemeModeChanged: _setThemeMode,
              onLogin: (value) => setState(() {
                _session = Future.value(value);
              }),
            );
          }
          return StockScreen(
            service: _service,
            session: session,
            onLogout: _signOut,
            themeMode: _themeMode,
            onThemeModeChanged: _setThemeMode,
          );
        },
      ),
    );
  }

  ThemeData _buildTheme(Brightness brightness) {
    const primary = Color(0xFF087FBF);
    final isDark = brightness == Brightness.dark;
    final surface = isDark ? const Color(0xFF17212B) : Colors.white;
    final background = isDark
        ? const Color(0xFF101820)
        : const Color(0xFFF4F7FA);
    final scheme = ColorScheme.fromSeed(
      seedColor: primary,
      brightness: brightness,
      surface: surface,
    );

    return ThemeData(
      useMaterial3: true,
      brightness: brightness,
      scaffoldBackgroundColor: background,
      colorScheme: scheme,
      appBarTheme: AppBarTheme(
        backgroundColor: background,
        foregroundColor: scheme.onSurface,
        centerTitle: false,
        elevation: 0,
      ),
      cardTheme: CardThemeData(
        color: surface,
        elevation: 0,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: isDark ? scheme.surfaceContainerHighest : surface,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(15),
          borderSide: BorderSide(color: scheme.outlineVariant),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(15),
          borderSide: BorderSide(color: scheme.outlineVariant),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(15),
          borderSide: const BorderSide(color: primary, width: 1.5),
        ),
      ),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          minimumSize: const Size(48, 52),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
          ),
          textStyle: const TextStyle(fontWeight: FontWeight.w700),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          minimumSize: const Size(48, 48),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(15),
          ),
          side: BorderSide(color: scheme.outlineVariant),
        ),
      ),
    );
  }
}

class _StartupError extends StatelessWidget {
  const _StartupError({required this.message, required this.onRetry});

  final String message;
  final VoidCallback onRetry;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: Padding(
          padding: const EdgeInsets.all(28),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.cloud_off_outlined, size: 42),
              const SizedBox(height: 16),
              const Text(
                'Could not restore your session',
                style: TextStyle(fontSize: 20, fontWeight: FontWeight.w700),
              ),
              const SizedBox(height: 8),
              Text(message, textAlign: TextAlign.center),
              const SizedBox(height: 20),
              FilledButton(onPressed: onRetry, child: const Text('Try again')),
            ],
          ),
        ),
      ),
    );
  }
}
