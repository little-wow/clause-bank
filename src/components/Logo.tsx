import { useState } from "react";

interface LogoProps {
  /** "color" for light backgrounds, "light" for the dark footer */
  variant?: "color" | "light";
  /** Tailwind height class for the logo image, e.g. "h-9" */
  heightClass?: string;
}

/**
 * Library Futures logo.
 *
 * Displays the official artwork from /public/library-futures-logo.png when it
 * exists. Until that file is added, it falls back to the LIBRARY FUTURES
 * wordmark set in the brand color. To use the official logo, export the EPS to
 * a transparent PNG (or SVG) and save it as public/library-futures-logo.png.
 */
export default function Logo({ variant = "color", heightClass = "h-9" }: LogoProps) {
  const [imgOk, setImgOk] = useState(true);

  if (imgOk) {
    return (
      <img
        src="https://github.com/NYUEngelberg/copyright-tools/blob/main/src/LIbraryFutures_CMYK.svg"
        alt="Library Futures"
        className={`${heightClass} w-auto select-none`}
        onError={() => setImgOk(false)}
      />
    );
  }

  return (
    <span
      className={`font-black tracking-tight leading-none text-lg sm:text-xl select-none ${
        variant === "light" ? "text-white" : "text-[#b41f6e]"
      }`}
    >
      LIBRARY&nbsp;FUTURES
    </span>
  );
}
