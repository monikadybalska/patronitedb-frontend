import { createRootRoute, Outlet } from "@tanstack/react-router";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

const theme = createTheme({
  palette: {
    primary: {
      main: "#d13f40",
    },
    secondary: {
      main: "#f5f5f5",
    },
    text: {
      primary: "#262626",
      secondary: "#404040",
    },
  },
  typography: {
    fontFamily: "Jost",
  },
});

export const Route = createRootRoute({
  component: () => (
    <ThemeProvider theme={theme}>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </ThemeProvider>
  ),
});
