import { Suspense } from "react";
import { JobSearchApp } from "@/components/JobSearchApp";

export default function Home() {
  return <Suspense fallback={<div className="min-h-svh bg-background" />}><JobSearchApp /></Suspense>;
}
