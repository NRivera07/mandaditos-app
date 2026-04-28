import { create } from "zustand";

type Mandado = {
  id: string;
  description: string;
  tipo: string;
  estado: "Pendiente" | "En curso" | "Completado";
  lat: number;
  lng: number;
  phone: number;
};

type Store = {
  mandados: Mandado[];
  aceptarMandado: (id: string) => void;
};

export const useOrdersStore = create<Store>((set) => ({
  mandados: [
    {
      id: "1",
      description: "Comprar medicina",
      tipo: "farmacia",
      estado: "Pendiente",
      phone: 57574464,
      lat: 12.104510189318631,
      lng: -85.37116033485523,
    },
    {
      id: "2",
      description: "Ir al banco",
      tipo: "banco",
      estado: "Pendiente",
      phone: 57574464,
      lat: 12.1072922641739,
      lng: -85.37033454465575,
    },
  ],

  aceptarMandado: (id) =>
    set((state) => ({
      mandados: state.mandados.map((m) =>
        m.id === id ? { ...m, estado: "En curso" } : m
      ),
    })),
}));
