import { useContext, useState, useEffect, createContext } from "react";
import { toast } from "react-hot-toast";
import * as api from "../utils/api";

const SearchContext = createContext();

export function useSearch() {
  return useContext(SearchContext);
}

export function SearchProvider({ children }) {
  const [restaurants, setRestaurants] = useState([]);
  const [products, setProduct] = useState();
  const [isLoading, setLoading] = useState();
  const [city, setCity] = useState();
  const [categories, setCategory] = useState();

  const city_deliverable = (deliverable_city) => {
    return api
      .is_city_deliverable(deliverable_city)
      .then((response) => {
        if (response.city_id != null) {
          localStorage.setItem("city", response.city_id);
          const deliverable_city_data = localStorage.getItem("city");
          setCity(deliverable_city_data);
          return response;
        } else {
          localStorage.removeItem("city");
          toast.error(response.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // get restaurant

  const get_restaurants = (city_data, limit = 8) => {
    api.get_partners("", "", city_data, "", 1, limit).then((response) => {
      if (response.error) {
        setRestaurants(null);
      } else {
        setLoading(false);
        setRestaurants(response.data);
      }
    });
  };

  // get top rated foods

  const get_products = (city) => {
    api
      .get_products(
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        city,
        ""
      )
      .then((response) => {
        if (response.error) {
          setProduct(null);
        } else {
          setLoading(false);
          setProduct(response.data);
        }
      })
      .catch(() => {});
  };

  //   get_categories

  const get_categories = () => {
    api
      .get_categories()
      .then((response) => {
        if (!response.error) {
          setCategory(response.data);
          setLoading(false);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    get_restaurants(localStorage.getItem("city"));
    get_products(localStorage.getItem("city"));
    // eslint-disable-next-line
  }, []);

  const value = {
    restaurants,
    setRestaurants,
    products,
    setProduct,
    isLoading,
    setLoading,
    get_restaurants,
    city_deliverable,
    city,
    setCity,
    get_products,
    get_categories,
    categories,
    setCategory,
  };

  return (
    <SearchContext.Provider value={value}>
      {!isLoading && children}
    </SearchContext.Provider>
  );
}
