import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import { useQuery } from "@tanstack/react-query";
import { fetchAllCategories } from "../../../../lib/api";
import Checkbox from "@mui/material/Checkbox";
import { SelectChangeEvent } from "@mui/material/Select";

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

export default function Checkboxes({
  value,
  onChange,
}: {
  value: string[];
  onChange: (e: SelectChangeEvent<string[]>) => void;
}) {
  //   const [personName, setPersonName] = React.useState<string[]>([]);

  //   const handleChange = (event: SelectChangeEvent<typeof personName>) => {
  //     const {
  //       target: { value },
  //     } = event;
  //     setPersonName(
  //       // On autofill we get a stringified value.
  //       typeof value === "string" ? value.split(",") : value
  //     );
  //   };

  const {
    isPending,
    isError,
    data: categories,
    error,
  } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchAllCategories,
  });

  if (isPending) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <div>
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={value}
          onChange={onChange}
          input={<OutlinedInput label="Tag" />}
          renderValue={(selected) => selected.join(", ")}
          MenuProps={MenuProps}
        >
          {/* <option value="">All</option> */}
          {categories?.map((category) => (
            <MenuItem key={category} value={category}>
              <Checkbox checked={value.includes(category)} />
              <ListItemText primary={category} />
            </MenuItem>
            // <option value={category}>{category}</option>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
