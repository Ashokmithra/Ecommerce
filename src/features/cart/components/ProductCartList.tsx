import { Card } from "@/components/ui/card";
import type { TCartProduct } from "../types";
import { useMemo, useState } from "react";
import QuantityCount from "@/components/common/QuantityCount";
import { Button } from "@/components/ui/button";
import { getDiscountAmount } from "@/utils";
import { getLocalStorageItem } from "@/utils/localStorage";
import useCart from "@/hooks/useCart";

type TCartProductProps = {
  product: TCartProduct;
};
const ProductCartList = ({ product }: TCartProductProps) => {
  const [productCount, setProductCount] = useState<number>(product.quantity);
  const { updateUserCartdata, deleteProductCart } = useCart();
  const currentDiscountPrice = useMemo(() => {
    const unitDiscountedPrice = getDiscountAmount(
      product.price,
      product.discountPercentage,
    );
    return productCount * unitDiscountedPrice;
  }, [product.discountPercentage, product.price, productCount]);

  const currentDiscountTotal = useMemo(() => {
    const total = productCount * product.price;
    return total - currentDiscountPrice;
  }, [productCount, product.price, currentDiscountPrice]);

  const handleQuantityChange = (newCount: number) => {
    setProductCount(newCount);
    updateUserCartdata(Number(getLocalStorageItem("id")), product, newCount);
  };

  const removeCartItem = () => {
    deleteProductCart(product, Number(getLocalStorageItem("id")));
  };
  return (
    <Card className="p-8">
      <div className="w-full flex">
        <div className="img h-30 w-30">
          <img src={product.thumbnail} alt={product.title} />
        </div>
        <div className="content flex  flex-col gap-2 w-full">
          <div className="title text-xl font-bold">{product.title}</div>
          <div className="total flex flex-col gap-4 w-full">
            <div className="count flex w-full items-center justify-between">
              <QuantityCount
                productCount={productCount}
                setProductCount={handleQuantityChange}
              />
              <div className="totalcount flex flex-col">
                <div className="discountPrice text-xl font-bold">
                  ${Number(currentDiscountPrice).toFixed(2)}
                </div>
                <div className="productPrice line-through text-sm text-slate-500">
                  ${product.price}
                </div>
                <div className="save font-semibold text-sm text-green-700">
                  You save ${Number(currentDiscountTotal).toFixed(2)}
                </div>
              </div>
            </div>
            <Button onClick={removeCartItem} className="w-30 cursor-pointer">
              Remove
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProductCartList;
