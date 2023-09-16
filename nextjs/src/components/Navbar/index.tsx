import React from "react";
import { AppBar, Toolbar, Typography } from "@mui/material";
import StoreIcon from "@mui/icons-material/Store";
import LogoutIcon from "@mui/icons-material/Logout";
import IconButton from "@mui/material/IconButton";
import { useAuth } from "@/hooks";

const Navbar = () => {
  const { logout } = useAuth();

  return (
    <AppBar position="static">
      <Toolbar>
        <StoreIcon />
        <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
          Fincycle
        </Typography>
        <div style={{ display: "flex" }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            onClick={logout}
          >
            <LogoutIcon />
          </IconButton>
        </div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
