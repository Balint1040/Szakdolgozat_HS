import { pool } from "@/_lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    request: NextRequest,
    context: { params: { id?: string } }
) {


    const params = await context.params
    const id = params.id

    try {

        if (request.headers.get('X-Api-Key') !== process.env.NEXT_PUBLIC_API_KEY) {
            return NextResponse.json({ error: 'Hozzáférés megtagadva' }, { status: 403 })
        }

        const [rows] = await (await pool).execute('SELECT * FROM user WHERE user.id = ?', [id]);

        return NextResponse.json(rows)
    } catch (e) {
        return console.error(e);
    }
}
