import { COMPANION } from "../data";
import { Blocks } from "../components/RichText";
import { Kicker, PageTitle, PrevNext, WithSidebar } from "../components/ui";
import { chapterLabel, clausesByTheme } from "../content";
import { to } from "../router";

function Contents({ activeId }: { activeId: string }) {
  return (
    <nav aria-label="Companion Document contents">
      <p className="mb-3 text-xs font-black uppercase tracking-[0.14em] text-ink">Companion Document</p>
      <ol className="space-y-1">
        {COMPANION.map((s) => {
          const active = s.id === activeId;
          const subs = s.blocks.filter((b) => b.k === "h2");
          return (
            <li key={s.id}>
              <a
                href={to(`companion/${s.id}`)}
                aria-current={active ? "page" : undefined}
                className={`block rounded-lg px-3 py-2 text-[15px] leading-snug ${
                  active ? "bg-blush font-bold text-plum" : "text-ink hover:text-plum"
                }`}
              >
                {chapterLabel(s)}
              </a>
              {active && subs.length > 0 && (
                <ul className="mt-1 mb-2 ml-3 border-l-2 border-blush-line pl-3 space-y-1">
                  {subs.map((b) =>
                    b.k === "h2" ? (
                      <li key={b.id}>
                        <a href={to(`companion/${s.id}`, b.id)} className="block py-0.5 text-sm text-ink/80 hover:text-plum">
                          {b.num ? `${b.num} ` : ""}
                          {b.text}
                        </a>
                      </li>
                    ) : null
                  )}
                </ul>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export default function Companion({ id }: { id?: string }) {
  const idx = Math.max(0, COMPANION.findIndex((s) => s.id === id));
  const chapter = COMPANION[idx];
  const theme = clausesByTheme.find((t) => t.theme === chapter.title);
  const prev = idx > 0
    ? { href: to(`companion/${COMPANION[idx - 1].id}`), label: chapterLabel(COMPANION[idx - 1]) }
    : { href: to(""), label: "Introduction" };
  const next = idx < COMPANION.length - 1
    ? { href: to(`companion/${COMPANION[idx + 1].id}`), label: chapterLabel(COMPANION[idx + 1]) }
    : { href: to(`clauses/${clausesByTheme[0].clauses[0].id}`), label: `Clause Bank: ${clausesByTheme[0].clauses[0].topic}` };

  return (
    <WithSidebar sidebar={<Contents activeId={chapter.id} />}>
      <article className="max-w-3xl">
        <Kicker>Companion Document{chapter.num ? ` · Chapter ${chapter.num}` : ""}</Kicker>
        <PageTitle>{chapter.title}</PageTitle>
        <div className="mt-8">
          <Blocks blocks={chapter.blocks} />
        </div>

        {theme && (
          <section aria-labelledby="chapter-clauses" className="mt-14 rounded-2xl bg-blush p-5 sm:p-7">
            <h2 id="chapter-clauses" className="text-lg font-black uppercase tracking-tight text-ink">
              {theme.theme} clauses
            </h2>
            <ul className="mt-4 grid gap-2">
              {theme.clauses.map((c) => (
                <li key={c.id}>
                  <a
                    href={to(`clauses/${c.id}`)}
                    className="group flex items-center gap-3 rounded-lg bg-white px-4 py-3 border-2 border-transparent hover:border-plum"
                  >
                    <span className="w-16 shrink-0 text-xs font-black text-plum">{c.id}</span>
                    <span className="flex-1 font-semibold text-ink group-hover:text-plum">{c.topic}</span>
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}

        <PrevNext prev={prev} next={next} />
      </article>
    </WithSidebar>
  );
}
