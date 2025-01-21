import { create } from "zustand";

export const useLocationStore = create((set, get) => ({
    userLocation: null,
    currentPage: 1,
    totalPages: 1,
    setCurrentPage: (value) => {
        set({ currentPage: value });
    },
    setTotalPages: (value) => {
        set({ totalPages: value });
    },
    setUserLocation: (lat, lng) => {
        set({ userLocation: { lat, lng } });
    },
    cardAllData: [],
    setCardAllData: (value) => {
        set({ cardAllData: value });
    },
    isCardLoading: false,
    setCardLoading: (value) => {
        set({ isCardLoading: value });

    },
    handlePageChange: (newPage) => {
        const { totalPages } = get()
        if (newPage >= 1 && newPage <= totalPages) {
            set({ currentPage: newPage });
        }
    }
}))