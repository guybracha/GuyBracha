import { Reveal } from "@/components/Reveal";
import { WorkGrid } from "@/components/WorkGrid";
import { ArrowRight, ArrowUpRight, Mail } from "@/components/Icons";
import { asset } from "@/data/projects";
import {
  codeProjects,
  disciplines,
  education,
  experience,
  influences,
  site,
  strengths,
  tools,
  type TimelineItem,
} from "@/data/site";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <section id="work" className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">Selected work</span>
              <h2 className="section-title">Projects &amp; pieces</h2>
            </div>
          </div>
          <WorkGrid />
        </div>
      </section>
      <About />
      <Experience />
    </>
  );
}

function Hero() {
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div>
          <span className="eyebrow">
            {site.role} — {site.location}
          </span>
          <h1 className="hero-title">
            Visuals that <em>pop</em>, built by a designer who{" "}
            <span className="scribble">speaks dev.</span>
          </h1>
          <p className="hero-lede">{site.tagline}</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#work">
              See the work <ArrowRight />
            </a>
            <a className="btn" href={`mailto:${site.email}`}>
              <Mail /> Get in touch
            </a>
          </div>
        </div>

        <div className="portrait">
          <div className="portrait-dots" aria-hidden="true" />
          <div className="portrait-frame">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={asset("/thumbs/profile.webp")} alt="Portrait of Guy Bracha" width={1200} height={1200} />
          </div>
          <div className="bubble">
            <span className="dot" aria-hidden="true" />
            Open to work!
          </div>
          <div className="sticker" aria-hidden="true">
            Game
            <br />
            art &amp;
            <br />
            brand
          </div>
        </div>
      </div>
    </section>
  );
}

function Marquee() {
  const list = (hidden?: boolean) => (
    <ul aria-hidden={hidden || undefined}>
      {disciplines.map((d) => (
        <li key={d}>{d}</li>
      ))}
    </ul>
  );
  return (
    <div className="marquee">
      <div className="marquee-track">
        {list()}
        {list(true)}
      </div>
    </div>
  );
}

function About() {
  return (
    <section id="about" className="section section-alt">
      <div className="container">
        <div className="about-grid">
          <Reveal>
            <span className="eyebrow">About</span>
            <p className="about-quote">{site.quote.text}</p>
            <p className="about-cite">— {site.quote.author}</p>
          </Reveal>
          <Reveal className="about-text" delay={100}>
            <p>
              I&rsquo;m <strong>Guy Bracha</strong>, a marketing-minded graphic designer and illustrator
              based in Herzliya, with a background in <strong>software engineering</strong>.
            </p>
            <p>
              I turn ideas into high-impact visual assets — monetization banners, live-ops promos,
              brand systems and characters — and I build them in a way developers love to receive:
              organised layers, clean exports, no surprises.
            </p>
            <p>
              On the side I&rsquo;m building <strong>Compass Alliance</strong>, an original superhero
              universe inspired by cinema and manga.
            </p>
            <div className="meta-rows">
              <div className="meta-row">
                <h4>Tools</h4>
                <div className="chips">
                  {tools.map((t) => (
                    <span key={t} className="chip">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="meta-row">
                <h4>Influences</h4>
                <div className="chips">
                  {influences.map((t) => (
                    <span key={t} className="chip">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="strengths">
          {strengths.map((s, i) => (
            <Reveal key={s.title} className="strength" delay={i * 90}>
              <span className="strength-num">0{i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Timeline({ title, items }: { title: string; items: TimelineItem[] }) {
  return (
    <Reveal className="timeline-col">
      <h3>{title}</h3>
      <ol className="timeline">
        {items.map((it) => (
          <li key={it.title}>
            <span className="tl-period">{it.period}</span>
            <h4 className="tl-title">{it.title}</h4>
            <span className="tl-org">{it.org}</span>
            <p className="tl-body">{it.body}</p>
          </li>
        ))}
      </ol>
    </Reveal>
  );
}

function Experience() {
  return (
    <section id="experience" className="section">
      <div className="container">
        <div className="section-head">
          <div>
            <span className="eyebrow">Journey</span>
            <h2 className="section-title">Experience &amp; education</h2>
          </div>
        </div>
        <div className="timeline-grid">
          <Timeline title="Experience" items={experience} />
          <Timeline title="Education" items={education} />
        </div>

        <Reveal className="code-block" delay={60}>
          <div style={{ marginTop: "clamp(56px, 8vw, 96px)" }}>
            <span className="eyebrow">Also building</span>
            <div className="code-list">
              {codeProjects.map((c) => (
                <a key={c.title} className="code-item" href={c.href} target="_blank" rel="noreferrer">
                  <strong>
                    {c.title} <ArrowUpRight className="inline-icon" />
                  </strong>
                  <span>{c.stack}</span>
                </a>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
