import Image from "next/image";

type ApplegreenLogoProps = {
  className?: string;
};

export function ApplegreenLogo({ className }: ApplegreenLogoProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md bg-[#1a1a1a] px-2 py-1 ${className ?? ""}`.trim()}
    >
      <Image
        src="/applegreen-logo.png"
        alt="Applegreen"
        width={140}
        height={40}
        className="h-7 w-auto object-contain"
        priority
      />
    </span>
  );
}
