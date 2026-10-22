import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

abstract interface class ThemeModeStore {
  Future<ThemeMode> load();
  Future<void> save(ThemeMode mode);
}

class SecureThemeModeStore implements ThemeModeStore {
  const SecureThemeModeStore({this._storage = const FlutterSecureStorage()});

  static const _key = 'smartstock_theme_mode';

  final FlutterSecureStorage _storage;

  @override
  Future<ThemeMode> load() async {
    final savedMode = await _storage.read(key: _key);
    return ThemeMode.values
            .where((mode) => mode.name == savedMode)
            .firstOrNull ??
        ThemeMode.system;
  }

  @override
  Future<void> save(ThemeMode mode) =>
      _storage.write(key: _key, value: mode.name);
}
