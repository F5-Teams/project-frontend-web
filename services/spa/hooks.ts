import { useState, useEffect } from "react";
import { spaApi, SpaCombo } from "./api";

/**
 * @deprecated Use `useCombos` from @/hooks/useCombos instead for better caching
 * This hook doesn't cache results and may cause duplicate API calls
 */
export const useSpaCombos = () => {
  const [combos, setCombos] = useState<SpaCombo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCombos = async () => {
    console.log("🔄 Starting to fetch spa combos...");
    try {
      setLoading(true);
      setError(null);
      console.log("📡 Calling spaApi.getAvailableCombos()...");
      const combosData = await spaApi.getAvailableCombos();
      console.log("✅ API call successful, data:", combosData);
      setCombos(combosData || []);
    } catch (err: any) {
      console.error("❌ Error fetching spa combos:", err);
      setError(err.message || "Không thể tải danh sách combo spa");
      setCombos([]); // Clear combos on error
    } finally {
      console.log("🏁 Setting loading to false");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCombos();
  }, []);

  return {
    combos,
    loading,
    error,
    refetch: fetchCombos,
  };
};

export const useSpaCombo = (id: string) => {
  const [combo, setCombo] = useState<SpaCombo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCombo = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const comboData = await spaApi.getComboById(id);
      setCombo(comboData);
    } catch (err: any) {
      setError(err.message || "Không thể tải thông tin combo spa");
      console.error("Error fetching spa combo:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCombo();
  }, [id]);

  return {
    combo,
    loading,
    error,
    refetch: fetchCombo,
  };
};
