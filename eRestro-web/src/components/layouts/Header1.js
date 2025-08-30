import React, { useState, useEffect } from "react";
import {
  Container,
  Grid,
  Menu,
  MenuItem,
  Typography,
  Badge,
} from "@mui/material";

import { Box, Tooltip } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Link } from "react-router-dom";
import ReactCountryFlag from "react-country-flag";
import i18next from "i18next";
import LanguageIcon from "@mui/icons-material/Language";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useCart } from "../../context/CartContext";
import Login from "../common/Login";
import * as api from "../../utils/api";
import OfflineCart from "../cart/OfflineCart";
import { toast } from "react-hot-toast";
import { isLogin } from "../../utils/functions";
import { selectData } from "../../store/reducers/settings";
import { useSelector } from "react-redux";
import { t } from "i18next";
import SearchBarNew from "../Search/SearchBarNew";
import Searchbar from "../Search/Searchbar";

const Header1 = () => {
  const data = useSelector(selectData);

  const [languages, setLanguages] = useState();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const { cartTotal } = useCart();
  const [isloading, setLoading] = useState(true);
  useEffect(() => {
    if (data) {
      setLoading(false);
    }
  }, []);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  useEffect(() => {
    api.get_languages().then((response) => {
      if (!response.error) {
        setLanguages(response.data);
      }
    });
    // eslint-disable-next-line
  }, []);

  const Nologin = () => {
    toast.error("Please Login!");
  };
  return (
    <Container>
      <div className="header-wrapper-sec desktop-header">
        <Grid container spacing={2}>
          <Grid item md={3} sx={{ order: { sm: 1 } }}>
            <Link to="/">
              <div className="logo-wrapper">
                {isloading ? (
                  <>
                    <img src={data && data.web_settings[0].logo} alt={"logo"} />
                  </>
                ) : (
                  <>
                    <img src={data && data.web_settings[0].logo} alt={"logo"} />
                  </>
                )}
              </div>
            </Link>
          </Grid>
          <Grid
            item
            md={6}
            sx={{ margin: "auto", order: { sm: 3, md: 2 } }}
            className="hidden-search"
          >
            <Box
              sx={{
                "@media screen and (min-width: 62em)": {
                  transform: "translate(-24px, 0px)",
                },
              }}
            >
              <SearchBarNew />
              {/* <Searchbar /> */}
            </Box>
          </Grid>
          <Grid
            item
            md={3}
            sx={{
              margin: "auto",
              order: { sm: 2, md: 3 },
              mr: { sm: -1, md: 0 },
            }}
          >
            <div className="menu-wrapper">
              <Box sx={{ display: { xs: "none", sm: "flex" } }}>
                <Box component={Link} to="/" sx={{ margin: "auto" }}>
                  <Typography
                    variant="subtitle1"
                    component="h6"
                    sx={{ marginRight: "15px", color: "#000" }}
                  >
                    {t("home")}
                  </Typography>
                </Box>

                {/* login component */}
                <div className="login">
                  <Login />
                </div>

                {isLogin() ? (
                  <Link to="/cart">
                    <Tooltip title={t("cart")}>
                      <IconButton
                        size="large"
                        aria-label="show 4 new mails"
                        color="inherit"
                      >
                        <Badge
                          badgeContent={cartTotal != 0 ? cartTotal : null}
                          color="error"
                        >
                          <ShoppingCartIcon />
                        </Badge>
                      </IconButton>
                    </Tooltip>
                  </Link>
                ) : (
                  <OfflineCart />
                )}

                {isLogin() ? (
                  <Link to="/favorites">
                    <Tooltip title={t("favorites")}>
                      <IconButton
                        size="large"
                        aria-label="cart"
                        color="inherit"
                      >
                        <FavoriteIcon />
                      </IconButton>
                    </Tooltip>
                  </Link>
                ) : (
                  <Tooltip title={t("favorites")}>
                    <IconButton
                      size="large"
                      aria-label="cart"
                      color="inherit"
                      onClick={Nologin}
                    >
                      <FavoriteIcon />
                    </IconButton>
                  </Tooltip>
                )}

                <Box sx={{ flexGrow: 0, margin: "auto" }}>
                  <Tooltip title={t("language")}>
                    <IconButton
                      className="share-btn"
                      onClick={handleOpenNavMenu}
                      sx={{ fontSize: "18px", color: "#000" }}
                    >
                      <LanguageIcon />
                    </IconButton>
                  </Tooltip>

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
                </Box>
              </Box>
            </div>
          </Grid>
        </Grid>
      </div>
    </Container>
  );
};

export default Header1;
