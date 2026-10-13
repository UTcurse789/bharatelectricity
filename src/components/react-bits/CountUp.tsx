// Source: https://reactbits.dev/r/CountUp-TS-TW.json (MIT). Adapted for visible SSR output and reduced motion.
'use client';

import { animate, useInView, useMotionValue, useReducedMotion } from 'motion/react';
import { useCallback, useEffect, useMemo, useRef } from 'react';

interface CountUpProps {
  to: number;
  from?: number;
  direction?: 'up' | 'down';
  delay?: number;
  duration?: number;
  className?: string;
  startWhen?: boolean;
  separator?: string;
  onStart?: () => void;
  onEnd?: () => void;
}

export default function CountUp({
  to,
  from = 0,
  direction = 'up',
  delay = 0,
  duration = 2,
  className = '',
  startWhen = true,
  separator = '',
  onStart,
  onEnd
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const motionValue = useMotionValue(direction === 'down' ? to : from);

  const isInView = useInView(ref, { once: true, margin: '0px' });

  const getDecimalPlaces = (num: number): number => {
    const str = num.toString();
    if (str.includes('.')) {
      const decimals = str.split('.')[1];
      if (parseInt(decimals) !== 0) {
        return decimals.length;
      }
    }
    return 0;
  };

  const maxDecimals = Math.max(getDecimalPlaces(from), getDecimalPlaces(to));

  const formatter = useMemo(() => new Intl.NumberFormat('en-US', {
    useGrouping: !!separator,
    minimumFractionDigits: maxDecimals,
    maximumFractionDigits: maxDecimals
  }), [maxDecimals, separator]);

  const formatValue = useCallback(
    (latest: number) => {
      const formattedNumber = formatter.format(latest);

      return separator ? formattedNumber.replace(/,/g, separator) : formattedNumber;
    },
    [formatter, separator]
  );

  useEffect(() => {
    if (ref.current) {
      ref.current.textContent = formatValue(to);
    }
  }, [from, to, direction, formatValue]);

  useEffect(() => {
    const target = direction === 'down' ? from : to;
    if (reduce) {
      if (ref.current) ref.current.textContent = formatValue(target);
      return;
    }
    if (!isInView || !startWhen) return;

    motionValue.set(direction === 'down' ? to : from);
    if (ref.current) ref.current.textContent = formatValue(motionValue.get());
    const unsubscribe = motionValue.on('change', latest => {
      if (ref.current) ref.current.textContent = formatValue(latest);
    });
    const animation = animate(motionValue, target, {
      duration,
      delay,
      ease: 'easeOut',
      onPlay: onStart,
      onComplete: () => {
        if (ref.current) ref.current.textContent = formatValue(target);
        onEnd?.();
      }
    });
    return () => {
      animation.stop();
      unsubscribe();
    };
  }, [isInView, startWhen, motionValue, direction, from, to, delay, onStart, onEnd, duration, reduce, formatValue]);

  return <span className={className} ref={ref} aria-hidden="true">{formatValue(to)}</span>;
}
