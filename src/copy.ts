/**
 * All wording on the site that does NOT come from the spreadsheet.
 * Edit text here; everything from the spreadsheet lives in src/data.ts.
 */
export const COPY = {
  site: {
    name: "Digital Content Licensing Clause Bank",
    headerLine1: "Digital Content",
    headerLine2: "Licensing Clause Bank",
  },

  nav: {
    find: "Find a clause",
    table: "Table",
    howTo: "How to Use",
    book: "Read the book",
    downloadButton: ".xlsx",
    download: "Download the spreadsheet (.xlsx)",
    menu: "Menu",
    skip: "Skip to content",
  },

  finder: {
    kicker: "Clause Bank",
    title: "Find a clause",
    searchPlaceholder: "Search by topic, ID, or any word",
    allThemes: "All themes",
    anyPriority: "Any priority",
    highAndMedium: "High and Medium",
    highOnly: "High only",
    explainHighAndMedium: (p: string) =>
      `Clauses marked H (high) or M (medium) for ${p}.`,
    explainHighOnly: (p: string) => `Clauses marked H (high priority) for ${p}.`,
    countAll: (total: number) => `${total} clauses by theme`,
    countFiltered: (n: number, total: number) => `${n} of ${total} clauses`,
    clear: "Clear",
    noResults: "No clause contains all of those words. Try fewer words, or a clause ID like GS-AU.",
    panelHint: "Pick a clause to read it here",
    moreHowTo: "More on how to use the Clause Bank",
    back: "Back to results",
    notFound: (id: string) => `No clause with ID “${id}”.`,
    backToList: "Back to the list",
  },

  clause: {
    priority: "Priority",
    high: "High",
    medium: "Medium",
    copy: "Copy",
    copied: "Copied",
    copyLink: "Copy link",
    linkCopied: "Link copied",
    inCompanion: "in the companion document",
  },

  table: {
    kicker: "Clause Bank",
    title: "Table",
    intro: (total: number) =>
      `All ${total} clauses in one table, with the five priority columns. Filter by a priority to get the shortlist for one need, or read across a row to see how much rides on a single clause.`,
    priorityLink: "How the priority columns work",
    searchPlaceholder: "Search all text",
    allThemes: "All themes",
    priority: "Priority",
    highOnly: "High (H) only",
    showing: (n: number, total: number) => `Showing ${n} of ${total}`,
    clearFilters: "Clear filters",
    everyColumn: "Show every column (full clause text, like the workbook)",
    legendHigh: "high priority",
    legendMedium: "medium priority",
    hintSort: "Click a priority heading to sort by it.",
    hintRow: "Click a row to read the full clause.",
    hintId: "Click a clause ID to open it.",
    openClause: "Open this clause",
    noMatches: "No clauses match these filters.",
  },

  howTo: {
    kicker: "From the spreadsheet’s Read Me First tab",
    title: "How to Use",
    onThisPage: "On this page",
    importantLink: "Important",
  },

  footer: {
    published: "Published by",
    and: "and",
    explore: "Explore",
    book: "Read the book (companion document)",
    notLegalAdvice: "Not legal advice",
  },
};
