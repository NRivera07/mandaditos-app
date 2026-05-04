import { create } from "zustand";

type StatusOrder = "Pendiente" | "En curso" | "Completado";

type Order = {
  id: string;
  description: string;
  tipo: string;
  status: StatusOrder;
  lat: number;
  lng: number;
  phone: number;
  customerName: string;
};

type Store = {
  orders: Order[];
  aceptarMandado: (id: string) => void;
  updateStatus: (id: string, status: StatusOrder) => void;
};

export const useOrdersStore = create<Store>((set) => ({
  orders: [
    {
      id: "1",
      description: "Comprar medicina",
      tipo: "farmacia",
      status: "Pendiente",
      phone: 57574464,
      lat: 12.104510189318631,
      lng: -85.37116033485523,
      customerName: "Juan Perez",
    },
    {
      id: "2",
      description: "Ir al banco",
      tipo: "banco",
      status: "Pendiente",
      phone: 57574464,
      lat: 12.1072922641739,
      lng: -85.37033454465575,
      customerName: "Maria Lopez",
    },
  ],

  aceptarMandado: (id) =>
    set((state) => ({
      orders: state.orders.map((m) =>
        m.id === id ? { ...m, status: "En curso" } : m
      ),
    })),

  updateStatus: (id: string, status: StatusOrder) =>
    set((state) => ({
      orders: state.orders.map((m) => (m.id === id ? { ...m, status } : m)),
    })),
}));
