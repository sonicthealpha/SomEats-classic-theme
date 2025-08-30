import React, { useState, useEffect } from "react";
import { Grid, Typography, Container, Button } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import TwitterIcon from "@mui/icons-material/Twitter";
import { Link } from "react-router-dom";
import * as api from "../../utils/api";
import { selectData } from "../../store/reducers/settings";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Parallax } from "react-parallax";
import { Box } from "@mui/joy";
import CitiesModel from "../Modal/CitiesModel";
import Highlighter from "react-highlight-words";

const Footer = () => {
  const { t } = useTranslation();

  const data = useSelector(selectData);

  const cities = useSelector((state) => state.Cities)?.cities;

  const url = process.env.REACT_APP_ADMIN_PANEL_URL || "http://localhost:8000/";

  const parterurl = url.replace(/"/g, "");

  const [showMore, setShowMore] = useState(false);

  const handleShowMore = () => {
    setShowMore(true);
  };

  //   console.log(data);
  return (
    <Box mt={5}>
      <Parallax
        bgImage="/images/background.jpg"
        bgImageAlt="main background"
        strength={500}
      >
        <Box
          className="header-wrapper"
          sx={{
            background:
              "linear-gradient(0deg, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1))",
          }}
        >
          <div className="side-img-wrapper">
            <img
              src={process.env.PUBLIC_URL + "/images/red-chilli-paste.png"}
              alt="chilli"
            />
          </div>
          <Container>
            <div className="footer-wrapper">
              <Grid container spacing={3} justify="center">
                <Grid item md={3}>
                  <div className="footer-logo-wrapper">
                    <div className="footer-logo">
                      <img
                        src={data && data.web_settings[0].logo}
                        alt={"logo"}
                      />
                    </div>
                    <div className="footer-desc-wrapper">
                      <Typography color="#fff">
                        {data && data.web_settings[0].app_short_description}
                      </Typography>
                    </div>
                    <Box className="become-partner" sx={{ marginTop: "20px" }}>
                      <a
                        href={parterurl + "partner/auth/sign_up"}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Button
                          variant="contained"
                          sx={{ backgroundColor: "var(--primary-color--)" }}
                        >
                          {t("become_a_partner")}
                        </Button>
                      </a>
                    </Box>
                    <Box className="become-rider" sx={{ marginTop: "20px" }}>
                      <a
                        href={parterurl + "rider/auth/sign_up"}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <Button
                          variant="contained"
                          sx={{ backgroundColor: "var(--primary-color--)" }}
                        >
                          {t("become_a_delivery_rider")}
                        </Button>
                      </a>
                    </Box>
                  </div>
                </Grid>
                <Grid item md={3} sx={{ width: "100%" }}>
                  <div className="footer-services-wrapper">
                    <div className="footer-desc-title">
                      <Typography color="#fff" variant="h6" component="h6">
                        <Highlighter
                          highlightClassName="highlight"
                          searchWords={["learn", "Et", "और"]}
                          autoEscape={true}
                          textToHighlight={t("learn_more")}
                        />
                      </Typography>
                    </div>
                    <div className="footer-services">
                      <ul>
                        <li>
                          <Link to="/privacy">
                            <Typography variant="subtitle1" component="h6">
                              {t("privacy")}
                            </Typography>
                          </Link>
                        </li>
                        <li>
                          <Link to="/terms-conditions">
                            <Typography variant="subtitle1" component="h6">
                              {t("terms_and_conditions")}
                            </Typography>
                          </Link>
                        </li>
                        <li>
                          <Link to="/contact-us">
                            <Typography variant="subtitle1" component="h6">
                              {t("contact_us")}
                            </Typography>
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </Grid>
                <Grid item xs={3}>
                  <div className="footer-product-wrapper">
                    <div className="footer-desc-title">
                      <Typography color="#fff" variant="h6" component="h6">
                        <Highlighter
                          highlightClassName="highlight"
                          searchWords={["deliver", "livrer", "पहुंचाते"]}
                          autoEscape={true}
                          textToHighlight={t("we_deliver_to")}
                        />
                      </Typography>
                    </div>
                    <div className="footer-services">
                      <ul>
                        {cities &&
                          cities.map((city, index) => (
                            <React.Fragment key={index}>
                              {index + 1 <= 4 && (
                                <li>
                                  <Typography
                                    variant="subtitle1"
                                    component="h6"
                                  >
                                    {city.name}
                                  </Typography>
                                </li>
                              )}
                            </React.Fragment>
                          ))}
                        {!showMore && cities.length > 4 && (
                          <Button
                            sx={{ paddingLeft: 0 }}
                            onClick={handleShowMore}
                            variant="text"
                          >
                            <Typography
                              variant="subtitle1"
                              color={"whitesmoke"}
                            >
                              {t("show_more")}
                            </Typography>
                          </Button>
                        )}
                      </ul>
                    </div>
                  </div>
                </Grid>

                {showMore && (
                  <CitiesModel
                    cities={cities}
                    cityModel={showMore}
                    setCityModel={setShowMore}
                  />
                )}

                <Grid item md={3}>
                  <div className="contactUs-wrapper">
                    <div className="footer-desc-title">
                      <Typography color="#fff" variant="h6" component="h6">
                        <Highlighter
                          highlightClassName="highlight"
                          searchWords={["contact", "contact", "संपर्क"]}
                          autoEscape={true}
                          textToHighlight={t("contact_us")}
                        />
                      </Typography>
                    </div>
                    <div className="footer-services">
                      <Typography
                        color="#fff"
                        dangerouslySetInnerHTML={{
                          __html: data && data.web_settings[0].address,
                        }}
                      />
                      <Typography color="#fff">
                        {data && data.web_settings[0].support_email}
                      </Typography>
                    </div>
                  </div>
                </Grid>
              </Grid>
            </div>
            <div className="footer-bottom">
              <Grid container spacing={2}>
                <Grid item md={6}>
                  <div className="footer-bottom-Typography ">
                    <Typography
                      color="#fff"
                      variant="subtitle1"
                      component="div"
                    >
                      <Typography
                        color="#fff"
                        variant="subtitle1"
                        component="h6"
                      >
                        {data &&
                          data.web_settings?.[0]?.copyright_details?.replace(
                            /\\r\\n/g,
                            ""
                          )}
                      </Typography>
                    </Typography>
                  </div>
                </Grid>
                <Grid item md={6} justify="end">
                  <div className="social-icons">
                    <a
                      href={data.web_settings[0].facebook_link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FacebookIcon />
                    </a>
                    <a
                      href={data.web_settings[0].instagram_link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <InstagramIcon />
                    </a>

                    <a
                      href={data.web_settings[0].youtube_link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <YouTubeIcon />
                    </a>
                    <a
                      href={data.web_settings[0].twitter_link}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <TwitterIcon />
                    </a>
                  </div>
                </Grid>
              </Grid>
            </div>
          </Container>
          <div id="recaptcha-container"></div>
        </Box>
      </Parallax>
    </Box>
  );
};

export default Footer;
