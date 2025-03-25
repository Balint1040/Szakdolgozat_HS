import { cookies } from "next/headers"
import jwt from "jsonwebtoken"

export default async function RoleValidation() {

    const cookieStore = cookies()
    const token = (await cookieStore).get("auth_token")

    if (token && token.value) {
        const decoded = jwt.verify(token.value, process.env.JWT_SECRET!)
        if (typeof decoded !== 'string' && decoded.role !== 'admin') {
            return "user"
        } else {
            return "admin"
        }
    } else {
        return "user"
    }
}