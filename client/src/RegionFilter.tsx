import React from "react";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { STATE_LABELS } from "./maps";

export default function MultipleRegionSelect({
  regions,
  onChange,
}: {
  regions: string[];
  onChange: (newRegions: string[]) => void;
}) {
  const handleChange = (
    _event: React.MouseEvent<HTMLElement>,
    newRegions: string[]
  ) => {
    onChange(newRegions);
  };

  return (
    <>
      <ToggleButtonGroup
        value={regions}
        onChange={handleChange}
        aria-label="Region"
      >
        {Object.entries(STATE_LABELS).map(([regionKey, label]) => (
          <ToggleButton key={regionKey} value={regionKey}>
            {label}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>
    </>
  );
}
