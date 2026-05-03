import { useInfiniteQuery } from "@tanstack/react-query";
import { getListProducts } from "../services/api";
import type { Product } from "../types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StarRating from "@/components/common/StarRating";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCallback, useMemo, useRef, type ReactEventHandler } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Stocks } from "../constant/productDetail";
import { SkeletonCard } from "@/components/common/SkeletonCard";
import { getDiscountAmount } from "@/utils";

const ProductList = () => {
  const [searchparam] = useSearchParams();
  const sortby = searchparam.get("sortBy") || "";
  const order = searchparam.get("order") || "asc";
  const search = searchparam.get("search") || "";
  const category = searchparam.get("category") || "";
  const stock = searchparam.getAll("stock") || "all";
  const rating = searchparam.getAll("rating") || "all";
  const price = searchparam.get("price")?.split(",") || ["0", "1000"];
  const navigate = useNavigate();

  const allProductsQuery = useInfiniteQuery({
    queryKey: ["allproducts", { search, category }],
    queryFn: ({ pageParam = 0 }) =>
      getListProducts({ pageParam, search, category }),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => {
      const nextSkip = lastPage.data.skip + lastPage.data.limit;

      if (nextSkip >= lastPage.data.total) {
        return undefined;
      }
      return nextSkip;
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const allProducts: Product[] =
    allProductsQuery?.data?.pages.flatMap(
      (page) => page.data?.products ?? [],
    ) ?? [];

  const filterProducts = useMemo(() => {
    let selectedProduct: Product[] = [];
    const StockList = Stocks.filter((stk) => {
      return stock.includes(stk.id);
    }).map((stk) => stk.name);
    if (StockList.length !== 0) {
      selectedProduct.push(
        ...allProducts.filter(
          (product) =>
            StockList.includes(product.availabilityStatus) && product,
        ),
      );
    } else selectedProduct = allProducts;

    const priceProduct = selectedProduct.filter((product) => {
      return (
        product.price >= parseInt(price[0]) &&
        product.price <= parseInt(price[1])
      );
    });
    selectedProduct = priceProduct;

    if (rating.length > 0) {
      const ratingProduct = selectedProduct.filter(({ rating: rat }) => {
        return (
          (rating.includes("b2") && rat <= 2) ||
          (rating.includes("a2b3") && rat > 2 && rat <= 3) ||
          (rating.includes("a3b4") && rat > 3 && rat <= 4) ||
          (rating.includes("a4b5") && rat > 4 && rat <= 5)
        );
      });
      selectedProduct = ratingProduct;
    }

    if (sortby !== "") {
      if (order === "asc") {
        switch (sortby) {
          case "price":
            selectedProduct.sort((a, b) => a.price - b.price);
            break;
          case "rating":
            selectedProduct.sort((a, b) => a.rating - b.rating);
            break;
          case "title":
            selectedProduct.sort((a, b) => a.title.localeCompare(b.title));
            break;
        }
      } else {
        switch (sortby) {
          case "price":
            selectedProduct.sort((a, b) => b.price - a.price);
            break;
          case "rating":
            selectedProduct.sort((a, b) => b.rating - a.rating);
            break;
        }
      }
    }
    return selectedProduct;
  }, [sortby, order, stock, rating, allProductsQuery, price]);

  const containerRef = useRef<HTMLDivElement>(null);

  const viewProductHandler = (
    event: React.MouseEvent<HTMLElement>,
    productId: number,
  ) => {
    navigate(`/product/${productId}`, { replace: false });
  };

  const handleScroll = useCallback(async () => {
    const container = containerRef.current;
    if (!container) return;
    const { scrollTop, scrollHeight, clientHeight } = container;

    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 5;

    if (isAtBottom) {
      if (allProductsQuery.hasNextPage && !allProductsQuery.isFetching) {
        await allProductsQuery.fetchNextPage();
      }
    }
  }, [allProductsQuery]);
  return (
    <div
      className="p-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 h-212.75 overflow-y-auto w-full gap-3 auto-rows-[420px] relative cursor-pointer"
      ref={containerRef}
      onScroll={handleScroll}
    >
      {filterProducts &&
        filterProducts.map((product: Product) => {
          const discountPrice = getDiscountAmount(
            product.price,
            product.discountPercentage,
          );
          return (
            <Card
              className="h-full w-full shadow shadow-gray-500 p-2 max-h-full  "
              onClick={(event) => viewProductHandler(event, product.id)}
            >
              <div className="w-full flex justify-end">
                <Badge
                  variant={
                    product.availabilityStatus === "In Stock"
                      ? "success"
                      : "destructive"
                  }
                  className=" text-xs flex justify-end"
                >
                  {product.availabilityStatus}
                </Badge>
              </div>
              <div className="flex  justify-center  w-full! h-55">
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-4/5"
                />
              </div>
              <div className="Content flex flex-col w-full px-2">
                <div className=" font-semibold ">
                  <span>{product.title}</span>
                  {product.brand && <span>,{product.brand}</span>}
                </div>
                <div className="flex my-1 gap-1  items-center">
                  <div className=" text-xl font-bold ">${discountPrice}</div>
                  <div className="text-sm font-lighter line-through">
                    ${product.price}
                  </div>
                  <div className="text-emerald-600 font-bold text-lg">
                    {Math.round(product.discountPercentage)}% off
                  </div>
                </div>
                <div className="flex  items-center gap-2 text-sm">
                  <span>Rating</span>
                  <StarRating rating={product.rating} />
                  <span>{product.rating}</span>
                </div>
              </div>
            </Card>
          );
        })}
      {allProductsQuery.isFetching &&
        Array.from({ length: 8 }).map((_, index) => (
          <SkeletonCard key={index} />
        ))}
    </div>
  );
};

export default ProductList;
