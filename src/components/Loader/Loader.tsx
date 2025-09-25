import classes from "./Loader.module.scss";

interface ILoaderProps {
  isInline?: boolean;
  size?: "small" | "medium" | "large";
  variant?: "primary" | "secondary" | "minimal";
  text?: string;
}

export function Loader({ 
  isInline, 
  size = "medium", 
  variant = "primary",
  text 
}: ILoaderProps) {
  if (isInline) {
    return (
      <div className={`${classes.inline} ${classes[size]} ${classes[variant]}`}>
        <div className={classes.inlineSpinner}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        {text && <span className={classes.inlineText}>{text}</span>}
      </div>
    );
  }

  return (
    <div className={classes.global}>
      <div className={classes.globalContent}>
        {/* Custom Opportune Logo */}
        <div className={classes.logoContainer}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            fill="none"
            className={classes.logo}
          >
            <defs>
              <linearGradient id="opportuneLoaderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#2563eb" />
                <stop offset="50%" stopColor="#1d4ed8" />
                <stop offset="100%" stopColor="#1e40af" />
              </linearGradient>
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>
            <circle 
              cx="32" 
              cy="32" 
              r="28" 
              fill="url(#opportuneLoaderGradient)" 
              filter="url(#glow)"
              className={classes.logoCircle}
            />
            <circle 
              cx="32" 
              cy="32" 
              r="20" 
              fill="none" 
              stroke="white" 
              strokeWidth="3" 
              className={classes.logoRing}
            />
            <circle 
              cx="32" 
              cy="32" 
              r="8" 
              fill="white" 
              className={classes.logoCenter}
            />
          </svg>
        </div>

        <h2 className={classes.brandName}>Opportune</h2>
        
        <div className={classes.progressContainer}>
          <div className={classes.progressBar}>
            <div className={classes.progressFill}></div>
          </div>
        </div>
        
        <p className={classes.loadingText}>
          {text || "Loading your professional network..."}
        </p>
      </div>
      
      {/* Background Pattern */}
      <div className={classes.backgroundPattern}>
        <div className={classes.floatingElement} style={{ "--delay": "0s" } as React.CSSProperties}></div>
        <div className={classes.floatingElement} style={{ "--delay": "0.5s" } as React.CSSProperties}></div>
        <div className={classes.floatingElement} style={{ "--delay": "1s" } as React.CSSProperties}></div>
        <div className={classes.floatingElement} style={{ "--delay": "1.5s" } as React.CSSProperties}></div>
        <div className={classes.floatingElement} style={{ "--delay": "2s" } as React.CSSProperties}></div>
      </div>
    </div>
  );
}
