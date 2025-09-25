import { HTMLAttributes, useEffect, useState } from "react";
import { timeAgo } from "../../utils/date";
import classes from "./TimeAgo.module.scss";

interface ITimeAgoProps extends HTMLAttributes<HTMLDivElement> {
  date: string;
  edited?: boolean;
}

export function TimeAgo({ date, edited, className, ...others }: ITimeAgoProps) {
  const [time, setTime] = useState(timeAgo(new Date(date)));
  const [isHovered, setIsHovered] = useState(false);
  const [showFullDate, setShowFullDate] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(timeAgo(new Date(date)));
    }, 1000);

    return () => clearInterval(interval);
  }, [date]);

  // Format full date for tooltip
  const formatFullDate = (dateString: string) => {
    const parsedDate = new Date(dateString);
    return parsedDate.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div 
      className={`${classes.root} ${className ? className : ""}`} 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setShowFullDate(!showFullDate)}
      {...others}
    >
      {/* Background glow effect */}
      <div className={classes.glowEffect}></div>
      
      {/* Main content */}
      <div className={classes.content}>
        {/* Time icon */}
        <div className={classes.timeIcon}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
            <polyline points="12,6 12,12 16,14" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </div>

        {/* Time text */}
        <div className={classes.timeContainer}>
          <span className={classes.timeText}>
            {showFullDate ? formatFullDate(date) : time}
          </span>
          
          {/* Edited indicator */}
          {edited && (
            <div className={classes.editedContainer}>
              <div className={classes.editedDot}></div>
              <span className={classes.editedText}>Edited</span>
              <div className={classes.editedIcon}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2"/>
                  <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
            </div>
          )}
        </div>

        {/* Animated underline */}
        <div className={classes.underline}></div>
      </div>

      {/* Premium tooltip */}
      {isHovered && !showFullDate && (
        <div className={classes.tooltip}>
          <div className={classes.tooltipContent}>
            <div className={classes.tooltipHeader}>
              <div className={classes.tooltipIcon}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                  <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2"/>
                  <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2"/>
                  <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <span className={classes.tooltipTitle}>Full Date & Time</span>
            </div>
            
            <div className={classes.tooltipBody}>
              <p className={classes.fullDate}>{formatFullDate(date)}</p>
              {edited && (
                <div className={classes.tooltipEdited}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2"/>
                    <path d="m18.5 2.5 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                  <span>This content was edited</span>
                </div>
              )}
            </div>
          </div>
          
          <div className={classes.tooltipArrow}></div>
          <div className={classes.tooltipGlow}></div>
        </div>
      )}

      {/* Click hint */}
      <div className={classes.clickHint}>
        <span>Click to {showFullDate ? 'collapse' : 'expand'}</span>
      </div>
    </div>
  );
}
