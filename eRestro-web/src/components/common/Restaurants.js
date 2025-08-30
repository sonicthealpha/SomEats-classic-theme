import { Button, Grid, Typography } from "@mui/material";
import { Container } from "@mui/system";
import React, { useEffect } from "react";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { Link } from "react-router-dom";
import ResPlaceholder from "../placeholders/ResPlaceholder";
import ProductFlatCard from "../products/ProductFlatCard";
import Aos from "aos";
import "aos/dist/aos.css";
import { useSearch } from "../../context/SearchContext";
import Highlighter from "react-highlight-words";
import { useTranslation } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import ProductCardPlaceHolder from "../placeholders/ProductCardPlaceHolder";
import "swiper/css";
import "swiper/css/navigation";

const Restaurants = () => {
  const { restaurants, isLoading } = useSearch();
  const { t } = useTranslation();

  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  const city = localStorage.getItem("city");

  return (
    <>
      {city != null ? (
        <>
          <Container>
            <Grid container>
              <Grid item md={6}>
                <div className="title-wrapper" data-aos="fade-up">
                  <Typography variant="h4" component="h4" className="bold">
                    <Highlighter
                      highlightClassName="highlight"
                      searchWords={["Restaurants"]}
                      autoEscape={true}
                      textToHighlight={t("top_restaurants")}
                    />
                  </Typography>
                  <Typography weight="light">
                    {t("top_most_restaurants")}
                  </Typography>
                </div>
              </Grid>
              <Grid item md={6} className="view-all-btn">
                <Link to="/restaurants">
                  <Button variant="text">
                    {t("view_all")}
                    <ArrowForwardIcon />
                  </Button>
                </Link>
              </Grid>
            </Grid>

            <div className="restaurants-wrapper">
              {restaurants && restaurants != null ? (
                <>
                  <Swiper
                    spaceBetween={20}
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
                        {restaurants &&
                          restaurants?.map((product, index) => {
                            const {
                              partner_id,
                              partner_name,
                              partner_profile,
                              description,
                              partner_rating,
                              partner_cook_time,
                              slug,
                              is_restro_open,
                              price_for_one,
                              partner_indicator,
                              is_favorite,
                            } = product;
                            return (
                              <SwiperSlide key={index}>
                                <ProductFlatCard
                                  image={partner_profile}
                                  title={partner_name}
                                  rating={partner_rating}
                                  des={description}
                                  price={price_for_one}
                                  slug={slug}
                                  cooking_time={partner_cook_time}
                                  open={is_restro_open}
                                  is_favorite={is_favorite}
                                  partner_indicator={partner_indicator}
                                  type_id={partner_id}
                                  type="partners"
                                />
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
};

export default Restaurants;
