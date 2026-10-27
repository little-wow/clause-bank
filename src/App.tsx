import { useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Companion from "./pages/Companion";
import ClauseIndex from "./pages/ClauseIndex";
import ClausePage from "./pages/ClausePage";
import Spreadsheet from "./pages/Spreadsheet";
import HowToUse from "./pages/HowToUse";
import { useRoute } from "./router";
import { BOOK_TITLE, COMPANION } from "./data";
import { clauseById } from "./content";

export default function App() {
  const { parts, anchor } = useRoute();
  const [section = "", sub] = parts;

  // Scroll to an anchor (e.g. a chapter sub-section) or to the top on navigation.
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const el = anchor ? document.getElementById(anchor) : null;
      if (el) el.scrollIntoView({ block: "start" });
      else window.scrollTo({ top: 0 });
    });
    return () => cancelAnimationFrame(id);
  }, [section, sub, anchor]);

  let page;
  let title = "";
  switch (section) {
    case "companion": {
      const ch = COMPANION.find((s) => s.id === sub) ?? COMPANION[0];
      title = ch.num ? `${ch.num}. ${ch.title}` : ch.title;
      page = <Companion id={ch.id} />;
      break;
    }
    case "clauses":
      if (sub) {
        title = clauseById.get(sub)?.topic ?? "Clause Bank";
        page = <ClausePage id={sub} />;
      } else {
        title = "Clause Bank";
        page = <ClauseIndex />;
      }
      break;
    case "spreadsheet":
      title = "Spreadsheet";
      page = <Spreadsheet />;
      break;
    case "how-to-use":
      title = "How to Use";
      page = <HowToUse />;
      break;
    default:
      page = <Home />;
  }

  useEffect(() => {
    document.title = title ? `${title} | ${BOOK_TITLE}` : BOOK_TITLE;
  }, [title]);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header section={section === "" || ["companion", "clauses", "spreadsheet", "how-to-use"].includes(section) ? section : ""} />
      <main id="main" className="mx-auto w-full max-w-7xl flex-grow px-4 sm:px-6 lg:px-8 pt-10 sm:pt-14">
        {page}
      </main>
      <Footer />
    </div>
  );
}
