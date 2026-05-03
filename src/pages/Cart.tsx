import ProductList from "@/features/cart/components/ProductList";

const Cart = () => {
  return (
    <div className="h-full w-full">
      <div className="h-full w-full py-4 lg:py-8">
        <ProductList />
      </div>
    </div>
  );
};

export default Cart;
