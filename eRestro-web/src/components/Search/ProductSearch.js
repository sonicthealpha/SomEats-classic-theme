import * as React from "react";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import SearchIcon from "@mui/icons-material/Search";
import * as api from "../../utils/api";
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { Box } from "@mui/material";

const ProductSearch = ({
  setProducts,
  restaurant_slug,
  category,
  setSearch,
  search,
}) => {
  const SearchIconWrapper = styled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }));
  const { t } = useTranslation();

  //   product search

  const handleSearch = (event) => {
    setSearch(event.target.value);
    api
      .get_products(
        "",
        "",
        category,
        search,
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
        "p.id",
        "",
        restaurant_slug
      )
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        toast.error(error.message);
      });
  };

  return (
    <Box className="mt20 d-none" sx={{ position: "relative", float: "right" }}>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <InputBase
        className="product-search"
        sx={{ ml: 1, flex: 1 }}
        placeholder={t("search_food")}
        inputProps={{ "aria-label": t("search_food") }}
        onChange={(e) => handleSearch(e)}
      />
    </Box>
  );
};

export default ProductSearch;
