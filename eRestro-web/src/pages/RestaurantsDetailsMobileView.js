import React from "react";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ProductListCard from "../components/products/ProductListCard";
import NorthEastIcon from "@mui/icons-material/NorthEast";

import { Skeleton } from "@mui/material";

const RestaurantsDetailsMobileView = ({
  products,
  categories,
  filterProducts,
  isloading,
}) => {
  return (
    <>
      {isloading ? (
        <>
          <div className="mobile-res-details mt20">
            <Skeleton
              variant="rounded"
              width="100%"
              height={60}
              className="mt20"
            />
            <Skeleton
              variant="rounded"
              width="100%"
              height={60}
              className="mt20"
            />
            <Skeleton
              variant="rounded"
              width="100%"
              height={60}
              className="mt20"
            />
          </div>
        </>
      ) : (
        <>
          <div className="mobile-res-details mt20">
            {categories &&
              categories.map((category, index) => {
                const { id, name } = category;
                return (
                  <Accordion className="mt20" key={index}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                      // onClick={(e) => {
                      //   filterProducts("", id);
                      //   console.log("vaatete",categories)
                      // }}
                    >
                      <Typography>{name}</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <div className="product-list-wrapper">
                        {products &&
                          products.map((product, index) => {
                            const {
                              id,
                              name,
                              image,
                              short_description,
                              rating,
                              indicator,
                              variants,
                              is_favorite,
                              partner_details,
                              product_add_ons,
                              total_allowed_quantity,
                              minimum_order_quantity,
                            } = product;
                            const product_id = variants[0].product_id;
                            return (
                              <div key={index} className="products-list">
                                <ProductListCard
                                  id={id}
                                  name={name}
                                  image={image}
                                  partner_name={partner_details[0].partner_name}
                                  indicator={indicator}
                                  price={variants}
                                  variants={variants}
                                  addons={product_add_ons}
                                  short_description={short_description}
                                  total_allowed_quantity={
                                    total_allowed_quantity
                                  }
                                  minimum_order_quantity={
                                    minimum_order_quantity
                                  }
                                  rating={rating}
                                  is_restro_open={
                                    partner_details[0].is_restro_open
                                  }
                                  is_favorite={is_favorite}
                                  type="products"
                                  type_id={product_id}
                                />
                              </div>
                            );
                          })}
                      </div>
                    </AccordionDetails>
                  </Accordion>
                );
              })}
          </div>
        </>
      )}
    </>
  );
};

export default RestaurantsDetailsMobileView;
