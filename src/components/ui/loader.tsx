
import React from "react";

export function Loader({ size = 20 }: { size?: number }) {
  return (
    <svg
      className="animate-spin mx-auto"
      width={size}
      height={size}
      viewBox="0 0 50 50"
    >
      <circle
        className="opacity-25"
        cx="25"
        cy="25"
        r="20"
        stroke="currentColor"
        strokeWidth="5"
        fill="none"
      />
      <circle
        className="opacity-75"
        cx="25"
        cy="25"
        r="20"
        stroke="#3b82f6"
        strokeWidth="5"
        fill="none"
        strokeDasharray="90,150"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default Loader;
