import { create } from "zustand";

export const useUser = create((set, get) => ({
    userPackages: {}, 
    setPackage: (data) => set({ userPackages: data }),
}));
