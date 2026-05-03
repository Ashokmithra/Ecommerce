import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import { Toaster } from "./components/ui/sonner";
import DashBoard from "./pages/Dashboard";
import ProtectedRoutes from "./Routes/ProtectedRoutes";
import Layout from "./components/common/Layout";
import Login from "./pages/auth/Login";
import InvalidPage from "./pages/auth/InvalidPage";
import ProductDetail from "./features/products/components/ProductDetail";
import Cart from "./pages/Cart";

function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoutes />}>
            <Route path="/dashboard" element={<DashBoard />} />
            <Route path="/cart" element={<Cart />} />
          </Route>
          <Route
            path="*"
            element={<InvalidPage errorMessage="404 Page not found" />}
          />
        </Route>
      </Routes>
      <Toaster position="top-center" richColors />
      {/* <Signup/> */}
    </>
  );
}

export default App;
