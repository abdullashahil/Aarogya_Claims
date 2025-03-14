import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#2F7FF2", // Blue
    },
    secondary: {
      main: "#35F3D7", // Teal
    },
    background: {
      default: "#ffffff", // White
      paper: "#ffffff", // White
    },
    text: {
      primary: "#000000", // Black
      secondary: "#ffffff", // White for text on colored backgrounds
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          borderRadius: 8,
          transition: "opacity 0.3s ease-in-out",
          "&:hover": {
            opacity: 0.9,
            boxShadow: "none", // Removes hover shadow
          },
        },
      },
    },
  },
});

export default theme;
