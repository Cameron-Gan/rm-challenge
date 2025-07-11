import { type Theme, useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { type SelectChangeEvent } from "@mui/material/Select";

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

const status_list = ["committed", "operating", "retired"];

function getStyles(status: string, statuses: string[], theme: Theme) {
  return {
    fontWeight: statuses.includes(status)
      ? theme.typography.fontWeightMedium
      : theme.typography.fontWeightRegular,
  };
}

export default function MultipleStatusSelect({
  statuses,
  onChange,
}: {
  statuses: string[];
  onChange: (newStatuses: string[]) => void;
}) {
  const theme = useTheme();

  const handleChange = (event: SelectChangeEvent<typeof statuses>) => {
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
        <InputLabel id="demo-multiple-name-label">Status</InputLabel>
        <Select
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          multiple
          value={statuses}
          onChange={handleChange}
          input={<OutlinedInput label="Status" />}
          MenuProps={MenuProps}
        >
          {status_list.map((status) => (
            <MenuItem
              key={status}
              value={status}
              style={getStyles(status, statuses, theme)}
            >
              {status}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
