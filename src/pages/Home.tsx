import { ArrowRight, BookOpen, FileSpreadsheet, Layers, ListChecks } from "lucide-react";
import { BOOK_TITLE, CLAUSES, COMPANION, INTRODUCTION, LAST_UPDATED } from "../data";
import { Blocks } from "../components/RichText";
import { Kicker, PageTitle, PillLink } from "../components/ui";
import { to } from "../router";

const DESTINATIONS = [
  {
    href: to(`companion/${COMPANION[0].id}`),
    icon: BookOpen,
    title: "Companion Document",
    text: `Negotiating with Vendors, then ${COMPANION.length - 1} chapters on the reasoning behind each group of clauses.`,
  },
  {
    href: to("clauses"),
    icon: Layers,
    title: "Clause Bank",
    text: `${CLAUSES.length} clauses, each in three versions, with what to watch for.`,
  },
  {
    href: to("spreadsheet"),
    icon: FileSpreadsheet,
    title: "Spreadsheet",
    text: "Every clause and its priority markers in one table you can filter, or download.",
  },
  {
    href: to("how-to-use"),
    icon: ListChecks,
    title: "How to Use",
    text: "How the Clause Bank is organized, and the Theme Index.",
  },
];

export default function Home() {
  return (
    <div className="max-w-5xl">
      <Kicker>Library Futures</Kicker>
      <PageTitle>{BOOK_TITLE}</PageTitle>
      <p className="mt-4 text-sm font-semibold text-ink/60">{LAST_UPDATED}</p>

      <nav aria-label="What's here" className="mt-10 grid gap-4 sm:grid-cols-2">
        {DESTINATIONS.map((d) => (
          <a
            key={d.title}
            href={d.href}
            className="group rounded-xl border-2 border-line bg-white p-5 sm:p-6 transition-all hover:-translate-y-1 hover:border-plum hover:shadow-lg"
          >
            <d.icon className="h-6 w-6 text-plum" aria-hidden />
            <h2 className="mt-3 flex items-center gap-2 text-lg font-black uppercase tracking-tight text-ink group-hover:text-plum">
              {d.title} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden />
            </h2>
            <p className="mt-1.5 text-[15px] leading-relaxed text-ink/75">{d.text}</p>
          </a>
        ))}
      </nav>

      <section aria-labelledby="introduction" className="mt-16 max-w-3xl">
        <h2 id="introduction" className="mb-6 text-2xl sm:text-3xl font-black uppercase tracking-tight text-ink">
          {INTRODUCTION.title}
        </h2>
        <Blocks blocks={INTRODUCTION.blocks} />
        <div className="mt-10 flex flex-wrap gap-3">
          <PillLink href={to(`companion/${COMPANION[0].id}`)}>
            Start: {COMPANION[0].title} <ArrowRight className="h-4 w-4" />
          </PillLink>
          <PillLink href={to("clauses")} variant="outline">
            Browse the Clause Bank
          </PillLink>
        </div>
      </section>
    </div>
  );
}
