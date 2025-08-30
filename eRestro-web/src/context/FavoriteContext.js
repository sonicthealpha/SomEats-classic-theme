import React, { createContext, useState, useContext } from "react";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import * as api from "../utils/api";
import { isLogin } from "../utils/functions";

const Favorites = createContext();

export function useFavorites() {
  return useContext(Favorites);
}

export function FavoriteContext({ children }) {
  const [favorites, setFavorites] = useState([]);
  const [per_page] = useState(3);
  const [page, setPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [favType, setFavType] = useState();

  const get_favorites = (type, offset = 0) => {
    setFavType(type);
    api.get_favorites(type, per_page, offset).then((response) => {
      // console.log(response);
      if (response !== undefined && !response.error) {
        var totalPages = parseInt(response.total) / per_page;
        totalPages = Math.ceil(totalPages);
        setPage(totalPages);
        setFavorites(response.data);
      }
    });
  };

  const add = (type, id) => {
    api.add_to_favorites(type, id).then((response) => {
      if (isLogin()) {
        if (response.error) {
          toast.success(response.message);
        } else {
          setFavorites(response.data);
          toast.success("Item Added to Favorites");
        }
      } else {
        toast.error("Please Login!");
      }
    });
  };

  const remove = (type, id) => {
    api.remove_from_favorites(type, id).then((response) => {
      if (response !== undefined && !response.error) {
        setFavorites((favorites) => {
          return favorites.filter((_, index) => index != id);
        });
        get_favorites(type);
        toast.error("Item Removed from Favorites");
      }
    });
  };

  const handlePageChange = (event, selectedPage) => {
    if (currentPage != selectedPage) {
      const offset = (selectedPage - 1) * per_page;
      setCurrentPage(selectedPage);
      get_favorites(favType, offset);
    }
  };

  useEffect(() => {
    if (isLogin() === true) {
      get_favorites();
      remove();
    }
    // eslint-disable-next-line
  }, []);

  const value = {
    favorites,
    setFavorites,
    get_favorites,
    remove,
    add,
    currentPage,
    handlePageChange,
    page,
    setCurrentPage,
  };

  return <Favorites.Provider value={value}>{children}</Favorites.Provider>;
}
