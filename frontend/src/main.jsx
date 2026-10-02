import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <App />
          <Toaster
            position="top-center"
            containerStyle={{ top: 16 }}
            toastOptions={{
              duration: 3000,
              className: "!rounded-full !text-sm !font-medium !shadow-lg dark:!bg-zinc-800 dark:!text-zinc-100",
            }}
          />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);