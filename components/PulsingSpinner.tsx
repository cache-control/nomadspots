import { useState } from "react";
import { IPC } from "@/components/MapBrowser";

interface PulsingSpinnerPops {
  ipc: IPC;
}

export default function PulsingSpinner({ ipc }: PulsingSpinnerPops) {
  const [active, setActive] = useState(false);

  if (ipc.setLoading === null)
    ipc.setLoading = setActive;

  if (!active)
    return null;

  return (
    <div className="absolute flex items-center justify-center top-1/2 left-1/2 transform -translate-x-1/3 -translate-y-1/3 z-20">
      <div className="w-16 h-16 flex justify-center items-center space-x-2">
        <div className="w-4 h-4 bg-blue-400 rounded-full animate-pulse"></div>
        <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse delay-200"></div>
        <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse delay-400"></div>
      </div>
    </div>
  )
}
