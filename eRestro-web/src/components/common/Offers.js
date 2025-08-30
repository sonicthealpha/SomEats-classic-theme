import React, { useEffect, useState } from "react";
import { Container } from "@mui/system";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper";
import { Card, Typography } from "@mui/material";
import * as api from "../../utils/api";
import { toast } from "react-hot-toast";
import { Box } from "@mui/joy";
import Highlighter from "react-highlight-words";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Offers = () => {
  const [slider, setSlider] = useState([]);
  const { t } = useTranslation();
  const city_id = localStorage.getItem("city");

  const sliderData = () => {
    api
      .getOffers(city_id)
      .then((response) => {
        if (!response.error) {
          setSlider(response.data);
        } else {
          toast.error("No Slider Image Found");
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    sliderData();
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {slider.length > 0 && (
        <Container className="mb20 mt20">
          <Box
            className="title-wrapper"
            sx={{ paddingTop: "0px" }}
            data-aos="fade-up"
          >
            <Typography variant="h4" component="h4" className="bold">
              <Highlighter
                highlightClassName="highlight"
                searchWords={["Offers"]}
                autoEscape={true}
                textToHighlight={t("best_offer_for_you")}
              />
            </Typography>
            <Typography weight="light">
              <Highlighter
                highlightClassName="highlight"
                searchWords={["#FoodieSavings"]}
                autoEscape={true}
                textToHighlight={t("offer_section_line")}
              />
            </Typography>
          </Box>

          <Swiper
            spaceBetween={1}
            loop={true}
            navigation={true}
            modules={[Navigation]}
            className="mySwiper"
            breakpoints={{
              640: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
              1440: {
                slidesPerView: 4,
              },
            }}
          >
            <Card>
              {slider &&
                slider.map((imagedata, index) => {
                  const { image } = imagedata;
                  return (
                    <SwiperSlide key={index}>
                      <Box
                        className="image_slider"
                        display={"flex"}
                        justifyContent={"center"}
                        sx={{
                          transition: "transform 0.4s ease",
                          overflow: "visible",
                          "&:hover": {
                            transform: "scale(1.1)",
                          },
                        }}
                      >
                        {imagedata.type === "categories" ? (
                          <Box
                            component={Link}
                            to={"categories/" + imagedata.data[0]?.slug}
                            variant="plain"
                          >
                            <Box
                              component={"img"}
                              src={image}
                              alt={imagedata.data[0]?.slug}
                            />
                          </Box>
                        ) : (
                          <Box
                            component={"img"}
                            src={image}
                            alt={"product banner image"}
                          />
                        )}
                      </Box>
                    </SwiperSlide>
                  );
                })}
            </Card>
          </Swiper>
        </Container>
      )}
    </>
  );
};

export default Offers;
