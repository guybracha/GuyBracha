import { asset } from "@/data/projects";
import { site } from "@/data/site";
import { ArrowUpRight, Download } from "./Icons";

export function Footer() {
  return (
    <footer id="contact" className="site-footer">
      <div className="container">
        <span className="eyebrow">Contact</span>
        <h2 className="contact-title">
          Let&rsquo;s make
          <br />
          something <em>bold.</em>
        </h2>
        <p style={{ maxWidth: "46ch", opacity: 0.8, marginBottom: 28 }}>
          Open to full-time roles, freelance and collaborations in graphic design, UI/UX and
          branding.
        </p>
        <a className="contact-mail" href={`mailto:${site.email}`}>
          {site.email}
        </a>
        <div className="contact-actions">
          <a className="btn btn-sun" href={asset(site.cv)} download>
            <Download /> Download CV
          </a>
          <a className="btn" href={site.linkedin} target="_blank" rel="noreferrer">
            LinkedIn <ArrowUpRight />
          </a>
          <a className="btn" href={site.github} target="_blank" rel="noreferrer">
            GitHub <ArrowUpRight />
          </a>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} {site.name}
          </span>
          <span>{site.location}</span>
        </div>
      </div>
    </footer>
  );
}
