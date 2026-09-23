import { useEffect, useState } from 'react';
import { differenceInSeconds } from 'date-fns';

export interface CountdownValue {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isPast: boolean;
}

function calculate(targetIso: string): CountdownValue {
  const target = new Date(targetIso);
  const totalSeconds = differenceInSeconds(target, new Date());

  if (totalSeconds <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
  }

  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds, isPast: false };
}

/** Đếm ngược realtime tới `targetIso`, tự cập nhật mỗi giây. */
export function useCountdown(targetIso: string): CountdownValue {
  const [value, setValue] = useState<CountdownValue>(() => calculate(targetIso));

  useEffect(() => {
    const tick = () => setValue(calculate(targetIso));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [targetIso]);

  return value;
}
