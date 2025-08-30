
import React from "react";
import { Card, CardContent, CardCover, Typography } from "@mui/joy";
import { LocalActivity } from "@mui/icons-material";
import { Link } from "react-router-dom";

const CategoryCard = ({
    id,
    name,
    slug,
    text,
    image,
    banner,
    status
}) => {


    return (
        <Link
            to={"/categories/" + slug}
            underline="none"
        >
            <Card sx={{ minHeight: '280px', width: "280px", maxWidth:"100%" }}>
                <CardCover>
                    <img
                        src={image}
                        loading="lazy"
                        alt=""
                    />
                </CardCover>
                <CardCover
                    sx={{
                        background:
                            'linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0) 200px), linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0) 300px)',
                    }}
                />
                <CardContent sx={{ justifyContent: 'flex-end' }}>
                    <Typography level="title-lg" textColor="#fff">
                        {name}
                    </Typography>
                    <Typography
                        startDecorator={<LocalActivity />}
                        textColor="neutral.300"
                    >
                        {text}
                    </Typography>
                </CardContent>
            </Card>
        </Link>

    );
};

export default CategoryCard;
