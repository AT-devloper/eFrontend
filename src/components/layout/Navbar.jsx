import { useState, useEffect, useMemo } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Box,
  Avatar,
  InputBase,
  Paper,
  ClickAwayListener,
  Divider,
} from "@mui/material";
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  ShoppingCart as ShoppingCartIcon,
  Favorite as FavoriteIcon,
  ReceiptLong as ReceiptLongIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { useUser } from "../../context/UserContext";

export default function Navbar() {
  const { cart } = useCart();
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const [uiState, setUiState] = useState({
    mobileOpen: false,
    profileOpen: false,
    isScrolled: false,
    searchQuery: "",
    showSuggestions: false,
  });

  const cartCount = useMemo(() => cart.reduce((acc, item) => acc + item.quantity, 0), [cart]);
  const suggestions = useMemo(() => {
    if (!uiState.searchQuery.trim()) return [];
    return DUMMY_PRODUCTS.filter((p) =>
      p.name.toLowerCase().includes(uiState.searchQuery.toLowerCase())
    );
  }, [uiState.searchQuery]);

  const navLinks = [
    { label: "Home", path: "/" },
    { label: "Collections", path: "/products" },
    { label: "My Orders", path: "/my-orders" },
    { label: "Wishlist", path: "/wishlist" },
  ];

  const displayName = user?.name || user?.username || user?.email?.split("@")[0] || "";

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50 !== uiState.isScrolled) {
        setUiState((prev) => ({ ...prev, isScrolled: window.scrollY > 50 }));
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [uiState.isScrolled]);

  const toggleDrawer = (key, open) => () => {
    setUiState((prev) => ({ ...prev, [key]: open }));
  };

  const handleSearchSubmit = (query) => {
    const cleanQuery = query?.trim();
    if (!cleanQuery) return;
    navigate(`/products?search=${encodeURIComponent(cleanQuery)}`);
    setUiState((prev) => ({ ...prev, searchQuery: "", showSuggestions: false, mobileOpen: false }));
  };

  const handleLogout = () => {
    logout();
    setUiState((prev) => ({ ...prev, profileOpen: false }));
    navigate("/");
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={uiState.isScrolled ? 4 : 0}
        sx={{
          transition: "0.3s",
          bgcolor: uiState.isScrolled ? "primary.main" : "rgba(74,46,46,0.92)",
          backdropFilter: "blur(8px)",
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between", flexWrap: "wrap", gap: 1 }}>
          {/* LOGO */}
          <Typography
            variant="h5"
            component={Link}
            to="/"
            sx={{
              textDecoration: "none",
              color: "secondary.main",
              fontWeight: 800,
              letterSpacing: 1.5,
            }}
          >
            AT-LUXE
          </Typography>

          {/* SEARCH BAR */}
          <Box sx={{ flex: 1, mx: 3, minWidth: 180, maxWidth: 400, display: { xs: "none", md: "flex" } }}>
            <ClickAwayListener onClickAway={() => setUiState((prev) => ({ ...prev, showSuggestions: false }))}>
              <Box sx={{ position: "relative", width: "100%" }}>
                <Paper
                  component="form"
                  onSubmit={(e) => { e.preventDefault(); handleSearchSubmit(uiState.searchQuery); }}
                  sx={{ display: "flex", alignItems: "center", px: 1.5, py: 0.5, bgcolor: "secondary.light", borderRadius: 3 }}
                >
                  <InputBase
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search luxury pieces..."
                    value={uiState.searchQuery}
                    onChange={(e) => setUiState((prev) => ({ ...prev, searchQuery: e.target.value, showSuggestions: true }))}
                    onFocus={() => setUiState((prev) => ({ ...prev, showSuggestions: suggestions.length > 0 }))}
                  />
                  <IconButton type="submit" size="small" color="primary"><SearchIcon /></IconButton>
                </Paper>
                {uiState.showSuggestions && suggestions.length > 0 && (
                  <Paper sx={{ position: "absolute", top: "110%", left: 0, right: 0, zIndex: 1200, borderRadius: 2, overflow: "hidden" }}>
                    <List disablePadding>
                      {suggestions.map((item) => (
                        <ListItemButton key={item.id} onClick={() => handleSearchSubmit(item.name)}>
                          <ListItemText primary={item.name} />
                        </ListItemButton>
                      ))}
                    </List>
                  </Paper>
                )}
              </Box>
            </ClickAwayListener>
          </Box>

          {/* NAV LINKS + ACTIONS */}
          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 0.5, sm: 1.5 } }}>
            {navLinks.map((link) => (
              <Button
                key={link.path}
                component={Link}
                to={link.path}
                sx={{
                  color: location.pathname === link.path ? "secondary.light" : "secondary.main",
                  fontWeight: location.pathname === link.path ? 700 : 500,
                  textTransform: "none",
                }}
              >
                {link.label}
              </Button>
            ))}

            <IconButton component={Link} to="/wishlist" sx={{ color: "secondary.main" }}>
              <Badge badgeContent={0} color="error">
                <FavoriteIcon />
              </Badge>
            </IconButton>

            <IconButton component={Link} to="/cart" sx={{ color: "secondary.main" }}>
              <Badge badgeContent={cartCount} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>

            {user ? (
              <IconButton onClick={toggleDrawer("profileOpen", true)} sx={{ p: 0.5 }}>
                <Avatar src={user.avatar} sx={{ width: 35, height: 35, border: "2px solid", borderColor: "secondary.main" }}>
                  {displayName[0]}
                </Avatar>
              </IconButton>
            ) : (
              <Button component={Link} to="/auth" variant="contained" color="secondary" sx={{ borderRadius: 2, textTransform: "none" }}>
                Login
              </Button>
            )}

            <IconButton sx={{ display: { xs: "flex", md: "none" }, color: "secondary.main" }} onClick={toggleDrawer("mobileOpen", true)}>
              <MenuIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* PROFILE DRAWER */}
      <Drawer anchor="right" open={uiState.profileOpen} onClose={toggleDrawer("profileOpen", false)}>
        <Box sx={{ width: 280, p: 3, bgcolor: "primary.main", height: "100%", color: "secondary.main" }}>
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Avatar src={user?.avatar} sx={{ width: 80, height: 80, mx: "auto", mb: 2 }} />
            <Typography variant="h6">{displayName}</Typography>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>{user?.email}</Typography>
          </Box>
          <Divider sx={{ mb: 2, borderColor: "rgba(255,255,255,0.1)" }} />
          <List>
            <ListItemButton component={Link} to="/my-orders" onClick={toggleDrawer("profileOpen", false)}>
              <ReceiptLongIcon sx={{ mr: 2 }} />
              <ListItemText primary="My Orders" />
            </ListItemButton>
            <ListItemButton onClick={handleLogout} sx={{ color: "error.main" }}>
              <LogoutIcon sx={{ mr: 2 }} />
              <ListItemText primary="Logout" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>

      <Toolbar /> {/* spacer */}
    </>
  );
}
