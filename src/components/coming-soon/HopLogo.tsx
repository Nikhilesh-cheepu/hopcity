import Image from "next/image";

export function HopLogo() {
  return (
    <div className="relative flex items-center justify-center">
      <div className="absolute h-32 w-32 rounded-full bg-hop-gold/20 blur-3xl animate-pulse-slow" />
      <Image
        src="/brand/hop-logo.svg"
        alt="Hopcity hop mark"
        width={96}
        height={96}
        priority
        className="relative z-10 drop-shadow-[0_0_24px_rgba(201,162,39,0.4)]"
      />
    </div>
  );
}
