import React, { useState } from "react";
import { Navbar, Nav, Container, Button, Modal } from "react-bootstrap";
import AuthPage from "./AuthPage";

const Header = () => {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>
          <Navbar.Brand href="#">ShopMate</Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center">
              <Nav.Link href="#">Home</Nav.Link>
              <Nav.Link href="#">Shop</Nav.Link>
              <Nav.Link href="#">Categories</Nav.Link>
              <Nav.Link href="#">About</Nav.Link>

              {/* LOGIN BUTTON */}
              <Button
                variant="outline-primary"
                className="ms-3"
                onClick={() => setShowAuth(true)}
              >
                Login/Register
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* AUTH MODAL */}
      <Modal
        show={showAuth}
        onHide={() => setShowAuth(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Welcome</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <AuthPage />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Header;
