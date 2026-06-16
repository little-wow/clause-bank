import { useState } from "react";
import { Library, Menu, X, BookOpen, Layers, FileText } from "lucide-react";

export type TabId = "overview" | "clauses" | "companion";

interface NavbarProps {
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
}

const MENU_ITEMS: { id: TabId; label: string; icon: typeof BookOpen }[] = [
  { id: "overview", label: "Overview", icon: BookOpen },
  { id: "clauses", label: "Clause Bank", icon: Layers },
  { id: "companion", label: "Companion Guide", icon: FileText },
];

export default function Navbar({ activeTab, setActiveTab }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleTabClick = (tabId: TabId) => {
    setActiveTab(tabId);
    setIsOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b-2 border-slate-100 shadow-sm">
      {/* Top thin accent brand line */}
      <div className="h-1 bg-gradient-to-r from-[#9a1866] via-[#85346a] to-[#9a1866]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo / Title */}
          <div
            className="flex items-center space-x-3.5 cursor-pointer select-none"
            onClick={() => handleTabClick("overview")}
          >
            <div className="bg-[#9a1866]/5 p-2.5 rounded-xl border border-[#9a1866]/10 flex items-center justify-center transition-transform duration-300 hover:scale-105">
              <Library className="h-6 w-6 text-[#9a1866]" />
            </div>
            <div className="leading-none">
              <h1 className="font-display text-base sm:text-lg md:text-xl font-black text-[#222222] tracking-tight leading-none">
                Digital Licensing Clause Bank
              </h1>
              <p className="hidden sm:block font-mono text-[10px] uppercase tracking-widest text-slate-400 mt-1">
                For Libraries · Library Futures
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1.5">
            {MENU_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-[#9a1866] text-white shadow-md shadow-[#9a1866]/20"
                      : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-sans font-semibold">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2.5 rounded-md text-slate-700 hover:bg-slate-50 hover:text-slate-950 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className="md:hidden bg-[#f6f6f6] border-t border-slate-100 fade-in">
          <div className="px-2 pt-2 pb-4 space-y-1">
            {MENU_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleTabClick(item.id)}
                  className={`flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-base font-semibold transition-all ${
                    isActive
                      ? "bg-[#9a1866] text-white"
                      : "text-slate-700 hover:bg-slate-50 hover:text-slate-950"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}
