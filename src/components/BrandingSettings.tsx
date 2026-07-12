import React, { useRef } from 'react';
import { BrandConfig } from '../types';
import { COLOR_THEMES, FONT_STYLES, DEFAULT_ZINGA_LOGO } from '../lib/constants';
import { Palette, Type, Image as ImageIcon, Sliders, Check, RefreshCw, Upload, Sparkles } from 'lucide-react';

interface BrandingSettingsProps {
  config: BrandConfig;
  onUpdateConfig: (config: BrandConfig) => void;
}

export default function BrandingSettings({ config, onUpdateConfig }: BrandingSettingsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleThemeSelect = (theme: typeof COLOR_THEMES[0]) => {
    onUpdateConfig({
      ...config,
      themeName: theme.name,
      primaryColor: theme.primary,
      secondaryColor: theme.secondary,
      accentColor: theme.accent
    });
  };

  const handleFontSelect = (fontStyle: BrandConfig['fontStyle']) => {
    onUpdateConfig({
      ...config,
      fontStyle
    });
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result as string;
      onUpdateConfig({
        ...config,
        logoUrl: base64Url,
        logoName: file.name
      });
    };
    reader.readAsDataURL(file);
  };

  const handleResetLogo = () => {
    onUpdateConfig({
      ...config,
      logoUrl: DEFAULT_ZINGA_LOGO,
      logoName: 'zinga.jpeg'
    });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleWatermarkToggle = (showWatermark: boolean) => {
    onUpdateConfig({
      ...config,
      showWatermark
    });
  };

  const handleWatermarkOpacityChange = (opacity: number) => {
    onUpdateConfig({
      ...config,
      watermarkOpacity: opacity
    });
  };

  return (
    <div className="space-y-6">
      {/* Introduction Card */}
      <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 p-5 rounded-2xl border border-amber-200/50 shadow-xs relative overflow-hidden">
        <div className="relative z-10 space-y-1.5 text-left">
          <h3 className="font-bold text-amber-900 text-sm flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
            Custom Invoice Branding
          </h3>
          <p className="text-xs text-amber-800 leading-relaxed max-w-lg">
            Create an aesthetic invoice design that matches your personal brand. These settings modify colors, layout typography, and watermarks in real-time.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 translate-y-3 translate-x-3 text-amber-200/30 opacity-60">
          <Palette className="w-24 h-24 stroke-[1.5]" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
        {/* Color Palette Section */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-4">
          <h4 className="font-semibold text-gray-900 text-xs uppercase tracking-wider flex items-center gap-2">
            <Palette className="w-4 h-4 text-amber-600" />
            Color Theme Presets
          </h4>
          
          <div className="grid grid-cols-1 gap-2.5">
            {COLOR_THEMES.map((theme) => {
              const isSelected = config.primaryColor === theme.primary;
              return (
                <button
                  key={theme.name}
                  id={`theme-btn-${theme.name.replace(/\s+/g, '-').toLowerCase()}`}
                  onClick={() => handleThemeSelect(theme)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all hover:bg-gray-50 cursor-pointer ${
                    isSelected ? 'border-amber-500 bg-amber-50/10 ring-2 ring-amber-500/10' : 'border-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Circle Swatch */}
                    <div className="flex -space-x-1">
                      <div className="w-6 h-6 rounded-full border border-white shadow-xs shrink-0" style={{ backgroundColor: theme.primary }} />
                      <div className="w-6 h-6 rounded-full border border-white shadow-xs shrink-0" style={{ backgroundColor: theme.secondary }} />
                    </div>
                    <div>
                      <span className="text-xs font-semibold text-gray-900 block">{theme.name}</span>
                      <span className="text-[10px] text-gray-400">Primary: {theme.primary}</span>
                    </div>
                  </div>
                  
                  {isSelected && (
                    <div className="w-5 h-5 bg-amber-600 text-white rounded-full flex items-center justify-center">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Typography & Layout */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs space-y-5">
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 text-xs uppercase tracking-wider flex items-center gap-2">
              <Type className="w-4 h-4 text-amber-600" />
              Document Typography
            </h4>

            <div className="grid grid-cols-3 gap-2">
              {FONT_STYLES.map((font) => {
                const isSelected = config.fontStyle === font.id;
                return (
                  <button
                    key={font.id}
                    id={`font-btn-${font.id}`}
                    onClick={() => handleFontSelect(font.id as BrandConfig['fontStyle'])}
                    className={`p-3 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected ? 'border-amber-500 bg-amber-50/15 text-amber-700 font-semibold' : 'border-gray-100 text-gray-500'
                    }`}
                  >
                    <span className={`text-base block mb-1 ${font.class}`}>Aa</span>
                    <span className="text-[10px] block truncate">{font.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Logo Section */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <h4 className="font-semibold text-gray-900 text-xs uppercase tracking-wider flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-amber-600" />
              Brand Logo
            </h4>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              {/* Logo Preview box */}
              <div className="w-20 h-20 bg-gray-50 rounded-xl border border-gray-100 flex items-center justify-center overflow-hidden p-2 shrink-0">
                {config.logoUrl ? (
                  <img
                    id="brand-logo-preview"
                    src={config.logoUrl}
                    alt="Logo"
                    referrerPolicy="no-referrer"
                    className="max-w-full max-h-full object-contain"
                  />
                ) : (
                  <span className="text-xs text-gray-400">No Logo</span>
                )}
              </div>

              <div className="flex-1 w-full space-y-2">
                <span className="text-xs text-gray-500 block truncate font-medium">
                  File: <span className="text-gray-900">{config.logoName || 'No logo selected'}</span>
                </span>
                
                <div className="flex flex-wrap gap-2">
                  <button
                    id="trigger-logo-upload"
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    Upload Image
                  </button>
                  
                  <button
                    id="reset-logo-btn"
                    type="button"
                    onClick={handleResetLogo}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 rounded-lg text-xs font-semibold cursor-pointer transition-colors border border-amber-100"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    Zinga Bee
                  </button>
                </div>
                
                <input
                  id="logo-file-input"
                  type="file"
                  ref={fileInputRef}
                  onChange={handleLogoUpload}
                  accept="image/jpeg,image/png,image/svg+xml"
                  className="hidden"
                />
              </div>
            </div>
          </div>

          {/* Watermark Section */}
          <div className="border-t border-gray-100 pt-5 space-y-4">
            <h4 className="font-semibold text-gray-900 text-xs uppercase tracking-wider flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-600" />
              Document Watermark
            </h4>

            <div className="space-y-4">
              <label htmlFor="watermark-toggle" className="flex items-center justify-between cursor-pointer">
                <div>
                  <span className="text-xs font-semibold text-gray-900 block">Durable Background Watermark</span>
                  <span className="text-[10px] text-gray-500">Renders selected logo as a large centered background watermark</span>
                </div>
                <div className="relative">
                  <input
                    id="watermark-toggle"
                    type="checkbox"
                    checked={config.showWatermark}
                    onChange={(e) => handleWatermarkToggle(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-600"></div>
                </div>
              </label>

              {config.showWatermark && (
                <div className="space-y-1.5 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <div className="flex justify-between text-[11px] font-medium text-gray-600">
                    <label htmlFor="watermark-opacity">Watermark Opacity</label>
                    <span>{Math.round(config.watermarkOpacity * 100)}%</span>
                  </div>
                  <input
                    id="watermark-opacity"
                    type="range"
                    min="0.02"
                    max="0.30"
                    step="0.01"
                    value={config.watermarkOpacity}
                    onChange={(e) => handleWatermarkOpacityChange(parseFloat(e.target.value))}
                    className="w-full accent-amber-600 cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
