'use client'

import dynamic from "next/dynamic";
const MapBrowser = dynamic(
  () => import('@/components/MapBrowser'),
  { ssr: false }
);

export default function Home() {

  return (
    <div className="relative w-screen h-screen">
      <MapBrowser />
    </div>
  );
}
