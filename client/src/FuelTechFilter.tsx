import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { type SelectChangeEvent } from "@mui/material/Select";
import { FUELTECH_LABELS } from "./maps";
import type { UnitFueltechType } from "./types";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const fueltech_ids = Object.keys(FUELTECH_LABELS) as UnitFueltechType[];

export default function MultipleFuelTechSelect({
  fueltechs,
  onChange,
}: {
  fueltechs: string[];
  onChange: (newFuelTechs: string[]) => void;
}) {
  const handleChange = (event: SelectChangeEvent<typeof fueltechs>) => {
    const {
      target: { value },
    } = event;
    onChange(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-name-label">FuelTech</InputLabel>
        <Select
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          multiple
          value={fueltechs}
          onChange={handleChange}
          input={<OutlinedInput label="FuelTech" />}
          MenuProps={MenuProps}
        >
          {fueltech_ids.map((fueltech) => (
            <MenuItem key={fueltech} value={fueltech}>
              {FUELTECH_LABELS[fueltech]}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
