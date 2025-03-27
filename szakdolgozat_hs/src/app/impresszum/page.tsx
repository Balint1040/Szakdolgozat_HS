export default function Page() {
    return (
        <div className="container pb-5">
            <h1 className="mt-5">Impresszum</h1>
            <hr />
            <h3 className="mt-4">Céginformációk</h3>
            <div className="mt-3">
                <p><strong>Cég neve:</strong> HSmarket Kft.</p>
                <p><strong>Cégjegyzékszám:</strong> 01-09-876543</p>
                <p><strong>Székhely:</strong> 9735 Csepreg, Rákóczi u. 13-15.</p>
                <p><strong>Adószám:</strong> 123-456-78-90</p>
                <p><strong>Kapcsolat:</strong> info@hsmarket.hu</p>
                <p><strong>Telefonszám:</strong> +36 20 965 8523</p>
            </div>
            <h3 className="mt-4">Webtárhely Szolgáltató</h3>
            <div className="mt-3">
                <p><strong>Cég neve:</strong> TárhelySzolgáltató Kft.</p>
                <p><strong>Székhely:</strong> 1024 Budapest, Web utca 12.</p>
                <p><strong>Kapcsolat:</strong> support@tarhelyszolgaltato.hu</p>
                <p><strong>Weboldal:</strong> <a href="https://www.tarhelyszolgaltato.hu" target="_blank" rel="noopener noreferrer">www.tarhelyszolgaltato.hu</a></p>
                <p><strong>Szolgáltatás típusa:</strong> Webtárhely és domain regisztrációs szolgáltatások</p>
                <p><strong>Telefonszám:</strong> +36 1 234 5679</p>
            </div>
        </div>
    )
}