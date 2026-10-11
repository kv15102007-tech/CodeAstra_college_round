import React, { useState } from 'react';
import {
  Globe,
  Upload,
  Eye,
  Check,
  Laptop,
  Tablet,
  Smartphone,
  Copy,
  Download,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface WebsiteBuilderPageProps {
  onShowToast: (msg: string) => void;
}

export const WebsiteBuilderPage: React.FC<WebsiteBuilderPageProps> = ({
  onShowToast,
}) => {
  const [siteName, setSiteName] = useState('Acme Studio');
  const [headline, setHeadline] = useState('Ideas that move your business forward');
  const [description, setDescription] = useState(
    'We help ambitious teams turn bold ideas into meaningful digital experiences.'
  );
  const [ctaText, setCtaText] = useState("Let's talk");
  const [accentColor, setAccentColor] = useState('#6366f1');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const colors = [
    { label: 'Indigo', hex: '#6366f1' },
    { label: 'Emerald', hex: '#10b981' },
    { label: 'Coral', hex: '#f97316' },
    { label: 'Cyan', hex: '#06b6d4' },
    { label: 'Rose', hex: '#f43f5e' },
  ];

  const handlePublish = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    onShowToast(`Website "${siteName}" published successfully to https://${siteName.toLowerCase().replace(/\s+/g, '-')}.nexus.site`);
  };

  const getSubdomain = () => {
    return siteName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'my-site';
  };

  const handleCopyCode = () => {
    const code = `<!-- Published with Nexus Website Builder -->
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${siteName}</title>
  <style>
    body { font-family: system-ui, sans-serif; margin: 0; background: #0b0f19; color: #fff; }
    .hero { padding: 80px 24px; text-align: center; }
    .btn { background: ${accentColor}; color: #fff; border: 0; padding: 12px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; }
  </style>
</head>
<body>
  <div class="hero">
    <h1>${headline}</h1>
    <p>${description}</p>
    <button class="btn">${ctaText}</button>
  </div>
</body>
</html>`;
    navigator.clipboard.writeText(code);
    onShowToast('HTML code copied to clipboard!');
    setIsExportModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-500 tracking-wider uppercase mb-1">
            <span>Presence Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Website Builder
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Customize copy, theme accents, and test responsiveness live before publishing.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExportModalOpen(true)}
            className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Code</span>
          </button>
          <button
            onClick={handlePublish}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all flex items-center gap-1.5"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Publish Live</span>
          </button>
        </div>
      </div>

      {/* 2-Column Builder Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Form Controls (5 cols) */}
        <div className="lg:col-span-5 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Page Properties
          </h3>

          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1.5">
              Brand / Company Name
            </label>
            <input
              type="text"
              value={siteName}
              onChange={(e) => setSiteName(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1.5">
              Headline
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-1.5">
              Call to Action Button Label
            </label>
            <input
              type="text"
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-600 dark:text-slate-300 block mb-2">
              Brand Accent Color
            </label>
            <div className="flex items-center gap-2.5">
              {colors.map((c) => (
                <button
                  key={c.hex}
                  onClick={() => setAccentColor(c.hex)}
                  className={`w-7 h-7 rounded-full border-2 transition-transform flex items-center justify-center ${
                    accentColor === c.hex ? 'scale-110 ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900' : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.hex, borderColor: '#fff' }}
                  title={c.label}
                >
                  {accentColor === c.hex && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={() => onShowToast('Preview refreshed!')}
              className="w-full py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-semibold transition-colors"
            >
              Update Preview State
            </button>
          </div>
        </div>

        {/* Right Live Preview Canvas (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          {/* Preview Device Switcher Toolbar */}
          <div className="flex items-center justify-between p-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 text-xs">
            <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-500 dark:text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>{getSubdomain()}.nexus.site</span>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setPreviewDevice('desktop')}
                className={`p-1.5 rounded-lg transition-colors ${
                  previewDevice === 'desktop'
                    ? 'bg-white dark:bg-slate-900 text-indigo-500 shadow-xs'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-white'
                }`}
                title="Desktop View"
              >
                <Laptop className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setPreviewDevice('tablet')}
                className={`p-1.5 rounded-lg transition-colors ${
                  previewDevice === 'tablet'
                    ? 'bg-white dark:bg-slate-900 text-indigo-500 shadow-xs'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-white'
                }`}
                title="Tablet View"
              >
                <Tablet className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setPreviewDevice('mobile')}
                className={`p-1.5 rounded-lg transition-colors ${
                  previewDevice === 'mobile'
                    ? 'bg-white dark:bg-slate-900 text-indigo-500 shadow-xs'
                    : 'text-slate-400 hover:text-slate-600 dark:hover:text-white'
                }`}
                title="Mobile View"
              >
                <Smartphone className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Device Mockup Canvas */}
          <div className="w-full flex justify-center bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-inner overflow-hidden min-h-[500px]">
            <div
              className={`bg-slate-900 text-white rounded-xl shadow-2xl transition-all duration-300 flex flex-col overflow-hidden border border-slate-800 ${
                previewDevice === 'mobile'
                  ? 'w-[360px] min-h-[520px]'
                  : previewDevice === 'tablet'
                  ? 'w-[520px] min-h-[520px]'
                  : 'w-full min-h-[520px]'
              }`}
            >
              {/* Browser Header Bar */}
              <div className="px-4 py-2.5 border-b border-slate-800/80 bg-slate-950/80 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                </div>
                <span className="text-[10px] font-mono text-slate-500">
                  https://{getSubdomain()}.nexus.site
                </span>
                <span className="text-[10px] text-emerald-400 font-semibold">SSL 256-bit</span>
              </div>

              {/* Website Navbar */}
              <div className="px-5 py-3.5 border-b border-slate-800/60 flex items-center justify-between">
                <span className="text-xs font-extrabold tracking-wider font-sans">
                  {siteName.toUpperCase()}
                </span>
                <div className="hidden sm:flex items-center gap-4 text-[11px] text-slate-400">
                  <span className="hover:text-white cursor-pointer">About</span>
                  <span className="hover:text-white cursor-pointer">Services</span>
                  <span className="hover:text-white cursor-pointer">Case Studies</span>
                </div>
                <button
                  onClick={() => onShowToast(`Contact form triggered for ${siteName}`)}
                  className="px-2.5 py-1 rounded text-[11px] font-semibold text-white transition-opacity hover:opacity-90"
                  style={{ backgroundColor: accentColor }}
                >
                  {ctaText} ↗
                </button>
              </div>

              {/* Website Hero Section */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-center relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950">
                <div className="space-y-3 max-w-lg z-10">
                  <span
                    className="text-[10px] font-extrabold tracking-widest uppercase block"
                    style={{ color: accentColor }}
                  >
                    CREATIVE PARTNERS FOR WHAT’S NEXT
                  </span>
                  <h2 className="text-xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
                    {headline}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                    {description}
                  </p>
                  <div className="pt-2 flex flex-wrap gap-2.5">
                    <button
                      onClick={() => onShowToast('Primary action clicked')}
                      className="px-4 py-2 rounded-lg text-xs font-semibold text-white shadow-md transition-opacity hover:opacity-90 flex items-center gap-1.5"
                      style={{ backgroundColor: accentColor }}
                    >
                      <span>Explore our work</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onShowToast('Secondary action clicked')}
                      className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-300 bg-slate-800/80 hover:bg-slate-700 border border-slate-700 transition-colors"
                    >
                      Book a demo
                    </button>
                  </div>
                </div>

                {/* Decorative background monogram */}
                <div className="absolute right-4 bottom-2 text-7xl font-extrabold text-white/5 pointer-events-none font-sans select-none">
                  {siteName.charAt(0) || 'N'}
                </div>
              </div>

              {/* Website Bottom 3 Features */}
              <div className="grid grid-cols-3 border-t border-slate-800/60 bg-slate-950/60 p-4 gap-2 text-center">
                <div>
                  <span className="text-xs font-bold block text-slate-200">Strategy</span>
                  <span className="text-[10px] text-slate-500 block">Find your next move</span>
                </div>
                <div>
                  <span className="text-xs font-bold block text-slate-200">Design</span>
                  <span className="text-[10px] text-slate-500 block">Make it meaningful</span>
                </div>
                <div>
                  <span className="text-xs font-bold block text-slate-200">Growth</span>
                  <span className="text-[10px] text-slate-500 block">Build what lasts</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Export Code Modal */}
      {isExportModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-100 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Export Website Template</h3>
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Download or copy standalone production-ready HTML with responsive styling.
            </p>
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px] text-slate-300 max-h-48 overflow-y-auto">
              {`<!DOCTYPE html>\n<html>\n<head><title>${siteName}</title></head>\n<body>\n  <h1>${headline}</h1>\n  <p>${description}</p>\n</body>\n</html>`}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 text-slate-300 hover:bg-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={handleCopyCode}
                className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
