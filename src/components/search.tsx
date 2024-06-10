import { Stack, InputAdornment } from "@mui/material";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useQuery } from "@tanstack/react-query";
import { fetchAllAuthors } from "../../lib/api";
import { useState } from "react";
import { matchSorter } from "match-sorter";
import { useNavigate } from "@tanstack/react-router";
import { SyntheticEvent } from "react";
import SearchIcon from "@mui/icons-material/Search";

export default function Search() {
  const navigate = useNavigate();
  const [value, setValue] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [options, setOptions] = useState<readonly string[]>([]);

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["authors"],
    queryFn: fetchAllAuthors,
  });

  if (isPending) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    e.target.value === ""
      ? setOptions([])
      : setOptions(
          matchSorter(
            data.map((author) => author.name),
            e.target.value
          ).slice(0, 11)
        );
  };

  const handleSubmit = (e: React.KeyboardEvent) => {
    const authorId = value;
    if (e.key === "Enter" && authorId !== "") {
      // @ts-expect-error: Missing type definitions in Material UI
      e.defaultMuiPrevented = true; // eslint-disable-line
      navigate({ to: "/authors/$authorId", params: { authorId } });
      setInputValue("");
      setValue("");
    }
  };

  return (
    <Stack spacing={2} sx={{ width: 300, ml: 2 }}>
      <Autocomplete
        freeSolo
        id="free-solo-2-demo"
        size="small"
        disableClearable
        autoHighlight
        filterOptions={(x) => x}
        options={options}
        onKeyDown={handleSubmit}
        value={value}
        onChange={(event: SyntheticEvent<Element, Event>, newValue: string) => {
          const authorId = newValue;
          navigate({ to: "/authors/$authorId", params: { authorId } });
          setInputValue("");
          setValue("");
          console.log(event);
        }}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
          newInputValue === ""
            ? setOptions([])
            : setOptions(
                matchSorter(
                  data.map((author) => author.name),
                  newInputValue
                ).slice(0, 11)
              );
          console.log(event);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search authors..."
            onChange={handleChange}
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
