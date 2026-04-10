

import {apiGet, createBrowserApiClient} from "@/lib/api.helper";
import {Product} from "@/types";

export async function getBookById(id: string) {
    const client = createBrowserApiClient();

    try {
        const product = await apiGet<any>(client, `/products/${id}`);
        console.log(product, "product")
        return product;
    } catch (error) {
        console.error("Failed to fetch product with Axios:", error);
        return null;
    }
}



export async function getSimilarBooks(currentBookId: string) {
    const client = createBrowserApiClient();

    try {
        // Fetch all books
        const res = await apiGet<any>(client, "/products");
        const allBooks = Array.isArray(res.data) ? res.data : [];

        // Filter out current book
        const filtered = allBooks.filter((b : Product) => String(b.id) !== String(currentBookId));

        // Take only 3 random books
        const shuffled = filtered.sort(() => 0.5 - Math.random());

        // Ensure price is a number for rendering
        return shuffled.map((b : Product) => ({
            ...b,
            price: parseFloat(b.price ?? "0"),
        })).slice(0, 3);
    } catch (err) {
        console.error("Failed to fetch similar books:", err);
        return [];
    }
}