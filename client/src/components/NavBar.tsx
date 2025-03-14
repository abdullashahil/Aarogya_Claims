import { Link as RouterLink } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Container,
  ThemeProvider,
} from "@mui/material";
import theme from "../theme";

const Navbar: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <AppBar position="static" color="primary" sx={{ px: 3, py: 1, boxShadow: "none" }}>
        <Container maxWidth="xl">
          <Toolbar sx={{ justifyContent: "center" }} >
            {/* Logo & Brand Name */}
            <Box
              component={RouterLink}
              to="/"
              sx={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <Box
                component="img"
                src="/logo.png"
                alt="Aarogya Claims"
                sx={{ height: 30, mr: 1 }}
              />
              <Typography
                variant="h6"
                noWrap
                sx={{
                  fontWeight: 600,
                  letterSpacing: ".02rem",
                  color: "inherit",
                  textDecoration: "none",
                }}
              >
                Aarogya Claims
              </Typography>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </ThemeProvider>
  );
};

export default Navbar;
