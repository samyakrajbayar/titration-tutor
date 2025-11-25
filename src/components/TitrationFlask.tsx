import { useEffect, useState } from "react";

interface TitrationFlaskProps {
  pH: number;
  volumeAdded: number;
  maxVolume: number;
  isRunning: boolean;
}

export const TitrationFlask = ({ pH, volumeAdded, maxVolume, isRunning }: TitrationFlaskProps) => {
  const [droplets, setDroplets] = useState<number[]>([]);

  useEffect(() => {
    if (isRunning) {
      const interval = setInterval(() => {
        setDroplets((prev) => [...prev, Date.now()]);
        setTimeout(() => {
          setDroplets((prev) => prev.slice(1));
        }, 800);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isRunning]);

  const getFlaskColor = (pH: number): string => {
    if (pH < 4) return "hsl(var(--flask-acid))"; // Red for acidic
    if (pH > 10) return "hsl(var(--flask-base))"; // Blue for basic
    if (pH >= 6 && pH <= 8) return "hsl(var(--flask-neutral))"; // Green for neutral
    if (pH < 6) return `hsl(${30 + (pH - 4) * 30} 75% 55%)`; // Orange transition
    return `hsl(${180 + (pH - 8) * 30} 75% 55%)`; // Cyan transition
  };

  const fillPercentage = Math.min((volumeAdded / 50) * 100, 100);
  const flaskColor = getFlaskColor(pH);

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Burette */}
      <div className="relative flex justify-center mb-4">
        <div className="w-16 bg-card border-2 border-border rounded-lg h-64 relative overflow-hidden shadow-md">
          <div className="absolute top-0 left-0 right-0 h-8 bg-secondary/20 border-b-2 border-border" />
          <div className="absolute top-8 bottom-8 left-1/2 -translate-x-1/2 w-4 bg-gradient-to-b from-secondary/30 to-secondary/10" />
          
          {/* Burette valve */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-8 bg-card border-2 border-border rounded-full shadow-md" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-4 bg-border" />
          
          {/* Droplets */}
          {droplets.map((id) => (
            <div
              key={id}
              className="absolute left-1/2 -translate-x-1/2 w-2 h-3 rounded-full animate-fall"
              style={{
                backgroundColor: flaskColor,
                top: "100%",
                animation: "fall 0.8s linear",
              }}
            />
          ))}
        </div>
      </div>

      {/* Flask */}
      <div className="relative w-full h-80">
        <svg viewBox="0 0 200 300" className="w-full h-full">
          {/* Flask outline */}
          <path
            d="M 70 50 L 70 100 L 40 250 Q 40 280 70 280 L 130 280 Q 160 280 160 250 L 130 100 L 130 50 Q 130 40 120 40 L 80 40 Q 70 40 70 50 Z"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="3"
            className="drop-shadow-lg"
          />
          
          {/* Flask background (glass effect) */}
          <path
            d="M 70 50 L 70 100 L 40 250 Q 40 280 70 280 L 130 280 Q 160 280 160 250 L 130 100 L 130 50 Q 130 40 120 40 L 80 40 Q 70 40 70 50 Z"
            fill="hsl(var(--card))"
            opacity="0.3"
          />

          {/* Liquid fill */}
          <defs>
            <clipPath id="flask-clip">
              <path d="M 70 50 L 70 100 L 40 250 Q 40 280 70 280 L 130 280 Q 160 280 160 250 L 130 100 L 130 50 Q 130 40 120 40 L 80 40 Q 70 40 70 50 Z" />
            </clipPath>
          </defs>
          
          <rect
            x="40"
            y={280 - (fillPercentage * 2.3)}
            width="120"
            height={fillPercentage * 2.3}
            fill={flaskColor}
            clipPath="url(#flask-clip)"
            className="transition-all duration-300"
            opacity="0.8"
          />

          {/* Shine effect */}
          <ellipse
            cx="75"
            cy="120"
            rx="15"
            ry="30"
            fill="white"
            opacity="0.15"
            clipPath="url(#flask-clip)"
          />
        </svg>

        {/* pH Indicator */}
        <div className="absolute top-4 right-4 bg-card/90 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg border-2 border-border">
          <p className="text-xs text-muted-foreground">pH Level</p>
          <p className="text-2xl font-bold" style={{ color: flaskColor }}>
            {pH.toFixed(2)}
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fall {
          from {
            top: 100%;
            opacity: 1;
          }
          to {
            top: calc(100% + 120px);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};
