import { useState } from "react";
import Navbar, { type TabId } from "./components/Navbar";
import Footer from "./components/Footer";
import Overview from "./components/Overview";
import ClauseBank from "./components/ClauseBank";
import CompanionGuide from "./components/CompanionGuide";

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  const renderActiveTab = () => {
    switch (activeTab) {
      case "overview":
        return <Overview goTo={setActiveTab} />;
      case "clauses":
        return <ClauseBank />;
      case "companion":
        return <CompanionGuide />;
      default:
        return <Overview goTo={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#f6f6f6] flex flex-col justify-between selection:bg-[#9a1866]/10 selection:text-[#9a1866]">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="flex-grow w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white border border-slate-200/60 rounded-2xl p-5 sm:p-8 lg:p-10 shadow-sm">
            {renderActiveTab()}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
