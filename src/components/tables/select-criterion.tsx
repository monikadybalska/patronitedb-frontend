import Box from "@mui/material/Box";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

export default function SelectCriterion({
  criterion,
  handleChange,
}: {
  criterion: "number_of_patrons" | "monthly_revenue";
  handleChange: (event: SelectChangeEvent) => void;
}) {
  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">By</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={criterion}
          label="By"
          onChange={handleChange}
        >
          <MenuItem value="number_of_patrons">Number of patrons</MenuItem>
          <MenuItem value="monthly_revenue">Monthly revenue</MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
