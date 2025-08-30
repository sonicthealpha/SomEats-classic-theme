import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Checkbox,
  Typography,
} from "@mui/material";
import React from "react";
import StarRateIcon from "@mui/icons-material/StarRate";
import { Link } from "react-router-dom";
import { isLogin } from "../../utils/functions";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CartModel from "../common/CartModel";
import { useState } from "react";
import FavoriteBorder from "@mui/icons-material/FavoriteBorder";
import Favorite from "@mui/icons-material/Favorite";
import { useFavorites } from "../../context/FavoriteContext";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { selectData } from "../../store/reducers/settings";

const ProductFlatCard = ({
  title,
  image,
  des = "",
  rating = "",
  cooking_time = "",
  slug = "",
  open = "",
  price,
  is_favorite = "",
  partner_indicator = "",
  short_description = "",
  indicator = "",
  variants = "",
  addons = "",
  id = "",
  is_restro_open = "",
  minimum_order_quantity = "",
  total_allowed_quantity = "",
  type_id = "",
  type = "",
}) => {
  const data = useSelector(selectData);
  const currency = data.currency;
  const rating_digits = parseFloat(rating).toFixed(1);
  const [checked, setChecked] = useState(is_favorite == 1 ? true : false);
  const { add, remove } = useFavorites();

  const handleFavorite = (event, fav_id) => {
    if (event.target.checked) {
      if (isLogin()) {
        add(type, fav_id);
        setChecked(true);
      } else {
        setChecked(false);
        toast.error("please Login!");
      }
    } else {
      remove(type, type_id);
      setChecked(false);
    }
  };

  return (
    <>
      <Card
        variant="outlined"
        sx={{
          borderRadius: "15px",
          height: "430px",
          transition: "transform 0.3s, border 0.3s",
          "&:hover": {
            transform: "translateY(-2px)",
          },
        }}
      >
        <CardContent className="product-card-content">
          {open == 1 ? (
            <div className="restaurant-img-wrapper">
              <Link to={`/restaurant/${slug}`}>
                <CardMedia
                  className="mb20"
                  component="img"
                  alt={title}
                  height="250"
                  image={image}
                />
              </Link>
            </div>
          ) : (
            <div className="restaurant-img-wrapper close-res">
              <Link to={`/restaurant/${slug}`}>
                <CardMedia
                  className="mb20"
                  component="img"
                  alt={title}
                  height="250"
                  image={image}
                />
              </Link>
            </div>
          )}
          <div className="time-duration">
            <div className="time-duration-wrapper">
              <AccessTimeIcon fontSize="small" />
              <Typography variant="body2" component="h6">
                {cooking_time}
              </Typography>
            </div>
          </div>

          <Checkbox
            className="favorites"
            checked={checked}
            icon={<FavoriteBorder />}
            checkedIcon={<Favorite />}
            onChange={(event) => handleFavorite(event, type_id)}
          />

          <Link to={`/restaurant/${slug}`}>
            <Typography
              variant="subtitle1"
              component="h6"
              className="bold"
              color="#000"
            >
              {title}
            </Typography>
          </Link>

          <Link to={`/restaurant/${slug}`}>
            <CardActions sx={{ padding: "0", marginBottom: "10px" }}>
              <Typography
                variant="subtitle2"
                component="h6"
                sx={{ flexGrow: 1 }}
                color="#000"
              >
                {des.substring(0, 20)}
              </Typography>
              {rating > 0.0 ? (
                <div className="rated">
                  {rating_digits}
                  <StarRateIcon />
                </div>
              ) : null}
            </CardActions>
            <div className="border" />
            <CardActions sx={{ padding: "0" }}>
              {price != null ? (
                <Typography
                  variant="subtitle1"
                  component="h6"
                  color="#838383"
                  sx={{ flexGrow: 1 }}
                >
                  {currency}
                  {price} for one
                </Typography>
              ) : null}

              {(() => {
                if (partner_indicator == 1) {
                  return (
                    <div className="food-status home-res">
                      <img
                        src={process.env.PUBLIC_URL + "/images/veg.png"}
                        alt="veg"
                      />
                    </div>
                  );
                } else if (partner_indicator == 2) {
                  return (
                    <div className="food-status home-res">
                      <img
                        src={process.env.PUBLIC_URL + "/images/non-veg.jpg"}
                        alt="nonveg"
                      />
                    </div>
                  );
                } else {
                  return (
                    <div className="food-status home-res">
                      <img
                        src={process.env.PUBLIC_URL + "/images/veg.png"}
                        alt="veg"
                      />
                      <img
                        src={process.env.PUBLIC_URL + "/images/non-veg.jpg"}
                        alt="nonveg"
                      />
                    </div>
                  );
                }
              })()}
            </CardActions>
          </Link>
          {id != 0 ? (
            <>
              <div className="fav-products-cart-btn cart-btn mb20">
                <CartModel
                  title={title}
                  short_description={short_description}
                  indicator={indicator}
                  rating={rating}
                  variants={variants}
                  minimum_order_quantity={minimum_order_quantity}
                  total_allowed_quantity={total_allowed_quantity}
                  addons={addons}
                  id={id}
                  is_restro_open={is_restro_open}
                />
              </div>
            </>
          ) : null}
          {open == 1 ? null : (
            <>
              <Typography variant="body2" sx={{ color: "rgb(171, 0, 13)" }}>
                currently closed
              </Typography>
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default ProductFlatCard;
