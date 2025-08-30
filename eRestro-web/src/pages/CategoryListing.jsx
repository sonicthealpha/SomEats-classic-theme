import { Typography, Grid, Pagination } from "@mui/material";
import { Container } from "@mui/system";
import React, { useState } from "react";
import Layout from "../components/layouts/Layout";
import Breadcrumbs from "../components/breadcrumbs";
import * as api from "../utils/api";
import ResPlaceholder from "../components/placeholders/ResPlaceholder";
import { useTranslation } from "react-i18next";
import Highlighter from "react-highlight-words";
import Nofound from "./Nofound";
import { useEffect } from "react";
import CategoryCard from "../components/products/CategoryCard";

const CategoryListing = () => {
    const { t } = useTranslation();
    const [categories, setcategories] = useState();
    const [isLoading, setLoading] = useState(true);
    const per_page = 5;
    const [page, setPage] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);
    const [foodType, setFoodType] = useState("");

    const handlePageChange = (event, selectedPage) => {
        if (currentPage !== selectedPage) {
            const offset = (selectedPage - 1) * per_page;
            setLoading(true);
            setCurrentPage(selectedPage);
            get_categories(offset, foodType);
        }
    };

    useEffect(() => {
        get_categories();
        // eslint-disable-next-line
    }, []);

    const get_categories = (offset = 0, food_type) => {
        api
            .get_categories("", per_page, offset)
            .then((response) => {
                var totalPages = parseInt(response.total) / per_page;
                totalPages = Math.ceil(totalPages);
                setPage(totalPages);
                setLoading(false);
                setcategories(response.data);
            });
    };

    return (
        <Layout title={t("category_crumb")}>
            <Breadcrumbs
                title={t("category_crumb")}
                crumb={t("category_crumb")}
            />
            {categories && categories !== null ? (
                <>
                    <Container>
                        <div className="title-wrapper">
                            <Typography variant="h4" component="h4" className="bold">
                                <Highlighter
                                    highlightClassName="highlight"
                                    searchWords={["categories"]}
                                    autoEscape={true}
                                    textToHighlight={t("top_categories")}
                                />
                            </Typography>
                            <Typography>{t("top_most_categories")}</Typography>
                        </div>

                        <div className="categories-list-wrapper">
                            {categories && categories !== null ? (
                                <>
                                    <Grid container spacing={2}>
                                        {isLoading ? (
                                            <ResPlaceholder number={8} />
                                        ) : (
                                            <>
                                                {categories &&
                                                    categories.map((product, index) => {
                                                        const {
                                                            id,
                                                            name,
                                                            slug,
                                                            text,
                                                            image,
                                                            banner,
                                                            status
                                                        } = product;
                                                        return (
                                                            <Grid
                                                                item
                                                                xl={3}
                                                                md={3}
                                                                key={index}
                                                                // className="res-card"
                                                            >
                                                                <CategoryCard
                                                                    id={id}
                                                                    name={name}
                                                                    slug={slug}
                                                                    text={text}
                                                                    image={image}
                                                                    banner={banner}
                                                                    status={status}
                                                                />
                                                            </Grid>
                                                        );
                                                    })}
                                            </>
                                        )}
                                    </Grid>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <div className="not-found-res">
                                            <img
                                                src={process.env.PUBLIC_URL + "/images/oopsie.gif"}
                                                alt="not-found"
                                            />
                                        </div>
                                        <Typography
                                            variant="h6"
                                            component="h5"
                                            sx={{ textAlign: "center" }}
                                        >
                                            sorry, online ordering isn't available at your location.
                                        </Typography>
                                    </div>
                                </>
                            )}
                        </div>
                        <div className="pagination">
                            <Pagination
                                count={page}
                                color="error"
                                variant="outlined"
                                shape="rounded"
                                onChange={handlePageChange}
                                page={currentPage}
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

export default CategoryListing;
