import React, { useEffect } from "react";
import Header from "../components/layouts/Header";
import Footer from "../components/layouts/Footer";
import ErestroApp from "../components/common/ErestroApp";
import Services from "../components/common/Services";
import Categories from "../components/common/Categories";
import Restaurants from "../components/common/Restaurants";
import ScrollTopSec from "../components/common/ScrollTopSec";
import Offers from "../components/common/Offers";
import Sliders from "../components/common/Sliders";
import Food from "../components/common/Food";
import Faq from "../components/common/Faq";
import BottomNav from "../components/layouts/BottomNav";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { Container } from "@mui/system";
import { Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { selectData } from "../store/reducers/settings";
import Boxes from "../components/layouts/Boxes";
import { isLogin } from "../utils/functions";
import * as api from "../utils/api";
import { t } from "i18next";
import { setWallet } from "../store/reducers/WalletData";
import { setCities } from "../store/reducers/Cities";
import FeaturedSection from "../components/common/FeaturedSection";

const Home = () => {
  const data = useSelector(selectData);
  const dispatch = useDispatch();
 

  useEffect(() => {
    if (isLogin() === true) {
      api.get_settings().then((result) => {
        if (result.error === false) {
          dispatch(setWallet(result?.data?.user_data));
        }
      });
    }
    api.get_cities().then((result) => {
      dispatch(setCities(result?.data));
    });
  }, [dispatch]);
  // console.log("hello",data)
  // for first render null value avoid
  let title = data && data.web_settings[0].site_title;

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <link rel="icon" href={data && data.web_settings[0].favicon} />
          <title>Home | {title ? title : " "}</title>
          <link rel="icon" href={data && data.web_settings[0].favicon} />
          <link
            rel="apple-touch-icon"
            href={data && data.web_settings[0].favicon}
          />
          <meta
            name="description"
            content={data && data.web_settings[0].meta_description}
          />
          <link rel="apple-touch-icon" href="%PUBLIC_URL%/logo192.png" />
        </Helmet>
      </HelmetProvider>
      {data &&
      data.system_settings[0].is_web_maintenance_mode_on &&
      data.system_settings[0].is_web_maintenance_mode_on === 1 ? (
        <>
          <Container>
            <div className="maintenance-wrapper mt20">
              <div className="maintenance-img-wrapper">
                <img
                  alt="Home"
                  src={process.env.PUBLIC_URL + "/images/under-maintenance.gif"}
                />
              </div>
              <Typography
                variant="h5"
                component="h5"
                sx={{ textAlign: "center", fontWeight: "bold" }}
              >
                {t("currently_site_is_an")}
                <span className="highlight"> {t("under_maintenance")}</span>.
              </Typography>
            </div>
          </Container>
        </>
      ) : (
        <>
          <Header />
          <ScrollTopSec />
          <Categories />
          <Sliders />
          <Restaurants />
          <Offers />
          <Food />
          <FeaturedSection />
          <Services />
          <Faq />
          <ErestroApp />
          <Boxes />
          <Footer />
          <BottomNav />
        </>
      )}
    </>
  );
};

export default Home;
