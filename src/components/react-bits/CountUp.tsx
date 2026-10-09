// Source: https://reactbits.dev/r/CountUp-TS-TW.json (MIT). Adapted for visible SSR output and reduced motion.
'use client';

import { useInView, useMotionValue, useSpring, useReducedMotion } from 'motion/react';
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

  const damping = 20 + 40 * (1 / duration);
  const stiffness = 100 * (1 / duration);

  const springValue = useSpring(motionValue, {
    damping,
    stiffness
  });

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
    if (reduce && ref.current) ref.current.textContent = formatValue(to);
    if (isInView && startWhen && !reduce) {
      if (typeof onStart === 'function') {
        onStart();
      }

      const timeoutId = setTimeout(() => {
        motionValue.set(direction === 'down' ? from : to);
      }, delay * 1000);

      const durationTimeoutId = setTimeout(
        () => {
          if (typeof onEnd === 'function') {
            onEnd();
          }
        },
        delay * 1000 + duration * 1000
      );

      return () => {
        clearTimeout(timeoutId);
        clearTimeout(durationTimeoutId);
      };
    }
  }, [isInView, startWhen, motionValue, direction, from, to, delay, onStart, onEnd, duration, reduce, formatValue]);

  useEffect(() => {
    const unsubscribe = springValue.on('change', (latest: number) => {
      if (ref.current && isInView && !reduce) {
        ref.current.textContent = formatValue(latest);
      }
    });

    return () => unsubscribe();
  }, [springValue, formatValue, isInView, reduce]);

  return <span className={className} ref={ref} aria-hidden="true">{formatValue(to)}</span>;
}
