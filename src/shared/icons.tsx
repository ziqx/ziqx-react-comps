import type { SVGProps } from "react";

export function ControlIcon({
  kind,
  ...props
}: SVGProps<SVGSVGElement> & { kind: "calendar" | "chevron" | "check" }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      {kind === "calendar" ? (
        <>
          <rect x="3" y="5" width="18" height="16" rx="2" />
          <path d="M16 3v4M8 3v4M3 11h18" />
        </>
      ) : (
        <path d={kind === "check" ? "m5 12 4 4L19 6" : "m6 9 6 6 6-6"} />
      )}
    </svg>
  );
}
