export interface TCartProduct {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountPercentage: number;
  discountedTotal: number;
  thumbnail: string;
}

export interface TProductCartQuantity {
  id: number;
  quantity: number;
}

export interface TCartResponse {
  id: number;
  products: TCartProduct[];
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
}

export interface TCartListResponse {
  carts: TCartResponse[];
  total: number;
  skip: number;
  limit: number;
}
