import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Container,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
} from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import YouTubeIcon from "@mui/icons-material/YouTube";
import TwitterIcon from "@mui/icons-material/Twitter";
import { Link } from "react-router-dom";
import * as api from "../../utils/api";
import { selectData } from "../../store/reducers/settings";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { Box } from "@mui/joy";
import Highlighter from "react-highlight-words";

const Boxes = () => {
  const { t } = useTranslation();

  const data = useSelector(selectData);
  const cities = useSelector((state) => state.Cities)?.cities;

  const url = process.env.REACT_APP_ADMIN_PANEL_URL || "http://localhost:8000/";

  const parterurl = url.replace(/"/g, "");

  const web_settings =
    data.web_settings.length > 0 ? data.web_settings[0] : "no settings";
  //   console.log(web_settings);
  return (
    <Box mb={10}>
      {data.web_settings.length > 0 ? (
        <Box sx={{ marginTop: "2.3rem" }}>
          <Container>
            <Grid container spacing={3} justifyContent="space-between">
              {web_settings.return_mode === true ? (
                <Grid item md={4}>
                  <Card variant="outlined" sx={{ borderRadius: "5%" }}>
                    <CardContent>
                      <Typography color="#000" variant="h5" component="h5">
                        <Highlighter
                          highlightClassName="highlight"
                          searchWords={["return", "Politique", "नीति"]}
                          autoEscape={true}
                          textToHighlight={t("return_policy")}
                        />
                      </Typography>
                      <Divider />

                      <Typography
                        variant="h6"
                        component="h6"
                        color="text.secondary"
                        gutterBottom
                      >
                        {web_settings.return_title}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        {web_settings.return_description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ) : (
                " "
              )}

              {web_settings.support_mode === true ? (
                <Grid item md={4}>
                  <Card variant="outlined" sx={{ borderRadius: "5%" }}>
                    <CardContent>
                      <Typography color="#000" variant="h5" component="h5">
                        <Highlighter
                          highlightClassName="highlight"
                          searchWords={["support", "Politique", "नीति"]}
                          autoEscape={true}
                          textToHighlight={t("support_policy")}
                        />
                      </Typography>
                      <Divider />

                      <Typography
                        variant="h6"
                        component="h6"
                        color="text.secondary"
                        gutterBottom
                      >
                        {web_settings.support_title}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        {web_settings.support_description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ) : (
                " "
              )}

              {web_settings.safety_security_mode === true ? (
                <Grid item md={4}>
                  <Card variant="outlined" sx={{ borderRadius: "5%" }}>
                    <CardContent>
                      <Typography color="#000" variant="h5" component="h5">
                        <Highlighter
                          highlightClassName="highlight"
                          searchWords={[
                            "Safety & Security",
                            "sécurité",
                            "नीति",
                          ]}
                          autoEscape={true}
                          textToHighlight={t("safety_&_security_policy")}
                        />
                      </Typography>
                      <Divider />

                      <Typography
                        variant="h6"
                        component="h6"
                        color="text.secondary"
                        gutterBottom
                      >
                        {web_settings.safety_security_title}
                      </Typography>
                      <Typography
                        variant="subtitle2"
                        color="text.secondary"
                        gutterBottom
                      >
                        {web_settings.safety_security_description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ) : (
                " "
              )}
            </Grid>
          </Container>
        </Box>
      ) : (
        ""
      )}
    </Box>
  );
};

export default Boxes;
