import { Button, Grid, Typography } from "@mui/material";
import { Container } from "@mui/system";
import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Highlighter from "react-highlight-words";

const Services = () => {
  const { t } = useTranslation();
  return (
    <>
      <Container>
        <Grid container spacing={2}>
          <Grid item md={6}>
            <Grid container spacing={2}>
              <Grid item md={6}>
                <div className="box-wrapper">
                  <div className="service-img-wrapper">
                    <img
                      src={process.env.PUBLIC_URL + "/images/order-food.gif"}
                      alt="order"
                    />
                  </div>
                  <Typography variant="h5" component="h5" className="bold">
                    <Highlighter
                      highlightClassName="highlight"
                      searchWords={["order", "commander", "ऑर्डर"]}
                      autoEscape={true}
                      textToHighlight={t("easy_order")}
                    />
                  </Typography>
                  <Typography variant="body1" component="p">
                    {t("easy_order_sub")}
                  </Typography>
                </div>
                <div className="box-wrapper">
                  <div className="service-img-wrapper">
                    <img
                      src={process.env.PUBLIC_URL + "/images/delivery-boy.gif"}
                      alt="delivery"
                    />
                  </div>
                  <Typography variant="h5" component="h5" className="bold">
                    <Highlighter
                      highlightClassName="highlight"
                      searchWords={["delivery", "livraison", "वितरण"]}
                      autoEscape={true}
                      textToHighlight={t("fastest_delivery")}
                    />
                  </Typography>
                  <Typography variant="body1" component="p">
                    {t("fastest_delivery_sub")}
                  </Typography>
                </div>
              </Grid>
              <Grid item md={6} sx={{ alignSelf: "center" }}>
                <div className="box-wrapper">
                  <div className="service-img-wrapper">
                    <img
                      src={process.env.PUBLIC_URL + "/images/quality.gif"}
                      alt="quality"
                    />
                  </div>
                  <Typography variant="h5" component="h5" className="bold">
                    <Highlighter
                      highlightClassName="highlight"
                      searchWords={["quality", "qualité", "गुणवत्ता"]}
                      autoEscape={true}
                      textToHighlight={t("best_quality")}
                    />
                  </Typography>
                  <Typography variant="body1" component="p">
                    {t("best_quality_sub")}
                  </Typography>
                </div>
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={6} sx={{ alignSelf: "center" }}>
            <div className="service-content-wrapper">
              <Typography variant="h3" component="h3">
                <Highlighter
                  highlightClassName="highlight"
                  searchWords={["Delivery Partner"]}
                  autoEscape={true}
                  textToHighlight={t("delivery_partner")}
                />
              </Typography>
              <Typography variant="body1" component="h5">
                {t("delivery_partner_desc1")}
              </Typography>
              <Typography variant="body1" component="h5">
                {t("delivery_partner_desc2")}
              </Typography>
              <Link to="/restaurants">
                <Button
                  variant="contained"
                  sx={{ backgroundColor: "var(--primary-color--)" }}
                  className="order-btn"
                >
                  {t("order_now")}
                </Button>
              </Link>
            </div>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Services;
