import LodingOverlay from "@/components/common/LodingOverlay";
import { useGetCurrentUser } from "@/features/auth/hooks/auth";
import type { TProductCartQuantity } from "@/features/cart/types";
import useCart from "@/hooks/useCart";
import { getLocalStorageItem } from "@/utils/localStorage";
import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = () => {
  const { data: userData, isLoading } = useGetCurrentUser();

  const isAuthorized: boolean = !!userData?.data;

  const { setUserCartData } = useCart();
  const userId = userData?.data?.id;

  useEffect(() => {
    if (isAuthorized && userId) {
      const usercart = getLocalStorageItem("user_cart");

      if (usercart) {
        const cart = JSON.parse(usercart) as TProductCartQuantity[];

        if (cart.length > 0) {
          setUserCartData(Number(userId), cart);
        }
      }
    }
  }, [isAuthorized, userId]);
  return isLoading ? (
    <LodingOverlay />
  ) : isAuthorized ? (
    <Outlet />
  ) : (
    <Navigate to="/login" />
  );
};

export default ProtectedRoutes;
