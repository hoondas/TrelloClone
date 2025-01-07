import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";

export default function Navbar() {
  return (
    <Box sx={{ flexGrow: 1, marginBottom: 10 }}>
      <AppBar position="static" sx={{ backgroundColor: "#ffffff31" }}>
        <Toolbar>
          <Box display="flex" justifyContent="center" width="100%">
            <Box component="img" width="120px" src="/assets/trello.png" />
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
