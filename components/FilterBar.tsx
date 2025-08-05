import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

export interface Filter {
  type: string[];
  fee: string[];
  org: string[];
}

export interface FilterBarProps {
  filter: Filter;
  setFilter: React.Dispatch<React.SetStateAction<Filter>>;
}

export default function FilterBar({ filter, setFilter }: FilterBarProps) {

  return (
    <div className="bg-white absolute top-3 left-15 rounded-md right-5 z-[1000] p-3">
      <div className="flex flex-row overflow-x-auto whitespace-nowrap scrollbar-hide justify-start gap-3 items-center w-full">

        <div>
          <ToggleGroup
            type="multiple"
            value={filter.type}
            onValueChange={val => setFilter({ ...filter, type: val })}
          >
            <ToggleGroupItem value="Sites">Sites</ToggleGroupItem>
            <ToggleGroupItem value="Water">Water</ToggleGroupItem>
            <ToggleGroupItem value="Showers" className="pr-5">Showers</ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="border-l-2 h-8"></div>

        <div>
          <ToggleGroup
            type="multiple"
            value={filter.fee}
            onValueChange={val => setFilter({ ...filter, fee: val })}
          >
            <ToggleGroupItem value="Free">Free</ToggleGroupItem>
            <ToggleGroupItem value="Pay">Pay</ToggleGroupItem>
            <ToggleGroupItem value="Unknown" className="pr-5">Unknown</ToggleGroupItem>
          </ToggleGroup>
        </div>

        <div className="border-l-2 h-8"></div>

        <div>
          <ToggleGroup
            type="multiple"
            value={filter.org}
            onValueChange={val => setFilter({ ...filter, org: val })}
          >
            <ToggleGroupItem value="BLM">BLM</ToggleGroupItem>
            <ToggleGroupItem value="USFS">USFS</ToggleGroupItem>
            <ToggleGroupItem className="pr-5" value="Unknown">Unknown</ToggleGroupItem>
          </ToggleGroup>
        </div>

      </div>
    </div>
  )
}
