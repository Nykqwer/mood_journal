import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/global.css";
import App from "./components/App";
import "@fontsource/source-sans-pro/400.css"; // regular
import "@fontsource/source-sans-pro/600.css"; // semi-bold
import Header from "./components/Header";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Header />
    <main> 
      <App />
    </main>

    <footer></footer>
  </StrictMode>,
);
