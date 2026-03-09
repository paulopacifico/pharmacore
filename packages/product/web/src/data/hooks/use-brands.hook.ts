import { useContext } from "react";
import { BrandContext } from "../context";

export function useBrands() {
    const context = useContext(BrandContext);

    if (!context) {
        throw new Error("useBrand must be used within a BrandProvider");
    }

    return context;
}
