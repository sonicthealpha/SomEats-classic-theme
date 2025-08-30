import React, { useEffect, useState } from "react";
import Layout from "../components/layouts/Layout";
import ProductListCard from "../components/products/ProductListCard";
import {
  Box,
  Button,
  Card,
  Checkbox,
  Container,
  Grid,
  Pagination,
  Typography,
} from "@mui/material";
import Breadcrumbs from "../components/breadcrumbs";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";
import StarRateIcon from "@mui/icons-material/StarRate";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import * as api from "../utils/api";
import { useParams } from "react-router";
import ResDetailsPlaceholder from "../components/placeholders/ResDetailsPlaceholder";
import { useFavorites } from "../context/FavoriteContext";
import { useTranslation } from "react-i18next";
import RestaurantsDetailsMobileView from "./RestaurantsDetailsMobileView";
import ProductSearch from "../components/Search/ProductSearch";
import Nofound from "./Nofound";
import { isLogin } from "../utils/functions";
import { toast } from "react-hot-toast";
import ApiErrorPage from "./ApiErrorPage";

const RestaurantsDetails = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const { slug } = useParams();
  // const [active, setActive] = useState();
  const city = localStorage.getItem("city");
  const [isloading, setLoading] = useState(true);
  const { add, remove } = useFavorites();
  const { t } = useTranslation();
  const [per_page] = useState(10);
  const [page, setPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [categoryId, setCategoryId] = useState([]);
  const [search, setSearch] = useState([]);
  const [checked, setChecked] = useState(false);
  const [foodType, setFoodType] = useState("");
  const [apiError, setApiError] = useState(false);

  const get_products = (offset = 0, id) => {
    setApiError(false);
    setLoading(true);
    // setActive(id);
    setCategoryId(id);
    api
      .get_products(
        "",
        "",
        id,
        search,
        "",
        "",
        "",
        per_page,
        offset,
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "p.id",
        "",
        slug
      )
      .then((response) => {
        if (!response.error) {
          var totalPages = parseInt(response.total) / per_page;
          totalPages = Math.ceil(totalPages);
          setPage(totalPages);
          setLoading(false);
          setProducts(response.data);
        } else {
          setLoading(false);
        }
      })
      .catch(() => {
        setLoading(false);
        setApiError(true);
      });
  };

  useEffect(() => {
    get_products();
    api
      .get_partners(slug, "", city)
      .then((response) => {
        if (!response.error) {
          setRestaurants(response.data[0]);
          if (response.data[0].is_favorite === 1) {
            setChecked(true);
          }
        }
      })
      .catch(() => {});
    // eslint-disable-next-line
  }, [slug, city]);

  const get_categories = () => {
    api
      .get_categories(slug)
      .then((response) => {
        if (!response.error) {
          setCategories(response.data);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    get_categories();
    // eslint-disable-next-line
  }, []);

  const PartnerFav = (event, partner_id) => {
    if (event.target.checked) {
      if (isLogin()) {
        add("partners", partner_id);
        setChecked(true);
      } else {
        setChecked(false);
        toast.error("please Login..");
      }
    } else {
      remove("partners", partner_id);
      setChecked(false);
    }
  };

  const handlePageChange = (event, selectedPage) => {
    if (currentPage !== selectedPage) {
      const offset = (selectedPage - 1) * per_page;
      setLoading(true);
      setCurrentPage(selectedPage);
      get_products(offset, foodType);
    }
  };

  const rating_digits = parseFloat(restaurants?.partner_rating).toFixed(1);

  return (
    <Layout title={`${t("Restaurants_crumb")} | ${restaurants.partner_name}`}>
      <Breadcrumbs
        partner_name={restaurants.partner_name}
        crumb={t("restaurants")}
        crumb_link="/restaurants"
      />
      <Container>
        <div className="title-wrapper" id="myHeader">
          <Typography variant="h4" component="h4" className="bold">
            {restaurants.partner_name}
          </Typography>
          <Typography>{restaurants.partner_address}</Typography>
          {restaurants.is_restro_open === 0 ? (
            <Typography
              variant="h6"
              component="h5"
              color="error"
              sx={{ fontWeight: 300 }}
            >
              {t("currently_closed")}
            </Typography>
          ) : null}
        </div>
        <div className="restaurants-detail-img-wrapper">
          <Card sx={{ position: "relative", boxShadow: "none" }}>
            <Box
              className="restaurants-background"
              sx={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)),url(${restaurants.partner_profile})`,
              }}
            />
            <div className="indicators">
              {restaurants.partner_indicator ? (
                restaurants.partner_indicator === 1 ? (
                  <div className="food-status">
                    <img
                      src={process.env.PUBLIC_URL + "/images/veg.png"}
                      alt="veg"
                    />
                  </div>
                ) : (
                  <div className="food-status">
                    <img
                      src={process.env.PUBLIC_URL + "/images/veg.png"}
                      alt="veg"
                    />
                    <img
                      src={process.env.PUBLIC_URL + "/images/non-veg.jpg"}
                      alt="non-veg"
                    />
                  </div>
                )
              ) : null}
            </div>
            <div className="res-rat-time">
              <div className="favorites-wrapper">
                <Checkbox
                  checked={checked}
                  color="error"
                  sx={{
                    paddingTop: "0px",
                    paddingBottom: "0px",
                    color: "#d32f2f",
                  }}
                  icon={<FavoriteBorder />}
                  checkedIcon={<Favorite />}
                  onChange={(event) =>
                    PartnerFav(event, restaurants.partner_id)
                  }
                />
              </div>

              {!isNaN(rating_digits) && (
                <div className="rated">
                  ({rating_digits})
                  <StarRateIcon />
                </div>
              )}

              <div className="time">
                <AccessTimeIcon />
                <Typography variant="body2" component="h6">
                  {restaurants.partner_cook_time}
                </Typography>
              </div>
            </div>
          </Card>
        </div>
        {!apiError ? (
          <>
            {products.length !== 0 ? (
              <>
                <ProductSearch
                  className="mt20"
                  setProducts={setProducts}
                  restaurant_slug={slug}
                  category={categoryId}
                  setSearch={setSearch}
                  search={search}
                />
                <RestaurantsDetailsMobileView
                  products={products}
                  categories={categories}
                  filterProducts={get_products}
                  isloading={isloading}
                />
                <div className="category-listing d-none">
                  <div className="all_categories mt20 filter">
                    <Button
                      variant="outlined"
                      color="error"
                      className={foodType === "" ? "active" : ""}
                      onClick={() => {
                        setFoodType("");
                        setCurrentPage(1);
                        get_products("", "");
                      }}
                      sx={{ textTransform: "capitalize" }}
                    >
                      {t("all")}
                    </Button>
                  </div>
                  {categories &&
                    categories.map((category, index) => {
                      const { id, name } = category;
                      return (
                        <div key={index} className="all_categories mt20 filter">
                          <Button
                            variant="outlined"
                            color="error"
                            className={foodType === id ? "active" : ""}
                            onClick={() => {
                              setFoodType(id);
                              setCurrentPage(1);
                              get_products("", id);
                            }}
                            sx={{ textTransform: "capitalize" }}
                          >
                            {name}
                          </Button>
                        </div>
                      );
                    })}
                </div>
                <div className="border d-none"></div>
                <Grid container className="d-none">
                  <Grid item md={12}>
                    <>
                      <section>
                        <div className="product-list-wrapper">
                          {isloading ? (
                            <ResDetailsPlaceholder />
                          ) : (
                            <>
                              {products.length !== 0 ? (
                                <>
                                  {products &&
                                    products.map((product, index) => {
                                      const {
                                        id,
                                        name,
                                        image,
                                        short_description,
                                        rating,
                                        indicator,
                                        variants,
                                        is_favorite,
                                        partner_details,
                                        product_add_ons,
                                        total_allowed_quantity,
                                        minimum_order_quantity,
                                        no_of_ratings,
                                      } = product;
                                      return (
                                        <div
                                          key={index}
                                          className="products-list"
                                        >
                                          <ProductListCard
                                            id={id}
                                            name={name}
                                            image={image}
                                            partner_name={
                                              partner_details[0].partner_name
                                            }
                                            indicator={indicator}
                                            price={variants}
                                            variants={variants}
                                            addons={product_add_ons}
                                            short_description={
                                              short_description
                                            }
                                            total_allowed_quantity={
                                              total_allowed_quantity
                                            }
                                            minimum_order_quantity={
                                              minimum_order_quantity
                                            }
                                            rating={rating}
                                            is_restro_open={
                                              partner_details[0].is_restro_open
                                            }
                                            is_favorite={is_favorite}
                                            rating_count={no_of_ratings}
                                            partner_id={
                                              partner_details[0].partner_id
                                            }
                                            type_id={variants[0].product_id}
                                            type="products"
                                          />
                                        </div>
                                      );
                                    })}
                                </>
                              ) : (
                                <Nofound />
                              )}
                            </>
                          )}
                        </div>
                      </section>
                    </>

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
                  </Grid>
                </Grid>
              </>
            ) : (
              <Box mb={8}>
                <Nofound />
              </Box>
            )}
          </>
        ) : (
          <Box
            sx={{
              mt: {
                xs: -25,
                sm: -22,
                lg: -25, // margin-top for large screens (lg)
                xl: -25, // margin-top for extra large screens (xl)
              },
            }}
          >
            {" "}
            <ApiErrorPage onRetry={get_products} />
          </Box>
        )}
      </Container>
    </Layout>
  );
};

export default RestaurantsDetails;
