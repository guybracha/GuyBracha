import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="container">
        <span className="eyebrow">404</span>
        <h1 className="section-title" style={{ margin: "16px 0 24px" }}>
          This page went off-panel.
        </h1>
        <Link href="/" className="btn btn-primary">
          Back to home
        </Link>
      </div>
    </section>
  );
}
