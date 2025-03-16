import { useState, useEffect } from "react";

export function useFetchRacks(racks_collection: string, endpoint: string = "") {
    const [racks, setRacks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRacks = async () => {
            const cacheKey = `${racks_collection}-${endpoint}`;
            const cachedData = sessionStorage.getItem(cacheKey);
            if (cachedData) {
                setRacks(JSON.parse(cachedData));
                setLoading(false);
                return;
            }

            try {
                const url = endpoint || `${import.meta.env.VITE_API_URL}/api/v2/r/${racks_collection}/`;
                console.log(url);
                const response = await fetch(url);
                if (!response.ok) throw new Error("Error al obtener los racks");
                const data = await response.json();
                data.sort((a: { order: number }, b: { order: number }) => a.order - b.order);
                sessionStorage.setItem(cacheKey, JSON.stringify(data));
                setRacks(data);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchRacks();
    }, [racks_collection, endpoint]);

    return { racks, loading, error };
}
