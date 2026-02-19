import { useState, useEffect, useMemo } from "react"; 
import {
  AppBar, Toolbar, Typography, IconButton, Drawer,
  List, ListItemButton, ListItemText, Box, Avatar,
  Divider, useMediaQuery, useTheme, Container, ListItemIcon, Button, Badge,
  Dialog, Card
} from "@mui/material";
import {
  Search as SearchIcon,
  ShoppingCart as ShoppingCartIcon,
  FavoriteBorder as FavoriteIcon,
  Logout as LogoutIcon,
  Home as HomeIcon,
  Store as StoreIcon,
  Close as CloseIcon,
  LocalShipping as OrdersIcon,
  Login as LoginIcon,
  Menu as MenuIcon,
  AdminPanelSettings as AdminIcon,
  Dashboard as SellerIcon 
} from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react"; // Updated for latest motion
import { useUser } from "../../context/UserContext";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

import Login from "../../pages/Login";
import Register from "../../pages/Register";
import ForgotPassword from "../../components/auth/ForgotPassword";

export default function Navbar() {
  const { user, logout } = useUser();
  const { cart } = useCart();
  const { wishlist } = useWishlist(); 
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [openAuth, setOpenAuth] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [direction, setDirection] = useState(0); 
  const [isScrolled, setIsScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- LOGIC FOR INSTANT UI UPDATES ---
  // We use useMemo but ensure 'user' and 'user.roles' are deep dependencies
  const { navLinks, drawerLinks, displayName, shortName } = useMemo(() => {
    const role = user?.roles?.[0];
    const name = user?.username || user?.name || user?.email?.split('@')[0] || "Guest";
    
    let panelLink = null;
    if (role === "SUPER_ADMIN" || role === "ADMIN") {
      panelLink = { label: "Admin Panel", path: "/admin", icon: <AdminIcon />, text: "Admin Panel" };
    } else if (role === "SELLER") {
      panelLink = { label: "Seller Panel", path: "/seller", icon: <SellerIcon />, text: "Seller Panel" };
    }

    const nLinks = [
      { label: "Home", path: "/" },
      { label: "Collections", path: "/products" },
    ];
    // if (panelLink) nLinks.push({ label: panelLink.label, path: panelLink.path });
    if (user) {
      nLinks.push({ label: "My Orders", path: "/my-orders" });
      nLinks.push({ label: "Cart", path: "/cart", isCart: true });
    }

    const dLinks = [
      { text: "Home", icon: <HomeIcon />, path: "/" },
      { text: "Shop Collections", icon: <StoreIcon />, path: "/products" },
    ];
    if (panelLink) dLinks.push({ text: panelLink.text, icon: panelLink.icon, path: panelLink.path });
    if (user) {
      dLinks.push({ text: "My Orders", icon: <OrdersIcon />, path: "/my-orders" });
      dLinks.push({ text: "My Favorites", icon: <FavoriteIcon />, path: "/wishlist" });
    }
    dLinks.push({ text: "Shopping Cart", icon: <ShoppingCartIcon />, path: "/cart" });

    return { 
      navLinks: nLinks, 
      drawerLinks: dLinks, 
      displayName: name, 
      shortName: name.split(' ')[0] 
    };
  }, [user, user?.roles]); // Listening specifically to roles array change

  const handleLogoutAction = () => {
    logout();
    setDrawerOpen(false);
    if (["/my-orders", "/cart", "/wishlist", "/admin", "/seller"].includes(location.pathname)) {
      navigate("/");
    }
  };

  const handleOpenAuth = () => { setDirection(0); setActiveTab("login"); setOpenAuth(true); };
  const handleCloseAuth = () => setOpenAuth(false);
  
  const switchToLogin = () => { setDirection(-1); setActiveTab("login"); };
  const switchToRegister = () => { setDirection(1); setActiveTab("register"); };
  const switchToForgot = () => { setDirection(1); setActiveTab("forgot"); };

  const cartCount = cart?.reduce((acc, item) => acc + item.quantity, 0) || 0;
  const wishlistCount = wishlist?.length || 0;

  const formVariants = {
    enter: (dir) => ({ x: dir > 0 ? 50 : -50, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir) => ({ x: dir < 0 ? 50 : -50, opacity: 0 }),
  };

  return (
    <Box key={user?.id || 'guest'}> {/* Force re-render on user change */}
      <Box sx={{
        position: "fixed", top: isScrolled ? 15 : 0, left: 0, right: 0,
        zIndex: 1100, display: "flex", justifyContent: "center",
        transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)", px: isScrolled ? 2 : 0,
      }}>
        <AppBar
          component={motion.div}
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          sx={{
            position: "relative", width: isScrolled ? (isMobile ? "95%" : "85%") : "100%",
            maxWidth: "1440px", borderRadius: isScrolled ? "100px" : "0px",
            background: isScrolled ? "rgba(74, 46, 46, 0.95)" : theme.palette.background.default,
            backdropFilter: "blur(12px)", border: isScrolled ? "1px solid rgba(216, 182, 123, 0.2)" : "none",
            transition: "all 0.5s ease",
          }}
        >
          <Container maxWidth="xl">
            <Toolbar sx={{ justifyContent: "space-between", py: isScrolled ? 0.5 : 1.5 }}>
              <Box component={Link} to="/" sx={{ textDecoration: "none", display: "flex", flexDirection: "column" }}>
                <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, letterSpacing: 4, color: isScrolled ? "secondary.main" : "primary.main", lineHeight: 1 }}>AT</Typography>
                <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: 2, color: isScrolled ? "secondary.light" : "primary.light", textAlign: "center" }}>LUXE</Typography>
              </Box>

              {!isMobile && (
                <Box sx={{ display: "flex", bgcolor: isScrolled ? "rgba(255,255,255,0.05)" : "rgba(74, 46, 46, 0.03)", borderRadius: "50px", px: 1, py: 0.5 }}>
                  {navLinks.map((item) => (
                    <Button
                      key={item.label}
                      component={motion.button}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => navigate(item.path)}
                      startIcon={item.isCart ? (
                        <Badge badgeContent={cartCount} color="secondary">
                          <ShoppingCartIcon sx={{ fontSize: '1.2rem' }} />
                        </Badge>
                      ) : null}
                      sx={{
                        color: location.pathname === item.path ? "secondary.main" : (isScrolled ? "white" : "primary.main"),
                        px: 3, fontWeight: 600, fontSize: "0.85rem", borderRadius: "50px"
                      }}
                    >
                      {item.label}
                    </Button>
                  ))}
                </Box>
              )}

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <IconButton sx={{ color: isScrolled ? "secondary.main" : "primary.main" }}>
                  <SearchIcon />
                </IconButton>

                {!isMobile && user && (
                  <IconButton onClick={() => navigate("/wishlist")} sx={{ color: isScrolled ? "secondary.main" : "primary.main" }}>
                    <Badge badgeContent={wishlistCount} color="secondary" showZero={false}>
                      <FavoriteIcon />
                    </Badge>
                  </IconButton>
                )}

                {!user ? (
                  !isMobile ? (
                    <Button
                      onClick={handleOpenAuth}
                      variant="outlined" startIcon={<LoginIcon />}
                      sx={{ borderRadius: "50px", fontWeight: 800, color: isScrolled ? "secondary.main" : "primary.main", borderColor: isScrolled ? "secondary.main" : "primary.main" }}
                    >
                      Login
                    </Button>
                  ) : (
                    <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: isScrolled ? "secondary.main" : "primary.main" }}>
                      <MenuIcon />
                    </IconButton>
                  )
                ) : (
                  <Box
                    onClick={() => setDrawerOpen(true)}
                    sx={{
                      display: "flex", alignItems: "center", gap: 1.5, cursor: "pointer", ml: 1, pl: 0.6, pr: 2, py: 0.6,
                      borderRadius: "50px", border: "1px solid",
                      borderColor: isScrolled ? "rgba(216,182,123,0.3)" : "rgba(74,46,46,0.1)",
                      transition: "all 0.3s", "&:hover": { bgcolor: "rgba(216,182,123,0.1)" }
                    }}
                  >
                    <Avatar src={user?.avatar} sx={{ width: 34, height: 34, bgcolor: "secondary.main", color: "primary.main" }}>
                      {displayName[0]?.toUpperCase()}
                    </Avatar>
                    <Box sx={{ textAlign: 'left' }}>
                      <Typography variant="caption" sx={{ fontSize: '0.6rem', fontWeight: 800, color: isScrolled ? "secondary.light" : "primary.light", display: 'block', lineHeight: 1.2 }}>PROFILE</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 800, color: isScrolled ? "white" : "primary.main", lineHeight: 1 }}>{shortName}</Typography>
                    </Box>
                  </Box>
                )}
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </Box>

      {/* --- AUTH MODAL --- */}
      <Dialog open={openAuth} onClose={handleCloseAuth} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 6, overflow: 'hidden' } }}>
        <Card sx={{ p: 3, position: "relative" }}>
          <IconButton onClick={handleCloseAuth} sx={{ position: "absolute", right: 12, top: 12 }}><CloseIcon /></IconButton>
          
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 2 }}>
            <Typography variant="h4" sx={{ fontFamily: "Playfair Display", fontWeight: 900, color: "primary.main" }}>AT</Typography>
            <Typography variant="caption" sx={{ fontWeight: 700, color: "primary.light" }}>LUXE</Typography>
          </Box>

          {(activeTab === "login" || activeTab === "register") && (
            <Box sx={{ display: "flex", position: 'relative', bgcolor: "rgba(0,0,0,0.05)", borderRadius: 50, p: 0.5, mb: 3 }}>
              <Box
                component={motion.div}
                animate={{ x: activeTab === "login" ? "0%" : "100%" }}
                sx={{
                  position: "absolute", top: 4, bottom: 4, left: 4,
                  width: "calc(50% - 4px)", bgcolor: "primary.main", borderRadius: 50, zIndex: 0
                }}
              />
              <Button fullWidth onClick={switchToLogin} sx={{ zIndex: 1, borderRadius: 50, color: activeTab === "login" ? "#fff" : "text.secondary" }}>Login</Button>
              <Button fullWidth onClick={switchToRegister} sx={{ zIndex: 1, borderRadius: 50, color: activeTab === "register" ? "#fff" : "text.secondary" }}>Register</Button>
            </Box>
          )}

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={activeTab}
              custom={direction}
              variants={formVariants}
              initial="enter" animate="center" exit="exit"
              transition={{ x: { type: "spring", stiffness: 300, damping: 30 }, opacity: { duration: 0.2 } }}
            >
              {activeTab === "login" && <Login switchToRegister={switchToRegister} switchToForgot={switchToForgot} onSuccess={handleCloseAuth} />}
              {activeTab === "register" && <Register switchToLogin={switchToLogin} onSuccess={handleCloseAuth} />}
              {activeTab === "forgot" && <ForgotPassword switchToLogin={switchToLogin} />}
            </motion.div>
          </AnimatePresence>
        </Card>
      </Dialog>

      {/* --- DRAWER --- */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)} PaperProps={{ sx: { width: { xs: "100%", sm: 360 }, backgroundColor: "#4A2E2E", color: "#D8B67B" } }}>
        <Box sx={{ p: 4, height: "100%", display: "flex", flexDirection: "column" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 5 }}>
            <Typography variant="h5" sx={{ fontFamily: "Playfair Display", fontWeight: 900, color: "secondary.main" }}>AT-LUXE</Typography>
            <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: "secondary.main" }}><CloseIcon /></IconButton>
          </Box>

          {user && (
            <Box sx={{ textAlign: "center", mb: 5 }}>
              <Avatar src={user?.avatar} sx={{ width: 80, height: 80, mx: "auto", mb: 2, border: "2px solid #D8B67B" }}>
                {displayName[0]?.toUpperCase()}
              </Avatar>
              <Typography fontWeight={800} variant="h6" sx={{ color: "white" }}>Hi, {displayName}</Typography>
              <Typography variant="body2" sx={{ color: "rgba(216, 182, 123, 0.7)", mt: 0.5 }}>{user.email}</Typography>
            </Box>
          )}

          <List sx={{ flex: 1 }}>
            {drawerLinks.map((item) => (
              <ListItemButton 
                key={item.text} 
                onClick={() => { navigate(item.path); setDrawerOpen(false); }} 
                sx={{ mb: 1, py: 1.5, borderRadius: "14px" }}
              >
                <ListItemIcon sx={{ color: "secondary.main" }}>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 600, color: "white" }} />
              </ListItemButton>
            ))}
          </List>

          <Divider sx={{ borderColor: "rgba(216,182,123,0.2)", my: 3 }} />

          <Box sx={{ pb: 2 }}>
            {user ? (
              <Button fullWidth startIcon={<LogoutIcon />} onClick={handleLogoutAction} sx={{ color: "#ff8a80", fontWeight: 800, py: 2, borderRadius: "50px", border: "1px solid rgba(255,138,128,0.3)" }}>Log Out</Button>
            ) : (
              <Button fullWidth variant="contained" onClick={() => { setDrawerOpen(false); handleOpenAuth(); }} sx={{ py: 2, fontWeight: 800, borderRadius: "50px", bgcolor: "secondary.main", color: "primary.main" }}>Sign In / Register</Button>
            )}
          </Box>
        </Box>
      </Drawer>

      <Toolbar sx={{ height: { xs: 70, md: 90 } }} />
    </Box>
  );
}