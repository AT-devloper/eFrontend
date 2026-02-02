import { createTheme } from "@mui/material/styles";

const softDarkTheme = createTheme({
  palette: {
    mode: "light", // Keep light mode for overall brightness
    primary: {
      main: "#4A2E2E", // Deep burgundy
      light: "#7E5A5A",
      dark: "#321F1F",
      contrastText: "#F5EDE5",
    },
    secondary: {
      main: "#D8B67B", // Soft faded gold
      light: "#E6CFA0",
      dark: "#A58450",
      contrastText: "#4A2E2E",
    },
    background: {
      default: "#EFE8E3", // Slightly dark ivory instead of white
      paper: "#E6DED6",   // Slightly darker cards
    },
    text: {
      primary: "#3A2C2C", // Dark soft text
      secondary: "#5E3B3B", // Burgundy accent text
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h1: { fontFamily: "'Playfair Display', serif", fontWeight: 700, color: "#4A2E2E" },
    h2: { fontFamily: "'Playfair Display', serif", fontWeight: 600, color: "#4A2E2E" },
    h3: { fontFamily: "'Playfair Display', serif", fontWeight: 500, color: "#4A2E2E" },
    body1: { color: "#3A2C2C" },
    button: { textTransform: "none", fontWeight: 600 },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: "#4A2E2E", // Deep burgundy
          color: "#D8B67B",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.08)",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "#E6DED6", // Slightly dark paper
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
          borderRadius: 20,
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 12px 32px rgba(0,0,0,0.11)",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          background: "linear-gradient(135deg, #D8B67B, #E6CFA0)",
          color: "#4A2E2E",
          "&:hover": {
            background: "linear-gradient(135deg, #E6CFA0, #D8B67B)",
          },
        },
      },
    },
  },

  MuiDrawer: {
  styleOverrides: {
    paper: {
      backgroundColor: "#4A2E2E",
      color: "#D8B67B",
    },
  },
},
MuiListItemButton: {
  styleOverrides: {
    root: {
      "&:hover": {
        backgroundColor: "rgba(216,182,123,0.12)",
      },
    },
  },
},

});

export default softDarkTheme;
