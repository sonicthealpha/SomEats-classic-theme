import { Typography } from "@mui/material";
import { Container } from "@mui/system";
import React, { useEffect, useState } from "react";
import Layout from "../components/layouts/Layout";
import Breadcrumbs from "../components/breadcrumbs";
import PagesPlaceHolder from "../components/placeholders/PagesPlaceHolder";
import { useSelector } from "react-redux";
import { selectData } from "../store/reducers/settings";
import { useTranslation } from "react-i18next";


const ContactUs = () => {
    const { t } = useTranslation();

  const data = useSelector(selectData);
  const [isloading, setLoading] = useState(true);
  useEffect(() => {
    if (data) {
      setLoading(false)
    }
  },[])

  return (
    <Layout title={t("contact_us")}>
      <Breadcrumbs title="Contact US" crumb="Contact US" />
      <Container>
        <div className="title-wrapper">
          <Typography variant="h4" component="h4" className="bold">
            Contact <span className="highlight">Us</span>
          </Typography>
          <Typography weight="light">
            {t("contact_us_title")}
          </Typography>
        </div>
        <div className="privacy-content">
          {isloading ? (
            <PagesPlaceHolder />
          ) : (
            <>
              <Typography
                variant="h6"
                component="h5"
                dangerouslySetInnerHTML={{
                  __html: data && data.contact_us
                }}
              />
            </>
          )}
        </div>
      </Container>
    </Layout>
  );
};

export default ContactUs;
