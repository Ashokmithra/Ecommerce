import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getSingleProduct } from "../services/api";
import type { AxiosError } from "axios";
import InvalidPage from "@/pages/auth/InvalidPage";
import { Spinner } from "@/components/ui/spinner";
import type { Product, TReviews } from "../types";
import { getDiscountAmount } from "@/utils";
import StarRating from "@/components/common/StarRating";
import { Badge } from "@/components/ui/badge";
import { useMemo, useState } from "react";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FaTruck } from "react-icons/fa";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import RatingBreakDown from "@/components/common/RatingBreakDown";
import { getLocalStorageItem } from "@/utils/localStorage";
import QuantityCount from "@/components/common/QuantityCount";
import useCart from "@/hooks/useCart";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const cart = useCart();
  const productdetail = useQuery({
    queryKey: ["productDetail", id],
    queryFn: () => getSingleProduct(Number(id)),
    retry: false,
    enabled: !!id,
  });

  const axiosError = productdetail.error as AxiosError;
  const status = axiosError?.response?.status;
  const productData = productdetail.data?.data as Product;
  const [productCount, setProductCount] = useState<number>(1);
  const [sort, setSort] = useState<string>("");
  const [order, setOrder] = useState<string>("");
  const navigate = useNavigate();

  const sortedReviews: Array<TReviews> = useMemo(() => {
    const productData = productdetail.data?.data as Product;
    const rawReviews = productData?.reviews ?? [];

    const result = [...rawReviews];

    if (sort === "latest") {
      result.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );
    } else if (sort === "rating") {
      result.sort((a, b) => {
        return order === "asc" ? a.rating - b.rating : b.rating - a.rating;
      });
    }

    return result;
  }, [productdetail, sort, order]);

  if (productdetail.isPending) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner className="h-15 w-15" />
      </div>
    );
  }

  if (productdetail.isError) {
    const message =
      status === 404 ? "Product Not Found" : "Something went wrong";
    return <InvalidPage errorMessage={message} />;
  }

  const sortReviewHandler = (value: string) => {
    const [sort, order] = value.split("/");
    setSort(sort);
    setOrder(order);
  };
  const discountPrice = getDiscountAmount(
    productData.price,
    productData.discountPercentage,
  );

  const addToCartHandler = (productId: number) => {
    cart.setUserCartData(Number(getLocalStorageItem("id")), [
      {
        id: productId,
        quantity: productCount,
      },
    ]);
  };
  const cartNavigateHandler = () => {
    navigate("/cart");
  };

  return (
    <div className="min-h-screen w-full p-4 lg:p-8 space-y-8">
      <div className="productDetail grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="image-section flex items-center justify-center bg-gray-100 rounded-lg p-4 min-h-75">
          <img
            src={productData.images[0]}
            alt={productData.title}
            className="h-138"
            // className="max-h-full object-contain mix-blend-multiply"
          />
        </div>

        <div className="product-detail bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="text-blue-500 font-semibold text-sm">
            {productData.brand}
          </div>
          <h1 className="text-3xl font-bold">{productData.title}</h1>
          <div className="flex  items-center gap-2  font-semibold my-2 text-sm">
            <StarRating rating={productData.rating} />
            <span className="text-slate-600 font-thin ">
              {productData.rating}
            </span>
            <span className="text-blue-500 font-semibold mx-1">
              {productData.reviews.length} reviews
            </span>
          </div>
          <Badge className="bg-gray-200 text-black">
            {productData.category}
          </Badge>

          <div className="border border-slate-100 w-full my-8"></div>
          <div className="flex my-4 gap-3  items-center">
            <div className=" text-3xl font-bold ">${discountPrice}</div>
            <div className="text-2xl font-thin text-gray-500 line-through">
              ${productData.price}
            </div>
            <Badge className="text-xs! mt-1! rounded-sm bg-blue-500 text-white  ">
              {Math.round(productData.discountPercentage)}% OFF
            </Badge>
          </div>
          <p className="text-gray-600 mt-2 leading-7">
            {productData.description}
          </p>
          <div className="border border-slate-100 w-full my-8"></div>
          <div className="productCount flex w-full gap-4  items-center">
            {!cart.findProductCart(productData.id) && (
              <div className="countModifier">
                <span className="text-sm  font-semibold text-slate-500">
                  Quantity
                </span>
                <QuantityCount
                  max={productData.stock}
                  productCount={productCount}
                  setProductCount={setProductCount}
                />
              </div>
            )}
            <div className="stockStatus  flex flex-col">
              <div
                className={`font-semibold text-sm ${
                  productData.availabilityStatus === "In Stock"
                    ? "text-green-600"
                    : "text-red-500"
                }`}
              >
                {productData.availabilityStatus}
              </div>
              <div className="text-slate-500 font-thin text-xs">
                Only {productData.stock} left
              </div>
            </div>
          </div>
          <div className="productGet flex w-full  mt-6 gap-1 items-center">
            <div className="w-1/2 flex justify-center">
              {!cart.findProductCart(productData.id) ? (
                <Button
                  className="w-full bg-blue-500 shadow-xl"
                  onClick={() => addToCartHandler(productData.id)}
                >
                  AddToCart
                </Button>
              ) : (
                <Button
                  className="w-full bg-blue-500 shadow-xl"
                  onClick={cartNavigateHandler}
                >
                  GoToCart
                </Button>
              )}
            </div>
            <div className="w-0.5 h-8 bg-slate-300 "></div>
            <div className="w-1/2 flex justify-center">
              <Button
                className="w-full text-black bg-transparent! border border-black hover:bg-black! hover:text-white shadow-xl"
                name="viewProduct"
                // onClick={(event) => viewProductHandler(event, product.id)}
              >
                Buy Now
              </Button>
            </div>
          </div>
          <div className="Info flex  h-10 w-full gap-5 items-center mt-6 text-sm text-slate-500 px-2">
            <div className="flex flex-1 items-center h-full gap-2">
              <FaTruck className="h-6 w-6 text-black" />
              <p className="wrap-break-word">
                Deliverd within {productData.shippingInformation}
              </p>
            </div>
            <div className=" flex flex-1 items-center h-full gap-2">
              <ShieldCheck className="h-6 w-6 text-black"></ShieldCheck>
              <p className="wrap-break-word">
                {productData.warrantyInformation}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="reviewsection p-4 lg:p-8 w-full  text-white   rounded-lg flex flex-col gap-10">
        <div className="statics-section">
          <Card className="p-4 lg:p-8 ">
            <div className="flex w-full items-center gap-6">
              <div className="overallview flex flex-col items-center">
                <div className="text-5xl font-bold">
                  {Number(productData.rating.toFixed(1))}
                </div>
                <StarRating rating={productData.rating} />
                <div className="text-sm font-thin text-slate-500 mt-1">
                  out of 5
                </div>
                <div className="text-sm font-thin text-slate-500 mt-1">
                  {productData.reviews.length} reviews
                </div>
              </div>

              <div className="self-stretch w-px bg-slate-200"></div>

              <div className="w-full">
                <RatingBreakDown
                  ratings={productData.reviews.map((review) => review.rating)}
                />
              </div>
            </div>
          </Card>
        </div>
        <div className="reviews-section">
          <div className="font-bold text-2xl text-black">Customer Reviews</div>
          <div className="border border-slate-200 w-full"></div>
          <div className="review-section flex flex-col items-end w-full my-4">
            <Select onValueChange={sortReviewHandler}>
              <SelectTrigger className="w-full max-w-48 text-black focus-visible:ring-0  border-2 border-slate-300 shadow-lg">
                <SelectValue placeholder="Sort By" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectGroup>
                  <SelectItem value="latest">Latest</SelectItem>
                  <SelectItem value="price/desc">
                    Price - high to low
                  </SelectItem>
                  <SelectItem value="rating/asc">
                    Rating - low to high
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div className="reviews ">
            {sortedReviews.length > 0 &&
              sortedReviews.map((data) => (
                <Card className="p-4 lg:p-8 mb-4 bg-gray-50">
                  <div className="header-section flex  w-full">
                    <div className="NameDate flex flex-col">
                      <div className="name font-bold">{data.reviewerName}</div>
                      <div className="date font-thin text-sm text-slate-500">
                        {new Date(data.date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                      <div className="email font-thin text-sm text-blue-500">
                        {data.reviewerEmail}
                      </div>
                    </div>
                    <div className="flex  items-center gap-2 text-sm ml-auto">
                      <StarRating rating={data.rating} />
                    </div>
                  </div>
                  <div className="text-black">{data.comment}</div>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
