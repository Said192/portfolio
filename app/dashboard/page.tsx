import type { Metadata } from "next";

import { DashboardApp } from "@/components/dashboard/DashboardApp";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false }, // private tool — keep out of search
};

export default function DashboardPage() {
  return <DashboardApp />;
}
