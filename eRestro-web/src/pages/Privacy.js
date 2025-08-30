import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { Container } from "@mui/system";
import Layout from "../components/layouts/Layout";
import Breadcrumbs from "../components/breadcrumbs";
import PagesPlaceHolder from "../components/placeholders/PagesPlaceHolder";
import { selectData } from "../store/reducers/settings";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const Privacy = () => {
  const { t } = useTranslation();

  const data = useSelector(selectData);
  const [isloading, setLoading] = useState(true);
  useEffect(() => {
    if (data) {
      setLoading(false);
    }
  }, []);

  return (
    <Layout title={t("privacy_policy")}>
      <Breadcrumbs title="Privacy" crumb="Privacy" />
      <Container>
        <div className="title-wrapper">
          <Typography variant="h4" component="h4" className="bold">
            Privacy <span className="highlight">Policy</span>
          </Typography>
          <Typography weight="light">{t("privacy_title")}</Typography>
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
                  __html: data && data.privacy_policy,
                }}
              />
            </>
          )}
        </div>
      </Container>
    </Layout>
  );
};

export default Privacy;
