import React, { useEffect, useState } from "react";
import { Typography } from "@mui/material";
import { Container } from "@mui/system";
import Layout from "../components/layouts/Layout";
import Breadcrumbs from "../components/breadcrumbs";
import PagesPlaceHolder from "../components/placeholders/PagesPlaceHolder";
import { useSelector } from "react-redux";
import { selectData } from "../store/reducers/settings";
import { useTranslation } from "react-i18next";

const TermsConditions = () => {
  const { t } = useTranslation();

  const data = useSelector(selectData);
  const [isloading, setLoading] = useState(true);
  useEffect(() => {
    if (data) {
      setLoading(false);
    }
  }, []);

  return (
    <Layout title={t("terms_and_conditions")}>
      <Breadcrumbs
        title={t("terms_and_conditions")}
        crumb={t("terms_and_conditions")}
      />
      <Container>
        <div className="title-wrapper">
          <Typography variant="h4" component="h4" className="bold">
            Terms & <span className="highlight">Conditions</span>
          </Typography>
          <Typography weight="light">
            {t("terms_and_conditions_title")}
          </Typography>
        </div>
        <div className="privacy-content">
          {isloading ? (
            <PagesPlaceHolder />
          ) : (
            <>
              {" "}
              <Typography
                variant="body1"
                component="h5"
                dangerouslySetInnerHTML={{
                  __html: data && data.terms_conditions,
                }}
              />
            </>
          )}
        </div>
      </Container>
    </Layout>
  );
};

export default TermsConditions;
