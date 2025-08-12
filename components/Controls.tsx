import { Plus, Radar } from 'lucide-react';

interface ControlProps {
  enable: boolean;
  setAutoSearch: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Controls({ enable, setAutoSearch }: ControlProps) {

  return (
    <>
      <Radar
        className="absolute top-20 left-3 z-[410]"
        size={32}
        color={enable ? "black" : "grey"}
        onClick={() => {
          setAutoSearch(prev => !prev)
        }}
      />

      <Plus
        className="absolute top-1/2 left-1/2 z-[410]"
        color="grey"
        size={16}
      />
    </>
  )
}
