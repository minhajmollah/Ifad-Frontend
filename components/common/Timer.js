import {useEffect, useState} from 'react';

const Timer = ({startDate, endDate, prefix = true}) => {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const countDownDate = new Date(endDate).getTime();

    const interval = setInterval(function () {
      const now = new Date().getTime();
      const distance = countDownDate - now;

      if (distance <= 0) {
        setTimeLeft("");
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (prefix) {
        setTimeLeft(`Ends In: ${days}d ${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [endDate])

  return timeLeft
};

export default Timer;