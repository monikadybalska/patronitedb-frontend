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
import { useMemo } from "react";
import { Column } from "@tanstack/react-table";
import { Author } from "../../../../lib/types";

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
  column,
}: {
  column: Column<Author, unknown>;
}) {
  const filterValue = column.getFilterValue();

  function isStringArray(array: unknown): array is string[] {
    return array !== undefined;
  }

  const categoryNames: string[] | undefined = useMemo(() => {
    return isStringArray(filterValue) ? filterValue : [];
  }, [filterValue]);

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    column.setFilterValue(typeof value === "string" ? value.split(",") : value);
  };

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
      <FormControl sx={{ width: 300 }}>
        <InputLabel id="demo-multiple-checkbox-label">Tag</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={categoryNames}
          onChange={handleChange}
          input={<OutlinedInput label="Tag" />}
          renderValue={(selected) => selected.join(", ")}
          MenuProps={MenuProps}
          sx={{ textAlign: "start" }}
        >
          {categories?.map((category) => (
            <MenuItem key={category} value={category}>
              <Checkbox checked={categoryNames.indexOf(category) > -1} />
              <ListItemText primary={category} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
