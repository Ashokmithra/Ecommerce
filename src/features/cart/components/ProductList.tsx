import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import useCart from "@/hooks/useCart";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import type { TCartProduct } from "../types";
import ProductCartList from "./ProductCartList";
import { getLocalStorageItem } from "@/utils/localStorage";

const ProductList = () => {
  const cartItems = useCart().getUserCartData();
  const products = cartItems?.products ?? [];
  const navigate = useNavigate();
  const { clearCartData } = useCart();

  const navigateToProducts = () => {
    navigate("/");
  };

  const clearCart = () => {
    clearCartData(Number(getLocalStorageItem("id")));
  };

  return products.length > 0 ? (
    <div className="w-full  grid grid-cols-1  lg:grid-cols-3  gap-4 lg:gap-8  px-4 lg:max-w-310  mx-auto">
      <div className="lg:col-span-2 flex flex-col gap-2">
        <div className="topic flex items-center justify-between p-4">
          <div className="text-3xl font-bold">Your Cart</div>
          <div className="clearAll justify-end">
            <Button className="cursor-pointer" onClick={clearCart}>
              Clear All
            </Button>
          </div>
        </div>
        {products.map((product: TCartProduct) => {
          return <ProductCartList key={product.id} product={product} />;
        })}
      </div>
      <Card className="h-full max-h-95 p-6">
        <div className="font-semibold text-xl">Order Summary</div>
        <hr />
        <div className="order-details text-sm text-slate-500 font-semibold flex flex-col gap-3">
          <div className="items flex items-center justify-between ">
            <div>Items({cartItems.totalQuantity})</div>
            <div className="line-through">${cartItems.total}</div>
          </div>
          <div className="items flex items-center justify-between ">
            <div>SubTotal</div>
            <div className=" text-black">${cartItems.discountedTotal}</div>
          </div>
          <div className="items flex items-center justify-between ">
            <div>Product Discount</div>
            <div className=" text-green-600">
              -${Number(cartItems.total - cartItems.discountedTotal).toFixed(2)}
            </div>
          </div>
        </div>
        <hr />
        <div className="totalPayable  flex items-center justify-between font-semibold">
          <div className="text-lg text-black">Total Payable</div>
          <div className="text-xl">${cartItems.discountedTotal}</div>
        </div>
        <Button>Proceed to Checkout</Button>
      </Card>
    </div>
  ) : (
    <div className="h-full w-full flex flex-col justify-center items-center gap-2">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-black text-5xl text-white ">
        <AiOutlineShoppingCart />
      </div>
      <div className="text-4xl">Your cart is empty</div>
      <div className="w-150 text-center">
        Looks like you haven't added anything yet. Explore our latest collection
        and find something you'll love.
      </div>
      <Button className="cursor-pointer" onClick={navigateToProducts}>
        Shop Now
      </Button>
    </div>
  );
};

export default ProductList;
