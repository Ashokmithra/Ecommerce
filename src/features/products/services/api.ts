import api from "@/services/api";

export const getListProducts = ({
  pageParam = 0,
  search = "",
  category = "",
}) => {
  const url = new URL("https://dummyjson.com/products");

  if (category !== "") {
    url.pathname = `/products/category/${category}`;
  }
  if (search !== "") {
    url.pathname = "/products/search";
    url.searchParams.set("q", search);
  }
  url.searchParams.set("limit", "30");
  url.searchParams.set("skip", pageParam.toString());

  return api.get(url.toString());
};

export const getSingleProduct = (id: number) => {
  return api.get(`product/${id}`);
};

export const getAllCategories = () => {
  return api.get("products/categories");
};
