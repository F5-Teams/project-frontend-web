import { useState, useEffect } from "react";
import { spaApi } from "@/services/spa/api";

interface ServiceLink {
  id: number;
  comboId: number;
  serviceId: number;
  service: {
    id: number;
    name: string;
    price: string;
    duration: number;
    description: string;
    isActive: boolean;
    images: Array<{
      id: number;
      imageUrl: string;
    }>;
  };
}

interface Combo {
  id: number;
  name: string;
  price: string;
  duration: number;
  description: string;
  isActive: boolean;
  serviceLinks: ServiceLink[];
}

// Global cache for combos
let combosCache: Combo[] | null = null;
let isLoading = false;
let loadingPromise: Promise<Combo[]> | null = null;

export const useCombos = () => {
  const [combos, setCombos] = useState<Combo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = async () => {
    // Clear cache and reload
    combosCache = null;
    loadCombos();
  };

  const loadCombos = async () => {
    // If already cached, use cache
    if (combosCache) {
      setCombos(combosCache);
      setLoading(false);
      setError(null);
      return;
    }

    // If already loading, wait for the existing promise
    if (isLoading && loadingPromise) {
      try {
        const result = await loadingPromise;
        setCombos(result);
        setError(null);
        return;
      } catch (err) {
        const errorMsg =
          err instanceof Error ? err.message : "Error loading combos";
        console.error("Error loading combos:", err);
        setError(errorMsg);
        return;
      }
    }

    // Start loading
    setLoading(true);
    setError(null);
    isLoading = true;

    try {
      console.log("🔄 useCombos: Fetching combos from API...");
      loadingPromise = spaApi.getAvailableCombos();
      const result = await loadingPromise;

      // Cache the result
      combosCache = result;
      setCombos(result);
      console.log(
        "✅ useCombos: Combos loaded and cached:",
        result.length,
        "items"
      );
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "Error fetching combos";
      console.error("❌ useCombos: Error fetching combos:", err);
      setError(errorMsg);
    } finally {
      setLoading(false);
      isLoading = false;
      loadingPromise = null;
    }
  };

  useEffect(() => {
    loadCombos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { combos, loading, error, refetch };
};

// Helper function to find combo by serviceIds (exact match)
export const findComboByServiceIds = (
  serviceIds: number[],
  combos: Combo[]
): Combo | null => {
  return (
    combos.find((combo) => {
      const comboServiceIds = combo.serviceLinks.map((link) => link.serviceId);
      // Check if both arrays have the same length (exact match)
      if (comboServiceIds.length !== serviceIds.length) {
        return false;
      }
      // Check if all serviceIds in the item are present in this combo
      return serviceIds.every((serviceId) =>
        comboServiceIds.includes(serviceId)
      );
    }) || null
  );
};

// Helper function to get service names by serviceIds
export const getServiceNamesByServiceIds = (
  serviceIds: number[],
  combos: Combo[]
): string[] => {
  const serviceNames: string[] = [];

  for (const serviceId of serviceIds) {
    for (const combo of combos) {
      const serviceLink = combo.serviceLinks.find(
        (link) => link.serviceId === serviceId
      );
      if (serviceLink) {
        serviceNames.push(serviceLink.service.name);
        break;
      }
    }
  }

  return serviceNames;
};
