import Image from "next/image";

export function HopLogo() {
  return (
    <div className="flex w-full items-center justify-center px-2">
      <Image
        src="/brand/hopcity-logo.png"
        alt="Hopcity Brew Co."
        width={1024}
        height={575}
        priority
        className="h-auto w-[min(92vw,340px)] max-w-[340px] sm:w-[min(85vw,440px)] sm:max-w-[440px] lg:max-w-[520px]"
      />
    </div>
  );
}
