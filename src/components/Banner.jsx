import React from "react";
import { Container, Button } from "react-bootstrap";

const Banner = () => (
  <div
    style={{
      backgroundImage: "url('https://via.placeholder.com/1200x400')",
      backgroundSize: "cover",
      backgroundPosition: "center",
      height: "400px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#fff",
      textAlign: "center",
    }}
  >
    <Container>
      <h1>Discover Your Style</h1>
      <p>Exclusive deals on our top products!</p>
      <Button variant="danger" size="lg">
        Shop Now
      </Button>
    </Container>
  </div>
);

export default Banner;
