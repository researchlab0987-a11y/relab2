import React, { useMemo, useState } from "react";
import PublicationCard from "../components/PublicationCard";
import { usePublications, useSiteContent } from "../firebase/hooks";
import type { Publication } from "../types";

// ── Helpers ────────────────────────────────────────────────────
function groupByYear(list: Publication[]): Record<number, Publication[]> {
  return list.reduce(
    (acc, p) => {
      acc[p.year] = acc[p.year] ? [...acc[p.year], p] : [p];
      return acc;
    },
    {} as Record<number, Publication[]>,
  );
}

const Publications: React.FC = () => {
  const { ongoing, published, loading } = usePublications();
  const { content } = useSiteContent();

  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"all" | "ongoing" | "published">("all");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [selectedTag, setSelectedTag] = useState<string>("");

  // ── Derived filter options ─────────────────────────────────
  const allYears = useMemo(() => {
    const set = new Set([...ongoing, ...published].map((p) => p.year));
    return Array.from(set).sort((a, b) => b - a);
  }, [ongoing, published]);

  const allTags = useMemo(() => {
    const set = new Set(
      [...ongoing, ...published].flatMap((p) => p.tags ?? []),
    );
    return Array.from(set).sort();
  }, [ongoing, published]);

  // ── Filter function ────────────────────────────────────────
  const filter = (list: Publication[]) =>
    list.filter((p) => {
      const q = search.toLowerCase();
      const matchSearch =
        !search ||
        p.title.toLowerCase().includes(q) ||
        p.authors.toLowerCase().includes(q) ||
        p.journal.toLowerCase().includes(q) ||
        p.tags?.some((t) => t.toLowerCase().includes(q));
      const matchYear = !selectedYear || String(p.year) === selectedYear;
      const matchTag = !selectedTag || p.tags?.includes(selectedTag);
      return matchSearch && matchYear && matchTag;
    });

  const filteredOngoing = filter(ongoing);
  const filteredPublished = filter(published);
  const groupedPublished = groupByYear(filteredPublished);
  const sortedYears = Object.keys(groupedPublished)
    .map(Number)
    .sort((a, b) => b - a);

  const hasFilters = !!(search || selectedYear || selectedTag);
  const clearFilters = () => {
    setSearch("");
    setSelectedYear("");
    setSelectedTag("");
  };

  const totalShown =
    (tab === "all" || tab === "ongoing" ? filteredOngoing.length : 0) +
    (tab === "all" || tab === "published" ? filteredPublished.length : 0);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div
          className="w-10 h-10 rounded-full border-4 border-t-transparent animate-spin"
          style={{
            borderColor: "var(--color-primary)",
            borderTopColor: "transparent",
          }}
        />
      </div>
    );

  const tabStyle = (active: boolean) => ({
    padding: "9px 20px",
    border: "none",
    borderBottom: active
      ? "3px solid var(--color-primary)"
      : "3px solid transparent",
    cursor: "pointer",
    fontSize: 14,
    fontWeight: active ? 700 : 500,
    color: active ? "var(--color-primary)" : "#6b7280",
    background: "transparent",
    transition: "color 0.15s",
    whiteSpace: "nowrap" as const,
  });

  const selectStyle: React.CSSProperties = {
    padding: "8px 32px 8px 12px",
    border: "1px solid #e5e7eb",
    borderRadius: 10,
    fontSize: 13,
    fontWeight: 600,
    color: "#374151",
    background: "white",
    cursor: "pointer",
    outline: "none",
    appearance: "none",
    WebkitAppearance: "none",
    backgroundImage:
      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 10px center",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  };

  return (
    <div>
      {/* ── Hero ── */}
      <section
        className="relative py-20 text-center px-4 overflow-hidden"
        style={{ background: "var(--color-primary)" }}
      >
        {/* Decorative dots */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative z-10">
          <h1
            className="font-black text-white mb-4"
            style={{
              fontSize: "clamp(2rem,4vw,3rem)",
              fontFamily: "var(--font-heading)",
            }}
          >
            {content["publications.pageTitle"] ?? "Publications"}
          </h1>
          <p
            className="text-base max-w-xl mx-auto mb-6"
            style={{ color: "rgba(255,255,255,0.72)" }}
          >
            {content["publications.pageSubtitle"] ?? ""}
          </p>
          {/* Hero stats */}
          <div className="flex items-center justify-center gap-8">
            <div className="text-center">
              <div
                className="text-2xl font-black"
                style={{ color: "var(--color-accent)" }}
              >
                {published.length}
              </div>
              <div
                className="text-xs"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                Published
              </div>
            </div>
            <div
              className="w-px h-8"
              style={{ background: "rgba(255,255,255,0.2)" }}
            />
            <div className="text-center">
              <div
                className="text-2xl font-black"
                style={{ color: "var(--color-accent)" }}
              >
                {ongoing.length}
              </div>
              <div
                className="text-xs"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                Ongoing
              </div>
            </div>
            <div
              className="w-px h-8"
              style={{ background: "rgba(255,255,255,0.2)" }}
            />
            <div className="text-center">
              <div
                className="text-2xl font-black"
                style={{ color: "var(--color-accent)" }}
              >
                {
                  [
                    ...new Set(
                      [...ongoing, ...published].flatMap((p) => p.tags ?? []),
                    ),
                  ].length
                }
              </div>
              <div
                className="text-xs"
                style={{ color: "rgba(255,255,255,0.6)" }}
              >
                Topics
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* ── Filter bar ── */}
        <div
          className="bg-white rounded-2xl p-4 mb-8 flex flex-wrap items-center gap-3"
          style={{
            boxShadow: "0 2px 14px rgba(0,0,0,0.07)",
            border: "1px solid #f0f0f0",
          }}
        >
          {/* Search */}
          <div className="relative flex-1" style={{ minWidth: 200 }}>
            <span
              className="absolute left-3 top-1/2 text-sm"
              style={{ transform: "translateY(-50%)", color: "#9ca3af" }}
            >
              🔍
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title, author, journal, tag..."
              className="w-full text-sm outline-none rounded-xl"
              style={{
                padding: "9px 14px 9px 32px",
                border: "1px solid #e5e7eb",
                background: "#f9fafb",
              }}
            />
          </div>

          {/* Year filter */}
          {allYears.length > 1 && (
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              style={{
                ...selectStyle,
                borderColor: selectedYear ? "var(--color-primary)" : "#e5e7eb",
                color: selectedYear ? "var(--color-primary)" : "#374151",
              }}
            >
              <option value="">All Years</option>
              {allYears.map((y) => (
                <option key={y} value={String(y)}>
                  {y}
                </option>
              ))}
            </select>
          )}

          {/* Tag filter */}
          {allTags.length > 0 && (
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              style={{
                ...selectStyle,
                borderColor: selectedTag ? "var(--color-primary)" : "#e5e7eb",
                color: selectedTag ? "var(--color-primary)" : "#374151",
              }}
            >
              <option value="">All Topics</option>
              {allTags.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          )}

          {/* Clear */}
          {hasFilters && (
            <button
              onClick={clearFilters}
              className="text-xs font-bold px-3 py-2 rounded-xl border-none cursor-pointer"
              style={{ background: "#fee2e2", color: "#991b1b" }}
            >
              ✕ Clear
            </button>
          )}

          <span
            className="ml-auto text-xs font-semibold"
            style={{ color: "#9ca3af" }}
          >
            {totalShown} result{totalShown !== 1 ? "s" : ""}
          </span>
        </div>

        {/* ── Tabs ── */}
        <div
          className="flex border-b mb-8 overflow-x-auto"
          style={{ borderColor: "#e5e7eb" }}
        >
          <button style={tabStyle(tab === "all")} onClick={() => setTab("all")}>
            All ({filteredOngoing.length + filteredPublished.length})
          </button>
          <button
            style={tabStyle(tab === "ongoing")}
            onClick={() => setTab("ongoing")}
          >
            🔬 Ongoing ({filteredOngoing.length})
          </button>
          <button
            style={tabStyle(tab === "published")}
            onClick={() => setTab("published")}
          >
            ✅ Published ({filteredPublished.length})
          </button>
        </div>

        {/* ── Ongoing Section ── */}
        {(tab === "all" || tab === "ongoing") && filteredOngoing.length > 0 && (
          <div className="mb-14">
            <SectionHeader
              title={content["publications.ongoingTitle"] ?? "Ongoing Research"}
              subtitle={content["publications.ongoingSubtitle"]}
              count={filteredOngoing.length}
              color="var(--color-accent)"
              badgeBg="#fef3c7"
              badgeText="#92400e"
            />
            <div className="flex flex-col gap-4">
              {filteredOngoing.map((p) => (
                <PublicationCard key={p.id} publication={p} />
              ))}
            </div>
          </div>
        )}

        {/* ── Published Section — grouped by year ── */}
        {(tab === "all" || tab === "published") &&
          filteredPublished.length > 0 && (
            <div>
              <SectionHeader
                title={
                  content["publications.publishedTitle"] ?? "Published Research"
                }
                subtitle={content["publications.publishedSubtitle"]}
                count={filteredPublished.length}
                color="var(--color-secondary)"
                badgeBg="#dbeafe"
                badgeText="#1e40af"
              />
              {sortedYears.map((year) => (
                <YearGroup
                  key={year}
                  year={year}
                  publications={groupedPublished[year]}
                />
              ))}
            </div>
          )}

        {/* ── Empty state ── */}
        {totalShown === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">📭</div>
            <p className="font-semibold text-gray-500 text-lg">
              No publications found.
            </p>
            {hasFilters && (
              <button
                onClick={clearFilters}
                className="mt-4 text-sm font-bold px-5 py-2.5 rounded-xl text-white border-none cursor-pointer"
                style={{ background: "var(--color-primary)" }}
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ── Section heading ────────────────────────────────────────────
const SectionHeader: React.FC<{
  title: string;
  subtitle?: string;
  count: number;
  color: string;
  badgeBg: string;
  badgeText: string;
}> = ({ title, subtitle, count, color, badgeBg, badgeText }) => (
  <div className="mb-6">
    <div className="flex items-center gap-3 mb-1">
      <div
        className="w-1 h-7 rounded-full flex-shrink-0"
        style={{ background: color }}
      />
      <h2
        className="font-black text-xl"
        style={{
          color: "var(--color-primary)",
          fontFamily: "var(--font-heading)",
        }}
      >
        {title}
      </h2>
      <span
        className="text-xs font-black px-2.5 py-1 rounded-full"
        style={{ background: badgeBg, color: badgeText }}
      >
        {count}
      </span>
    </div>
    {subtitle && <p className="text-sm text-gray-500 ml-4 mb-3">{subtitle}</p>}
    <div
      className="h-0.5 w-24 ml-4 rounded-full"
      style={{ background: color, opacity: 0.35 }}
    />
  </div>
);

// ── Year group for published papers ───────────────────────────
const YearGroup: React.FC<{ year: number; publications: Publication[] }> = ({
  year,
  publications,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="mb-8">
      {/* Year header */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="flex items-center gap-3 w-full text-left mb-4 bg-transparent border-none cursor-pointer group"
      >
        <div
          className="flex items-center gap-3 px-4 py-2 rounded-xl"
          style={{ background: "var(--color-primary)" }}
        >
          <span className="text-white font-black text-sm">{year}</span>
          <span
            className="text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ background: "rgba(255,255,255,0.2)", color: "white" }}
          >
            {publications.length} paper{publications.length !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="flex-1 h-px" style={{ background: "#e5e7eb" }} />
        <span className="text-xs font-bold" style={{ color: "#9ca3af" }}>
          {collapsed ? "▼ Show" : "▲ Hide"}
        </span>
      </button>

      {/* Papers */}
      {!collapsed && (
        <div className="flex flex-col gap-4 pl-2">
          {publications.map((p) => (
            <PublicationCard key={p.id} publication={p} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Publications;
