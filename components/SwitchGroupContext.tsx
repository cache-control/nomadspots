'use client';

import * as React from 'react';

type SwitchGroupContextType = {
  values: string[];
  toggleValue: (value: string) => void;
};

export const SwitchGroupContext = React.createContext<SwitchGroupContextType | null>(null);

export function useSwitchGroup() {
  const context = React.useContext(SwitchGroupContext);

  if (!context) {
    throw new Error('SwitchGroupItem must be used within a SwitchGroup');
  }

  return context;
}

