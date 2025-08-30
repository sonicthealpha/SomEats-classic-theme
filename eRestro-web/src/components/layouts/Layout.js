import React from "react";
import { Helmet, HelmetProvider } from "react-helmet-async";
import Header1 from "../layouts/Header1";
import Footer from "../layouts/Footer";
import MobileNav from "./MobileNav";
import BottomNav from "./BottomNav";
import { useSelector } from "react-redux";
import { selectData } from "../../store/reducers/settings";

const Layout = ({ children, ...props }) => {

  const data = useSelector(selectData);

  // for first render null value avoid
  let title = data && data.web_settings[0].site_title

  return (
    <>
      <Header1  />
      <MobileNav logo={data && data.web_settings[0].logo} />
      <HelmetProvider>
        <Helmet>
          <title>{props.title} | {title ? title : " "}</title>
          <link
            rel="icon"
            href={data && data.web_settings[0].favicon}
          />
          <link
            rel="apple-touch-icon"
            href={data && data.web_settings[0].favicon}
          />
        </Helmet>
        {children}
      </HelmetProvider>
      <Footer  />
      <BottomNav />
    </>
  );
};

export default Layout;
