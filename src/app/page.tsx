import { HopLogo } from "@/components/coming-soon/HopLogo";
import { LocationBadge } from "@/components/coming-soon/LocationBadge";
import { WaitlistForm } from "@/components/coming-soon/WaitlistForm";

export default function Home() {
  return (
    <div className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden px-4 pb-[max(2rem,env(safe-area-inset-bottom))] pt-[max(2rem,env(safe-area-inset-top))] sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(174,201,176,0.12)_0%,_transparent_55%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_rgba(174,201,176,0.06)_0%,_transparent_50%)]" />

      <main className="relative z-10 flex w-full max-w-lg flex-col items-center text-center sm:max-w-xl lg:max-w-2xl">
        <HopLogo />

        <div className="mt-6 inline-flex items-center rounded-full border border-hop-green/40 bg-hop-green/10 px-4 py-1.5 sm:mt-8 sm:px-5">
          <span className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-hop-green sm:text-xs">
            Coming Soon
          </span>
        </div>

        <h1 className="mt-6 text-xl font-medium leading-tight text-hop-white sm:mt-8 sm:text-2xl lg:text-3xl">
          The World in Your Glass
        </h1>

        <p className="mt-3 max-w-[18rem] text-sm leading-relaxed text-hop-white/55 sm:max-w-md sm:text-base lg:max-w-lg">
          Twelve iconic beers from across the globe, each paired with a chef-crafted bite.
          A sensory journey is brewing at Sarath City.
        </p>

        <div className="mt-6 w-full sm:mt-8">
          <LocationBadge />
        </div>

        <div className="mt-8 w-full sm:mt-10 lg:mt-12">
          <p className="mb-4 text-[0.65rem] font-medium uppercase tracking-[0.22em] text-hop-white/40 sm:text-xs">
            Find your world at Hopcity
          </p>
          <div className="flex justify-center">
            <WaitlistForm />
          </div>
        </div>

        <footer className="mt-10 text-[0.7rem] text-hop-white/30 sm:mt-14 sm:text-xs">
          © {new Date().getFullYear()} Hopcity Brew Co.
        </footer>
      </main>
    </div>
  );
}
