import Image from "next/image";

export function HopLogo() {
  return (
    <div className="flex w-full items-center justify-center">
      <Image
        src="/brand/hopcity-logo.png"
        alt="Hopcity Brew Co."
        width={1024}
        height={1024}
        priority
        className="h-auto w-[min(88vw,300px)] max-w-[300px] sm:w-[min(70vw,380px)] sm:max-w-[380px] lg:max-w-[420px]"
      />
    </div>
  );
}
