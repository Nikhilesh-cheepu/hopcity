import Image from "next/image";

export function HopLogo() {
  return (
    <div className="relative flex w-full items-center justify-center">
      <div className="absolute h-40 w-40 rounded-full bg-hop-green/15 blur-3xl animate-pulse-slow sm:h-52 sm:w-52" />
      <Image
        src="/brand/hopcity-logo.png"
        alt="Hopcity Brew Co."
        width={1024}
        height={1024}
        priority
        className="relative z-10 h-auto w-[min(88vw,300px)] max-w-[300px] sm:w-[min(70vw,380px)] sm:max-w-[380px] lg:max-w-[420px]"
      />
    </div>
  );
}
