import React from "react";
import ProductCard from "./ProductCard";
import { Container, Row, Col } from "react-bootstrap";

const products = [
  { name: "Gold Necklace", price: 450, image: "/assets/products/necklace.jpg" },
  { name: "Diamond Ring", price: 1250, image: "/assets/products/diamond-ring.jpg" },
  { name: "Stud Earrings", price: 280, image: "/assets/products/earrings.jpg" },
];

const FeaturedProducts = () => (
  <Container className="py-5">
    <h2 className="text-center text-uppercase mb-4">Our Bestsellers</h2>
    <Row className="g-4 justify-content-center">
      {products.map((p, i) => (
        <Col key={i} xs={12} sm={6} md={4} lg={3}>
          <ProductCard product={p} />
        </Col>
      ))}
    </Row>
  </Container>
);

export default FeaturedProducts;
