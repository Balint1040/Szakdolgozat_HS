import jwt from 'jsonwebtoken'
import { cookies } from "next/headers"

export default async function LoggedValidation({
    loggedIn,
    notLoggedIn,
} : {
    loggedIn: JSX.Element,
    notLoggedIn: JSX.Element,
}) {

    const cookieStore = cookies()
    const token = (await cookieStore).get("auth_token")

    if (token === undefined) {
        return notLoggedIn
    }
    const decoded = jwt.verify(token.value, process.env.JWT_SECRET!)
    if (typeof decoded !== 'string') {
        return loggedIn
    }
}