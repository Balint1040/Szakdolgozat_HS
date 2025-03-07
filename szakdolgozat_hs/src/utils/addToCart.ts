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
            window.dispatchEvent(new Event("cartUpdated"))
            enqueueSnackbar("Termék sikeresen hozzáadva", {
                variant: "success",
                autoHideDuration: 2500
            })
        } else {
            enqueueSnackbar("Terméket nem sikerült hozzáadni a kosárhoz", {
                variant: "error",
                autoHideDuration: 2500
            })
        }
    } catch (e) {
        console.error(e)
    }
}
