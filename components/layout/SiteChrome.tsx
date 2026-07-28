"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { AssistantWidget } from "@/components/assistant/AssistantWidget";
import { AnimatedBackground } from "@/components/effects/AnimatedBackground";
import { BackToTop } from "@/components/effects/BackToTop";
import { CustomCursor } from "@/components/effects/CustomCursor";
import { PageLoader } from "@/components/effects/PageLoader";
import { ScrollProgress } from "@/components/effects/ScrollProgress";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { LanguageProvider } from "@/lib/i18n";

/**
 * Wraps pages with the public-site chrome. The /dashboard route is a
 * private tool, so it renders without navbar, footer, or widgets.
 */
export function SiteChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isDashboard = pathname.startsWith("/dashboard");

  if (isDashboard) {
    return <>{children}</>;
  }

  return (
    <LanguageProvider>
      <PageLoader />
      <ScrollProgress />
      <AnimatedBackground />
      <CustomCursor />
      <Navbar />
      {children}
      <Footer />
      <AssistantWidget />
      <BackToTop />
    </LanguageProvider>
  );
}
