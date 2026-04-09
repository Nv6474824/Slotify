'use client';

import { QRCodeSVG } from 'qrcode.react';

export default function QRCodeDisplay({ value }: { value: string }) {
  return (
    <div className="bg-white inline-block">
      <QRCodeSVG value={value} size={150} level="H" />
    </div>
  );
}
