"use client";

import * as React from "react";
import { Volume2Icon, VolumeXIcon } from "lucide-react";
import { isSoundEnabled, toggleSoundSetting } from "@/lib/sound";
import { Button } from "./ui/8bit/button";

export const SoundToggle: React.FC = () => {
  const [enabled, setEnabled] = React.useState<boolean>(true);

  // initialize from localStorage on mount
  React.useEffect(() => {
    setEnabled(isSoundEnabled());
  }, []);

  const handleToggle = () => {
    const next = !enabled;
    toggleSoundSetting();
    setEnabled(next);
  };

  return (
    <Button variant="outline" onClick={handleToggle} size={"icon"}>
      {enabled ? <Volume2Icon /> : <VolumeXIcon />}
    </Button>
  );
};
