'use client';

import React from 'react';
import { X, QrCode, Smartphone, ExternalLink, Copy, Check } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface QRCodeModalProps {
  onClose: () => void;
}

export const QRCodeModal: React.FC<QRCodeModalProps> = ({ onClose }) => {
  const appUrl = 'https://campusexchange-six.vercel.app/';
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(appUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-sm bg-white dark:bg-[#18191e] rounded-3xl p-6 shadow-2xl border border-gray-200/80 dark:border-zinc-800 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 text-gray-500 dark:text-zinc-400 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-3">
          <Smartphone className="w-6 h-6" />
        </div>

        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          Open on Mobile Phone
        </h3>
        <p className="text-xs text-gray-500 dark:text-zinc-400 mt-1 mb-5">
          Scan this QR code with your phone camera or QR scanner to access UniLoop on your smartphone.
        </p>

        {/* QR Code Container with nice elevation and white backdrop for scanner contrast */}
        <div className="p-4 bg-white rounded-2xl border-2 border-blue-500/20 shadow-inner inline-block mx-auto mb-4">
          <QRCodeSVG
            value={appUrl}
            size={190}
            level="H"
            includeMargin={false}
          />
        </div>

        {/* URL Box with Copy */}
        <div className="flex items-center justify-between gap-2 p-2.5 rounded-xl bg-gray-100 dark:bg-zinc-800 text-xs font-mono text-gray-700 dark:text-zinc-300 mb-4">
          <span className="truncate">{appUrl}</span>
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg hover:bg-white dark:hover:bg-zinc-700 text-gray-500 dark:text-zinc-300 transition-colors shrink-0"
            title="Copy URL"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 text-[11px] text-gray-400">
          <QrCode className="w-3.5 h-3.5 text-blue-500" />
          <span>Point camera to scan instantly • No app install needed</span>
        </div>
      </div>
    </div>
  );
};
