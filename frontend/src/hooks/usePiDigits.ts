import { useState, useEffect } from 'react';

export function usePiDigits(updateInterval: number = 3000) {
  const [piDigits, setPiDigits] = useState('3.14159265358979323846');

  useEffect(() => {
    const pi = '3.14159265358979323846264338327950288419716939937510';
    
    const interval = setInterval(() => {
      const length = Math.floor(Math.random() * 20) + 10;
      setPiDigits(pi.substring(0, length));
    }, updateInterval);

    return () => clearInterval(interval);
  }, [updateInterval]);

  return piDigits;
}