import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  endTime: string;
  onEnd?: () => void;
}

export default function CountdownTimer({ endTime, onEnd }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const end = new Date(endTime).getTime();
      const now = new Date().getTime();
      const distance = end - now;

      if (distance < 0) {
        clearInterval(timer);
        onEnd?.();
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [endTime, onEnd]);

  return (
    <div className="flex space-x-2 text-sm">
      {Object.entries(timeLeft).map(([key, value]) => (
        <div key={key} className="text-center">
          <div className="bg-gray-800 text-white px-2 py-1 rounded">
            {String(value).padStart(2, '0')}
          </div>
          <div className="text-xs text-gray-500 mt-1">
            {key === 'days' ? '天' : key === 'hours' ? '时' : key === 'minutes' ? '分' : '秒'}
          </div>
        </div>
      ))}
    </div>
  );
} 