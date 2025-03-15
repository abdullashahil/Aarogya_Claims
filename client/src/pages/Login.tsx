import { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Tabs,
  Tab,
  Box,
  Paper,
  Typography,
  Container,
  ThemeProvider,
  createTheme,
  CssBaseline,
  CircularProgress, 
} from "@mui/material";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";

const theme = createTheme({
  palette: {
    primary: { main: "#2F7FF2" }, // Blue
    secondary: { main: "#35F3D7" }, // Teal
    background: { default: "#ffffff", paper: "#ffffff" }, // White
    text: { primary: "#000000", secondary: "#666666" }, // Black & gray
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 600 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 8, textTransform: "none", padding: "10px 0", fontWeight: 600 },
        containedPrimary: { "&:hover": { backgroundColor: "#1a68d1" } },
      },
    },
    MuiTextField: { styleOverrides: { root: { marginBottom: 16 } } },
    MuiTab: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 500, "&.Mui-selected": { color: "#2F7FF2" } },
      },
    },
  },
});

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isSignup, setIsSignup] = useState(false);
  const [role, setRole] = useState("patient");
  const [loading, setLoading] = useState(false); 
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    const accessToken = localStorage.getItem("access_token");
    const userRole = localStorage.getItem("role");

    if (accessToken && userRole && window.location.pathname !== "/dashboard") {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleToggle = () => {
    setIsSignup(!isSignup);
    reset();
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const endpoint = isSignup
        ? "http://localhost:4000/users/register"
        : "http://localhost:4000/auth/login";

      const payload = isSignup ? { ...data, role } : data;
      const response = await axios.post(endpoint, payload);

      if (response.data.access_token && response.data.role) {
        login(response.data.access_token, response.data.role, response.data.email);
        toast.success(isSignup ? "Account created successfully!" : "Logged in successfully!");
      }

      navigate("/dashboard");
    } catch (error: any) {
      toast.error("Error: " + (error.response?.data?.message || "Something went wrong"));
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container
        maxWidth={false}
        sx={{ display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f5f5f5", padding: { xs: 2, sm: 4 } }}
      >
        <Paper
          elevation={3}
          sx={{ width: "100%", maxWidth: "450px", borderRadius: 2, padding: { xs: 3, sm: 4 }, boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)" }}
        >
          <Typography variant="h4" align="center" gutterBottom sx={{ mb: 3, color: "primary.main", fontSize: "1.75rem" }}>
            {isSignup ? "Create Account" : "Welcome Back"}
          </Typography>

          {/* Role Selection (Signup only) */}
          {isSignup && (
            <Box sx={{ mb: 3 }}>
              <Tabs value={role} onChange={(_, newValue) => setRole(newValue)} centered indicatorColor="primary"
                sx={{ "& .MuiTabs-indicator": { backgroundColor: "primary.main" } }}>
                <Tab label="Patient" value="patient" />
                <Tab label="Insurer" value="insurer" />
              </Tabs>
            </Box>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
            <TextField
              label="Email" type="email" fullWidth variant="outlined" margin="normal"
              error={!!errors.email} helperText={errors.email ? "Email is required" : ""}
              {...register("email", { required: true })} sx={{ mb: 2 }}
            />

            <TextField
              label="Password" type="password" fullWidth variant="outlined" margin="normal"
              error={!!errors.password} helperText={errors.password ? "Password is required" : ""}
              {...register("password", { required: true })} sx={{ mb: 2 }}
            />

            {isSignup && (
              <TextField
                label="Confirm Password" type="password" fullWidth variant="outlined" margin="normal"
                error={!!errors.confirmPassword} helperText={errors.confirmPassword ? "Please confirm your password" : ""}
                {...register("confirmPassword", { required: true })} sx={{ mb: 2, p: 0 }}
              />
            )}

            <Button
              type="submit" variant="contained" color="primary" fullWidth size="large"
              disabled={loading} // Disable button when loading
              sx={{ mt: 2, mb: 2, height: "48px", fontSize: "1rem" }}>
              {loading ? (
                <CircularProgress size={24} sx={{ color: "white" }} /> // Show spinner when loading
              ) : (
                isSignup ? "Sign Up" : "Login"
              )}
            </Button>

            <Button onClick={handleToggle} fullWidth color="primary" variant="text" sx={{ mt: 1 }}>
              {isSignup ? "Already have an account? Login" : "New here? Sign Up"}
            </Button>
          </Box>

          <Box sx={{ height: "4px", width: "80px", backgroundColor: "secondary.main", margin: "24px auto 0", borderRadius: "2px" }} />
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default Login;