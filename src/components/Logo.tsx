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
 * Displays the official artwork from /public/library-futures-logo.svg. If that
 * file is missing it falls back to the LIBRARY FUTURES wordmark in brand color.
 */
export default function Logo({ variant = "color", heightClass = "h-9" }: LogoProps) {
  const [imgOk, setImgOk] = useState(true);

  if (imgOk) {
    return (
      <img
        src="/library-futures-logo.svg"
        alt="Library Futures"
        className={`${heightClass} w-auto select-none`}
        onError={() => setImgOk(false)}
      />
    );
  }

  return (
    <span
      className={`font-black tracking-tight leading-none text-lg sm:text-xl select-none ${
        variant === "light" ? "text-white" : "text-[#a80977]"
      }`}
    >
      LIBRARY&nbsp;FUTURES
    </span>
  );
}
