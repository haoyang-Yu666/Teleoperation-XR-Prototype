"use client";

import { useMemo, useState } from "react";

const defaultProfile = {
  name: "Jordan Lee",
  role: "Product Strategy Lead",
  bio: "I help early teams turn messy customer signals into focused product bets, launch plans, and crisp operating rituals.",
  location: "Austin, TX",
  type: "Consultant",
};

const goalOptions = [
  "Book intro calls",
  "Showcase expertise",
  "Collect leads",
  "Share portfolio",
  "Route requests",
];

const featureOptions = [
  {
    key: "calendar",
    title: "Calendar booking",
    description: "Offer a direct scheduling path.",
  },
  {
    key: "email",
    title: "Public email",
    description: "Show an email contact option.",
  },
  {
    key: "intake",
    title: "AI intake",
    description: "Ask visitors a short qualifying question.",
  },
];

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase()).join("") || "QS";
}

export default function Home() {
  const [profile, setProfile] = useState(defaultProfile);
  const [goals, setGoals] = useState(["Book intro calls", "Showcase expertise", "Route requests"]);
  const [features, setFeatures] = useState(["calendar", "intake"]);
  const [activeStep, setActiveStep] = useState("basics");
  const [published, setPublished] = useState(false);

  const score = useMemo(() => {
    let total = 0;
    total += profile.name.trim() ? 15 : 0;
    total += profile.role.trim() ? 15 : 0;
    total += profile.bio.trim().length > 35 ? 20 : 0;
    total += profile.location.trim() ? 10 : 0;
    total += Math.min(goals.length, 3) * 10;
    total += Math.min(features.length, 2) * 10;
    return total;
  }, [features.length, goals.length, profile]);

  const checklist = [
    ["Basics complete", Boolean(profile.name && profile.role && profile.bio)],
    ["Goals selected", goals.length >= 2],
    ["Contact path active", features.length >= 1],
    ["Ready to publish", score >= 85],
  ];

  const previewTags = [profile.type, profile.location, ...goals.slice(0, 2)].filter(Boolean);
  const nextAction = published
    ? "Preview published. Share the link with a teammate for feedback."
    : score >= 85
      ? "Review the live preview and publish when it feels right."
      : "Add a stronger bio, select goals, and turn on one contact path.";

  function updateProfile(field: keyof typeof defaultProfile, value: string) {
    setPublished(false);
    setProfile((current) => ({ ...current, [field]: value }));
  }

  function toggleGoal(goal: string) {
    setPublished(false);
    setGoals((current) =>
      current.includes(goal) ? current.filter((item) => item !== goal) : [...current, goal],
    );
  }

  function toggleFeature(feature: string) {
    setPublished(false);
    setFeatures((current) =>
      current.includes(feature)
        ? current.filter((item) => item !== feature)
        : [...current, feature],
    );
  }

  function resetPrototype() {
    setProfile(defaultProfile);
    setGoals(["Book intro calls", "Showcase expertise", "Route requests"]);
    setFeatures(["calendar", "intake"]);
    setPublished(false);
  }

  function jumpToStep(step: string) {
    setActiveStep(step);
    document.getElementById(step)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <main className="app">
      <aside className="sidebar" aria-label="Profile setup progress">
        <div className="brand">
          <div className="mark" aria-hidden="true">
            QS
          </div>
          <div>
            <strong>Quick Start</strong>
            <span className="micro">Profile setup prototype</span>
          </div>
        </div>

        <nav className="steps" aria-label="Setup sections">
          {[
            ["basics", "Basics"],
            ["goals", "Goals"],
            ["preferences", "Preferences"],
            ["launch", "Launch"],
          ].map(([step, label], index) => (
            <button
              className={`step ${activeStep === step ? "active" : ""} ${index < 2 ? "done" : ""}`}
              key={step}
              onClick={() => jumpToStep(step)}
              type="button"
            >
              <span className="dot">{index + 1}</span>
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="progress-wrap">
          <div className="progress-label">
            <span>Profile readiness</span>
            <strong>{score}%</strong>
          </div>
          <div className="progress" aria-hidden="true">
            <div style={{ width: `${score}%` }} />
          </div>
        </div>

        <div className="sidebar-footer">
          <strong>Next best action</strong>
          <p className="micro">{nextAction}</p>
        </div>
      </aside>

      <section className="main">
        <div className="topbar">
          <div>
            <h1>Build a useful profile in under five minutes.</h1>
            <p className="muted">
              A compact onboarding surface for turning a blank account into a credible,
              personalized, ready-to-use profile.
            </p>
          </div>
          <div className="actions">
            <button className="button" onClick={resetPrototype} type="button">
              Reset
            </button>
            <button className="button primary" onClick={() => setPublished(true)} type="button">
              Publish preview
            </button>
          </div>
        </div>

        <section className="panel profile-section" id="basics">
          <div className="section-head">
            <div>
              <h2>Basics</h2>
              <p className="muted">Start with the minimum details that make the profile feel real.</p>
            </div>
            <span className="status-pill">2 min</span>
          </div>
          <div className="grid">
            <label>
              Display name
              <input
                autoComplete="name"
                value={profile.name}
                onChange={(event) => updateProfile("name", event.target.value)}
              />
            </label>
            <label>
              Role
              <input value={profile.role} onChange={(event) => updateProfile("role", event.target.value)} />
            </label>
            <label className="span-2">
              Short bio
              <textarea value={profile.bio} onChange={(event) => updateProfile("bio", event.target.value)} />
            </label>
            <label>
              Location
              <input
                value={profile.location}
                onChange={(event) => updateProfile("location", event.target.value)}
              />
            </label>
            <label>
              Profile type
              <select value={profile.type} onChange={(event) => updateProfile("type", event.target.value)}>
                <option>Consultant</option>
                <option>Founder</option>
                <option>Creator</option>
                <option>Internal expert</option>
              </select>
            </label>
          </div>
        </section>

        <section className="panel profile-section" id="goals">
          <div className="section-head">
            <div>
              <h2>Goals</h2>
              <p className="muted">Pick the outcomes this profile should support first.</p>
            </div>
            <span className="status-pill">Recommended</span>
          </div>
          <div className="chips" aria-label="Goal options">
            {goalOptions.map((goal) => (
              <button
                className={`chip ${goals.includes(goal) ? "selected" : ""}`}
                key={goal}
                onClick={() => toggleGoal(goal)}
                type="button"
              >
                {goal}
              </button>
            ))}
          </div>
        </section>

        <section className="panel profile-section" id="preferences">
          <div className="section-head">
            <div>
              <h2>Preferences</h2>
              <p className="muted">Set lightweight rules so the profile can guide visitors cleanly.</p>
            </div>
            <span className="status-pill">Live</span>
          </div>
          <div className="toggles">
            {featureOptions.map((feature) => (
              <div className="toggle" key={feature.key}>
                <div>
                  <strong>{feature.title}</strong>
                  <p className="micro">{feature.description}</p>
                </div>
                <button
                  aria-label={`Toggle ${feature.title}`}
                  className={`switch ${features.includes(feature.key) ? "on" : ""}`}
                  onClick={() => toggleFeature(feature.key)}
                  type="button"
                />
              </div>
            ))}
          </div>
        </section>

        <section className="panel profile-section" id="launch">
          <div className="section-head">
            <div>
              <h2>Launch checklist</h2>
              <p className="muted">
                A quick operating view for what is ready and what still needs attention.
              </p>
            </div>
            <span className="status-pill">{published ? "Published" : score >= 85 ? "Ready" : "Draft"}</span>
          </div>
          <div className="checklist">
            {checklist.map(([label, done]) => (
              <div className="check" key={String(label)}>
                <strong>{label}</strong>
                <span>{done ? "Ready" : "Needs input"}</span>
              </div>
            ))}
          </div>
        </section>
      </section>

      <aside className="preview" aria-label="Live profile preview">
        <div className="section-head">
          <div>
            <h2>Live preview</h2>
            <p className="muted">Updates as the setup changes.</p>
          </div>
        </div>

        <article className="profile-card">
          <div className="cover" aria-hidden="true" />
          <div className="avatar">{getInitials(profile.name)}</div>
          <div className="card-body">
            <div>
              <h3>{profile.name || "New profile"}</h3>
              <p className="muted">{profile.role || "Role not set"}</p>
            </div>
            <p>{profile.bio || "Add a short bio to help visitors understand what you do."}</p>
            <div className="tag-row">
              {previewTags.map((tag) => (
                <span className="tag" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
            <button className="button primary" type="button">
              Request an intro
            </button>
          </div>
        </article>

        <div className="metrics">
          <div className="metric">
            <strong>{goals.length}</strong>
            <span>goals selected</span>
          </div>
          <div className="metric">
            <strong>{features.length}</strong>
            <span>features on</span>
          </div>
          <div className="metric">
            <strong>{score >= 85 ? "1m" : score >= 65 ? "4m" : "7m"}</strong>
            <span>to finish</span>
          </div>
        </div>
      </aside>
    </main>
  );
}
