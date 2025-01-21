import { faArrowRight } from "@fortawesome/free-solid-svg-icons"
import OrangeButton from "./OrangeButton"

export default function Hero() {
    return (
        <section className="position-relative hero">
            <div className="container h-100">
                <div className="row d-flex align-items-center h-100">
                    <div className="contentWrapper">
                        <p className="text-end pb-3">
                            <span className="text-Orange">2.481</span> termékünk várja, hogy kiválaszd a számodra legmegfelelőbbet!
                        </p>
                        <OrangeButton name="Termékek felfedezése" href="https://www.google.com" variant="discover"/>
                    </div>
                </div>
            </div>
        </section>
    )
}