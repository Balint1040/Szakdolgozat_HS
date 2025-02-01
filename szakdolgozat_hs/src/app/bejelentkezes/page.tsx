export default function Page() {
    return (
        <>
            <div className="loginWrap d-flex justify-content-center align-items-center my-5">
                <div className="loginCard d-flex justify-content-center align-items-center">
                    <form>
                        <h2 className="text-center mb-4">Bejelentkezés</h2>
                        <div className="mb-3">
                            <label htmlFor="email">E-mail cím</label>
                            <input type="email" id="email" required/>
                        </div>
                        <div className="mb-1">
                            <label htmlFor="password">Jelszó</label>
                            <input type="password" id="password" required/>
                        </div>
                        <div className="mb-3 px-2 d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center">
                                <input type="checkbox" id="rememberMe"/>
                                <label htmlFor="rememberMe" className="ps-1 mb-0">Emlékezz rám</label>
                            </div>
                            <a href="#" className="forgotPassword">Elfelejtett jelszó?</a>
                        </div>
                        <div className="d-flex justify-content-center">
                            <button type="submit" className="orangeButton">Bejelentkezés</button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}