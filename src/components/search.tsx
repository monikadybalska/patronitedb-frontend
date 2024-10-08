import { Stack, InputAdornment } from "@mui/material";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useQuery } from "@tanstack/react-query";
import { fetchAllAuthors } from "../../lib/api";
import { useState, useMemo } from "react";
import { matchSorter } from "match-sorter";
import { useNavigate } from "@tanstack/react-router";
import SearchIcon from "@mui/icons-material/Search";
import { Author } from "../../lib/types";

const filterOptions = (
  options: Pick<Author, "name" | "url">[],
  { inputValue }: { inputValue: string }
) => {
  if (inputValue === "") {
    return [];
  }
  return matchSorter(options, inputValue, { keys: ["name"] }).slice(0, 11);
};

export default function Search() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState({ name: "", url: "" });
  const [inputValue, setInputValue] = useState("");

  const { isError, isLoading, data, error } = useQuery({
    queryKey: ["authors"],
    queryFn: fetchAllAuthors,
  });

  const options = useMemo(() => {
    return data || [];
  }, [data]);

  if (isError) {
    return <span>Error loading search options: {error.message}</span>;
  }

  return (
    <Stack spacing={2} sx={{ width: 300, ml: 2 }}>
      <Autocomplete
        freeSolo
        id="free-solo-2-demo"
        size="small"
        disableClearable
        autoHighlight
        clearOnEscape
        open={open}
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        loading={isLoading}
        options={options}
        filterOptions={filterOptions}
        value={value}
        // @ts-expect-error: unused values
        onChange={(event, newValue) => {
          typeof newValue === "string"
            ? setValue({ name: newValue, url: "" })
            : setValue(newValue);
          const authorId =
            typeof newValue === "string"
              ? newValue
              : newValue.url.split("/").slice(-1)[0];
          navigate({ to: "/authors/$authorId", params: { authorId } });
          setInputValue("");
          setValue({ name: "", url: "" });
        }}
        inputValue={inputValue}
        // @ts-expect-error: unused values
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        isOptionEqualToValue={(option, value) => option.name === value.name}
        getOptionLabel={(option) =>
          typeof option === "string" ? option : option.name
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search authors..."
            InputProps={{
              ...params.InputProps,
              type: "search",
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        )}
      />
    </Stack>
  );
}
