export interface IOrder {
  _id: string;
  items: IOrderItem[];
  user: {
    _id: string;
    email: string;
    name: string;
    phone: string;
  };
  transaction: ITransaction;
  totalPrice: number;
  vatFee: number;
  note?: string;
}

interface ITransaction {
  transactionId?: string;
  status?: string;
  paidAt?: string;
  isPaid?: boolean;
  method: string; // STRIPE, PAYPAL, VNPAY, MOMO
}

interface IOrderItem {
  courseId: string;
  name?: string;
  finalPrice?: number;
  thumbnail?: string;
}
