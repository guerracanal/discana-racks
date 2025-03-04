import { useState, useEffect } from "react";

export function useFetchRacks() {
    const [racks, setRacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchRacks = async () => {
            try {

                const url = import.meta.env.VITE_API_URL + '/api/racks'

                const response = await fetch(url,{
                    /*headers: {
                        'X-Forwarded-Proto': 'https'  // Forza HTTPS en el backend
                      }*/
                });
                
                if (!response.ok) throw new Error("Error al obtener los racks");

                const data = await response.json();

                // Ordenamos los racks por el campo `order`
                data.sort((a: { order: number }, b: { order: number }) => a.order - b.order);


                setRacks(data);
            } catch (err) {
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchRacks();
    }, []);

    return { racks, loading, error };
}
