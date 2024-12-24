import { Rocket } from "lucide-react";
import { useEffect, useState } from "react";

export default function LoadingRocket() {
  const [time, setTime] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prevTime) => prevTime + 10); // Increment by 10ms each tick
    }, 10);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const milliseconds = ms % 1000;
    return `${seconds}.${milliseconds
      .toString()
      .substring(0, 2)
      .padStart(2, "0")}`;
  };

  return (
    <div className="flex flex-col items-center justify-start">
      <div className="relative size-64">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="size-48 animate-ping rounded-full bg-slate-500 opacity-20" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="size-40 animate-pulse rounded-full bg-slate-500 opacity-30" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Rocket className="size-24 animate-bounce text-white" />
        </div>
      </div>
      <h2 className="text-4xl font-bold">Waiting for Response</h2>
      <p className="mt-2 font-mono text-2xl">{formatTime(time)}</p>
    </div>
  );
}
