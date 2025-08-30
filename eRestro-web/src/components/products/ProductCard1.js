import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
  Typography
} from "@mui/material";
import React from "react";
import FavoriteIcon from "@mui/icons-material/Favorite";
import StarRateIcon from "@mui/icons-material/StarRate";
import { Link } from "react-router-dom";

const ProductCard1 = ({ image, name, rating, category_name, price, slug }) => {
  return (
    <Link to="/restaurants">
      <Card
        variant="outlined"
        sx={{
          maxWidth: 365,
          borderRadius: "15px",
          transition: "transform 0.3s, border 0.3s",
          "&:hover": {
            transform: "translateY(-2px)"
          }
        }}
      >
        <CardContent className="product-card-content">
          <div className="restaurant-img-wrapper">
            <CardMedia
              className="mb20"
              component="img"
              alt={name}
              height="240"
              image={image}
            />
          </div>
          <IconButton aria-label="add to favorites" className="favorites">
            <FavoriteIcon />
          </IconButton>
          <Typography variant="h6" component="h6" className="bold" color="#000">
            {name.substring(0, 20)}
          </Typography>
          <CardActions sx={{ padding: "0", marginBottom: "10px" }}>
            <Typography
              variant="subtitle1"
              component="h6"
              sx={{ flexGrow: 1 }}
              color="#000"
            >
              {category_name}
            </Typography>
            <div className="rated">
              {rating}
              <StarRateIcon />
            </div>
          </CardActions>
          <div className="border" />
          <CardActions sx={{ padding: "0" }}>
            <Typography
              variant="subtitle1"
              component="h6"
              color="#838383"
              sx={{ flexGrow: 1 }}
            >
              {price} for one
            </Typography>
          </CardActions>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard1;
