import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
queryClient.getQueryCache().subscribe((event) => {
  if (event?.type === "updated" && event?.action?.type === "success") {
    const queryKey = event.query.queryKey;
    const data = event.action.data;

    const [key, userId] = queryKey;

    if (key === "cart" && userId) {
      const storageKey = `cart_user_${userId}`;
      localStorage.setItem(storageKey, JSON.stringify(data));
    }
  }
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
);
