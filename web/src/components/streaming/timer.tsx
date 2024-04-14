import { useEffect, useState } from 'react';

export interface ITimerProps {
  timeout: number;
  timeoutCallback: () => void;
}

export function Timer({ timeout, timeoutCallback }: ITimerProps) {
  const [currentTime, setCurrentTime] = useState(timeout);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime((cTime: number) => {
        if (cTime <= 0) {
          timeoutCallback();
          clearInterval(interval);
          return 0;
        } else {
          return cTime - 1;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <span>{currentTime} seconds</span>;
}
