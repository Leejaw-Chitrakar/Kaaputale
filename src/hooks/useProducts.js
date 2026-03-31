/**
 * useProducts.js
 * Reads products from Firestore in real-time.
 * Falls back to the local static products array if Firestore is empty,
 * so the site still works even before products are seeded.
 */
import { useState, useEffect } from "react";
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";
import { db } from "../firebase";

const COLLECTION_PATH = "artifacts/kaaputale-store/public/data/products";

export function useProducts() {
    const [products, setProducts] = useState([]); // start with local data instantly
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const q = query(collection(db, COLLECTION_PATH), orderBy("sortOrder", "asc"));
        const unsub = onSnapshot(
            q,
            (snap) => {
                if (snap.empty) {
                    // No Firestore products yet → keep showing local static data
                    setProducts(staticProducts);
                } else {
                    setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
                }
                setLoading(false);
            },
            (err) => {
                console.warn("Firestore products unavailable, using local data:", err.message);
                setProducts(staticProducts); // fallback gracefully
                setLoading(false);
                setError(err.message);
            }
        );
        return unsub;
    }, []);

    return { products, loading, error };
}
