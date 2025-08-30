import React, { useEffect, useState } from "react";
import { Container } from "@mui/system";
import "swiper/css";
import "swiper/css/navigation";
import * as api from "../../utils/api";
import { toast } from "react-hot-toast";
import {
  Box,
  Card,
  CardContent,
  CardCover,
  Grid,
  Link,
  Typography,
} from "@mui/joy";
import { useTranslation } from "react-i18next";
import { CoffeeOutlined } from "@mui/icons-material";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper";
import ProductCard from "../products/ProductCard";

const FeaturedSection = () => {
  const [section, setSection] = useState();
  const { t } = useTranslation();

  const sectionData = () => {
    api
      .get_sections()
      .then((response) => {
        if (!response.error) {
          setSection(response.data);
        } else {
          // toast.error("No section Image Found");
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    sectionData();
    // eslint-disable-next-line
  }, []);

  return (
    <Container className="mb20">
      {section &&
        section.map((data, index) => {
          const { product_details } = data;
          const { product_tags } = data;
          return (
            <Box key={index}>
              {product_details.length > 0 ? (
                <Box mb={3}>
                  <Box
                    className="title-wrapper"
                    sx={{ paddingTop: "0px" }}
                    data-aos="fade-up"
                  >
                    <Typography level="h2">{data.title}</Typography>
                    <Typography weight="light">
                      {data.short_description}
                    </Typography>
                    <Grid
                      container
                      gap={{ xs: 0, md: 2 }}
                      sx={{ width: "100%" }}
                    >
                      {product_tags.map((tag, index) => {
                        return (
                          <Grid xs={6} md={1} key={index}>
                            <Typography key={index} className="highlight">
                              #{tag}
                            </Typography>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Box>
                  <Swiper
                    spaceBetween={1}
                    loop={true}
                    navigation={true}
                    modules={[Navigation, Autoplay]}
                    className="mySwiper"
                    breakpoints={{
                      640: {
                        slidesPerView: 1,
                      },
                      768: {
                        slidesPerView: 2,
                      },
                      1024: {
                        slidesPerView: 4,
                        spaceBetween: 20,
                      },
                    }}
                  >
                    {product_details.map((items, index) => {
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
                              id={items.id}
                              title={items.name}
                              image={items.image}
                              partner_name={
                                items.partner_details[0].partner_name
                              }
                              indicator={items.indicator}
                              price={items.variants}
                              variants={items.variants}
                              addons={items.product_add_ons}
                              short_description={items.short_description}
                              total_allowed_quantity={
                                items.total_allowed_quantity
                              }
                              minimum_order_quantity={
                                items.minimum_order_quantity
                              }
                              rating={items.rating}
                              is_restro_open={
                                items.partner_details[0].is_restro_open
                              }
                              partner_id={items.partner_details[0].partner_id}
                            />
                          </Box>
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>
                </Box>
              ) : (
                ""
              )}
            </Box>
          );
        })}
    </Container>
  );
};

export default FeaturedSection;
