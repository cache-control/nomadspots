'use client';

import { SwitchGroupContext } from "@/components/SwitchGroupContext"
import * as React from 'react';

interface SwitchGroupProps {
  value: string[];
  onValueChange: (values: string[]) => void;
  children: React.ReactNode;
}

export function SwitchGroup({ value, onValueChange, children }: SwitchGroupProps) {
  const toggleValue = (val: string) => {
    onValueChange(
      value.includes(val)
        ? value.filter((v) => v !== val)
        : [...value, val]
    );
  };

  return (
    <SwitchGroupContext.Provider value={{ values: value, toggleValue }}>
      <div className="flex flex-col">
        {children}
      </div>
    </SwitchGroupContext.Provider>
  );
}

