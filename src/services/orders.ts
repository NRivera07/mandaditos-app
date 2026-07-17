import { db } from "@/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export type CreateOrderDto = {
  customerName: string;
  customerId: string;
  categoryId: string;
  description: string;
  location?: {
    latitude: number;
    longitude: number;
  };
};

export const createOrder = async (data: CreateOrderDto) => {
  return addDoc(collection(db, "orders"), {
    ...data,
    location: data.location ?? null,
    status: "pending",
    deliveryId: null,
    createdAt: serverTimestamp(),
  });
};
