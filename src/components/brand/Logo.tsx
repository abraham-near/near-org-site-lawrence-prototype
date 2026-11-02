import Image from "next/image";

// Official marks from assets/brand/ (never redrawn). "dark" = black mark for light/green surfaces; "light" = white mark for dark surfaces.
const FILES = {
  lockup: { dark: "/brand/logo.svg", light: "/brand/logo_rev.svg", width: 1656, height: 567 },
  icon: { dark: "/brand/icon.svg", light: "/brand/icon_rev.svg", width: 639, height: 639 },
} as const;

type LogoProps = {
  variant?: keyof typeof FILES;
  tone?: "dark" | "light";
  /** Rendered height in px; width follows the artwork's aspect ratio. */
  height?: number;
  className?: string;
  /** Above the fold: load eagerly (Next 16 deprecates `priority`). */
  priority?: boolean;
};

export function Logo({ variant = "lockup", tone = "dark", height = 28, className, priority }: LogoProps) {
  const file = FILES[variant];
  const width = Math.round((file.width / file.height) * height);
  return (
    <Image
      src={file[tone]}
      alt="NEAR"
      width={width}
      height={height}
      className={className}
      loading={priority ? "eager" : undefined}
      unoptimized
    />
  );
}
