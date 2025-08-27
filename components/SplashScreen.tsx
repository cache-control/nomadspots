import { Bree_Serif } from 'next/font/google';
import { useEffect, useState } from 'react';
import Image from "next/image";

const breeSerif = Bree_Serif({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bree',
});

const SplashScreen = () => {
  const [opacity, setOpacity] = useState("opacity-100");
  const [show, setShow] = useState(true);

  useEffect(() => {
    const opacityTimer = setTimeout(() => setOpacity("opacity-0"), 1_500)
    const showTimer = setTimeout(() => setShow(false), 2_000)
    return () => {
      clearTimeout(opacityTimer)
      clearTimeout(showTimer);
    }
  }, []);

  if (!show)
    return null;

  return (
    <div className="absolute flex items-center inset-0 z-30">
      <div className={`
        relative flex flex-col items-center border w-full
        transition-opacity duration-500 ${opacity}
        `}>
        <Image priority={true} width="256" height="256" alt="logo" src="/yurt.png" />
        <p className={`
          ${breeSerif.className}
          absolute text-center text-5xl bottom-0
          [text-shadow:2px_2px_4px_rgba(0,0,0,0.3)]
          `}>
          Nomad Spots
        </p>
      </div>
    </div>
  )
}

export default SplashScreen
