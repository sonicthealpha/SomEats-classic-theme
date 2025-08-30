import {
  Badge,
  Grid,
  IconButton,
  Tooltip,
  Typography,
  Button,
  Box,
} from "@mui/material";
import React from "react";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Menu from "@mui/material/Menu";
import Login from "../common/Login";
import { useCart } from "../../context/CartContext";
import CartModel from "../common/CartModel";
import { useSelector } from "react-redux";
import { selectData } from "../../store/reducers/settings";
import { t } from "i18next";

const OfflineCart = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const data = useSelector(selectData);
  const currency = data.currency;
  const { Remove_data, usercart, cartTotal, ClearOfflineCart } = useCart();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const Remove = (product_variant_id) => {
    Remove_data(product_variant_id);
  };

  const ClearCart = () => {
    ClearOfflineCart();
  };

  return (
    <div>
      <Tooltip title={t("cart")}>
        <IconButton size="large" color="inherit" onClick={handleClick}>
          <Badge
            badgeContent={cartTotal != "" ? cartTotal : null}
            color="error"
          >
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
      </Tooltip>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <Box sx={{ padding: "15px" }}>
          {usercart != null && usercart != "" ? (
            <div>
              {usercart &&
                usercart.map((cart, index) => {
                  const {
                    image,
                    title,
                    price,
                    qty,
                    product_variant_id,
                    minimum_order_quantity,
                    total_allowed_quantity,
                    short_description,
                    indicator,
                    addons,
                    variants,
                    rating,
                    is_restro_open,
                    partner_id,
                  } = cart;
                  return (
                    <div key={index}>
                      <Grid container spacing={2}>
                        <Grid item md={4}>
                          <div className="offline-product-img-wrapper">
                            <img src={image} alt="product" />
                          </div>
                        </Grid>
                        <Grid item md={8}>
                          <div className="offline-product-wrapper">
                            <Typography variant="subtitle1" component="h5">
                              {title}
                            </Typography>
                            <Grid container>
                              <Grid item md={6}>
                                <Typography variant="subtitle1" component="h5">
                                  {currency}
                                  {price}× {qty}
                                </Typography>
                              </Grid>
                              {/* <Grid item md={6}>
                                <Typography variant="subtitle1" component="h5">
                                  {currency}
                                  {sub_total}
                                </Typography>
                              </Grid> */}
                            </Grid>
                            <CartModel
                              title={title}
                              short_description={short_description}
                              indicator={indicator}
                              rating={rating}
                              variants={variants}
                              minimum_order_quantity={minimum_order_quantity}
                              total_allowed_quantity={total_allowed_quantity}
                              addons={addons}
                              is_restro_open={is_restro_open}
                              partner_id={partner_id}
                              type="edit_cart"
                              product_qty={qty}
                            />
                            <Button
                              variant="text"
                              color="error"
                              onClick={() => Remove(product_variant_id)}
                            >
                              Remove
                            </Button>
                          </div>
                        </Grid>
                      </Grid>
                      <div className="border" />
                    </div>
                  );
                })}
              <Button
                variant="contained"
                fullWidth
                color="error"
                className="mb20"
                onClick={() => ClearCart()}
              >
                Clear Cart
              </Button>
            </div>
          ) : (
            <Box className="empty_cart" sx={{ padding: "20px" }}>
              <Typography> your cart is empty!</Typography>
            </Box>
          )}
        </Box>
      </Menu>
    </div>
  );
};

export default OfflineCart;
