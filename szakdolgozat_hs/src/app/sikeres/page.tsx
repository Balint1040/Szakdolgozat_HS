"use client"
import Fireworks from "react-canvas-confetti/dist/presets/fireworks"
import Realistic from "react-canvas-confetti/dist/presets/realistic"
/*<Fireworks autorun={{ speed: 3, duration: 2000, delay: 300 }} />*/
export default function Page() {

    return (
        <>
            <div className="d-flex justify-content-center align-items-center h-100 successPayment">
                Sikeres fizetés
            </div>
            <Realistic autorun={{ speed: 1, duration: 500, delay: 200 }} />
        </>
    )
}