export interface CartItem {
 id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  quantity: number;
  width?:string;
}


export interface CartSummaryProps {
  cartItems: CartItem[];
  updateQty: (id: number, delta: number) => void;
  removeItem: (id: number) => void;
}
