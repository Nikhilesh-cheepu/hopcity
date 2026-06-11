import Image from "next/image";

export function LocationBadge() {
  return (
    <div className="inline-flex max-w-[20rem] items-center gap-2.5 rounded-2xl border border-hop-green/25 bg-hop-green/5 px-4 py-3 text-left sm:max-w-none sm:rounded-full sm:px-5 sm:py-2.5 sm:text-center">
      <Image
        src="/brand/favicon.png"
        alt=""
        width={28}
        height={28}
        unoptimized
        aria-hidden
        className="h-7 w-7 shrink-0 rounded-full"
      />
      <span className="text-xs leading-snug text-hop-white/75 sm:text-sm">
        Sarath City Capital Mall
        <span className="text-hop-green"> · </span>
        5th Floor
        <span className="text-hop-green"> · </span>
        Hyderabad
      </span>
    </div>
  );
}
