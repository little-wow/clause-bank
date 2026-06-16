import { Library } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-[#222222] text-slate-200 border-t-4 border-[#9a1866] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-8 border-b border-slate-700/50 text-sm">
          {/* Column 1: About */}
          <div className="lg:col-span-5 space-y-3">
            <div className="flex items-center space-x-2">
              <div className="bg-white/10 p-1.5 rounded flex items-center justify-center">
                <Library className="h-5 w-5 text-[#85346a]" />
              </div>
              <h4 className="font-display text-white font-extrabold uppercase tracking-wider text-base">
                Digital Licensing Clause Bank
              </h4>
            </div>
            <p className="font-sans leading-relaxed text-xs text-slate-300">
              A working reference for libraries negotiating licenses to digital
              content, databases, and platforms. Part of a resource set published by{" "}
              <a
                href="https://libraryfutures.net"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[#9a1866] transition-colors"
              >
                Library Futures
              </a>{" "}
              and{" "}
              <a
                href="https://nyuengelberg.org"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[#9a1866] transition-colors"
              >
                The Engelberg Center on Innovation Law &amp; Policy
              </a>{" "}
              at NYU Law.
            </p>
          </div>

          {/* Column 2: Not legal advice */}
          <div className="lg:col-span-4 space-y-3">
            <h4 className="font-display text-white font-bold uppercase tracking-wider text-[#85346a] text-sm">
              Not Legal Advice
            </h4>
            <p className="font-sans leading-relaxed text-xs text-slate-400">
              This is a general reference, not legal advice.{" "}
              <strong className="text-slate-300">
                Leverage, jurisdiction, library type, and the specific resource being
                licensed all change what is reasonable in your situation.
              </strong>{" "}
              When in doubt, consult counsel.
            </p>
          </div>

          {/* Column 3: Licensing */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-display text-white font-bold uppercase tracking-wider text-sm">
              Creative Commons
            </h4>
            <p className="font-sans leading-relaxed text-xs text-slate-300">
              Licensed for use under <strong>CC&nbsp;BY-4.0</strong>. Anyone may adapt,
              remix, and republish this resource with attribution.
            </p>
          </div>
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs font-mono font-medium text-slate-400">
          <span>
            © 2026 Library Futures / The Engelberg Center on Innovation Law &amp; Policy
          </span>
          <span className="mt-4 md:mt-0 text-[#85346a] text-[10px] uppercase tracking-widest font-bold">
            Aligned with libraryfutures.net standards
          </span>
        </div>
      </div>
    </footer>
  );
}
