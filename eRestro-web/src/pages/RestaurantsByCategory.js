import React, { useState, useEffect } from "react";
import Layout from "../components/layouts/Layout";
import Breadcrumbs from "../components/breadcrumbs";
import { Container } from "@mui/system";
import { useParams } from "react-router";
import * as api from "../utils/api";
import ProductFlatCard from "../components/products/ProductFlatCard";
import { Grid, Pagination, Typography } from "@mui/material";
import Nofound from "./Nofound";
import { useTranslation } from "react-i18next";

const RestaurantsByCategory = () => {
  const { slug } = useParams();
  const [products, setProducts] = useState([]);
  const { t } = useTranslation();
  const [per_page] = useState(8);
  const [page, setPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);

  const get_products = (offset = 0) => {
    api
      .get_products("", slug, "", "", "", "", "", per_page, offset)
      .then((response) => {
        if (!response.error) {
          var totalPages = parseInt(response.total) / per_page;
          totalPages = Math.ceil(totalPages);
          setPage(totalPages);
          setProducts(response.data);
        }
      })
      .catch(() => {});
  };
  useEffect(() => {
    get_products();
    // eslint-disable-next-line
  }, [slug]);

  const handlePageChange = (event, selectedPage) => {
    if (currentPage != selectedPage) {
      const offset = (selectedPage - 1) * per_page;
      setCurrentPage(selectedPage);
      get_products(offset);
    }
  };

  return (
    <Layout title={`Restaurants for ${products[0] && products[0].category_name}`}>
      <Breadcrumbs
        title={`Restaurants for ${products[0] && products[0].category_name}`}
        crumb={t("categories")}
        // partner_name={
        //   products[0] && products[0].partner_details[0].partner_name
        // }
        crumb_link="/restaurants"
        link={`/restaurant/${
          products[0] && products[0].partner_details[0].slug
        }`}
        category={products[0] && products[0].category_name}
      />
      {products != 0 ? (
        <>
          <Container>
            <div className="title-wrapper" data-aos="fade-up">
              <Typography variant="h4" component="h4" className="bold">
                {t("Restaurants_for")}{" "}
                <span className="highlight">
                  {products[0] && products[0].category_name}
                </span>
              </Typography>
              <Typography weight="light">
                {t("top_most_restaurants")}
              </Typography>
            </div>
            <Grid container spacing={2}>
              {products &&
                products.map((product, index) => {
                  const {
                    name,
                    image_md,
                    variants,
                    partner_details,
                    is_favorite
                  } = product;
                  const product_id = variants[0].product_id;

                  return (
                    <Grid item md={3} key={index}>
                      <ProductFlatCard
                        title={partner_details[0].partner_name}
                        des={name}
                        image={image_md}
                        price={variants[0].price}
                        rating={partner_details[0].partner_rating}
                        cooking_time={partner_details[0].partner_cook_time}
                        partner_indicator={partner_details[0].partner_indicator}
                        open={partner_details[0].is_restro_open}
                        is_favorite={is_favorite}
                        slug={partner_details[0].slug}
                        type="products"
                        type_id={product_id}
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
                defaultPage={currentPage}
              />
            </div>
          </Container>
        </>
      ) : (
        <>
          <Nofound />
        </>
      )}
    </Layout>
  );
};

export default RestaurantsByCategory;
