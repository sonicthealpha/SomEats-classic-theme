import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
  Slide,
  FormGroup,
  Checkbox,
} from "@mui/material";
import React, { useState, forwardRef } from "react";
import StarRateIcon from "@mui/icons-material/StarRate";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { useCart } from "../../context/CartContext";
import { isLogin } from "../../utils/functions";
import { useEffect } from "react";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { useSelector } from "react-redux";
import { selectData } from "../../store/reducers/settings";
import { useTranslation } from "react-i18next";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CartModel = ({
  title,
  short_description,
  indicator,
  rating,
  variants,
  minimum_order_quantity,
  total_allowed_quantity,
  addons,
  is_restro_open,
  image,
  partner_id = "",
  product_qty = "",
  type = "",
}) => {
  const [open, setOpen] = useState(false);
  const [totalCost, setTotalCost] = useState(0);
  const [selectedProductVariant, setProductVariant] = useState(0);
  const [addonsId, setAddOnsId] = useState([]);
  const data = useSelector(selectData);
  const currency = data.currency;
  const { addToCart, store_data } = useCart();
  const [variantId, setVariantId] = useState([]);
  const { t } = useTranslation();

  const [quantity, setQunatity] = useState(
    parseInt(product_qty != 0 ? product_qty : 1)
  );

  const total_quantity = total_allowed_quantity ? total_allowed_quantity : 100;

  useEffect(() => {
    const id =
      variantId != 0 && variantId != null
        ? variantId
        : variants && variants[0].id;
    setVariantId(id);
    // eslint-disable-next-line
  }, []);

  //open dailog

  const handleClickOpen = () => {
    setOpen(true);
  };

  //close dailog
  const handleClose = () => {
    setOpen(false);
  };

  //decrement quantity
  const handleDecrement = (data) => {
    if (quantity > data) {
      setQunatity((prevCount) => prevCount - 1);
    }
  };

  //increment quantity
  const handleIncrement = (data) => {
    if (quantity < data) {
      setQunatity((prevCount) => prevCount + 1);
    }
  };

  const handleInput = (add, add_on_id, event) => {
    if (event.target.checked) {
      setAddOnsId([
        ...addonsId,
        {
          add_on_id,
        },
      ]);
      setTotalCost((total) => total + parseInt(add.price));
    } else {
      // remove from list
      setAddOnsId(
        addonsId.filter((addons_data) => addons_data.id != add_on_id)
      );
      setTotalCost((total) => total - parseInt(add.price));
    }
    // if (event.target.checked) {
    //   setAddonsInfo((cartItem) => [cartItem, add_on_id]);
    //   setTotalCost((total) => total + parseInt(add.price));
    //   setAddOnsId(add_on_id);
    // } else {
    //   setTotalCost((total) => total - parseInt(add.price));
    //   setAddOnsId("");
    // }
  };

  const VariantsOnChnage = (variant_id, price) => {
    setVariantId(variant_id);
    setProductVariant(parseFloat(price));
  };

  const addons_id = addonsId.map((item) => item.add_on_id).join(", ");

  //   calculations

  let item_price = variants
    ? variants[0].special_price > 0 &&
      variants[0].price &&
      variants[0].special_price < variants[0].price
      ? variants[0].special_price
      : variants[0].price
    : 0;

  let addons_price = totalCost;

  item_price = parseFloat(item_price);
  addons_price = parseFloat(addons_price);

  const default_price = variants
    ? variants[0].special_price > 0 &&
      variants[0].price &&
      variants[0].special_price < variants[0].price
      ? variants[0].special_price
      : variants[0].price
    : 0;

  const variant_price_count = parseFloat(
    selectedProductVariant ? selectedProductVariant : default_price
  );

  const grand_total = (addons_price + variant_price_count) * quantity;

  const cart_total = grand_total ? grand_total : default_price;

  const difference = parseFloat(
    variants && variants[0].price - variants[0].special_price
  );

  const variant_price = parseFloat(variants && variants[0].price);

  const discount = ((difference / variant_price) * 100).toFixed(0);

  //   API

  const manage_cart = (
    variantId_data,
    quantity_data,
    addonsId_data,
    title_data,
    item_price_data,
    image_data,
    partner_id_data
  ) => {
    // eslint-disable-next-line
    {
      isLogin()
        ? addToCart(variantId_data, quantity_data, addonsId_data)
        : store_data(
            variantId_data,
            quantity_data,
            addonsId_data,
            title_data,
            item_price_data,
            image_data,
            partner_id_data,
            minimum_order_quantity,
            total_allowed_quantity,
            short_description,
            indicator,
            addons,
            variants,
            rating,
            is_restro_open
          );
      // eslint-disable-next-line
    }

    handleClose(true);
  };

  const discounted_price =
    variants && variants[0].price == item_price
      ? null
      : variants && variants[0].price;

  return (
    <>
      {type != 0 && type != null ? (
        <Button variant="text" color="primary" onClick={handleClickOpen}>
          <ArrowRightIcon />
          {t("edit")}
        </Button>
      ) : (
        <Button variant="outlined" color="error" onClick={handleClickOpen}>
          + {t("add")}
        </Button>
      )}

      {/* cart model */}

      {is_restro_open && is_restro_open == 1 ? (
        <>
          <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            className="test"
            onClose={handleClose}
            maxWidth={"md"}
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle>
              <span className="highlight pop_title">{title}</span>
              <p className="short_description">{short_description}</p>
              <div className="price_content">
                <Typography
                  variant="body1"
                  component="h5"
                  sx={{ marginRight: "7px", fontWeight: "500", color: "green" }}
                >
                  {currency}
                  {item_price}
                </Typography>
                {variants[0].price == item_price ? null : (
                  <>
                    <Typography
                      variant="body1"
                      component="h5"
                      sx={{ color: "#908c8c" }}
                    >
                      {currency}
                      <s>{discounted_price}</s>
                    </Typography>
                  </>
                )}
                {rating > 0.0 ? (
                  <div className="rated">
                    {rating}
                    <StarRateIcon className="staricon" />
                  </div>
                ) : null}
              </div>
              <div className="icon_discount">
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
                {discount != "NaN" && discount != 0.0 && discount != 100 ? (
                  <span className="discount_off">{discount}% OFF</span>
                ) : null}
              </div>
            </DialogTitle>
            <DialogContent className="border">
              <div className="quantity_sec">
                <div className="quatity_title">
                  <p>Quantity </p>
                </div>
                <div className="add_minus_quantity">
                  <span className="minus_icon">
                    <RemoveIcon
                      className={
                        quantity > 1 ? "minus_quantity2" : "minus_quantity"
                      }
                      onClick={() => handleDecrement(minimum_order_quantity)}
                    />
                  </span>
                  <input type="text" placeholder={quantity} readOnly />
                  <span className="plus_icon">
                    <AddIcon
                      className="plus_quantity"
                      onClick={() => handleIncrement(total_quantity)}
                    />
                  </span>
                </div>
              </div>

              <div className="variants">
                {variants[0].variant_values != "" ? (
                  <FormControl sx={{ width: "100%" }}>
                    <Typography
                      variant="subtitle1"
                      component="h5"
                      sx={{ color: "#000" }}
                    >
                      {variants[0].attr_name}
                    </Typography>

                    <Grid container spacing={2}>
                      <Grid item md={6} className="product-extra-addons">
                        {variants.map((variant, index) => {
                          return (
                            <div className="addons-name" key={index}>
                              {variant.variant_values}
                            </div>
                          );
                        })}
                      </Grid>
                      <Grid item md={6}>
                        <RadioGroup
                          aria-labelledby="demo-radio-buttons-group-label"
                          name="radio-buttons-group"
                          color="error"
                          defaultValue={
                            variants[0].special_price > 0 &&
                            variants[0].special_price < variants[0].price
                              ? variants[0].special_price
                              : variants[0].price
                          }
                        >
                          {variants &&
                            variants.map((variant, index) => {
                              let item_price =
                                variant.special_price > 0 &&
                                variant.special_price < variant.price
                                  ? variant.special_price
                                  : variant.price;
                              return (
                                <div
                                  className="addons-price-wrapper"
                                  key={index}
                                >
                                  <FormControlLabel
                                    value={item_price}
                                    control={
                                      <Radio
                                        color="error"
                                        sx={{ padding: "0px" }}
                                      />
                                    }
                                    label={`${currency} ${item_price}`}
                                    onChange={() =>
                                      VariantsOnChnage(variant.id, item_price)
                                    }
                                    labelPlacement="start"
                                    sx={{ color: "green" }}
                                  />
                                </div>
                              );
                            })}
                        </RadioGroup>
                      </Grid>
                    </Grid>
                  </FormControl>
                ) : null}
              </div>

              <div className="add-ons">
                {addons != "" ? (
                  <>
                    <Typography
                      variant="subtitle1"
                      component="h5"
                      sx={{ color: "#000" }}
                    >
                      {t("add_ons")}
                    </Typography>

                    <div className="addons-price">
                      <Grid container>
                        <Grid item md={6} className="product-extra-addons">
                          {addons.map((add, index) => {
                            return (
                              <div className="addons-name" key={index}>
                                <Typography>{add.title}</Typography>
                              </div>
                            );
                          })}
                        </Grid>
                        <Grid item md={6}>
                          <div className="addons-price">
                            <FormGroup>
                              {addons.map((add, index) => {
                                const add_on_id = add.id;
                                return (
                                  <div
                                    key={index}
                                    className="addons-price-wrapper"
                                  >
                                    <FormControlLabel
                                      control={
                                        <Checkbox
                                          color="error"
                                          sx={{ padding: "0px" }}
                                        />
                                      }
                                      value={add.price}
                                      name="addons"
                                      id={add.id}
                                      label={`${currency} ${add.price}`}
                                      labelPlacement="start"
                                      onChange={(event) =>
                                        handleInput(add, add_on_id, event)
                                      }
                                    />
                                  </div>
                                );
                              })}
                            </FormGroup>
                          </div>
                        </Grid>
                      </Grid>
                    </div>
                  </>
                ) : null}
              </div>
            </DialogContent>
            <DialogActions className="price_add_to_Cart">
              <div className="price_update">
                {quantity} |{" "}
                <Typography component={"span"} sx={{ color: "green" }}>
                  {currency}
                  {cart_total ? cart_total : item_price}
                </Typography>
              </div>
              <Button
                onClick={(e) =>
                  manage_cart(
                    variantId,
                    quantity,
                    addons_id,
                    title,
                    item_price,
                    image,
                    partner_id
                  )
                }
                variant="contained"
                sx={{ backgroundColor: "var(--primary-color--)" }}
                className="pop_up_add_to_cart"
              >
                {t("add_to_cart")}
              </Button>
            </DialogActions>
          </Dialog>
        </>
      ) : (
        <>
          <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            maxWidth={"lg"}
            onClose={handleClose}
            className="restaurant_dialog"
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogContent className="restaurant_close">
              <>
                <div className="service-unavailable-img">
                  <img
                    src={process.env.PUBLIC_URL + "/images/6463392.jpg"}
                    alt="unavailable"
                  />
                </div>
                <div className="className">
                  {t("currently_service_is_unavailable")}
                </div>
              </>
            </DialogContent>
          </Dialog>
        </>
      )}
    </>
  );
};

export default CartModel;
