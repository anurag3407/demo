"use client";

import React from "react";

interface CRTScanlinesProps {
  enabled?: boolean;
}

export const CRTScanlines: React.FC<CRTScanlinesProps> = ({ enabled = true }) => {
  if (!enabled) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-50 overflow-hidden select-none"
    >
      {/* Scanline pattern */}
      <div
        className="absolute inset-0 opacity-[0.14]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.4) 50%)",
          backgroundSize: "100% 4px",
        }}
      />

      {/* Radial vignette */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 65%, rgba(0, 0, 0, 0.8) 100%)",
        }}
      />
    </div>
  );
};
