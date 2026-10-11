import React, { useState } from 'react';
import {
  Laptop,
  Tablet,
  Smartphone,
  Maximize2,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Columns,
  RefreshCw,
} from 'lucide-react';
import { DeviceMode, DeviceOrientation, ThemeMode } from '../types';

interface DeviceSimulatorProps {
  deviceMode: DeviceMode;
  setDeviceMode: (mode: DeviceMode) => void;
  orientation: DeviceOrientation;
  setOrientation: (o: DeviceOrientation) => void;
  zoom: number;
  setZoom: (z: number) => void;
  themeMode: ThemeMode;
  children: React.ReactNode;
}

export const DeviceSimulator: React.FC<DeviceSimulatorProps> = ({
  deviceMode,
  setDeviceMode,
  orientation,
  setOrientation,
  zoom,
  setZoom,
  themeMode,
  children,
}) => {
  const [key, setKey] = useState(0);
  const isDark = themeMode === 'dark';

  // If in 'full' responsive mode, render children directly in normal page flow
  if (deviceMode === 'full') {
    return <>{children}</>;
  }

  const isLandscape = orientation === 'landscape';

  // Device dimensions in pixels
  const getDimensions = () => {
    switch (deviceMode) {
      case 'mobile':
        return isLandscape
          ? { width: 844, height: 390, name: 'iPhone 16 Pro (Landscape)' }
          : { width: 390, height: 844, name: 'iPhone 16 Pro' };
      case 'tablet':
        return isLandscape
          ? { width: 1024, height: 768, name: 'iPad Air 11" (Landscape)' }
          : { width: 768, height: 1024, name: 'iPad Air 11"' };
      case 'laptop':
        return { width: 1440, height: 900, name: 'MacBook Pro 14" (1440 × 900)' };
      default:
        return { width: '100%', height: '100%', name: 'Fluid' };
    }
  };

  const dims = getDimensions();

  // If comparison mode: render 3 side-by-side synchronized viewports
  if (deviceMode === 'comparison') {
    return (
      <div
        className={`w-full min-h-[calc(100vh-70px)] p-6 overflow-x-auto flex flex-col items-center transition-colors duration-200 ${
          isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-100/90 text-slate-900'
        }`}
      >
        {/* Comparison Header */}
        <div className="mb-6 text-center max-w-xl">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-500/15 text-indigo-500 dark:text-indigo-400 border border-indigo-500/30">
            Multi-Device Testing Matrix
          </span>
          <h2 className="text-xl font-bold mt-2 text-slate-900 dark:text-white">
            Simultaneous Responsive Audit
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Test layout reflow across Mobile, Tablet, and Desktop simultaneously.
          </p>
        </div>

        <div className="flex gap-8 items-start justify-center pb-12 w-full max-w-[1900px]">
          {/* 1. Mobile Preview (390px) */}
          <div className="flex flex-col items-center shrink-0">
            <div className="mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Smartphone className="w-3.5 h-3.5 text-indigo-500" />
              <span>Mobile (390 × 844)</span>
            </div>
            <div
              className={`w-[390px] h-[780px] rounded-[44px] p-3 shadow-2xl border-4 relative overflow-hidden flex flex-col ${
                isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-200 border-slate-300'
              }`}
            >
              {/* Dynamic Island */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-30 flex items-center justify-end px-3">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500/80" />
              </div>
              <div
                className={`w-full h-full rounded-[34px] overflow-y-auto overflow-x-hidden pt-7 text-xs ${
                  isDark ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'
                }`}
              >
                {children}
              </div>
              {/* Home indicator */}
              <div className="w-32 h-1 bg-slate-400/60 rounded-full mx-auto my-1.5 shrink-0" />
            </div>
          </div>

          {/* 2. Tablet Preview (768px, scaled) */}
          <div className="flex flex-col items-center shrink-0">
            <div className="mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Tablet className="w-3.5 h-3.5 text-cyan-500" />
              <span>Tablet (768 × 1024)</span>
            </div>
            <div
              className={`w-[600px] h-[780px] rounded-[32px] p-3 shadow-2xl border-4 relative overflow-hidden flex flex-col ${
                isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-200 border-slate-300'
              }`}
            >
              <div
                className={`w-full h-full rounded-[22px] overflow-y-auto overflow-x-hidden ${
                  isDark ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'
                }`}
              >
                <div
                  style={{
                    transform: 'scale(0.78)',
                    transformOrigin: 'top left',
                    width: '768px',
                    height: '1000px',
                  }}
                >
                  {children}
                </div>
              </div>
              {/* Home indicator */}
              <div className="w-28 h-1 bg-slate-400/60 rounded-full mx-auto my-1.5 shrink-0" />
            </div>
          </div>

          {/* 3. Laptop Preview (Desktop condensed preview) */}
          <div className="flex flex-col items-center shrink-0">
            <div className="mb-2 text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <Laptop className="w-3.5 h-3.5 text-emerald-500" />
              <span>Desktop / Laptop (1440 × 900)</span>
            </div>
            <div
              className={`w-[720px] h-[780px] rounded-2xl p-2.5 shadow-2xl border-4 flex flex-col ${
                isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-200 border-slate-300'
              }`}
            >
              {/* macOS Titlebar */}
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 border-b ${
                  isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-slate-100'
                }`}
              >
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="text-[10px] text-slate-400 font-mono ml-3">
                  nexus.workspace.local
                </span>
              </div>
              <div
                className={`w-full flex-1 rounded-b-xl overflow-y-auto overflow-x-hidden ${
                  isDark ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'
                }`}
              >
                <div
                  style={{
                    transform: 'scale(0.5)',
                    transformOrigin: 'top left',
                    width: '1440px',
                    height: '1500px',
                  }}
                >
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Single Device View with Bezel
  return (
    <div
      className={`w-full min-h-[calc(100vh-70px)] flex flex-col items-center justify-start p-4 sm:p-8 overflow-auto transition-colors duration-200 ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-100/90 text-slate-900'
      }`}
    >
      {/* Top Device Bar */}
      <div
        className={`w-full max-w-4xl rounded-xl px-4 py-2.5 mb-6 flex flex-wrap items-center justify-between gap-3 backdrop-blur z-20 border transition-colors ${
          isDark
            ? 'bg-slate-900/90 border-slate-800 text-slate-200'
            : 'bg-white/95 border-slate-200 text-slate-800 shadow-xs'
        }`}
      >
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-indigo-500 dark:text-indigo-400 flex items-center gap-1.5">
            {deviceMode === 'mobile' && <Smartphone className="w-4 h-4" />}
            {deviceMode === 'tablet' && <Tablet className="w-4 h-4" />}
            {deviceMode === 'laptop' && <Laptop className="w-4 h-4" />}
            <span>{dims.name}</span>
          </span>
          <span
            className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
              isDark
                ? 'text-slate-400 bg-slate-800/80 border-slate-700/60'
                : 'text-slate-600 bg-slate-100 border-slate-200'
            }`}
          >
            {typeof dims.width === 'number' ? `${dims.width} × ${dims.height}px` : 'Fluid'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Rotate Orientation (for mobile & tablet) */}
          {(deviceMode === 'mobile' || deviceMode === 'tablet') && (
            <button
              onClick={() => setOrientation(isLandscape ? 'portrait' : 'landscape')}
              className={`p-1.5 rounded-lg border transition-colors flex items-center gap-1 text-xs ${
                isDark
                  ? 'text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border-slate-700'
                  : 'text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border-slate-200'
              }`}
              title="Rotate Device Orientation"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>{isLandscape ? 'Portrait' : 'Landscape'}</span>
            </button>
          )}

          {/* Zoom Controls */}
          <div
            className={`flex items-center rounded-lg border overflow-hidden text-xs ${
              isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-slate-100 border-slate-200 text-slate-700'
            }`}
          >
            <button
              onClick={() => setZoom(Math.max(50, zoom - 10))}
              className={`p-1.5 ${isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-200 text-slate-700'}`}
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-mono text-[11px]">{zoom}%</span>
            <button
              onClick={() => setZoom(Math.min(100, zoom + 10))}
              className={`p-1.5 ${isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-200 text-slate-700'}`}
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => setKey((k) => k + 1)}
            className={`p-1.5 rounded-lg border transition-colors ${
              isDark
                ? 'text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border-slate-700'
                : 'text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border-slate-200'
            }`}
            title="Reload viewport"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => setDeviceMode('full')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
              isDark
                ? 'text-slate-200 bg-slate-800 hover:bg-slate-700 border-slate-700'
                : 'text-slate-700 bg-slate-100 hover:bg-slate-200 border-slate-200'
            }`}
            title="Exit simulator and use native full responsive view"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Full Responsive</span>
          </button>
        </div>
      </div>

      {/* Device Frame Viewport Container */}
      <div
        className="transition-all duration-300 flex items-center justify-center"
        style={{
          transform: `scale(${zoom / 100})`,
          transformOrigin: 'top center',
        }}
      >
        {deviceMode === 'mobile' && (
          <div
            className={`mobile-bezel rounded-[50px] p-3.5 shadow-2xl relative overflow-hidden flex flex-col transition-all duration-300 border-4 ${
              isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-200 border-slate-300'
            }`}
            style={{
              width: `${dims.width}px`,
              height: `${dims.height}px`,
            }}
          >
            {/* Dynamic Island */}
            {!isLandscape ? (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-40 flex items-center justify-end px-3">
                <div className="w-2.5 h-2.5 rounded-full bg-indigo-500/80" />
              </div>
            ) : (
              <div className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-24 bg-black rounded-full z-40 flex flex-col items-center justify-end py-2">
                <div className="w-2 h-2 rounded-full bg-indigo-500/80" />
              </div>
            )}

            <div
              key={key}
              className={`w-full h-full rounded-[38px] overflow-y-auto overflow-x-hidden transition-colors ${
                isDark ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'
              } ${!isLandscape ? 'pt-7' : 'pl-7'}`}
            >
              {children}
            </div>

            {/* Home indicator */}
            <div className="w-36 h-1 bg-slate-400/60 rounded-full mx-auto my-1.5 shrink-0" />
          </div>
        )}

        {deviceMode === 'tablet' && (
          <div
            className={`tablet-bezel rounded-[36px] p-4 shadow-2xl relative overflow-hidden flex flex-col transition-all duration-300 border-4 ${
              isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-200 border-slate-300'
            }`}
            style={{
              width: `${dims.width}px`,
              height: `${dims.height}px`,
            }}
          >
            {/* Camera */}
            <div className="w-2.5 h-2.5 rounded-full bg-slate-500 mx-auto mb-2 shrink-0" />

            <div
              key={key}
              className={`w-full flex-1 rounded-[24px] overflow-y-auto overflow-x-hidden transition-colors ${
                isDark ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'
              }`}
            >
              {children}
            </div>

            {/* Home indicator */}
            <div className="w-32 h-1 bg-slate-400/60 rounded-full mx-auto mt-2 shrink-0" />
          </div>
        )}

        {deviceMode === 'laptop' && (
          <div
            className={`laptop-bezel rounded-2xl p-3 shadow-2xl border-4 flex flex-col transition-all duration-300 ${
              isDark ? 'bg-slate-900 border-slate-700' : 'bg-slate-200 border-slate-300'
            }`}
            style={{
              width: `${dims.width}px`,
              height: `${dims.height}px`,
            }}
          >
            {/* Laptop Titlebar */}
            <div
              className={`flex items-center justify-between px-3 py-2 border-b rounded-t-xl shrink-0 ${
                isDark ? 'border-slate-800 bg-slate-900' : 'border-slate-200 bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500/90" />
                <div className="w-3 h-3 rounded-full bg-amber-500/90" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/90" />
                <span
                  className={`text-xs font-mono ml-4 flex items-center gap-1.5 ${
                    isDark ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  https://acme-studio.nexus.site/overview
                </span>
              </div>
              <span className="text-[11px] text-slate-400">Nexus Responsive Shell</span>
            </div>

            <div
              key={key}
              className={`w-full flex-1 rounded-b-xl overflow-y-auto overflow-x-hidden transition-colors ${
                isDark ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'
              }`}
            >
              {children}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
