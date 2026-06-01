import { db } from "@/firebase";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs } from "firebase/firestore";

export type Category = {
  id: string;
  name: string;
  icon: string;
  color: string;
};

const getCategories = async (): Promise<Category[]> => {
  const snapshot = await getDocs(collection(db, "categories"));

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Category[];
};

export const useCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });
};
