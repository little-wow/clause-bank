interface LogoProps {
  /** "color" for light backgrounds, "light" for the dark footer */
  variant?: "color" | "light";
  /** show the LIBRARY FUTURES wordmark next to the mark */
  showWordmark?: boolean;
  className?: string;
  markClassName?: string;
}

/**
 * Library Futures brand lockup — an angular forward-arrow mark in the
 * magenta→purple brand gradient plus the stacked LIBRARY FUTURES wordmark.
 *
 * This is an on-brand SVG/CSS recreation. To use the official artwork instead,
 * drop the file in /public and swap the <svg> mark for an <img>.
 */
export default function Logo({
  variant = "color",
  showWordmark = true,
  className = "",
  markClassName = "h-10 w-10",
}: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className={`flex-shrink-0 ${markClassName}`}
        role="img"
        aria-label="Library Futures"
      >
        <defs>
          <linearGradient id="lf-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#c81f76" />
            <stop offset="100%" stopColor="#5d2a68" />
          </linearGradient>
        </defs>
        <g fill="url(#lf-grad)">
          {/* upper blade */}
          <path d="M14 10 H49 L86 47 H51 Z" />
          {/* lower forward arrow */}
          <path d="M14 55 H51 L86 90 H51 L14 73 Z" />
        </g>
      </svg>

      {showWordmark && (
        <span className="leading-[0.86] select-none">
          <span
            className={`block font-display font-black tracking-tight text-[1.05rem] sm:text-xl ${
              variant === "light"
                ? "text-white"
                : "bg-gradient-to-br from-[#c81f76] to-[#5d2a68] bg-clip-text text-transparent"
            }`}
          >
            LIBRARY
          </span>
          <span
            className={`block font-display font-black tracking-tight text-[1.05rem] sm:text-xl ${
              variant === "light"
                ? "text-white"
                : "bg-gradient-to-br from-[#c81f76] to-[#5d2a68] bg-clip-text text-transparent"
            }`}
          >
            FUTURES
          </span>
        </span>
      )}
    </span>
  );
}
