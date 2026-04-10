import React, { useState } from "react";
import PublicationCard from "../components/PublicationCard";
import { usePublications, useSiteContent } from "../firebase/hooks";

const Publications: React.FC = () => {
  const { ongoing, published, loading } = usePublications();
  const { content } = useSiteContent();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"all" | "ongoing" | "published">("all");

  const filter = (list: typeof ongoing) =>
    list.filter(
      (p) =>
        p.title.toLowerCase().includes(search.toLowerCase()) ||
        p.authors.toLowerCase().includes(search.toLowerCase()) ||
        p.journal.toLowerCase().includes(search.toLowerCase()),
    );

  const filteredOngoing = filter(ongoing);
  const filteredPublished = filter(published);

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
    padding: "8px 20px",
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
  });

  return (
    <div>
      {/* Hero */}
      <section
        className="py-20 text-center px-4"
        style={{ background: "var(--color-primary)" }}
      >
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
          className="text-base max-w-xl mx-auto"
          style={{ color: "rgba(255,255,255,0.75)" }}
        >
          {content["publications.pageSubtitle"] ?? ""}
        </p>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Search + Tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div
            className="flex border-b w-full sm:w-auto"
            style={{ borderColor: "#e5e7eb" }}
          >
            <button
              style={tabStyle(tab === "all")}
              onClick={() => setTab("all")}
            >
              All ({ongoing.length + published.length})
            </button>
            <button
              style={tabStyle(tab === "ongoing")}
              onClick={() => setTab("ongoing")}
            >
              Ongoing ({ongoing.length})
            </button>
            <button
              style={tabStyle(tab === "published")}
              onClick={() => setTab("published")}
            >
              Published ({published.length})
            </button>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, author, journal..."
            className="text-sm px-4 py-2 rounded-lg border outline-none w-full sm:w-64"
            style={{ borderColor: "#d1d5db" }}
          />
        </div>

        {/* Ongoing Section */}
        {(tab === "all" || tab === "ongoing") && filteredOngoing.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-2">
              <h2
                className="font-black text-xl"
                style={{
                  color: "var(--color-primary)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                {content["publications.ongoingTitle"] ?? "Ongoing Research"}
              </h2>
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ background: "#fef3c7", color: "#92400e" }}
              >
                {filteredOngoing.length}
              </span>
            </div>
            {content["publications.ongoingSubtitle"] && (
              <p className="text-sm text-gray-500 mb-4">
                {content["publications.ongoingSubtitle"]}
              </p>
            )}
            <div
              className="w-10 h-1 rounded mb-6"
              style={{ background: "var(--color-accent)" }}
            />
            <div className="flex flex-col gap-4">
              {filteredOngoing.map((p) => (
                <PublicationCard key={p.id} publication={p} />
              ))}
            </div>
          </div>
        )}

        {/* Published Section */}
        {(tab === "all" || tab === "published") &&
          filteredPublished.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2
                  className="font-black text-xl"
                  style={{
                    color: "var(--color-primary)",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  {content["publications.publishedTitle"] ??
                    "Published Research"}
                </h2>
                <span
                  className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: "#dbeafe", color: "#1e40af" }}
                >
                  {filteredPublished.length}
                </span>
              </div>
              {content["publications.publishedSubtitle"] && (
                <p className="text-sm text-gray-500 mb-4">
                  {content["publications.publishedSubtitle"]}
                </p>
              )}
              <div
                className="w-10 h-1 rounded mb-6"
                style={{ background: "var(--color-secondary)" }}
              />
              <div className="flex flex-col gap-4">
                {filteredPublished.map((p) => (
                  <PublicationCard key={p.id} publication={p} />
                ))}
              </div>
            </div>
          )}

        {filteredOngoing.length === 0 && filteredPublished.length === 0 && (
          <p className="text-center text-gray-400 py-16">
            No publications found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Publications;
