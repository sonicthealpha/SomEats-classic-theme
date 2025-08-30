import { Card, Typography } from "@mui/material";
import React from "react";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardCover from "@mui/joy/CardCover";
import CartModel from "../common/CartModel";
import { useSelector } from "react-redux";
import { selectData } from "../../store/reducers/settings";

const ProductCard = ({
  id,
  title,
  image,
  partner_name,
  indicator,
  price,
  addons,
  variants,
  short_description,
  total_allowed_quantity,
  minimum_order_quantity,
  rating,
  is_restro_open,
  partner_id = "",
}) => {
  const data = useSelector(selectData);
  const currency = data.currency;

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

  return (
    <>
      <div className="category-wrapper">
        <Card
          sx={{
            boxShadow: "none",
            position: "relative",
            height: 340,
            marginY: 2,
          }}
        >
          <CardCover
            className="radius"
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background:
                "linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0) 200px), linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0) 300px)",
            }}
          />
          <CardMedia
            component="img"
            height="100%" // Set the height to 100% to match the parent's height
            image={image}
            alt={title}
          />
          <CardContent className="category-content">
            {discount != "NaN" && discount != 0.0 && discount != 100 ? (
              <div className="discount res-discount">{discount}% off</div>
            ) : null}
            <Typography
              gutterBottom
              component="h5"
              variant="h5"
              color="#fff"
              className="bold"
            >
              {title}
            </Typography>

            <div className="product-details">
              <Typography variant="body2" color="#fff">
                {partner_name}
              </Typography>
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
            {price ? (
              <>
                <div className="product-details top-food-price">
                  <Typography variant="subtitle1" color="#fff">
                    {currency != null ? currency : null}
                    {item_price}
                  </Typography>
                  <div className="cart-btn">
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
                      image={image}
                      partner_id={partner_id}
                    />
                  </div>
                </div>
              </>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ProductCard;
