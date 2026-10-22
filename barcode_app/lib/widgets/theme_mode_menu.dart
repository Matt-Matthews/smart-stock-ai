import 'package:flutter/material.dart';

class ThemeModeMenu extends StatelessWidget {
  const ThemeModeMenu({required this.mode, required this.onChanged, super.key});

  final ThemeMode mode;
  final ValueChanged<ThemeMode> onChanged;

  @override
  Widget build(BuildContext context) {
    return PopupMenuButton<ThemeMode>(
      key: const Key('theme-mode-menu'),
      tooltip: 'Appearance: ${_label(mode)}',
      initialValue: mode,
      onSelected: onChanged,
      icon: Icon(_icon(mode)),
      itemBuilder: (context) => [
        for (final option in ThemeMode.values)
          PopupMenuItem<ThemeMode>(
            value: option,
            child: Row(
              children: [
                Icon(_icon(option), size: 20),
                const SizedBox(width: 12),
                Text(_label(option)),
                if (mode == option) ...[
                  const Spacer(),
                  const Icon(Icons.check, size: 18),
                ],
              ],
            ),
          ),
      ],
    );
  }

  static IconData _icon(ThemeMode mode) => switch (mode) {
    ThemeMode.system => Icons.brightness_auto_outlined,
    ThemeMode.light => Icons.light_mode_outlined,
    ThemeMode.dark => Icons.dark_mode_outlined,
  };

  static String _label(ThemeMode mode) => switch (mode) {
    ThemeMode.system => 'System',
    ThemeMode.light => 'Light',
    ThemeMode.dark => 'Dark',
  };
}
