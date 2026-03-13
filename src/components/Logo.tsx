interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

const Logo = ({ size = "md", showText = true }: LogoProps) => {
  const dim = size === "sm" ? 28 : size === "lg" ? 44 : 36;
  const textSize = size === "sm" ? "text-lg" : size === "lg" ? "text-3xl" : "text-xl";

  return (
    <div className="flex items-center gap-2.5">
      <svg width={dim} height={dim} viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="44" y2="44" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fb923c"/>
            <stop offset="100%" stopColor="#c2410c"/>
          </linearGradient>
        </defs>
        <rect width="44" height="44" rx="10" fill="url(#logoGrad)"/>
        <text x="4" y="32" fontFamily="Arial Black, sans-serif" fontWeight="900" fontSize="22" fill="white" letterSpacing="-1">GW</text>
      </svg>

      {showText && (
        <span
          className={`${textSize} font-black tracking-tight text-foreground`}
          style={{ fontFamily: "Syne, sans-serif", letterSpacing: "-0.03em" }}
        >
          Gig<span className="text-primary">Worker</span>
        </span>
      )}
    </div>
  );
};

export default Logo;