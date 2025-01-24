export default async function Page({
    params
} : {
    params: Promise<{ id: number }>
}) {
    const id = (await params).id

    return (
        <>
            <h1>Termek aloldal</h1>
            <div>{id}</div>
        </>
    )
}