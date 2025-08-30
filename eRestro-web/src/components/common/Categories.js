import { Typography } from "@mui/material";
import { Container } from "@mui/system";
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper";
import * as api from "../../utils/api";
import ProductCard from "../products/ProductCard";
import ProductCardPlaceHolder from "../placeholders/ProductCardPlaceHolder";
import { useTranslation } from "react-i18next";
import Highlighter from "react-highlight-words";
import Aos from "aos";
import { useSearch } from "../../context/SearchContext";
import { Box } from "@mui/joy";
import { ArrowForward } from "@mui/icons-material";
import { Link } from "react-router-dom";

const Categories = () => {
  const [isLoading, setLoading] = useState(true);
  const { t } = useTranslation();
  const { categories, setCategory } = useSearch();

  const Categories_data = () => {
    api
      .get_categories()
      .then((response) => {
        if (!response.error) {
          setLoading(false);
          setCategory(response.data);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    Categories_data();
    Aos.init({ duration: 1000 });
    // eslint-disable-next-line
  }, []);

  const city = localStorage.getItem("city");

  return (
    <>
      {city != null ? (
        <>
          <Container className="mb20">
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"space-between"}
              padding={5}
            >
              <Box sx={{ marginLeft: "-32px" }} data-aos="fade-up">
                <Typography variant="h4" component="h4" className="bold">
                  <Highlighter
                    highlightClassName="highlight"
                    searchWords={["Cuisine"]}
                    autoEscape={true}
                    textToHighlight={t("latest_cuisine")}
                  />
                </Typography>
                <Typography weight="light">{t("top_most_cuisine")}</Typography>
              </Box>
              <Link underline="none" to="/categories" className="highlight">
                <Box
                  display={"flex"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  className="view-all-btn"
                >
                  <Typography sx={{ fontWeight: "bolder" }}>
                    {t("view_all")}
                  </Typography>
                  <ArrowForward sx={{ fontWeight: "bolder" }} />
                </Box>
              </Link>
            </Box>
            <div className="category-wrapper">
              <Swiper
                spaceBetween={20}
                loop={true}
                navigation={true}
                modules={[Navigation]}
                className="mySwiper"
                breakpoints={{
                  640: {
                    slidesPerView: 1,
                  },
                  768: {
                    slidesPerView: 1,
                  },
                  1024: {
                    slidesPerView: 4,
                  },
                }}
              >
                {isLoading ? (
                  <>
                    <SwiperSlide>
                      <ProductCardPlaceHolder />
                    </SwiperSlide>
                    <SwiperSlide>
                      <ProductCardPlaceHolder />
                    </SwiperSlide>
                  </>
                ) : (
                  <>
                    {categories &&
                      categories.map((category, index) => {
                        const { name, image, slug } = category;
                        return (
                          <SwiperSlide key={index}>
                            <Link to={`categories/${slug}`}>
                              <Box
                                sx={{
                                  transition: "transform 0.4s ease",
                                  overflow: "visible",
                                  "&:hover": {
                                    transform: "scale(1.05)",
                                  },
                                }}
                              >
                                <ProductCard title={name} image={image} />
                              </Box>
                            </Link>
                          </SwiperSlide>
                        );
                      })}
                  </>
                )}
              </Swiper>
            </div>
          </Container>
        </>
      ) : null}
    </>
  );
};

export default Categories;
