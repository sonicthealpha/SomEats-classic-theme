import React from "react";
import { NavLink, useLocation, useMatch } from "react-router-dom";
import LanguageIcon from "@mui/icons-material/Language";
import {
  Box,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import Login from "../common/Login";
import ReactCountryFlag from "react-country-flag";
import * as api from "../../utils/api";
import i18next from "i18next";
import { t } from "i18next";
import { useState, useEffect } from "react";

const MobileNav = ({ logo }) => {
  const isHomePage = useMatch("/");
  const [languages, setLanguages] = useState();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [isloading, setLoading] = useState(true);
  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const path = useLocation();
  const Languages = () => {
    api.get_languages().then((response) => {
      if (!response.error) {
        setLanguages(response.data);
      }
    });
  };

  useEffect(() => {
    Languages();
    setLoading(false);
    // eslint-disable-next-line
  }, []);
  return (
    <Box
      className="mobile-header home-header"
      sx={
        isHomePage
          ? { background: "transparent" }
          : { background: "var(--primary-color--)" }
      }
    >
      <Grid
        container
        className="mobileNav"
        sx={{ alignItems: "center", paddingTop: "0px" }}
      >
        <Grid item md={8} className="mobileNavGrid">
          <div className="logo">
            <NavLink to="/">
              <div className="header-logo">
                <Box
                  component={"img"}
                  sx={{ maxHeight: "80px" }}
                  src={logo}
                  alt="logo"
                />
              </div>
            </NavLink>
          </div>
        </Grid>
        <Grid
          item
          md={2}
          className="mobileNavGrid"
          sx={{
            display: "flex",
            alignItems: "center",
            marginLeft: "auto",
          }}
        >
          <Box>
            <Login />
          </Box>
          <Box sx={{ marginLeft: "8px" }}>
            <Tooltip title={t("language")}>
              <IconButton
                className="share-btn"
                onClick={handleOpenNavMenu}
                sx={{ fontSize: "18px", color: "#fff" }}
              >
                <LanguageIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <Menu
            sx={{ mt: "45px" }}
            id="menu-appbar"
            anchorEl={anchorElNav}
            value="test"
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            keepMounted
            transformOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
            open={Boolean(anchorElNav)}
            onClose={handleCloseNavMenu}
          >
            {languages &&
              languages.map((lang, index) => {
                const { country_code, code, language } = lang;
                return (
                  <MenuItem
                    key={index}
                    onClick={handleCloseNavMenu}
                    value={language}
                  >
                    <Typography
                      onClick={() => i18next.changeLanguage(code)}
                      className="lng-btn"
                    >
                      <span className="flag-icon">
                        <ReactCountryFlag
                          style={{
                            width: "1.5em",
                            height: "1.5em",
                            marginRight: "20px",
                          }}
                          countryCode={country_code}
                          svg
                          title={country_code}
                        />
                      </span>
                      {language}
                    </Typography>
                  </MenuItem>
                );
              })}
          </Menu>
        </Grid>
      </Grid>
      <div id="recaptcha-container"></div>
    </Box>
  );
};

export default MobileNav;
