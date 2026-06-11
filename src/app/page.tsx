import { HopLogo } from "@/components/coming-soon/HopLogo";
import { LocationBadge } from "@/components/coming-soon/LocationBadge";
import { WaitlistForm } from "@/components/coming-soon/WaitlistForm";

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 py-16">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(201,162,39,0.08)_0%,_transparent_50%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(45,107,74,0.12)_0%,_transparent_45%)]" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a227' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <main className="relative z-10 flex w-full max-w-2xl flex-col items-center text-center">
        <HopLogo />

        <p className="mt-8 font-display text-xs font-medium uppercase tracking-[0.35em] text-hop-gold">
          Brew Co.
        </p>

        <h1 className="mt-2 font-display text-5xl font-semibold tracking-tight text-hop-cream sm:text-6xl md:text-7xl">
          Hopcity
        </h1>

        <div className="mt-6 inline-flex items-center rounded-full border border-hop-gold/30 bg-hop-gold/10 px-5 py-1.5">
          <span className="text-xs font-medium uppercase tracking-[0.25em] text-hop-gold-light">
            Coming Soon
          </span>
        </div>

        <p className="mt-8 font-display text-2xl font-medium italic text-hop-cream/90 sm:text-3xl">
          The World in Your Glass
        </p>

        <p className="mt-3 max-w-md text-sm leading-relaxed text-hop-cream/55">
          Twelve iconic beers from across the globe, each paired with a chef-crafted bite.
          A sensory journey is brewing at Sarath City.
        </p>

        <div className="mt-8">
          <LocationBadge />
        </div>

        <div className="mt-10 w-full">
          <p className="mb-4 text-xs uppercase tracking-[0.2em] text-hop-cream/40">
            Find your world at Hopcity
          </p>
          <WaitlistForm />
        </div>

        <footer className="mt-16 text-xs text-hop-cream/30">
          © {new Date().getFullYear()} Hopcity Brew Co.
        </footer>
      </main>
    </div>
  );
}
