import { addCart, getUserCart } from "@/features/cart/services/api";
import {
  type TCartListResponse,
  type TCartProduct,
  type TCartResponse,
  type TProductCartQuantity,
} from "@/features/cart/types";
import { getDiscountAmount } from "@/utils";
import { getLocalStorageItem, setLocalStorageItem } from "@/utils/localStorage";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AxiosResponse } from "axios";
import { toast } from "sonner";

const useCart = () => {
  const userId = getLocalStorageItem("id");
  const cartUser = getLocalStorageItem(`cart_user_${userId}`);
  const queryClient = useQueryClient();

  const cartQuery = useQuery({
    queryKey: ["cart", userId],
    queryFn: async () => {
      if (!userId) {
        const local = localStorage.getItem("user_cart");
        const products = local ? JSON.parse(local) : [];
        return {
          data: { carts: [{ products: [...products] }] },
        };
      } else if (cartUser) {
        const response = JSON.parse(cartUser);
        console.log("response", response);

        return response;
      } else {
        return getUserCart(userId);
      }
    },

    retry: false,
    select: (response) => response.data?.carts[0],
    staleTime: Infinity,
  });

  const addCartData = useMutation({
    mutationFn: addCart,
    onSuccess: (responseData) => {
      const previousCart = queryClient.getQueryData(["cart", userId]);
      const productData: TCartResponse = responseData.data;
      console.log(previousCart, "previouscart", userId);
      console.log(responseData, "responsedata");

      queryClient.setQueryData(
        [`cart`, userId],
        (old: AxiosResponse<TCartListResponse>) => {
          console.log("old", old);
          if (old) {
            return {
              ...old,
              data: {
                ...old.data,
                carts: old.data.carts.map((cart, index) => {
                  if (index === 0) {
                    return {
                      ...cart,
                      products: [...cart.products, ...productData.products],
                      totalQuantity:
                        cart.totalQuantity + productData.totalQuantity,
                      total: cart.total + productData.total,
                      discountedTotal:
                        cart.discountedTotal + productData.discountedTotal,
                      totalProducts:
                        cart.totalProducts + productData.totalProducts,
                    };
                  }
                  return cart;
                }),
              },
            };
          } else {
            return responseData;
          }
        },
      );
      localStorage.removeItem("user_cart");
      toast.success("Added to Cart");
      return { previousCart };
    },
    onError: (error) => {
      console.log(error.message);
    },
  });
  const getUserCartData = () => {
    return cartQuery.data;
  };

  const setUserCartData = (
    uId: number,
    productList: TProductCartQuantity[],
  ) => {
    const currentuserId = getLocalStorageItem("id");

    if (currentuserId) {
      const { mutate } = addCartData;
      mutate({ userId: uId, products: productList });
    } else {
      const userCart = getLocalStorageItem("user_cart");
      const cart = userCart ? JSON.parse(userCart) : [];
      cart.push(...productList);
      setLocalStorageItem("user_cart", JSON.stringify(cart));
      queryClient.invalidateQueries({ queryKey: ["cart", userId] });
      toast.success("Added to Cart");
    }
  };

  const updateUserCartdata = (
    uId: number,
    product: TCartProduct,
    productQuantity: number,
  ) => {
    queryClient.setQueryData(
      ["cart", userId],
      (old: AxiosResponse<TCartListResponse>) => {
        return {
          ...old,
          data: {
            ...old.data,
            carts: old.data.carts.map((cart) => {
              if (cart.id === uId) {
                const unitDiscountedPrice = getDiscountAmount(
                  product.price,
                  product.discountPercentage,
                );
                const producttotal = Number(
                  (product.price * productQuantity).toFixed(2),
                );
                const productDiscountTotal = Number(
                  (productQuantity * unitDiscountedPrice).toFixed(2),
                );
                let prevcurrentProductQuantity = productQuantity;
                return {
                  ...cart,
                  products: cart.products.map((productCart: TCartProduct) => {
                    if (productCart.id === product.id) {
                      prevcurrentProductQuantity = productCart.quantity;
                      return {
                        ...productCart,
                        quantity: productQuantity,
                        total: Number(
                          (productCart.price * productQuantity).toFixed(2),
                        ),
                        discountedTotal: Number(
                          (productQuantity * unitDiscountedPrice).toFixed(2),
                        ),
                      };
                    }
                    return productCart;
                  }),
                  total: Number(
                    (old.data.carts[0].total + producttotal).toFixed(2),
                  ),
                  discountedTotal: Number(
                    (
                      old.data.carts[0].discountedTotal + productDiscountTotal
                    ).toFixed(2),
                  ),
                  totalQuantity:
                    old.data.carts[0].totalQuantity -
                    prevcurrentProductQuantity +
                    productQuantity,
                };
              }
            }),
          },
        };
      },
    );
  };
  const deleteProductCart = (product: TCartProduct, uId: number) => {
    queryClient.setQueryData(
      ["cart", userId],
      (old: AxiosResponse<TCartListResponse>) => {
        return {
          ...old,
          data: {
            ...old.data,
            carts: old.data.carts.map((cart) => {
              if (cart.id === uId) {
                const unitDiscountedPrice = getDiscountAmount(
                  product.price,
                  product.discountPercentage,
                );
                const producttotal = Number(
                  (product.price * product.quantity).toFixed(2),
                );
                const productDiscountTotal = Number(
                  (product.quantity * unitDiscountedPrice).toFixed(2),
                );
                console.log(
                  cart.products.filter(
                    (productCart: TCartProduct) =>
                      productCart.id !== product.id,
                  ),
                );

                return {
                  ...cart,
                  products: cart.products.filter(
                    (productCart: TCartProduct) =>
                      productCart.id !== product.id,
                  ),
                  total: Number(
                    (old.data.carts[0].total - producttotal).toFixed(2),
                  ),
                  discountedTotal: Number(
                    (
                      old.data.carts[0].discountedTotal - productDiscountTotal
                    ).toFixed(2),
                  ),
                  totalQuantity:
                    old.data.carts[0].totalQuantity - product.quantity,
                  totalProducts: old.data.carts[0].totalProducts - 1,
                };
              }
            }),
          },
        };
      },
    );
  };

  const clearCartData = (uId: number) => {
    queryClient.setQueryData(
      ["cart", userId],
      (old: AxiosResponse<TCartListResponse> | undefined) => {
        if (!old) return old;

        return {
          ...old,
          data: {
            ...old.data,
            carts: old.data.carts.map((cart) => {
              if (cart.userId === uId) {
                return {
                  ...cart,
                  products: [],
                  total: 0,
                  discountedTotal: 0,
                  totalProducts: 0,
                  totalQuantity: 0,
                };
              }
              return cart;
            }),
          },
        };
      },
    );
  };
  const findProductCart = (productid: number): boolean => {
    if (!cartQuery.data) return false;
    return cartQuery.data?.products?.some(
      (product: any) => product.id === productid,
    );
  };
  const getUserCartDataLength = () => {
    return cartQuery?.data?.products?.length ?? 0;
  };
  return {
    getUserCartData,
    getUserCartDataLength,
    setUserCartData,
    updateUserCartdata,
    findProductCart,
    deleteProductCart,
    clearCartData,
  };
};

export default useCart;
