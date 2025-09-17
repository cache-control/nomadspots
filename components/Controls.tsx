import { Plus, Radar } from 'lucide-react';
import { useForceUpdate } from "@/lib/spots/hooks";
import type { IPC } from "@/components/MapBrowser";

interface ControlProps {
  ipc: IPC;
}

export default function Controls({ ipc }: ControlProps) {
  ipc.refreshControls = useForceUpdate()

  return (
    <>
      <Radar
        className="absolute top-20 left-2 hover:cursor-pointer z-10"
        size={32}
        color={ipc.autoSearch ? "black" : "grey"}
        onClick={() => ipc.setAutoSearch(!ipc.autoSearch)}
      />

      <Plus
        className="absolute top-1/2 left-1/2 z-10"
        color="grey"
        size={20}
      />
    </>
  )
}
