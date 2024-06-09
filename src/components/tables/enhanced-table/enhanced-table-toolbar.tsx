import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FilterListIcon from "@mui/icons-material/FilterList";
import React from "react";

export default function EnhancedTableToolbar(props: {
  title: string;
  filterListOpen: boolean;
  setFilterListOpen: React.Dispatch<boolean>;
}) {
  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
      }}
    >
      <Typography
        sx={{ flex: "1 1 100%" }}
        variant="h6"
        id="tableTitle"
        component="div"
      >
        {props.title}
      </Typography>
      <Tooltip title="Filter list">
        <IconButton onClick={() => props.setFilterListOpen(!props.filterListOpen)}>
          <FilterListIcon />
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
}
