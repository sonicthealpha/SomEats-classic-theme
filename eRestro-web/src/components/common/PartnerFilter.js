import { Button, Grid, Pagination } from "@mui/material";
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import ProductFlatCard from "../../components/products/ProductFlatCard";
import { useFavorites } from "../../context/FavoriteContext";
import { useTranslation } from "react-i18next";

const PartnerFilter = () => {
  const { t } = useTranslation();
  const { favorites, get_favorites, page, handlePageChange, currentPage } =
    useFavorites();

  useEffect(() => {
    get_favorites("partners");
    // eslint-disable-next-line
  }, []);

  return (
    <>
      {favorites != 0 ? (
        <>
          <Grid container spacing={2}>
            {favorites &&
              favorites.map((favorite, index) => {
                const {
                  type_id,
                  profile,
                  partner_name,
                  partner_rating,
                  owner_name,
                  is_restro_open,
                  cooking_time,
                  is_favorite,
                  slug
                } = favorite;
                return (
                  <Grid item md={4} key={index} sx={{ width: "100%" }}>
                    <ProductFlatCard
                      title={partner_name}
                      image={profile}
                      rating={partner_rating}
                      des={owner_name}
                      cooking_time={cooking_time}
                      is_favorite={is_favorite}
                      open={is_restro_open}
                      slug={slug}
                      type="partners"
                      type_id={type_id}
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
    </>
  );
};

export default PartnerFilter;
