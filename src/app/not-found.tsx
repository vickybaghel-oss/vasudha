import Link from "next/link";
import { site } from "@/lib/site";

export const metadata = {
  title: `Page Not Found — ${site.name}`,
  description: "The page you are looking for does not exist or has been moved.",
};

export default function NotFound() {
  return (
    <main className="page-gutter flex min-h-[70vh] flex-col items-center justify-center bg-background py-32 text-center">
      <p className="eyebrow text-accent">404 Error</p>
      <h1 className="editorial-heading mt-4 font-display text-[clamp(3.5rem,7vw,6rem)] text-heading">
        Page Not Found
      </h1>
      <p className="mt-6 max-w-md text-sm leading-7 text-foreground/80">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block rounded-full bg-heading px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-opacity hover:opacity-90"
      >
        Return to Home
      </Link>
    </main>
  );
}
