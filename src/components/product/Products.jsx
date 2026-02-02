import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import sellerApi from "../../api/sellerApi";
import { useCart } from "../../context/CartContext.jsx";
import SellerLayout from "../../layouts/SellerLayout.jsx"; // Include navbar & footer
import softDarkTheme from "../../theme.js";
import {
  ThemeProvider,
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Grid,
} from "@mui/material";

const Products = () => {
  const [products, setProducts] = useState([]);
  const { cart, addToCart } = useCart();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await sellerApi.getProductListing();

        // Normalize products with placeholder images & empty variants
        const normalized = data.map((p) => ({
          ...p,
          image: "/placeholder.png",
          variants: p.variants || [],
        }));

        setProducts(normalized);

        // Fetch real images
        const imagesData = await Promise.all(
          normalized.map((p) =>
            sellerApi
              .getProductImages(p.productId)
              .then((images) => images[0]?.imageUrl || "/placeholder.png")
              .catch(() => "/placeholder.png")
          )
        );

        setProducts((prev) =>
          prev.map((p, i) => ({ ...p, image: imagesData[i] }))
        );
      } catch (err) {
        console.error("Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToCart = async (e, product) => {
    e.stopPropagation();

    if (!product.variants.length) {
      alert("This product has no variants and cannot be added to cart");
      return;
    }

    const variantId = product.variants[0].id;

    try {
      await addToCart({
        productId: product.productId,
        variantId,
        quantity: 1,
      });
    } catch (err) {
      console.error("Failed to add item to cart:", err);
      alert("⚠️ Could not add to cart");
    }
  };

  if (loading)
    return (
      <SellerLayout>
        <Box textAlign="center" mt={5}>
          <CircularProgress />
        </Box>
      </SellerLayout>
    );

  if (!products.length)
    return (
      <SellerLayout>
        <Box textAlign="center" mt={5}>
          <Typography>No products found.</Typography>
        </Box>
      </SellerLayout>
    );

  return (
    <ThemeProvider theme={softDarkTheme}>
      <SellerLayout>
        <Box className="container" mt={4} px={{ xs: 2, md: 4 }}>
          <Typography variant="h4" color="primary" mb={3}>
            My Products
          </Typography>

          <Grid container spacing={4}>
            {products.map((p) => {
              const variantId = p.variants?.[0]?.id;
              const inCart =
                variantId &&
                cart.some(
                  (ci) => ci.productId === p.productId && ci.variantId === variantId
                );

              return (
                <Grid item xs={12} sm={6} md={4} key={p.productId}>
                  <Card
                    sx={{
                      cursor: "pointer",
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "transform 0.3s, box-shadow 0.3s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 12px 32px rgba(0,0,0,0.11)",
                      },
                    }}
                    onClick={() => navigate(`/products/${p.productId}`)}
                  >
                    <CardMedia
                      component="img"
                      image={p.image}
                      alt={p.name}
                      sx={{
                        height: 200,
                        objectFit: "cover",
                        transition: "transform 0.3s ease",
                        "&:hover": { transform: "scale(1.05)" },
                      }}
                    />

                    <CardContent
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          {p.name}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary">
                          ₹{p.price?.toFixed(2) || "0.00"}
                        </Typography>
                        <Typography variant="body2" color="secondary">
                          {p.brand}
                        </Typography>
                      </Box>

                      <Button
                        variant="contained"
                        color={inCart ? "secondary" : "primary"}
                        disabled={inCart || !variantId}
                        onClick={(e) => handleAddToCart(e, p)}
                        sx={{ mt: 2 }}
                      >
                        {!variantId
                          ? "Variant Missing"
                          : inCart
                          ? "Already in Cart"
                          : "Add to Cart"}
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </SellerLayout>
    </ThemeProvider>
  );
};

export default Products;
