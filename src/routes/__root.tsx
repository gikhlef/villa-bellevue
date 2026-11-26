import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { Toaster } from "sonner";
import { HydrateStay } from "@/components/stay/hydrate";
import { I18nProvider } from "@/lib/i18n";
import { faqJsonLd, lodgingJsonLd } from "@/lib/seo";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Villa Bellevue à Mailly-le-Château | Location de vacances, piscine, Bourgogne" },
      {
        name: "description",
        content:
          "Villa Bellevue, Mailly-le-Château (89660, Yonne). Location de vacances 4 étoiles, piscine, jacuzzi, cinéma, vue sur la vallée de l’Yonne. Jusqu’à 10 personnes. Réservation directe, sans commission.",
      },
      {
        name: "keywords",
        content:
          "Villa Bellevue, Mailly-le-Château, location vacances Yonne, villa piscine Bourgogne, gîte Mailly-le-Château, vacances vallée de l’Yonne",
      },
      { name: "geo.region", content: "FR-89" },
      { name: "geo.placename", content: "Mailly-le-Château" },
      { name: "geo.position", content: "47.5958;3.6426" },
      { name: "ICBM", content: "47.5958, 3.6426" },
      { name: "theme-color", content: "#1a6a6b" },
    ],
    links: [
      { rel: "canonical", href: "https://villabellevue.fr/" },
      { rel: "icon", type: "image/png", href: "/favicon-32.png" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500&family=Outfit:wght@400;500;600&display=swap",
      },
    ],
  }),
  component: () => (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(lodgingJsonLd()) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd()) }}
        />
        <PreviewHostBridge />
        <HydrateStay />
        <AuthProvider>
          <I18nProvider>
            <Outlet />
          </I18nProvider>
        </AuthProvider>
        <Toaster position="top-center" />
        <Scripts />
      </body>
    </html>
  ),
});
