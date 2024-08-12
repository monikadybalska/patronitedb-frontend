import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

export default function SelectTable({
  value,
  name,
  options,
  handleChange,
}: {
  value: string;
  name: string;
  options: { value: string; title: string }[];
  handleChange: (event: SelectChangeEvent) => void;
}) {
  return (
    <Box sx={{ width: "fit-content" }}>
      <FormControl>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={value}
          name={name}
          onChange={handleChange}
          sx={{ fontSize: "1rem" }}
        >
          {options.map((option) => (
            <MenuItem value={option.value} key={option.value}>
              {option.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
