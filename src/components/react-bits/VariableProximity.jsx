'use client';

import { forwardRef, useMemo, useRef, useEffect } from 'react';

function useAnimationFrame(callback) {
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  useEffect(() => {
    let frameId = 0;
    const schedule = () => {
      if (frameId || document.hidden) return;
      frameId = requestAnimationFrame(() => {
        frameId = 0;
        callbackRef.current();
      });
    };
    // Idle text needs no perpetual animation loop.
    for (const event of ['mousemove', 'touchmove', 'scroll', 'resize']) window.addEventListener(event, schedule, {passive: true});
    schedule();
    return () => {
      cancelAnimationFrame(frameId);
      for (const event of ['mousemove', 'touchmove', 'scroll', 'resize']) window.removeEventListener(event, schedule);
    };
  }, []);
}

function useMousePositionRef(containerRef) {
  const positionRef = useRef({ x: -10000, y: -10000 });

  useEffect(() => {
    const updatePosition = (x, y) => {
      positionRef.current = { x, y };
    };

    const handleMouseMove = ev => updatePosition(ev.clientX, ev.clientY);
    const handleTouchMove = ev => {
      const touch = ev.touches[0];
      if (touch) updatePosition(touch.clientX, touch.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove, {passive: true});
    window.addEventListener('touchmove', handleTouchMove, {passive: true});
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [containerRef]);

  return positionRef;
}

const VariableProximity = forwardRef(
  /**
   * @param {{label: string, fromFontVariationSettings: string, toFontVariationSettings: string, containerRef: import('react').RefObject<HTMLElement | null>, radius?: number, falloff?: string, className?: string, style?: import('react').CSSProperties, onClick?: import('react').MouseEventHandler<HTMLSpanElement>}} props
   * @param {import('react').ForwardedRef<HTMLSpanElement>} ref
   */
  (props, ref) => {
  const {
    label,
    fromFontVariationSettings,
    toFontVariationSettings,
    containerRef,
    radius = 50,
    falloff = 'linear',
    className = '',
    onClick,
    style,
    ...restProps
  } = props;

  const letterRefs = useRef([]);
  const interpolatedSettingsRef = useRef([]);
  const mousePositionRef = useMousePositionRef(containerRef);
  const lastPositionRef = useRef({ x: null, y: null });

  const parsedSettings = useMemo(() => {
    const parseSettings = settingsStr =>
      new Map(
        settingsStr
          .split(',')
          .map(s => s.trim())
          .map(s => {
            const [name, value] = s.split(' ');
            return [name.replace(/['"]/g, ''), parseFloat(value)];
          })
      );

    const fromSettings = parseSettings(fromFontVariationSettings);
    const toSettings = parseSettings(toFontVariationSettings);

    return Array.from(fromSettings.entries()).map(([axis, fromValue]) => ({
      axis,
      fromValue,
      toValue: toSettings.get(axis) ?? fromValue
    }));
  }, [fromFontVariationSettings, toFontVariationSettings]);

  const calculateDistance = (x1, y1, x2, y2) => Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

  const calculateFalloff = distance => {
    const norm = Math.min(Math.max(1 - distance / radius, 0), 1);
    switch (falloff) {
      case 'exponential':
        return norm ** 2;
      case 'gaussian':
        return Math.exp(-((distance / (radius / 2)) ** 2) / 2);
      case 'linear':
      default:
        return norm;
    }
  };

  useAnimationFrame(() => {
    if (!containerRef?.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const x = mousePositionRef.current.x - containerRect.left;
    const y = mousePositionRef.current.y - containerRect.top;
    if (lastPositionRef.current.x === x && lastPositionRef.current.y === y) {
      return;
    }
    lastPositionRef.current = { x, y };

    // Read all geometry before writing styles to avoid forced layout per letter.
    const rectangles = letterRefs.current.map(letter => letter?.getBoundingClientRect());
    const nextSettings = rectangles.map(rect => {
      if (!rect) return fromFontVariationSettings;
      const letterCenterX = rect.left + rect.width / 2 - containerRect.left;
      const letterCenterY = rect.top + rect.height / 2 - containerRect.top;

      const distance = calculateDistance(
        x,
        y,
        letterCenterX,
        letterCenterY
      );

      if (distance >= radius) {
        return fromFontVariationSettings;
      }

      const falloffValue = calculateFalloff(distance);
      const newSettings = parsedSettings
        .map(({ axis, fromValue, toValue }) => {
          const interpolatedValue = fromValue + (toValue - fromValue) * falloffValue;
          return `'${axis}' ${Math.round(interpolatedValue)}`;
        })
        .join(', ');

      return newSettings;
    });
    letterRefs.current.forEach((letterRef, index) => {
      if (!letterRef || interpolatedSettingsRef.current[index] === nextSettings[index]) return;
      interpolatedSettingsRef.current[index] = nextSettings[index];
      letterRef.style.fontVariationSettings = nextSettings[index];
    });
  });

  const words = label.split(' ');
  let letterIndex = 0;

  return (
    <span
      ref={ref}
      onClick={onClick}
      style={{
        display: 'inline',
        fontFamily: 'inherit',
        ...style
      }}
      className={className}
      {...restProps}
    >
      {words.map((word, wordIndex) => (
        <span key={wordIndex} className="inline-block whitespace-nowrap">
          {word.split('').map(letter => {
            const currentLetterIndex = letterIndex++;
            return (
              <span
                key={currentLetterIndex}
                ref={el => {
                  letterRefs.current[currentLetterIndex] = el;
                }}
                style={{
                  display: 'inline-block',
                  fontVariationSettings: interpolatedSettingsRef.current[currentLetterIndex] || fromFontVariationSettings,
                  transition: 'font-variation-settings 140ms ease-out'
                }}
                aria-hidden="true"
              >
                {letter}
              </span>
            );
          })}
          {wordIndex < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
      <span className="sr-only">{label}</span>
    </span>
  );
});

VariableProximity.displayName = 'VariableProximity';
export default VariableProximity;
