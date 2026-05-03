import { Minus, Plus } from "lucide-react";

type TQuantityProps = {
  max?: number;
  productCount: number;
  setProductCount: (newCount: number) => void;
};

const QuantityCount = ({
  max = 5,
  productCount,
  setProductCount,
}: TQuantityProps) => {
  const handleDecrement = () => {
    if (productCount > 1) {
      setProductCount(productCount - 1);
    }
  };

  const handleIncrement = () => {
    if (productCount < max) {
      setProductCount(productCount + 1);
    }
  };

  return (
    <div className="h-10 w-30 border border-slate-200 shadow-sm rounded-md mt-1.5 flex items-center px-2">
      <Minus
        className={`h-4 w-4 ${productCount === 1 ? "text-slate-300 cursor-not-allowed" : "cursor-pointer"}`}
        onClick={handleDecrement}
      />

      <span className="flex-1 text-center font-medium select-none text-sm">
        {productCount}
      </span>

      <Plus
        className={`h-4 w-4 ${productCount >= max ? "text-slate-300 cursor-not-allowed" : "cursor-pointer"}`}
        onClick={handleIncrement}
      />
    </div>
  );
};

export default QuantityCount;
