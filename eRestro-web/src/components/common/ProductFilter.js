import { Button, Grid, Pagination } from "@mui/material";
import { Container } from "@mui/system";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import ProductFlatCard from "../../components/products/ProductFlatCard";
import { useFavorites } from "../../context/FavoriteContext";
import { useTranslation } from "react-i18next";

const ProductFilter = () => {
  const { t } = useTranslation();

  const { favorites, get_favorites, page, handlePageChange, currentPage } =
    useFavorites();

  useEffect(() => {
    get_favorites("products");
    // eslint-disable-next-line
  }, []);

  return (
    <Container>
      {favorites != 0 ? (
        <>
          <Grid container spacing={2}>
            {favorites &&
              favorites.map((favorite, index) => {
                const {
                  id,
                  name,
                  image_md,
                  variants,
                  partner_details,
                  is_favorite,
                  short_description,
                  total_allowed_quantity,
                  minimum_order_quantity,
                  product_add_ons
                } = favorite;
                return (
                  <Grid item sm={6} md={4} key={index} sx={{ width: "100%" }}>
                    <ProductFlatCard
                      id={id}
                      des={name}
                      image={image_md}
                      price={variants && variants[0].price}
                      rating={
                        partner_details && partner_details[0].partner_rating
                      }
                      short_description={short_description}
                      indicator={
                        partner_details && partner_details[0].partner_indicator
                      }
                      cooking_time={
                        partner_details && partner_details[0].partner_cook_time
                      }
                      partner_indicator={
                        partner_details && partner_details[0].partner_indicator
                      }
                      open={
                        partner_details && partner_details[0].is_restro_open
                      }
                      title={partner_details && partner_details[0].partner_name}
                      is_favorite={is_favorite}
                      slug={partner_details && partner_details[0].slug}
                      variants={variants}
                      minimum_order_quantity={minimum_order_quantity}
                      total_allowed_quantity={total_allowed_quantity}
                      addons={product_add_ons}
                      is_restro_open={
                        partner_details && partner_details[0].is_restro_open
                      }
                      type="products"
                      type_id={id}
                    />
                  </Grid>
                );
              })}
          </Grid>
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
        </>
      ) : (
        <div className="no-cart-data">
          <img
            src={process.env.PUBLIC_URL + "/images/wishlist.gif"}
            alt="empty cart"
          />
         <div>{t("no_favorites_yet")}</div>
          <div>{t("looks_like_you_have_not_made_your_choice_yet")}</div>
          <Link to="/restaurants">
            <Button variant="outlined" color="error">
              {t("browse_menu")}
            </Button>
          </Link>
        </div>
      )}
    </Container>
  );
};

export default ProductFilter;
