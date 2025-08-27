import { useState } from "react"

export function useForceUpdate() {
  const [, setTick] = useState(0);
  return () => setTick(prev => prev + 1);
}
