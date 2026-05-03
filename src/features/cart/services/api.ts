import api from "@/services/api";

export const getUserCart = (userId: string | null) => {
  const url = "/carts/user/" + userId;
  return api.get(url);
};

export const addCart = (productData) => {
  return api.post("/carts/add", productData);
};
