export default function Page() {
    
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [message, setMessage] = useState('')


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault()

        try {
            const res = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({name, email, password }),
            })

            if (res.ok) {
                const data = await res.json()
                setMessage(data.message)
            } else {
                setMessage('sikertelen')
            }
        } catch (e) {
            console.error(e)
        }
    }
    return (
        <>
            <div className="loginWrap d-flex justify-content-center align-items-center my-5">
                <div className="loginCard d-flex justify-content-center align-items-center">
                    <form onSubmit={handleSubmit}>
                        <h2 className="text-center mb-4">Bejelentkezés</h2>
                        <div className="mb-3">
                            <label htmlFor="email">Név</label>
                            <input 
                            type="name" 
                            id="name" required 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email">E-mail cím</label>
                            <input 
                            type="email" 
                            id="email" required 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="mb-1">
                            <label htmlFor="password">Jelszó</label>
                            <input 
                            type="password" 
                            id="password" required 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <div className="mb-3 px-2 d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                                <input type="checkbox" id="rememberMe" />
                                <label htmlFor="rememberMe" className="ps-1 mb-0">Emlékezz rám</label>
                            </div>
                            <a href="#" className="forgotPassword text-Blue">Elfelejtett jelszó?</a>
                        </div>
                        <div className="d-flex justify-content-center">
                            <button type="submit" className="orangeButton">Bejelentkezés</button>
                            {message && <p className="mt-3">{message}</p>}
                        </div>
                        <div className="text-center mt-4">
                            <span>Még nincs fiókja? <Link href="/regisztracio" className="text-Orange">Regisztrálok</Link></span>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}