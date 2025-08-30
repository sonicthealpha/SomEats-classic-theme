import { Container, Tab, Tabs, Typography } from "@mui/material";
import React from "react";
import Layout from "../layouts/Layout";
import Breadcrumbs from "../../components/breadcrumbs/";
import { Box } from "@mui/system";
import PartnerFilter from "./PartnerFilter";
import ProductFilter from "./ProductFilter";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { useState } from "react";

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value != index}
      id={`vertical-tabpanel-${index}`}
      aria-labelledby={`vertical-tab-${index}`}
      {...other}
    >
      {value == index && (
        <Box p={3}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    "aria-controls": `vertical-tabpanel-${index}`,
  };
}

function Favorites(props) {
  const [value, setValue] = useState(0);
  const { t } = useTranslation();

  const handleChange = (event, newValue) => {
    console.log("change called");
    setValue(newValue);
  };

  return (
    <Layout title={t("favorites")}>
      <Breadcrumbs title={t("favorites")} crumb={t("favorites")} />
      <Container>
        <div className="title-wrapper" data-aos="fade-up">
          <Typography variant="h4" component="h4" className="bold">
            {t("favorites")}
          </Typography>
          <Typography weight="light">{t("favorite_desc")}</Typography>
        </div>

        <div className="desktop-tabs">
          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
            }}
          >
            <Tabs
              orientation="vertical"
              variant="scrollable"
              value={value}
              onChange={handleChange}
              aria-label="Vertical tabs example"
              sx={{ borderRight: 1, borderColor: "divider" }}
            >
              <Tab
                label={t("partners")}
                {...a11yProps(0)}
                className="tabs-btn"
              />
              <Tab
                label={t("products")}
                {...a11yProps(1)}
                className="tabs-btn"
              />
            </Tabs>
            <TabPanel value={value} index={0}>
              <PartnerFilter />
            </TabPanel>
            <TabPanel value={value} index={1}>
              <ProductFilter />
            </TabPanel>
          </Box>
        </div>
        <div className="mobile-tabs">
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
              sx={{ borderBottom: 1, borderColor: "divider" }}
            >
              <Tab
                label={t("partners")}
                {...a11yProps(0)}
                className="tabs-btn"
              />
              <Tab
                label={t("products")}
                {...a11yProps(1)}
                className="tabs-btn"
              />
            </Tabs>
          </Box>
          <TabPanel value={value} index={0}>
            <PartnerFilter />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <ProductFilter h={"480px"} />
          </TabPanel>
        </div>
      </Container>
    </Layout>
  );
}

export default Favorites;
