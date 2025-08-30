import React from "react";
import { Typography, Container } from "@mui/material";
import Navbar from "./Navbar";
import MobileNav from "./MobileNav";
import SearchBarNew from "../Search/SearchBarNew";
import { useSelector } from "react-redux";
import { selectData } from "../../store/reducers/settings";
import { Parallax } from "react-parallax";
import { useTranslation } from "react-i18next";
import Highlighter from "react-highlight-words";
import Searchbar from "../Search/Searchbar";

const Header = () => {
  const data = useSelector(selectData);

  const { t } = useTranslation();

  return (
    <Parallax
      bgImage="/images/front-view-tasty-meat-burge-new.jpg"
      bgImageAlt="main background"
      strength={500}
    >
      <div className="header-wrapper">
        <Container>
          <nav>
            <Navbar />
            <MobileNav logo={data && data.web_settings[0].logo} />
          </nav>
        </Container>
        <div className="hero-section-wrapper">
          <Typography variant="h4" component="h4">
            <Highlighter
              highlightClassName="highlight"
              searchWords={["hungry", "faim", "भूख"]}
              autoEscape={true}
              textToHighlight={t("tag_line")}
            />
          </Typography>
          <Typography variant="h6" component="h6">
            {t("tag_subtitle")}
          </Typography>
          <div className="searchbar">
            <SearchBarNew width="700px" />
            {/* <Searchbar width="700px"/> */}
          </div>
        </div>
      </div>
    </Parallax>
  );
};

export default Header;
