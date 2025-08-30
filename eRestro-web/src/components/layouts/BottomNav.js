import * as React from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import { Avatar, Paper } from "@mui/material";
import { NavLink } from "react-router-dom";
import { Box } from "@mui/joy";

export default function BottomNav() {
  return (
    <Box className="mobile-tabs" >
      <Paper sx={{ position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 999999 }}>
        <BottomNavigation showLabels>
          <BottomNavigationAction
            label="Home"
            value="Home"
            component={NavLink}
            to="/"
            icon={
              <Avatar
                sx={{ width: "30px", height: "30px" }}
                alt="Home"
                src={process.env.PUBLIC_URL + "/images/home-icon.gif"}
              />
            }
          />

          <BottomNavigationAction
            label="Favorites"
            value="favorites"
            component={NavLink}
            to="/favorites"
            icon={
              <Avatar
                sx={{ width: "30px", height: "30px" }}
                alt="favorites"
                src={process.env.PUBLIC_URL + "/images/favorite-icon.gif"}
              />
            }
          />

          <BottomNavigationAction
            label="Cart"
            value="cart"
            component={NavLink}
            to="/cart"
            icon={
              <Avatar
                sx={{ width: "30px", height: "30px" }}
                alt="Home"
                src={process.env.PUBLIC_URL + "/images/cart-icon.gif"}
              />
            }
          />

          <BottomNavigationAction
            label="Account"
            value="account"
            component={NavLink}
            to="/account"
            icon={
              <Avatar
                sx={{ width: "30px", height: "30px" }}
                alt="Home"
                src={process.env.PUBLIC_URL + "/images/user-icon.gif"}
              />
            }
          />
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
