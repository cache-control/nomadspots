'use client';
import { SwitchGroup } from "@/components/SwitchGroup";
import { SwitchGroupItem } from "@/components/SwitchGroupItem";
import { IPC } from "@/components/MapBrowser";
import { useForceUpdate } from "@/lib/spots/hooks";
import { ListFilter } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export interface Filter {
  type: string[];
  fee: string[];
  org: string[];
}

export interface FilterSheetProps {
  ipc: IPC;
}

export default function FilterSheet({ ipc }: FilterSheetProps) {
  const forceUpdate = useForceUpdate();

  function notifyRoi() {
    forceUpdate();
    ipc.refreshRoi();
  }

  return (
    <Sheet>
      <div className="bg-white absolute top-3 right-5 p-0 z-10">
        <SheetTrigger asChild>
          <ListFilter size={32} />
        </SheetTrigger>
        <SheetContent side="right" className="w-80 overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Filter</SheetTitle>
          </SheetHeader>
          <div className="flex flex-col justify-start gap-3 w-full">

            <h3 className="border-b mx-4 pb-2 text-lg font-medium">Type</h3>
            <div>
              <SwitchGroup
                value={ipc.filter.type}
                onValueChange={val => {
                  ipc.filter.type = val;
                  notifyRoi();
                }}
              >
                <SwitchGroupItem value="Sites" label="Sites" />
                <SwitchGroupItem value="Water" label="Water" />
                <SwitchGroupItem value="Toilet" label="Toilet" />
                <SwitchGroupItem value="Showers" label="Showers" />
                <SwitchGroupItem value="Unknown" label="Unknown" id="type_unknown" />
              </SwitchGroup>
            </div>

            <h3 className="border-b mx-4 pb-2 text-lg font-medium">Fee</h3>
            <div>
              <SwitchGroup
                value={ipc.filter.fee}
                onValueChange={val => {
                  ipc.filter.fee = val;
                  notifyRoi()
                }}
              >
                <SwitchGroupItem value="Free" label="Free" />
                <SwitchGroupItem value="Pay" label="Pay" />
                <SwitchGroupItem value="Unknown" label="Unknown" id="fee_unknown" />
              </SwitchGroup>
            </div>

            <h3 className="border-b mx-4 pb-2 text-lg font-medium">Operated by</h3>
            <div>
              <SwitchGroup
                value={ipc.filter.org}
                onValueChange={val => {
                  ipc.filter.org = val;
                  notifyRoi();
                }}
              >
                <SwitchGroupItem value="BLM" label="BLM" />
                <SwitchGroupItem value="USFS" label="USFS" />
                <SwitchGroupItem value="Unknown" label="Unknown" id="org_unknown" />
              </SwitchGroup>
            </div>

          </div>
        </SheetContent>
      </div>
    </Sheet>
  )
}
