import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { IPC } from "@/components/MapBrowser";
import { useForceUpdate } from "@/lib/spots/hooks";

export interface Filter {
  type: string[];
  fee: string[];
  org: string[];
}

export interface FilterBarProps {
  ipc: IPC;
}

export default function FilterBar({ ipc }: FilterBarProps) {
  const forceUpdate = useForceUpdate();

  function notifyRoi() {
    forceUpdate();
    ipc.refreshRoi?.();
  }

  return (
    <div className="bg-white absolute top-3 left-15 rounded-md right-5 z-10 p-3">
      <div className="flex flex-row overflow-x-auto whitespace-nowrap scrollbar-hide justify-start gap-3 items-center w-full">

        <div>
          <ToggleGroup
            type="multiple"
            variant="outline"
            className="inline-block"
            value={ipc.filter.type}
            onValueChange={val => {
              ipc.filter.type = val;
              notifyRoi();
            }}
          >
            <ToggleGroupItem value="Sites">Sites</ToggleGroupItem>
            <ToggleGroupItem value="Water">Water</ToggleGroupItem>
            <ToggleGroupItem value="Toilet">Toilet</ToggleGroupItem>
            <ToggleGroupItem value="Showers">Showers</ToggleGroupItem>
            <ToggleGroupItem value="Unknown">Unknown</ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="border-l-2 h-8"></div>

        <div>
          <ToggleGroup
            type="multiple"
            variant="outline"
            className="inline-block"
            value={ipc.filter.fee}
            onValueChange={val => {
              ipc.filter.fee = val;
              notifyRoi()
            }}
          >
            <ToggleGroupItem value="Free">Free</ToggleGroupItem>
            <ToggleGroupItem value="Pay">Pay</ToggleGroupItem>
            <ToggleGroupItem value="Unknown">Unknown</ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="border-l-2 h-8"></div>

        <div>
          <ToggleGroup
            type="multiple"
            variant="outline"
            className="inline-block"
            value={ipc.filter.org}
            onValueChange={val => {
              ipc.filter.org = val;
              notifyRoi();
            }}
          >
            <ToggleGroupItem value="BLM">BLM</ToggleGroupItem>
            <ToggleGroupItem value="USFS">USFS</ToggleGroupItem>
            <ToggleGroupItem value="Unknown">Unknown</ToggleGroupItem>
          </ToggleGroup>
        </div>

      </div>
    </div>
  )
}
