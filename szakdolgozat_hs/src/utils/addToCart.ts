import { Product } from "@/app/termekek/page"
import { enqueueSnackbar } from 'notistack'

export async function addToCart(product: Product, quantity: number): Promise<void> {
    try {
        const res = await fetch('/api/carts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Api-Key': process.env.NEXT_PUBLIC_API_KEY || ""
            },
            credentials: 'include',
            body: JSON.stringify({
                productId: product.id,
                quantity: quantity
            })
        })
        if (res.ok) {
            enqueueSnackbar("Termék sikeresen hozzáadva")
        } else {
            enqueueSnackbar("Sikertelen hozzáadás", {variant: "error"})
        }
    } catch (e) {
        console.error(e)
    }
}
