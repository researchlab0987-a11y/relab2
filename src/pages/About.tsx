import React from "react";
import { useSiteContent } from "../firebase/hooks";

const About: React.FC = () => {
  const { content, loading } = useSiteContent();

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

  const sections = [
    { titleKey: "about.section1Title", textKey: "about.section1Text" },
    { titleKey: "about.section2Title", textKey: "about.section2Text" },
    { titleKey: "about.section3Title", textKey: "about.section3Text" },
  ];

  return (
    <div>
      {/* Hero */}
      <section
        className="relative overflow-hidden py-20 text-center px-4"
        style={{ background: "var(--color-primary)" }}
      >
        {content["about.bannerUrl"] && (
          <img
            src={content["about.bannerUrl"]}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: "brightness(0.45)" }}
          />
        )}
        <div className="relative z-10">
          <h1
            className="font-black text-white mb-4"
            style={{
              fontSize: "clamp(2rem,4vw,3rem)",
              fontFamily: "var(--font-heading)",
            }}
          >
            {content["about.pageTitle"] ?? "About the Lab"}
          </h1>
          <p
            className="text-base max-w-xl mx-auto"
            style={{ color: "rgba(255,255,255,0.75)" }}
          >
            {content["about.pageSubtitle"] ?? ""}
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Main sections */}
        {sections.map((s) =>
          content[s.titleKey] ? (
            <div key={s.titleKey} className="mb-14">
              <h2
                className="font-black text-2xl mb-2"
                style={{
                  color: "var(--color-primary)",
                  fontFamily: "var(--font-heading)",
                }}
              >
                {content[s.titleKey]}
              </h2>
              <div
                className="w-10 h-1 rounded mb-5"
                style={{ background: "var(--color-accent)" }}
              />
              <p
                className="text-gray-700 leading-relaxed text-base"
                style={{ whiteSpace: "pre-line" }}
              >
                {content[s.textKey]}
              </p>
            </div>
          ) : null,
        )}

        {/* Mission & Vision side by side */}
        {(content["about.missionTitle"] || content["about.visionTitle"]) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
            {content["about.missionTitle"] && (
              <div
                className="bg-white rounded-2xl p-8 shadow-md border-t-4"
                style={{ borderColor: "var(--color-primary)" }}
              >
                <h3
                  className="font-black text-lg mb-3"
                  style={{
                    color: "var(--color-primary)",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  {content["about.missionTitle"]}
                </h3>
                <p
                  className="text-gray-600 leading-relaxed text-sm"
                  style={{ whiteSpace: "pre-line" }}
                >
                  {content["about.missionText"]}
                </p>
              </div>
            )}
            {content["about.visionTitle"] && (
              <div
                className="bg-white rounded-2xl p-8 shadow-md border-t-4"
                style={{ borderColor: "var(--color-accent)" }}
              >
                <h3
                  className="font-black text-lg mb-3"
                  style={{
                    color: "var(--color-primary)",
                    fontFamily: "var(--font-heading)",
                  }}
                >
                  {content["about.visionTitle"]}
                </h3>
                <p
                  className="text-gray-600 leading-relaxed text-sm"
                  style={{ whiteSpace: "pre-line" }}
                >
                  {content["about.visionText"]}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default About;
