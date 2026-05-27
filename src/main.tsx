import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";

const getBasename = () => {
  let path = window.location.pathname;
  if (path.endsWith("/index.html")) {
    path = path.slice(0, -11);
  }
  if (path.endsWith("/")) {
    path = path.slice(0, -1);
  }
  return path;
};

createRoot(document.getElementById("root")!).render(
  <BrowserRouter basename={getBasename()}>
    {/* <StrictMode> */}
    <App />
    {/* </StrictMode> */}
  </BrowserRouter>,
);
