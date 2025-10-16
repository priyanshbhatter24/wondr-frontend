import type { SVGProps } from "react";

export function IdeaIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M9 18h6" />
      <path d="M10 21h4" />
      <path d="M12 3a6 6 0 0 0-6 6c0 2.1 1.06 3.63 2.5 4.75.62.48 1 .97 1.13 1.75h4.74c.13-.78.51-1.27 1.13-1.75C16.94 12.63 18 11.1 18 9a6 6 0 0 0-6-6z" />
    </svg>
  );
}
