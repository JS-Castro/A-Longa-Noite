import { VerticalSliceDashboard } from "@/components/vertical-slice-dashboard";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#090c10]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(132,204,255,0.13),_transparent_28%),radial-gradient(circle_at_20%_20%,_rgba(251,191,36,0.08),_transparent_20%),linear-gradient(180deg,_rgba(255,255,255,0.03),_transparent_45%)]" />
      <VerticalSliceDashboard />
    </div>
  );
}
