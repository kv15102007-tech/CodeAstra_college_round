import React from 'react';
import {
  Moon,
  Sun,
  Palette,
  Sparkles,
  Sliders,
  Check,
  SplitSquareVertical,
  Layers,
  X,
  Contrast,
} from 'lucide-react';
import { ThemeMode, DarkFlavor } from '../types';

interface DarkThemeColumnProps {
  isOpen: boolean;
  onClose: () => void;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  darkFlavor: DarkFlavor;
  setDarkFlavor: (flavor: DarkFlavor) => void;
  accentColor: string;
  setAccentColor: (color: string) => void;
  highContrast: boolean;
  setHighContrast: (v: boolean) => void;
  oledMode: boolean;
  setOledMode: (v: boolean) => void;
}

export const DarkThemeColumn: React.FC<DarkThemeColumnProps> = ({
  isOpen,
  onClose,
  themeMode,
  setThemeMode,
  darkFlavor,
  setDarkFlavor,
  accentColor,
  setAccentColor,
  highContrast,
  setHighContrast,
  oledMode,
  setOledMode,
}) => {
  if (!isOpen) return null;

  const flavors: {
    id: DarkFlavor;
    label: string;
    sub: string;
    bgHex: string;
    borderHex: string;
    accentHex: string;
  }[] = [
    {
      id: 'obsidian',
      label: 'Obsidian Cyber',
      sub: 'Pure deep black with electric indigo',
      bgHex: '#030712',
      borderHex: '#1f293d',
      accentHex: '#6366f1',
    },
    {
      id: 'midnight',
      label: 'Midnight Slate',
      sub: 'Deep executive navy with arctic cyan',
      bgHex: '#0b1329',
      borderHex: '#1e294b',
      accentHex: '#06b6d4',
    },
    {
      id: 'emerald',
      label: 'Emerald Noir',
      sub: 'Carbon graphite with vivid mint green',
      bgHex: '#06130d',
      borderHex: '#133022',
      accentHex: '#10b981',
    },
    {
      id: 'sunset',
      label: 'Sunset Eclipse',
      sub: 'Warm charcoal with radiant amber orange',
      bgHex: '#120c18',
      borderHex: '#301f3b',
      accentHex: '#f97316',
    },
  ];

  const accentPresets = [
    { name: 'Electric Indigo', hex: '#6366f1' },
    { name: 'Emerald Mint', hex: '#10b981' },
    { name: 'Cyber Cyan', hex: '#06b6d4' },
    { name: 'Sunset Amber', hex: '#f97316' },
    { name: 'Neon Rose', hex: '#f43f5e' },
    { name: 'Royal Violet', hex: '#8b5cf6' },
  ];

  return (
    <aside
      className={`w-80 shrink-0 border-l flex flex-col h-full overflow-y-auto transition-colors duration-200 z-30 ${
        themeMode === 'dark'
          ? 'bg-slate-900/95 border-slate-800 text-slate-100'
          : 'bg-white border-slate-200 text-slate-900 shadow-xl'
      }`}
    >
      {/* Column Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-inherit backdrop-blur z-10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
            <Moon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-tight">Dark Theme Studio</h3>
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              Dedicated theme & styling column
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Close theme column"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-6">
        {/* Theme Mode Selector */}
        <div>
          <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2.5">
            Display Mode
          </label>
          <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700/60">
            <button
              onClick={() => setThemeMode('dark')}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-md text-xs font-medium transition-all ${
                themeMode === 'dark'
                  ? 'bg-slate-900 text-white shadow-sm border border-slate-700'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5 mb-1 text-indigo-400" />
              <span>Dark</span>
            </button>
            <button
              onClick={() => setThemeMode('light')}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-md text-xs font-medium transition-all ${
                themeMode === 'light'
                  ? 'bg-white text-slate-900 shadow-sm border border-slate-200'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5 mb-1 text-amber-500" />
              <span>Light</span>
            </button>
            <button
              onClick={() => setThemeMode('dual')}
              className={`flex flex-col items-center justify-center py-2 px-1 rounded-md text-xs font-medium transition-all ${
                themeMode === 'dual'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
              title="Compare Light & Dark side-by-side"
            >
              <SplitSquareVertical className="w-3.5 h-3.5 mb-1" />
              <span>Dual-View</span>
            </button>
          </div>
        </div>

        {/* Dark Theme Flavor Palette */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Dark Theme Presets
            </label>
            <span className="text-[10px] text-indigo-500 font-medium">Trendy Palettes</span>
          </div>
          <div className="space-y-2">
            {flavors.map((f) => {
              const isSelected = darkFlavor === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => {
                    setDarkFlavor(f.id);
                    setAccentColor(f.accentHex);
                    if (themeMode === 'light') setThemeMode('dark');
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-start gap-3 ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-500/10 ring-1 ring-indigo-500/30'
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div
                    className="w-7 h-7 rounded-lg shrink-0 border flex items-center justify-center mt-0.5"
                    style={{
                      backgroundColor: f.bgHex,
                      borderColor: f.borderHex,
                    }}
                  >
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: f.accentHex }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-900 dark:text-slate-100">
                        {f.label}
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-indigo-500" />}
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                      {f.sub}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Accent Color Chooser */}
        <div>
          <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2.5">
            Accent Brand Glow
          </label>
          <div className="grid grid-cols-6 gap-2">
            {accentPresets.map((preset) => {
              const isPicked = accentColor === preset.hex;
              return (
                <button
                  key={preset.hex}
                  onClick={() => setAccentColor(preset.hex)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform ${
                    isPicked ? 'scale-110 ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900' : 'hover:scale-105'
                  }`}
                  style={{
                    backgroundColor: preset.hex,
                    borderColor: isPicked ? '#ffffff' : 'transparent',
                  }}
                  title={preset.name}
                />
              );
            })}
          </div>
        </div>

        {/* Advanced Dark Mode Toggles */}
        <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
          <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
            Display Enhancements
          </label>

          <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Contrast className="w-4 h-4 text-slate-500" />
              <div>
                <span className="text-xs font-medium block">OLED True Black</span>
                <span className="text-[10px] text-slate-500 block">
                  #000000 pure blacks for OLED screens
                </span>
              </div>
            </div>
            <button
              onClick={() => setOledMode(!oledMode)}
              className={`w-9 h-5 rounded-full transition-colors relative ${
                oledMode ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-0.5 ${
                  oledMode ? 'left-4.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-slate-500" />
              <div>
                <span className="text-xs font-medium block">High Contrast Mode</span>
                <span className="text-[10px] text-slate-500 block">
                  Crisper hairline dividers & text
                </span>
              </div>
            </div>
            <button
              onClick={() => setHighContrast(!highContrast)}
              className={`w-9 h-5 rounded-full transition-colors relative ${
                highContrast ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-700'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full bg-white transition-transform absolute top-0.5 ${
                  highContrast ? 'left-4.5' : 'left-0.5'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Live Token Preview Card */}
        <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
          <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">
            Live Token Preview
          </label>
          <div
            className="p-3.5 rounded-xl border space-y-2.5 transition-colors"
            style={{
              backgroundColor: oledMode ? '#000000' : darkFlavor === 'obsidian' ? '#030712' : darkFlavor === 'midnight' ? '#0b1329' : darkFlavor === 'emerald' ? '#06130d' : '#120c18',
              borderColor: darkFlavor === 'obsidian' ? '#1f293d' : darkFlavor === 'midnight' ? '#1e294b' : darkFlavor === 'emerald' ? '#133022' : '#301f3b',
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider" style={{ color: accentColor }}>
                Token Test
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded text-emerald-400 bg-emerald-500/10 border border-emerald-500/20">
                Active
              </span>
            </div>
            <p className="text-xs text-slate-200 font-medium">
              Enterprise Dashboard Surface
            </p>
            <div className="flex gap-2 pt-1">
              <button
                className="text-[10px] font-medium py-1 px-2.5 rounded text-white"
                style={{ backgroundColor: accentColor }}
              >
                CTA Button
              </button>
              <button className="text-[10px] font-medium py-1 px-2.5 rounded text-slate-300 bg-slate-800/80 border border-slate-700">
                Outline
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};
