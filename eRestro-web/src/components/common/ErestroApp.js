import React from "react";
import { Typography, Container, Grid, Box } from "@mui/material";
import Highlighter from "react-highlight-words";
import { useSelector } from "react-redux";
import { selectData } from "../../store/reducers/settings";

const ErestroApp = () => {
  const data = useSelector(selectData);

  return (
    <>
      <Box className="side-img-wrapper" sx={{ marginLeft: "50px" }}>
        <img src={process.env.PUBLIC_URL + "/images/donuts.png"} alt="donuts" />
      </Box>
      <div className="side-img-wrapper right dnone">
        <img
          src={process.env.PUBLIC_URL + "/images/64809-pizza-loading.gif"}
          alt="pizzaslice"
        />
      </div>
      <Container>
        <div className="app-wrapper">
          <div className="app-store-wrapper">
            <Grid container spacing={2}>
              <Grid item md={4}>
                <div className="app-image">
                  <img
                    src={process.env.PUBLIC_URL + "/images/Mockup.gif"}
                    alt={"eRestro Food Delivery"}
                  />
                </div>
              </Grid>
              <Grid item md={8}>
                <div className="app-desc-wrapper">
                  <div className="app-desc title-wrapper">
                    <Typography
                      variant="h4"
                      component="h4"
                      className="responsive-h1-font"
                    >
                      <Highlighter
                        highlightClassName="highlight"
                        searchWords={[data && data.web_settings[0].site_title]}
                        autoEscape={true}
                        textToHighlight={
                          data &&
                          data.web_settings[0].app_download_section_tagline
                        }
                      />
                    </Typography>
                    <Typography variant="subtitle1" component="h6" color="#000">
                      {data &&
                        data.web_settings[0]
                          .app_download_section_short_description}
                    </Typography>
                  </div>
                  <div className="app-store">
                    <div className="playstore">
                      <a
                        href={
                          data &&
                          data.web_settings[0]
                            .app_download_section_playstore_url
                        }
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          src={process.env.PUBLIC_URL + "/images/playstore.png"}
                          alt="erestro"
                        />
                      </a>
                    </div>
                    <div className="apple">
                      <a
                        href={
                          data &&
                          data.web_settings[0].app_download_section_appstore_url
                        }
                        target="_blank"
                        rel="noreferrer"
                      >
                        <img
                          src={process.env.PUBLIC_URL + "/images/apple.png"}
                          alt="applestore"
                        />
                      </a>
                    </div>
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>
        </div>
      </Container>
      <div className="side-img-wrapper right">
        <img
          src={process.env.PUBLIC_URL + "/images/green-leaf.png"}
          alt="leaf"
        />
      </div>
    </>
  );
};

export default ErestroApp;
