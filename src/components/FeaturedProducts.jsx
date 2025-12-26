import React from "react";
import ProductCard from "./ProductCard";
import { Container, Row, Col } from "react-bootstrap";

const dummyProducts = [
  { name: "Sneakers", price: 50, image: "https://via.placeholder.com/200" },
  { name: "Watch", price: 120, image: "https://via.placeholder.com/200" },
  { name: "Bag", price: 80, image: "https://via.placeholder.com/200" },
  { name: "Sunglasses", price: 60, image: "https://via.placeholder.com/200" },
];

const FeaturedProducts = () => (
  <Container className="my-5">
    <h2 className="text-center mb-4">Featured Products</h2>
    <Row className="justify-content-center">
      {dummyProducts.map((product, idx) => (
        <Col key={idx} xs={12} sm={6} md={4} lg={3}>
          <ProductCard product={product} />
        </Col>
      ))}
    </Row>
  </Container>
);

export default FeaturedProducts;
