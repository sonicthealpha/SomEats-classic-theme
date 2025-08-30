import React, { createContext, useState, useEffect, useContext } from "react";
import { toast } from "react-hot-toast";
import * as api from "../utils/api";
import { isLogin } from "../utils/functions";

const UserCart = createContext();

export function useCart() {
  return useContext(UserCart);
}

export function CartContext({ children }) {
  const [usercart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cartTotal, setCartTotal] = useState([]);
  const [tax_amount, setTax] = useState();
  const [cartData, setCartData] = useState();

  //   offfline cart

  const getElementsfromLocalStorage = () => {
    let elements = [];
    if (localStorage.getItem("cart")) {
      elements = JSON.parse(localStorage.getItem("cart"));
      setCart(elements);
      const count = JSON.parse(localStorage.cart).length;
      setCartTotal(count);
    }
    return elements;
  };

  //add to cart

  const store_data = (
    variant_id,
    quantity,
    addonsId,
    title,
    item_price,
    image,
    partner_id,
    minimum_order_quantity,
    total_allowed_quantity,
    short_description,
    indicator,
    addons,
    variants,
    rating,
    is_restro_open
  ) => {
    const cart_item = {
      image: image,
      title: title,
      price: item_price,
      product_variant_id: variant_id,
      qty: quantity,
      addonsId: addonsId,
      partner_id: partner_id,
      minimum_order_quantity: minimum_order_quantity,
      total_allowed_quantity: total_allowed_quantity,
      short_description: short_description,
      indicator: indicator,
      addons: addons,
      variants: variants,
      rating: rating,
      is_restro_open: is_restro_open,
    };
    var cart = localStorage.getItem("cart");
    cart = localStorage.getItem("cart") != null ? JSON.parse(cart) : null;

    if (cart != null && cart != undefined) {
      if (cart.length > 0) {
        let is_item_present = false;
        for (let i = 0; i < cart.length; i++) {
          if (cart[i].partner_id == partner_id) {
            if (cart[i].product_variant_id == variant_id) {
              is_item_present = true;
              break;
            }
          } else {
            toast.error(
              "only items from one restaurant at a time are allowed in cart."
            );
            return false;
          }
        }

        if (!is_item_present) {
          // add multiple cart data with same partner
          cart.push(cart_item);
          localStorage.setItem("cart", JSON.stringify(cart));
          toast.success("Item added to cart");
        } else {
          // edit cart data
          let data = getElementsfromLocalStorage();
          for (let i = 0; i < data.length; i++) {
            if (data[i].product_variant_id == variant_id) {
              data[i].qty = quantity;
              data[i].sub_total = data[i].price * quantity;
            }
          }
          localStorage.setItem("cart", JSON.stringify(data));
          let elements = [];
          if (localStorage.getItem("cart")) {
            elements = JSON.parse(localStorage.getItem("cart"));
            setCart(elements);
            toast.success("Item added to cart");
          }
          return elements;
        }
      } else {
        cart.push(cart_item);
        toast.success("Item added to cart");
      }
    } else {
      cart = [cart_item];
      toast.success("Item added to cart");
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    getElementsfromLocalStorage();
  };

  //   remove data

  const Remove_data = (product_id) => {
    let elements = getElementsfromLocalStorage();
    elements = elements.filter(
      (element) => element.product_variant_id != product_id
    );
    localStorage.setItem("cart", JSON.stringify(elements));
    localStorage.removeItem("item_price");
    getElementsfromLocalStorage();
    toast.error("Item Removed from cart successfully..!!");
  };

  //   clear offline cart

  const ClearOfflineCart = () => {
    localStorage.removeItem("cart");
    setCart("");
    localStorage.removeItem("item_price");
    setCartTotal("");
    getElementsfromLocalStorage();
  };

  //   with login cart

  //   get cart

  const get_cart = () => {
    setLoading(true);
    api
      .get_user_cart()
      .then((response) => {
        setLoading(false);
        if (!response.error) {
          setCartData(response);
          setCart(response.data);
          setTax(response.tax_amount);
          const cart_total = localStorage.getItem("cart_total");
          setCartTotal(cart_total);
        }
      })
      .catch(() => {});
  };

  //   add to cart
  const addToCart = (variant_id, quantity, addonsId) => {
    api
      .add_to_cart(variant_id, quantity, "", "", addonsId, quantity)
      .then((response) => {
        if (response.error) {
          toast.error(response.message);
        } else {
          setCart(usercart, response.data);
          localStorage.setItem("cart_total", response.data.total_items);
          const cart_total = localStorage.getItem("cart_total");
          setCartTotal(cart_total);
          toast.success(response.message);
          get_cart();
        }
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  // remove from cart

  const RemoveCartData = (product_variant_id) => {
    api
      .remove_from_cart(product_variant_id)
      .then((response) => {
        if (response.error) {
          console.log(response.message);
        } else {
          setCart("");
          toast.error("Item Removed from cart successfully..!!");
          localStorage.setItem("cart_total", response.data.total_items);
          const cart_total = localStorage.getItem("cart_total");
          setCartTotal(cart_total);
          get_cart();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  //   clear cart

  const clearCart = () => {
    api
      .clearCart()
      .then((response) => {
        if (response.error) {
          console.log(response.message);
        } else {
          setCart("");
          toast.error("Item Removed from cart successfully..!!");
          localStorage.removeItem("cart_total");
          setCartTotal("");
          get_cart();
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    getElementsfromLocalStorage();
    if (isLogin()) {
      get_cart();
    }
    // eslint-disable-next-line
  }, []);

  return (
    <UserCart.Provider
      value={{
        usercart,
        addToCart,
        RemoveCartData,
        cartTotal,
        tax_amount,
        cartData,
        clearCart,
        store_data,
        Remove_data,
        get_cart,
        ClearOfflineCart,
        loading,
      }}
    >
      {children}
    </UserCart.Provider>
  );
}
