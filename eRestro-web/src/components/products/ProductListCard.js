import { Grid, Rating, Typography, Checkbox, Box } from "@mui/material";
import React, { useState } from "react";
import CardMedia from "@mui/material/CardMedia";
import { isLogin } from "../../utils/functions";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CartModel from "../common/CartModel";
import { useFavorites } from "../../context/FavoriteContext";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { selectData } from "../../store/reducers/settings";

const ProductListCard = ({
  id,
  name,
  image,
  short_description,
  indicator = "",
  rating = "",
  icon = "",
  is_restro_open = "",
  variants = "",
  total_allowed_quantity = "",
  minimum_order_quantity = "",
  addons = "",
  is_favorite = "",
  favorite = "",
  rating_count = "",
  partner_id = "",
  type = "",
  type_id = "",
}) => {
  const [value] = useState(rating);
  const data = useSelector(selectData);
  const currency = data.currency;
  const [checked, setChecked] = useState(is_favorite == 1 ? true : false);
  const { add, remove } = useFavorites();

  const handleFavorite = (event, fav_id) => {
    if (event.target.checked) {
      if (isLogin()) {
        add(type, fav_id);
        setChecked(true);
      } else {
        setChecked(false);
        toast.error("Please Login!");
      }
    } else {
      remove(type, fav_id);
      setChecked(false);
    }
  };

  let item_price = variants
    ? variants[0].special_price > 0 &&
      variants[0].price &&
      variants[0].special_price < variants[0].price
      ? variants[0].special_price
      : variants[0].price
    : 0;

  const difference = parseFloat(
    variants && variants[0].price - variants[0].special_price
  );

  const variant_price = parseFloat(variants && variants[0].price);

  const discount = ((difference / variant_price) * 100).toFixed(0);

  const discounted_price =
    variants[0].price == item_price ? null : variants[0].price;
  return (
    <>
      <Grid container spacing={2} className="responsive-grid">
        <Grid item xs={4} md={3} sm={4} sx={{ position: "relative" }}>
          <div className="product-list-image-wrapper">
            <CardMedia component="img" height="180" image={image} alt={name} />
          </div>
          {discount != "NaN" && discount != 0.0 && discount != 100 ? (
            <Box
              className="discount d-none"
              sx={{
                borderTopLeftRadius: "0px",
                borderBottomRightRadius: "0px",
              }}
            >
              {discount}% off
            </Box>
          ) : null}

          <div className="product-category">
            {indicator ? (
              indicator == 1 ? (
                <div className="food-status">
                  <img
                    src={process.env.PUBLIC_URL + "/images/veg.png"}
                    alt="veg"
                  />
                </div>
              ) : (
                <div className="food-status">
                  <img
                    src={process.env.PUBLIC_URL + "/images/non-veg.jpg"}
                    alt="non-veg"
                  />
                </div>
              )
            ) : null}
          </div>
        </Grid>
        <Grid
          item
          xs={8}
          sx={{
            display: { xs: "block", sm: "none" },
            justifyContent: "flex-end",
            alignItems: "end",
          }}
        >
          {rating !== 0 && (
            <>
              <Rating name="read-only" value={Number(value)} readOnly />
              {/* <Typography className="rating-count"> ({rating_count} votes) </Typography> */}
            </>
          )}
        </Grid>
        <Grid item md={9} sm={8}>
          <div className="peoduct-list-desc-wrapper">
            <Grid container spacing={2}>
              <Grid item md={6}>
                <Typography variant="h6" component="h5" className="mb5">
                  {name}
                </Typography>
                <div className="description mb5">
                  <Typography variant="body2" component="h5">
                    {short_description}
                  </Typography>
                </div>
              </Grid>
              <Grid item md={6} sx={{ textAlign: "end" }} className="d-none">
                <Checkbox
                  checked={checked}
                  color="error"
                  icon={<FavoriteBorder color="error" />}
                  checkedIcon={<Favorite color="error" />}
                  onChange={(event) => handleFavorite(event, type_id)}
                />

                <CartModel
                  title={name}
                  short_description={short_description}
                  indicator={indicator}
                  rating={rating}
                  variants={variants}
                  minimum_order_quantity={minimum_order_quantity}
                  total_allowed_quantity={total_allowed_quantity}
                  addons={addons}
                  id={id}
                  is_restro_open={is_restro_open}
                  image={image}
                  partner_id={partner_id}
                />
              </Grid>
            </Grid>
            {rating != 0 ? (
              <>
                <div className="ratings mb5 d-none">
                  <Rating name="read-only" value={Number(value)} readOnly />
                  <div className="rating-count">
                    <Typography> ({rating_count} votes)</Typography>
                  </div>
                </div>
              </>
            ) : null}
            {/* <div className="label mb5 d-none">MUST TRY</div> */}
            <Grid container>
              <Grid item xs={6}>
                <div className="disc-wrapper w-auto">
                  <div className="price mb5">
                    <Typography
                      variant="body1"
                      component="h5"
                      className="w-auto"
                      sx={{
                        marginRight: "7px",
                        fontWeight: "500",
                        width: "auto",
                      }}
                    >
                      {currency}
                      {item_price}
                    </Typography>

                    {variants[0].price == item_price ? null : (
                      <>
                        <Typography
                          variant="body1"
                          component="h5"
                          className="w-auto"
                          sx={{ color: "#908c8c", width: "auto" }}
                        >
                          {currency}
                          <s>{discounted_price}</s>
                        </Typography>
                      </>
                    )}
                  </div>

                  {/* <AddCircleIcon className="cart-icon-mobile" /> */}
                </div>
              </Grid>
              <Grid item xs={6}>
                <Box
                  className="cart-icon-mobile"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  {is_favorite == 1 ? <>{favorite}</> : <>{icon}</>}
                  <Checkbox
                    checked={checked}
                    color="error"
                    icon={<FavoriteBorder color="error" />}
                    checkedIcon={<Favorite color="error" />}
                    onChange={(event) => handleFavorite(event, type_id)}
                  />
                  <CartModel
                    title={name}
                    short_description={short_description}
                    indicator={indicator}
                    rating={rating}
                    variants={variants}
                    minimum_order_quantity={minimum_order_quantity}
                    total_allowed_quantity={total_allowed_quantity}
                    addons={addons}
                    id={id}
                    is_restro_open={is_restro_open}
                    image={image}
                    partner_id={partner_id}
                  />
                </Box>
              </Grid>
            </Grid>
          </div>
        </Grid>
      </Grid>

      {/* modal */}
    </>
  );
};

export default ProductListCard;
