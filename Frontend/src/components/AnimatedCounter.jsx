import React, { useState, useEffect, useRef } from 'react';

/**
 * Parses numeric targets from various string or numeric formats:
 * - 6 -> { num: 6, prefix: '', suffix: '', isDecimal: false, decimals: 0 }
 * - "18" -> { num: 18, prefix: '', suffix: '', isDecimal: false, decimals: 0 }
 * - "8.24 Acres" -> { num: 8.24, prefix: '', suffix: ' Acres', isDecimal: true, decimals: 2 }
 * - "7 / 8" -> { num: 7, prefix: '', suffix: ' / 8', isDecimal: false, decimals: 0 }
 * - "Deficit: 1" -> { num: 1, prefix: 'Deficit: ', suffix: '', isDecimal: false, decimals: 0 }
 * - "Valid 2027" -> { num: 2027, prefix: 'Valid ', suffix: '', isDecimal: false, decimals: 0 }
 * - "94.8%" -> { num: 94.8, prefix: '', suffix: '%', isDecimal: true, decimals: 1 }
 * - "140+" -> { num: 140, prefix: '', suffix: '+', isDecimal: false, decimals: 0 }
 */
export function parseStatisticValue(rawVal) {
  if (typeof rawVal === 'number') {
    return {
      num: rawVal,
      prefix: '',
      suffix: '',
      isDecimal: !Number.isInteger(rawVal),
      decimals: Number.isInteger(rawVal) ? 0 : 2,
    };
  }

  const str = String(rawVal ?? '').trim();

  // Pattern 1: Ratios like "7 / 8"
  const ratioMatch = str.match(/^(\d+)\s*\/\s*(\d+)$/);
  if (ratioMatch) {
    return {
      num: parseInt(ratioMatch[1], 10),
      prefix: '',
      suffix: ` / ${ratioMatch[2]}`,
      isDecimal: false,
      decimals: 0,
    };
  }

  // Pattern 2: Text prefix like "Deficit: 1" or "Valid 2027"
  const prefixMatch = str.match(/^([^\d]+)\s*(\d+)$/);
  if (prefixMatch) {
    return {
      num: parseInt(prefixMatch[2], 10),
      prefix: prefixMatch[1].endsWith(':') ? `${prefixMatch[1]} ` : `${prefixMatch[1]} `,
      suffix: '',
      isDecimal: false,
      decimals: 0,
    };
  }

  // Pattern 3: Number followed by unit/suffix like "8.24 Acres", "94.8%", "140+"
  const numSuffixMatch = str.match(/^([\d.]+)\s*(.*)$/);
  if (numSuffixMatch && !isNaN(parseFloat(numSuffixMatch[1]))) {
    const parsedNum = parseFloat(numSuffixMatch[1]);
    const decParts = numSuffixMatch[1].split('.');
    const isDec = decParts.length > 1;
    const decCount = isDec ? decParts[1].length : 0;
    const rawSuffix = numSuffixMatch[2] || '';
    const formattedSuffix = (rawSuffix.startsWith('%') || rawSuffix.startsWith('+'))
      ? rawSuffix
      : (rawSuffix ? ` ${rawSuffix}` : '');

    return {
      num: parsedNum,
      prefix: '',
      suffix: formattedSuffix,
      isDecimal: isDec,
      decimals: decCount,
    };
  }

  // Fallback
  const parsed = parseFloat(str) || 0;
  return {
    num: parsed,
    prefix: '',
    suffix: '',
    isDecimal: false,
    decimals: 0,
  };
}

/**
 * AnimatedCounter component
 * Fast sequential counting animation: 1 -> 2 -> 3 -> ... -> targetValue
 * Runs in 700 - 1200ms with optional stagger delay.
 */
export function AnimatedCounter({
  value,
  duration = 850,
  delay = 0,
  startFrom = null,
  triggerKey = null,
  reducedMotion = false,
  className = '',
}) {
  const parsed = parseStatisticValue(value);
  const targetNum = parsed.num;

  // Determine starting point: 1 for standard positive numbers, 0 if target is 0, or close to year for large years
  const initialStart = startFrom !== null
    ? startFrom
    : (targetNum > 1900 && targetNum < 2100
        ? targetNum - 25
        : (targetNum > 0 ? 1 : 0));

  const [currentNum, setCurrentNum] = useState(() => {
    if (reducedMotion) return targetNum;
    return initialStart;
  });

  const [isCompleted, setIsCompleted] = useState(Boolean(reducedMotion));
  const animFrameRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    // If reduced motion is requested, render target immediately
    if (reducedMotion) {
      setCurrentNum(targetNum);
      setIsCompleted(true);
      return;
    }

    // Cancel any active animation loops
    if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    if (timerRef.current) clearTimeout(timerRef.current);

    // Reset to start value on new trigger
    setCurrentNum(initialStart);
    setIsCompleted(false);

    // Delay start for card-to-card stagger
    timerRef.current = setTimeout(() => {
      const startTime = performance.now();
      const startVal = initialStart;
      const endVal = targetNum;

      if (startVal === endVal) {
        setCurrentNum(endVal);
        setIsCompleted(true);
        return;
      }

      const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Smooth cubic-out easing for natural momentum
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const interpolated = startVal + (endVal - startVal) * easeOut;

        if (progress < 1) {
          if (parsed.isDecimal) {
            setCurrentNum(parseFloat(interpolated.toFixed(parsed.decimals)));
          } else {
            // Sequential integer stepping: 1 -> 2 -> 3 -> ... -> endVal
            setCurrentNum(Math.round(interpolated));
          }
          animFrameRef.current = requestAnimationFrame(updateCounter);
        } else {
          setCurrentNum(endVal);
          setIsCompleted(true);
        }
      };

      animFrameRef.current = requestAnimationFrame(updateCounter);
    }, delay);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [value, duration, delay, triggerKey, reducedMotion]);

  // Format final display string
  const displayFormattedNum = parsed.isDecimal
    ? currentNum.toFixed(parsed.decimals)
    : currentNum;

  return (
    <span className={`animated-statistic-val ${className} ${isCompleted ? 'counter-done' : 'counter-animating'}`}>
      {parsed.prefix}
      {displayFormattedNum}
      {parsed.suffix}
    </span>
  );
}

export default AnimatedCounter;

