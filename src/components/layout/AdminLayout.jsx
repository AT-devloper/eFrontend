import { useState, useEffect, useMemo } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
  CssBaseline,
  Avatar,
  Menu,
  MenuItem,
} from "@mui/material";
import { ThemeProvider, useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { motion, AnimatePresence } from "framer-motion";

import softDarkTheme from "../../theme";
import { useUser } from "../../context/UserContext";

// Icons
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuIcon from "@mui/icons-material/Menu";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InventoryIcon from "@mui/icons-material/Inventory";
import AssignmentIcon from "@mui/icons-material/Assignment";
import SecurityIcon from "@mui/icons-material/Security";
import GroupIcon from "@mui/icons-material/Group";
import LockIcon from "@mui/icons-material/Lock";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

const drawerWidth = 280;
const collapsedWidth = 88;

export default function AdminLayout() {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [collapsed, setCollapsed] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);

  useEffect(() => {
    setDrawerOpen(!isMobile);
  }, [isMobile]);

  const toggleDrawer = () => {
    isMobile ? setDrawerOpen((prev) => !prev) : setCollapsed((prev) => !prev);
  };

  const handleLogoutAction = () => {
    setAnchorEl(null);
    logout();
    navigate("/");
  };

  const displayName = user?.username || user?.name || user?.email?.split("@")[0] || "Admin";
  const userRole = user?.roles?.[0] || "USER";

  // RBAC: which sidebar items are visible for this user
  const filteredMenuItems = useMemo(() => {
    const allItems = [
      { text: "Products", icon: <InventoryIcon />, path: "/admin/sellerpannel", roles: ["SUPER_ADMIN", "ADMIN", "SELLER"] },
      { text: "Orders", icon: <AssignmentIcon />, path: "/admin/orders", roles: ["SUPER_ADMIN", "ADMIN", "SELLER"] },
      { divider: true, roles: ["SUPER_ADMIN", "ADMIN"] },
      { text: "Roles", icon: <GroupIcon />, path: "/admin/create/roles", roles: ["SUPER_ADMIN", "ADMIN"] },
      { text: "Permissions", icon: <LockIcon />, path: "/admin/create/permissions", roles: ["SUPER_ADMIN", "ADMIN"] },
      { text: "Access Control", icon: <SecurityIcon />, path: "/admin/assign-role", roles: ["SUPER_ADMIN", "ADMIN"] },
      { text: "Analytics", icon: <DashboardIcon />, path: "/admin/rbac/permissions", roles: ["SUPER_ADMIN", "ADMIN"] },
    ];
    return allItems.filter((item) => !item.roles || item.roles.includes(userRole));
  }, [userRole]);

  const isDefaultPage = location.pathname === "/admin" || location.pathname === "/seller";

  return (
    <ThemeProvider theme={softDarkTheme}>
      <CssBaseline />
      <Box sx={{ display: "flex", bgcolor: "background.default", minHeight: "100vh" }}>
        
        {/* --- SIDEBAR --- */}
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? drawerOpen : true}
          onClose={() => setDrawerOpen(false)}
          sx={{
            width: isMobile ? "auto" : (collapsed ? collapsedWidth : drawerWidth),
            flexShrink: 0,
            "& .MuiDrawer-paper": {
              width: collapsed && !isMobile ? collapsedWidth : drawerWidth,
              boxSizing: "border-box",
              bgcolor: "primary.main",
              color: "secondary.main",
              borderRight: "none",
              overflowX: "hidden",
              transition: theme.transitions.create("width", { duration: 300 }),
            },
          }}
        >
          {/* Sidebar Avatar */}
          <Box sx={{ p: 3, display: "flex", alignItems: "center", gap: 2, minHeight: 80 }}>
            <Avatar sx={{ bgcolor: "secondary.main", color: "primary.main", fontWeight: 900 }}>
              {displayName[0]?.toUpperCase()}
            </Avatar>
            {!collapsed && (
              <Box>
                <Typography variant="h6" sx={{ color: "secondary.main", fontWeight: 900, letterSpacing: 1.5 }}>
                  LUXE.
                </Typography>
                <Typography variant="body2" sx={{ color: "secondary.light", fontWeight: 600 }}>
                  {userRole.replace("ROLE_", "")}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Sidebar Menu */}
          <List sx={{ px: 2 }}>
            {filteredMenuItems.map((item, index) => (
              item.divider ? (
                <Divider key={index} sx={{ my: 2, bgcolor: "rgba(216,182,123,0.15)" }} />
              ) : (
                <ListItemButton
                  key={item.text}
                  component={Link}
                  to={item.path}
                  selected={location.pathname === item.path}
                  sx={{
                    borderRadius: "12px", 
                    mb: 0.5,
                    transition: "all 0.3s ease",
                    color: "#F5EDE5", 
                    "& .MuiListItemIcon-root": { color: "secondary.main", transition: "color 0.2s" },
                    "&:hover": {
                      backgroundColor: "rgba(216,182,123,0.15)", 
                      color: "secondary.main", 
                      "& .MuiListItemIcon-root": { color: "#FFFFFF" }
                    },
                    "&.Mui-selected": {
                      bgcolor: "secondary.main", 
                      color: "primary.main",
                      "& .MuiListItemIcon-root": { color: "primary.main" },
                      "&:hover": {
                        backgroundColor: "secondary.light",
                        color: "primary.main",
                        "& .MuiListItemIcon-root": { color: "primary.main" }
                      }
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 0, mr: collapsed ? 0 : 2 }}>{item.icon}</ListItemIcon>
                  {!collapsed && <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 700, color: "inherit" }} />}
                </ListItemButton>
              )
            ))}
          </List>
        </Drawer>

        {/* --- MAIN AREA --- */}
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", width: "100%" }}>
          <AppBar position="sticky" elevation={0} sx={{ bgcolor: "background.default", color: "primary.main", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
            <Toolbar sx={{ px: { xs: 2, md: 4 } }}>
              <IconButton onClick={toggleDrawer} sx={{ mr: 2, color: "primary.main" }}>
                {collapsed ? <MenuIcon /> : <MenuOpenIcon />}
              </IconButton>
              <Typography variant="h6" sx={{ fontWeight: 800, flexGrow: 1 }}>Panel</Typography>
              
              {/* Navbar Avatar */}
              <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
                <Avatar sx={{ border: "2px solid", borderColor: "secondary.main", bgcolor: "primary.main", color: "secondary.main" }}>
                  {displayName[0]?.toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={openMenu}
                onClose={() => setAnchorEl(null)}
                PaperProps={{ sx: { borderRadius: "12px", mt: 1, minWidth: 200 } }}
              >
                <Box sx={{ px: 2, py: 1 }}>
                  <Typography variant="subtitle1" fontWeight={700}>{displayName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {userRole.replace("ROLE_", "")}
                  </Typography>
                </Box>
                <Divider />
                <MenuItem onClick={handleLogoutAction} sx={{ color: 'error.main', fontWeight: 600 }}>
                  Logout
                </MenuItem>
              </Menu>
            </Toolbar>
          </AppBar>

          <Box component="main" sx={{ p: { xs: 3, md: 5 }, flexGrow: 1, position: "relative" }}>
            <AnimatePresence mode="wait">
              {isDefaultPage ? (
                <Box
                  key="welcome"
                  component={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  sx={{
                    height: "70vh",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center",
                  }}
                >
                  <motion.div animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 3 }}>
                    <Avatar
                      sx={{
                        width: 140,
                        height: 140,
                        bgcolor: "primary.main",
                        border: "6px solid",
                        borderColor: "secondary.main",
                        fontSize: "3.5rem",
                        fontWeight: 900,
                        color: "secondary.main",
                        mb: 4,
                        boxShadow: "0 20px 50px rgba(0,0,0,0.15)"
                      }}
                    >
                      {displayName[0].toUpperCase()}
                    </Avatar>
                  </motion.div>

                  <Typography variant="h2" sx={{ fontFamily: "Playfair Display", fontWeight: 900, color: "primary.main", mb: 1 }}>
                    Welcome, {shortName(displayName)}
                  </Typography>
                  
                  <Typography variant="h6" sx={{ color: "secondary.dark", fontWeight: 800, letterSpacing: 3, mb: 4, textTransform: "uppercase" }}>
                   AT-Luxe • {userRole.replace("ROLE_", "")}
                  </Typography>

                  <Box
                    component={motion.div}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      px: 4,
                      py: 2,
                      borderRadius: "100px",
                      bgcolor: "primary.main",
                      boxShadow: "0 10px 30px rgba(74, 46, 46, 0.3)"
                    }}
                  >
                    <ArrowForwardIosIcon sx={{ fontSize: 16, color: "secondary.main", transform: 'rotate(180deg)' }} />
                    <Typography sx={{ fontWeight: 700, color: "#F5EDE5" }}>
                      Select an option from the sidebar to start managing
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <motion.div
                  key="content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4 }}
                >
                  <Outlet />
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

function shortName(name) {
  if (!name) return "";
  return name.split(" ")[0];
}