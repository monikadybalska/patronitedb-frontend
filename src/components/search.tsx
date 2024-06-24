import { Stack, InputAdornment } from "@mui/material";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useQuery } from "@tanstack/react-query";
import { fetchAllAuthors } from "../../lib/api";
import { useState, useMemo } from "react";
import { matchSorter } from "match-sorter";
import { useNavigate } from "@tanstack/react-router";
import { SyntheticEvent } from "react";
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

  const { isError, isLoading, data, error } = useQuery({
    queryKey: ["authors"],
    queryFn: fetchAllAuthors,
  });

  const options = useMemo(() => {
    return data || [];
  }, [data]);

  const handleSubmit = (
    // @ts-expect-error: unused props
    e: SyntheticEvent<Element, Event>,
    newValue: NonNullable<string | Pick<Author, "name" | "url">>
  ) => {
    const authorId = typeof newValue === "string" ? newValue : newValue.name;
    navigate({ to: "/authors/$authorId", params: { authorId } });
  };

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
        onChange={handleSubmit}
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
