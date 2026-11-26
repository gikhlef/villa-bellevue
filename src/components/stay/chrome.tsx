import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { euro } from "@/lib/dates";
import type { Property } from "@/data/property";
import { LANGS, t, useLang, type Lang } from "@/lib/i18n";

function go(id: string) {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.getElementById(id)?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
}

export function SiteHeader({ property, solid = false }: { property: Property; solid?: boolean }) {
  const { lang, setLang } = useLang();
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/95 backdrop-blur">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-4 px-5">
        <Link to="/" className="shrink-0">
          <img src="/logo-lockup.png" alt={property.name} className="h-16 w-auto" />
        </Link>
        {solid ? (
          <div className="flex items-center gap-2">
            <LangSwitch lang={lang} setLang={setLang} />
            <Link to="/" className="btn-ghost">
              {t(lang, "seeSite")}
            </Link>
          </div>
        ) : (
          <nav className="flex items-center gap-1 sm:gap-2">
            <button type="button" className="btn-ghost hidden sm:inline-flex" onClick={() => go("maison")}>
              {t(lang, "house")}
            </button>
            <button type="button" className="btn-ghost hidden md:inline-flex" onClick={() => go("avis")}>
              {t(lang, "reviews")}
            </button>
            <button type="button" className="btn-ghost hidden md:inline-flex" onClick={() => go("infos")}>
              {t(lang, "info")}
            </button>
            <LangSwitch lang={lang} setLang={setLang} />
            <button type="button" className="btn" onClick={() => go("reserver")}>
              {t(lang, "ask")}
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}

function LangSwitch({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  return (
    <div className="flex items-center text-xs text-muted">
      {LANGS.map((item, index) => (
        <span key={item.id} className="flex items-center">
          {index > 0 ? <span className="px-1 text-line">/</span> : null}
          <button
            type="button"
            className={`px-0.5 ${item.id === lang ? "text-ink" : "hover:text-ink"}`}
            onClick={() => setLang(item.id)}
            aria-pressed={item.id === lang}
          >
            {item.label}
          </button>
        </span>
      ))}
    </div>
  );
}

export function SiteFooter({ property }: { property: Property }) {
  const { lang } = useLang();
  return (
    <footer className="border-t border-line">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 pt-10 pb-28 sm:flex-row sm:items-end sm:justify-between md:pb-10">
        <div>
          <img src="/logo-lockup.png" alt="" className="h-16 w-auto" />
          <p className="mt-2 text-sm text-muted">
            {property.place}, {property.region}
          </p>
        </div>
        <div className="flex flex-col items-start gap-2 text-sm sm:items-end">
          <p className="text-muted">{t(lang, "direct")}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <a
              href="https://www.airbnb.fr/rooms/1132067670763466321"
              className="text-ink underline decoration-line underline-offset-4"
              target="_blank"
              rel="noreferrer"
            >
              Airbnb
            </a>
            <a
              href="https://www.booking.com/hotel/fr/villa-bellevue-mailly-le-chateau.fr.html"
              className="text-ink underline decoration-line underline-offset-4"
              target="_blank"
              rel="noreferrer"
            >
              Booking
            </a>
          </div>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <Link to="/conditions" className="text-ink underline decoration-line underline-offset-4">
              {t(lang, "conditions")}
            </Link>
            <Link to="/mentions" className="text-ink underline decoration-line underline-offset-4">
              {t(lang, "legal")}
            </Link>
            <Link to="/hote" className="text-ink underline decoration-line underline-offset-4">
              {t(lang, "host")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function MobileBookBar({ property }: { property: Property }) {
  const { lang } = useLang();
  const [hide, setHide] = useState(false);
  useEffect(() => {
    const el = document.getElementById("reserver");
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setHide(entry?.isIntersecting ?? false), {
      threshold: 0.12,
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  if (hide) return null;
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface px-4 py-3 md:hidden">
      <div className="flex items-center justify-between gap-3">
        <p className="font-display text-2xl leading-none tabular-nums text-ink">
          {euro(property.price)}
          <span className="ml-1 font-sans text-xs text-muted">{t(lang, "night")}</span>
        </p>
        <button type="button" className="btn" onClick={() => go("reserver")}>
          {t(lang, "ask")}
        </button>
      </div>
    </div>
  );
}
