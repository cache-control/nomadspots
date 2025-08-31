'use client';

import { useSwitchGroup } from "@/components/SwitchGroupContext"
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

interface SwitchGroupItemProps {
  value: string;
  label: string;
  id?: string;
}

export function SwitchGroupItem({ value, label, id }: SwitchGroupItemProps) {
  const { values, toggleValue } = useSwitchGroup();
  const isChecked = values.includes(value);
  const switchId = id ?? value;

  return (
    <div className="flex items-center justify-between px-4 py-2 rounded-md">
      <Label htmlFor={switchId}>{label}</Label>
      <Switch
        className="data-[state=checked]:bg-blue-500 data-[state=unchecked]:bg-gray-400"
        id={switchId}
        checked={isChecked}
        onCheckedChange={() => toggleValue(value)}
      />
    </div>
  );
}

