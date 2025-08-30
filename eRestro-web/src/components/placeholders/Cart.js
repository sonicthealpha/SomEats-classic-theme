import { Add } from "@mui/icons-material";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Skeleton,
  Typography,
  Grid,
  Button,
  Box,
  FormControlLabel,
  Radio,
  TextField,
} from "@mui/material";
import React from "react";
import { Container } from "react-bootstrap";

const Cart = ({ number }) => {
  const n = number;
  return [...Array(n)].map((elem, index) => (
    <span key={index}>
      <Container sx={{ mt: "30px" }}>
        <Grid container spacing={2}>
          <Grid item md={8}>
            <Card
              variant="normal"
              sx={{
                maxWidth: "100%",
                transition: "transform 0.3s, border 0.3s",
                "&:hover": {
                  transform: "translateY(-2px)",
                },
              }}
            >
              <CardContent className="product-card-content">
                <Typography
                  variant="h6"
                  component="h6"
                  className="bold"
                  color="#000"
                  width={"50%"}
                  sx={{
                    marginBottom: "1rem",
                  }}
                >
                  <Skeleton />
                </Typography>
                <CardActions sx={{ padding: "0", marginBottom: "10px" }}>
                  <Typography
                    variant="body1"
                    component="h6"
                    sx={{ flexGrow: 1 }}
                    color="#000"
                    width={"50%"}
                  >
                    <Grid container spacing={2}>
                      <Grid item md={6}>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "left",
                            p: 2,
                            border: "1px solid #ccc",
                            borderRadius: 4,
                          }}
                        >
                          <Skeleton animation="wave" height={40} width="80%" />
                          <Skeleton animation="wave" height={20} width="60%" />
                          <Skeleton animation="wave" height={20} width="40%" />
                          <Skeleton animation="wave" height={20} width="70%" />
                          <Skeleton
                            animation="wave"
                            variant="rectangular"
                            height={40}
                            width={120}
                            sx={{ mt: 2 }}
                          />
                        </Box>
                      </Grid>
                      <Grid item md={6}>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "left",
                            p: 2,
                            border: "1px solid #ccc",
                            borderRadius: 4,
                          }}
                        >
                          <Skeleton animation="wave" height={40} width="80%" />
                          <Skeleton animation="wave" height={20} width="60%" />
                          <Skeleton animation="wave" height={20} width="40%" />
                          <Skeleton animation="wave" height={20} width="70%" />
                          <Skeleton
                            animation="wave"
                            variant="rectangular"
                            height={40}
                            width={120}
                            sx={{ mt: 2 }}
                          />
                        </Box>
                      </Grid>
                      <Grid item md={6}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: 200,
                            width: "100%",
                            border: "1px solid #ccc",
                            borderRadius: 4,
                          }}
                        >
                          <Skeleton
                            variant="circular"
                            width={30}
                            height={30}
                            animation="wave"
                          />
                        </Box>
                      </Grid>
                    </Grid>
                  </Typography>
                </CardActions>
                <div className="border" />
                <CardActions sx={{ padding: "0" }}>
                  <Typography
                    variant="h6"
                    component="h6"
                    color="#838383"
                    sx={{ flexGrow: 1 }}
                  >
                    <Skeleton width={"50%"} />
                  </Typography>
                </CardActions>
              </CardContent>
            </Card>
          </Grid>
          <Grid item md={4} sx={{ margin: "auto" }}>
            <Box
              sx={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "flex-start",
                padding: "16px",
                border: "1px dashed #ccc",
                borderRadius: 4,
              }}
            >
              <Skeleton
                variant="text"
                width="50%"
                height={32}
                animation="wave"
              />
              <Skeleton
                variant="text"
                width="70%"
                height={20}
                animation="wave"
              />
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "16px",
                  gap: "5px",
                }}
              >
                <Skeleton
                  variant="circular"
                  width={20}
                  height={20}
                  animation="wave"
                />
                <Skeleton
                  variant="text"
                  width="5rem"
                  height={20}
                  animation="wave"
                />
                <Skeleton
                  variant="circular"
                  width={20}
                  height={20}
                  animation="wave"
                />
                <Skeleton
                  variant="text"
                  width="5rem"
                  height={20}
                  animation="wave"
                />
              </Box>
              <Skeleton
                variant="text"
                width="30%"
                height={16}
                animation="wave"
              />
              <Box sx={{ display: "flex", marginBottom: "16px" }}>
                <Skeleton
                  variant="text"
                  width="40%"
                  height={16}
                  animation="wave"
                />
                <Skeleton
                  variant="text"
                  width="60%"
                  height={16}
                  animation="wave"
                  sx={{ marginLeft: "16px" }}
                />
              </Box>
              <Box sx={{ display: "flex", marginBottom: "16px" }}>
                <Skeleton
                  variant="rectangular"
                  width={80}
                  height={32}
                  animation="wave"
                  sx={{ marginRight: "8px" }}
                />
                <Skeleton
                  variant="rectangular"
                  width={80}
                  height={32}
                  animation="wave"
                />
              </Box>
              <Skeleton
                variant="rectangular"
                width="100%"
                height={40}
                animation="wave"
                sx={{ marginBottom: "16px" }}
              />
              <Box sx={{ display: "flex", marginBottom: "16px" }}>
                <Skeleton
                  variant="text"
                  width="70%"
                  height={16}
                  animation="wave"
                />
                <Skeleton
                  variant="rectangular"
                  width={40}
                  height={32}
                  animation="wave"
                  sx={{ marginLeft: "8px" }}
                />
              </Box>
              <Skeleton
                variant="text"
                width="50%"
                height={16}
                animation="wave"
                sx={{ marginBottom: "8px" }}
              />
              <Skeleton
                variant="text"
                width="60%"
                height={16}
                animation="wave"
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "16px",
                }}
              >
                <Skeleton
                  variant="rectangular"
                  width="calc(25% - 4px)"
                  height={32}
                  animation="wave"
                />
                <Skeleton
                  variant="rectangular"
                  width="calc(25% - 4px)"
                  height={32}
                  animation="wave"
                />
                <Skeleton
                  variant="rectangular"
                  width="calc(25% - 4px)"
                  height={32}
                  animation="wave"
                />
                <Skeleton
                  variant="rectangular"
                  width="calc(25% - 4px)"
                  height={32}
                  animation="wave"
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  marginTop: "16px",
                }}
              >
                <Skeleton
                  variant="rectangular"
                  width="95%"
                  height={32}
                  animation="wave"
                  sx={{ marginRight: "16px" }}
                />
                <Skeleton
                  variant="rectangular"
                  width="5%"
                  height={32}
                  animation="wave"
                />
              </Box>
              {[1, 2, 3, 4, 5].map((line) => (
                <Skeleton
                  key={line}
                  variant="text"
                  width="100%"
                  height={16}
                  animation="wave"
                  sx={{ marginTop: "16px" }}
                />
              ))}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </span>
  ));
};

export default Cart;
