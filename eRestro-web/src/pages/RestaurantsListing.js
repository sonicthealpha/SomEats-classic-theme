import { Typography, Grid, Pagination, Button } from "@mui/material";
import { Container } from "@mui/system";
import React, { useState } from "react";
import Layout from "../components/layouts/Layout";
import ProductFlatCard from "../components/products/ProductFlatCard";
import Breadcrumbs from "../components/breadcrumbs";
import * as api from "../utils/api";
import ResPlaceholder from "../components/placeholders/ResPlaceholder";
import { useTranslation } from "react-i18next";
import Highlighter from "react-highlight-words";
import Nofound from "./Nofound";
import { useEffect } from "react";

const RestaurantsListing = () => {
  const { t } = useTranslation();
  const [restaurants, setRestaurants] = useState();
  const [isLoading, setLoading] = useState(true);
  const [per_page] = useState(8);
  const [page, setPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const city = localStorage.getItem("city");
  const [foodType, setFoodType] = useState("");

  const handlePageChange = (event, selectedPage) => {
    if (currentPage !== selectedPage) {
      const offset = (selectedPage - 1) * per_page;
      setLoading(true);
      setCurrentPage(selectedPage);
      get_restaurants(offset, foodType);
    }
  };

  useEffect(() => {
    get_restaurants();
    // eslint-disable-next-line
  },[]);
  
  const get_restaurants = (offset = 0, food_type) => {
    api
      .get_partners("", "", city, food_type, "", per_page, offset)
      .then((response) => {
        var totalPages = parseInt(response.total) / per_page;
        totalPages = Math.ceil(totalPages);
        setPage(totalPages);
        setLoading(false);
        setRestaurants(response.data);
      });
  };

  return (
    <Layout title={t("Restaurants_crumb")}>
      <Breadcrumbs
        title={t("Restaurants_crumb")}
        crumb={t("Restaurants_crumb")}
      />
      {restaurants && restaurants !== null && city !== null ? (
        <>
          <Container>
            <div className="title-wrapper">
              <Typography variant="h4" component="h4" className="bold">
                <Highlighter
                  highlightClassName="highlight"
                  searchWords={["Restaurants"]}
                  autoEscape={true}
                  textToHighlight={t("top_restaurants")}
                />
              </Typography>
              <Typography>{t("top_most_restaurants")}</Typography>
            </div>
            <div className="restaurants-filter mb20 filter">
              <Button
                variant="outlined"
                color="error"
                sx={{ mr: "10px" }}
                className={foodType === "" ? "active" : ""}
                onClick={() => {
                  setFoodType("");
                  setCurrentPage(1);
                  get_restaurants("", "");
                }}
              >
                {t("all")}
              </Button>
              <Button
                variant="outlined"
                color="error"
                sx={{ mr: "10px" }}
                className={foodType === 1 ? "active" : ""}
                onClick={() => {
                  setFoodType(1);
                  setCurrentPage(1);
                  get_restaurants("", 1);
                }}
              >
                {t("vegetarian")}
              </Button>
              <Button
                variant="outlined"
                color="error"
                sx={{ mr: "10px" }}
                className={foodType === 2 ? "active" : ""}
                onClick={() => {
                  setFoodType(2);
                  setCurrentPage(1);
                  get_restaurants("", 2);
                }}
                >
                {t("non_vegetarian")}
              </Button>
            </div>
            <div className="restaurants-list-wrapper">
              {restaurants && restaurants !== null && city !== null ? (
                <>
                  <Grid container spacing={2}>
                    {isLoading ? (
                      <ResPlaceholder number={8} />
                    ) : (
                      <>
                        {restaurants &&
                          restaurants.map((product, index) => {
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
                              is_favorite
                            } = product;
                            return (
                              <Grid
                                item
                                xl={3}
                                key={index}
                                className="res-card"
                              >
                                <ProductFlatCard
                                  title={partner_name}
                                  image={partner_profile}
                                  des={description}
                                  rating={partner_rating}
                                  cooking_time={partner_cook_time}
                                  slug={slug}
                                  open={is_restro_open}
                                  price={price_for_one}
                                  partner_indicator={partner_indicator}
                                  is_favorite={is_favorite}
                                  type="partners"
                                  type_id={partner_id}
                                />
                              </Grid>
                            );
                          })}
                      </>
                    )}
                  </Grid>
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
            <div className="pagination">
              <Pagination
                count={page}
                color="error"
                variant="outlined"
                shape="rounded"
                onChange={handlePageChange}
                page={currentPage}
              />
            </div>
          </Container>
        </>
      ) : (
        <>
          <Nofound />
        </>
      )}
    </Layout>
  );
};

export default RestaurantsListing;
