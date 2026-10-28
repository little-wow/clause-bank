import { useEffect } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Finder from "./pages/Finder";
import Table from "./pages/Table";
import HowToUse from "./pages/HowToUse";
import { useRoute } from "./router";
import { clauseById } from "./content";
import { COPY } from "./copy";

const SITE = COPY.site.name;

export default function App() {
  const { parts, anchor } = useRoute();
  const [section = "", sub] = parts;
  const isFinder = section === "" || section === "clause";

  // Changing pages starts at the top (or at an anchor). Opening clauses inside
  // the finder doesn't change pageKey, so the finder keeps the list's place.
  const pageKey = isFinder ? "finder" : section;
  useEffect(() => {
    const id = requestAnimationFrame(() => {
      const el = anchor ? document.getElementById(anchor) : null;
      if (el) el.scrollIntoView({ block: "start" });
      else window.scrollTo({ top: 0 });
    });
    return () => cancelAnimationFrame(id);
  }, [pageKey, anchor]);

  let page;
  let title = "";
  if (section === "table") {
    title = COPY.table.title;
    page = <Table />;
  } else if (section === "how-to-use") {
    title = COPY.howTo.title;
    page = <HowToUse />;
  } else {
    const c = section === "clause" && sub ? clauseById.get(sub) : undefined;
    title = c ? `${c.topic} (${c.id})` : "";
    page = <Finder selectedId={section === "clause" ? sub : undefined} />;
  }

  useEffect(() => {
    document.title = title ? `${title} | ${SITE}` : SITE;
  }, [title]);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header section={isFinder ? "" : section} />
      <main id="main" className="mx-auto w-full max-w-[90rem] flex-grow px-4 pt-8 sm:px-6 sm:pt-10 lg:px-8">
        {page}
      </main>
      <Footer />
    </div>
  );
}
