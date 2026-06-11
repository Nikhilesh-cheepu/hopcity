export function HopLogo() {
  return (
    <div className="flex w-full items-center justify-center px-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/hopcity-logo.png"
        alt="Hopcity Brew Co."
        width={960}
        height={259}
        fetchPriority="high"
        decoding="async"
        className="h-auto w-[min(92vw,340px)] max-w-[340px] bg-transparent sm:w-[min(85vw,440px)] sm:max-w-[440px] lg:max-w-[520px]"
      />
    </div>
  );
}
