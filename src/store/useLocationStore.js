import { create } from "zustand";

export const useLocationStore = create((set, get) => ({
    userLocation: null,
    setUserLocation: (lat, lng) => {
        set({ userLocation: { lat, lng } });
    },

}))