"use client";

import { useId } from "react";
import {
  logoAccentPath,
  logoLetterPath,
  logoTransform,
} from "./ziqx-logo-paths.js";

export function ZiqxLoaderMark() {
  const id = useId();
  const clipId = `${id}-water`;
  return (
    <svg
      className="ziqx-loader-mark"
      viewBox="-8 -8 720 919"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <clipPath id={clipId} clipPathUnits="userSpaceOnUse">
          <path d={logoLetterPath} transform={logoTransform} />
        </clipPath>
      </defs>
      <g className="ziqx-loader-cycle">
        <g clipPath={`url(#${clipId})`}>
          <g className="ziqx-loader-water-rise">
            <path
              className="ziqx-loader-wave"
              d="M-352 0 Q-264 -16 -176 0 T0 0 T176 0 T352 0 T528 0 T704 0 T880 0 T1056 0 T1232 0 T1408 0 V1100 H-352 Z"
            />
          </g>
        </g>
        <g transform={logoTransform}>
          <path
            className="ziqx-loader-outline"
            d={logoLetterPath}
            pathLength={1}
          />
          <path className="ziqx-loader-dot" d={logoAccentPath} />
        </g>
      </g>
    </svg>
  );
}
