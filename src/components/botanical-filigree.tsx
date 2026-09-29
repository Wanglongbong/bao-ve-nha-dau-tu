import React from 'react';

// Symmetrical Classical Baroque Botanical Acanthus Leaf for Card Corners
export function BotanicalCornerFiligree({
  className = '',
  size = 48,
  color = '#8C2B0A',
  goldColor = '#D4AF37',
}: {
  className?: string;
  size?: number;
  color?: string;
  goldColor?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`pointer-events-none select-none transition-opacity ${className}`}
      aria-hidden="true"
    >
      {/* Outer corner flourish */}
      <path
        d="M6 94 V20 C6 12 12 6 20 6 H94"
        stroke={goldColor}
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.85"
      />
      {/* Inner hairline ornamental contour */}
      <path
        d="M14 86 V26 C14 19 19 14 26 14 H86"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        opacity="0.7"
      />
      {/* Botanical Acanthus Leaf Swirl */}
      <path
        d="M18 18 C28 28 32 45 28 60 C24 72 16 80 18 82 C20 84 32 78 44 68 C58 56 68 38 68 24 C68 18 64 16 58 18 C50 20 42 30 36 40 C34 44 30 42 30 38 C30 26 40 18 48 16 C38 14 26 14 18 18 Z"
        fill={color}
        opacity="0.75"
      />
      {/* Gold Vine Tendril */}
      <path
        d="M26 26 C36 34 46 36 56 32 C62 30 68 24 74 24 C80 24 84 28 84 34 C84 42 76 50 66 56 C54 64 42 72 36 84"
        stroke={goldColor}
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
        opacity="0.8"
      />
      {/* Botanical Leaf Buds */}
      <circle cx="20" cy="20" r="3" fill={goldColor} />
      <circle cx="86" cy="14" r="2.5" fill={goldColor} />
      <circle cx="14" cy="86" r="2.5" fill={goldColor} />
      <path
        d="M60 40 C64 36 70 38 72 42 C72 46 66 48 62 46 Z"
        fill={goldColor}
        opacity="0.9"
      />
      <path
        d="M40 60 C36 64 38 70 42 72 C46 72 48 66 46 62 Z"
        fill={goldColor}
        opacity="0.9"
      />
    </svg>
  );
}

// Classical Botanical Floral Symmetrical Divider
export function BotanicalVineDivider({
  className = '',
  goldColor = '#D4AF37',
  terracottaColor = '#8C2B0A',
}: {
  className?: string;
  goldColor?: string;
  terracottaColor?: string;
}) {
  return (
    <div className={`flex items-center justify-center my-3 select-none pointer-events-none ${className}`}>
      <svg
        width="260"
        height="28"
        viewBox="0 0 260 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="max-w-full"
      >
        {/* Left flourish branch */}
        <path
          d="M10 14 C45 14 65 22 95 18 C110 16 120 14 125 14"
          stroke={goldColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.75"
        />
        <path
          d="M45 15 C52 10 60 12 62 16 C60 18 52 18 45 15 Z"
          fill={terracottaColor}
          opacity="0.7"
        />
        <path
          d="M80 18 C85 22 92 20 94 17 C92 15 85 16 80 18 Z"
          fill={terracottaColor}
          opacity="0.7"
        />

        {/* Center Floral Rosette */}
        <circle cx="130" cy="14" r="5" fill={goldColor} />
        <circle cx="130" cy="14" r="2.5" fill={terracottaColor} />
        <circle cx="120" cy="14" r="2" fill={goldColor} opacity="0.8" />
        <circle cx="140" cy="14" r="2" fill={goldColor} opacity="0.8" />

        {/* Right flourish branch (symmetrical) */}
        <path
          d="M250 14 C215 14 195 22 165 18 C150 16 140 14 135 14"
          stroke={goldColor}
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.75"
        />
        <path
          d="M215 15 C208 10 200 12 198 16 C200 18 208 18 215 15 Z"
          fill={terracottaColor}
          opacity="0.7"
        />
        <path
          d="M180 18 C175 22 168 20 166 17 C168 15 175 16 180 18 Z"
          fill={terracottaColor}
          opacity="0.7"
        />
      </svg>
    </div>
  );
}

// Subtle Background Botanical Foliage Watermark
export function BotanicalWatermark({
  className = '',
  opacity = 0.05,
}: {
  className?: string;
  opacity?: number;
}) {
  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none ${className}`}
      style={{ opacity }}
      aria-hidden="true"
    >
      <svg
        className="w-full h-full"
        viewBox="0 0 800 600"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <g stroke="#8C2B0A" strokeWidth="1.5" strokeLinecap="round">
          {/* Repeating elegant vine spirals */}
          <path d="M-50 150 C100 80 180 220 300 160 C420 100 520 280 650 190 C780 100 850 250 950 180" />
          <path d="M-50 350 C120 280 200 420 340 360 C480 300 560 480 700 390 C840 300 900 450 1000 380" />
          <path d="M-50 550 C100 480 220 620 360 560 C500 500 600 680 740 590 C880 500 950 650 1050 580" />
          
          {/* Botanical acanthus flourishes */}
          <circle cx="300" cy="160" r="14" stroke="#D4AF37" strokeWidth="1.2" />
          <circle cx="650" cy="190" r="14" stroke="#D4AF37" strokeWidth="1.2" />
          <circle cx="340" cy="360" r="14" stroke="#D4AF37" strokeWidth="1.2" />
          <circle cx="700" cy="390" r="14" stroke="#D4AF37" strokeWidth="1.2" />
        </g>
      </svg>
    </div>
  );
}
