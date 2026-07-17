import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";

export type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
};

export const getCategories = async (): Promise<Category[]> => {
  const snapshot = await getDocs(collection(db, "categories"));

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Category[];
};
