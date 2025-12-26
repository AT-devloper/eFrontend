import React from "react";
import { Container, Row, Col } from "react-bootstrap";

const Footer = () => (
  <footer className="bg-light py-4">
    <Container>
      <Row>
        <Col className="text-center">
          <p>&copy; {new Date().getFullYear()} ShopMate. All Rights Reserved.</p>
        </Col>
      </Row>
    </Container>
  </footer>
);

export default Footer;
