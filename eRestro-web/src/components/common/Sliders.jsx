import React, { useEffect, useState } from "react";
import { Container } from "@mui/system";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper";
import * as api from "../../utils/api";
import { toast } from "react-hot-toast";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  CardCover,
  Typography,
} from "@mui/joy";
import Highlighter from "react-highlight-words";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowUpRightFromSquare,
  faCartShopping,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import CartModel from "./CartModel";
import { CardMedia } from "@mui/material";

const Sliders = () => {
  const [slider, setSlider] = useState();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const currency = useSelector((state) => state.settings)?.data
    ?.system_settings[0]?.currency;

  const city_id = localStorage.getItem("city");

  const sliderData = () => {
    api
      .get_sliders(city_id)
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
    <Container>
      <Swiper
        spaceBetween={1}
        loop={true}
        navigation={true}
        modules={[Navigation, Autoplay]}
        // autoplay={{
        //     delay: 2500,
        //     disableOnInteraction: false,
        // }}
        style={{ borderRadius: "10px" }}
        className="mySwiper"
        breakpoints={{
          640: {
            slidesPerView: 1,
          },
          768: {
            slidesPerView: 1,
          },
          1024: {
            slidesPerView: 1,
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
                    //className="image_slider"
                    display={"flex"}
                    justifyContent={"center"}
                    sx={{
                      minHeight: { md: "500px", xs: "250px" },
                      maxWidth: "100%",
                    }}
                  >
                    {imagedata.type === "categories" ? (
                      <Card
                        sx={{ width: "100%" }}
                        component={"div"}
                        onClick={() => {
                          if (imagedata.type === "categories") {
                            navigate(`/categories/${imagedata.data[0]?.slug}`);
                          }
                        }}
                      >
                        <CardCover>
                          <Box
                            component={"img"}
                            src={image}
                            srcSet={image}
                            loading="lazy"
                            alt=""
                            sx={{
                              maxWidth: "100%", // Allow the width to adjust dynamically
                              maxHeight: "100%", // Set maximum height to prevent the image from overflowing
                              objectFit: "cover !important", // Ensure the entire image fits within the container
                            }}
                          />
                        </CardCover>
                        <CardCover
                          sx={{
                            background:
                              "linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0) 200px), linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0) 300px)",
                          }}
                        />

                        <CardContent className="category-content">
                          <Typography level="title-lg" textColor="#fff">
                            {imagedata.data[0]?.name}
                          </Typography>
                          <Typography
                            startDecorator={
                              <FontAwesomeIcon
                                icon={faArrowUpRightFromSquare}
                              />
                            }
                            textColor="neutral.300"
                          >
                            <Link to={"categories/" + imagedata.data[0]?.slug}>
                              View Product
                            </Link>
                          </Typography>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card sx={{ maxHeight: "100%", width: "100%" }}>
                        <CardCover>
                          <Box
                            component={"img"}
                            src={image}
                            srcSet={image}
                            loading="lazy"
                            alt=""
                            height={"100%"}
                            sx={{ objectFit: "cover !important" }}
                          ></Box>
                        </CardCover>
                        <CardCover
                          sx={{
                            background:
                              "linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0) 200px), linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0) 300px)",
                          }}
                        />
                        <CardContent
                          sx={{
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center",
                          }}
                        >
                          <Box
                            display={"flex"}
                            justifyContent={"space-between"}
                            width={"100%"}
                          >
                            <Box>
                              <Typography level="title-lg" textColor="#fff">
                                {imagedata.data[0]?.name}
                              </Typography>
                              <Typography
                                startDecorator={
                                  <FontAwesomeIcon icon={faCartShopping} />
                                }
                                textColor="neutral.300"
                              >
                                {currency}{" "}
                                {
                                  imagedata.data[0]?.min_max_price
                                    ?.special_price
                                }
                              </Typography>
                            </Box>
                            <Box>
                              <CartModel
                                title={imagedata.data[0]?.name}
                                short_description={
                                  imagedata.data[0]?.short_description
                                }
                                indicator={imagedata.data[0]?.indicator}
                                rating={imagedata.data[0]?.rating}
                                variants={imagedata.data[0]?.variants}
                                minimum_order_quantity={
                                  imagedata.data[0]?.minimum_order_quantity
                                }
                                total_allowed_quantity={
                                  imagedata.data[0]?.total_allowed_quantity
                                }
                                addons={imagedata.data[0]?.product_add_ons}
                                id={imagedata.data[0]?.id}
                                is_restro_open={
                                  imagedata.data[0]?.partner_details[0]
                                    ?.is_restro_open
                                }
                                image={image}
                                partner_id={imagedata.data[0]?.partner_id}
                              />
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    )}
                  </Box>
                </SwiperSlide>
              );
            })}
        </Card>
      </Swiper>
    </Container>
  );
};

export default Sliders;
