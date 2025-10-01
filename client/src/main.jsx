import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import App from "./App";

import CartPage from "./pages/CartPage";
import Wishlist from "./pages/Wishlist";
import "./index.css";
import { CurrencyProvider } from "./components/CurrencyProvider";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [

      { path: "cart", element: <CartPage /> },
      { path: "wishlist", element: <Wishlist /> },
      {
        path: "*",
        element: <div style={{ padding: 24 }}>404 - Not Found</div>,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <CurrencyProvider>
      <RouterProvider router={router} />
    </CurrencyProvider>
  </React.StrictMode>
);
