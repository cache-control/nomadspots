import { useState } from "react";
import { Plus, Radar } from 'lucide-react';
import type { IPC } from "@/components/MapBrowser";

interface ControlProps {
  ipc: IPC;
}

export default function Controls({ ipc }: ControlProps) {
  const [autoSearch, setAutoSearch] = useState(true);

  ipc.autoSearch = autoSearch;

  if (ipc.setAutoSearch === null)
    ipc.setAutoSearch = setAutoSearch;

  return (
    <>
      <Radar
        className="absolute top-20 left-2 hover:cursor-pointer z-10"
        size={32}
        color={autoSearch ? "black" : "grey"}
        onClick={() => {
          setAutoSearch(prev => !prev)
          ipc.refreshZoom?.();
        }}
      />

      <Plus
        className="absolute top-1/2 left-1/2 z-10"
        color="grey"
        size={20}
      />
    </>
  )
}
