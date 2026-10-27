import React, { useEffect, useState, useRef } from 'react';

interface NumberCounterProps {
  target: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export const NumberCounter: React.FC<NumberCounterProps> = ({
  target,
  duration = 1600,
  prefix = '',
  suffix = '',
  className = '',
}) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true);
          }
        });
      },
      { threshold: 0.15 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [hasAnimated]);

  useEffect(() => {
    if (!hasAnimated) return;

    let startTime: number | null = null;
    let animationFrameId: number;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      // Ease out cubic function for smooth deceleration
      const easeOutProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.round(easeOutProgress * target);

      setCount(currentVal);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [hasAnimated, target, duration]);

  // Format with Indonesian thousand separator '.'
  const formattedCount = new Intl.NumberFormat('id-ID').format(count);

  return (
    <span ref={elementRef} className={className}>
      {prefix}
      {formattedCount}
      {suffix}
    </span>
  );
};
