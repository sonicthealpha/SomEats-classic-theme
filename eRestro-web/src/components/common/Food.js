import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper";

import ProductCard from "../products/ProductCard";
import { Container, Typography } from "@mui/material";
import ProductCardPlaceHolder from "../placeholders/ProductCardPlaceHolder";
import Aos from "aos";
import { useSearch } from "../../context/SearchContext";
import { useTranslation } from "react-i18next";
import Highlighter from "react-highlight-words";
import { Box } from "@mui/system";

function Food() {
  const { products, isLoading } = useSearch();
  const { t } = useTranslation();

  useEffect(() => {
    Aos.init({ duration: 1000 });
    // eslint-disable-next-line
  }, []);

  const city = localStorage.getItem("city");

  return (
    <>
      {city != null ? (
        <>
          <Container className="mb20">
            <div className="title-wrapper" data-aos="fade-up">
              <Typography variant="h4" component="h4" className="bold">
                <Highlighter
                  highlightClassName="highlight"
                  searchWords={["Foods", "notés"]}
                  autoEscape={true}
                  textToHighlight={t("foods")}
                />
              </Typography>
              <Typography weight="light">{t("top_rated_foods")}</Typography>
            </div>
            <div className="category-wrapper">
              {products != null ? (
                <>
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
                        {products?.map((product, index) => {
                          return (
                            <SwiperSlide key={index}>
                              <Box
                                sx={{
                                  transition: "transform 0.3s, border 0.3s",
                                  "&:hover": {
                                    transform: "translateY(-3px)",
                                  },
                                }}
                              >
                                <ProductCard
                                  id={product.id}
                                  title={product.name}
                                  image={product.image}
                                  partner_name={
                                    product.partner_details[0].partner_name
                                  }
                                  indicator={product.indicator}
                                  price={product.variants}
                                  variants={product.variants}
                                  addons={product.product_add_ons}
                                  short_description={product.short_description}
                                  total_allowed_quantity={
                                    product.total_allowed_quantity
                                  }
                                  minimum_order_quantity={
                                    product.minimum_order_quantity
                                  }
                                  rating={product.rating}
                                  is_restro_open={
                                    product.partner_details[0].is_restro_open
                                  }
                                  partner_id={
                                    product.partner_details[0].partner_id
                                  }
                                />
                              </Box>
                            </SwiperSlide>
                          );
                        })}
                      </>
                    )}
                  </Swiper>
                </>
              ) : (
                <>
                  <div>
                    <div className="not-found-res">
                      <img
                        src={process.env.PUBLIC_URL + "/images/oopsie.gif"}
                        alt="not-found"
                      />
                    </div>
                    <Typography
                      variant="h6"
                      component="h5"
                      sx={{ textAlign: "center" }}
                    >
                      sorry, online ordering isn't available at your location.
                    </Typography>
                  </div>
                </>
              )}
            </div>
          </Container>
        </>
      ) : null}
    </>
  );
}

export default Food;
