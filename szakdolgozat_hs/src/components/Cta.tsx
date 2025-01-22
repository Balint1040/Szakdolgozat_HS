import Image from "next/image";
import BlueButton from "./BlueButton";
import OrangeButton from "./OrangeButton";
import ram from "../../public/static/ram.png"
import gpu from "../../public/static/gpu.png"
import motherb from "../../public/static/motherb.png"

export default function Cta() {
    return (
        <section id="cta" className="position-reltaive py-5 mb-5">
            <div className="container">
                <div className="row">
                    <div className="col-12 col-md-7">
                        <p>
                        <span className="text-Blue">Fedezd fel a <span className="text-Orange">legjobb</span> számítógép alkatrészeket!</span> Frissítsd géped, és élvezd a teljesítményt! Ne várj tovább, válaszd ki álmaid alkatrészét, és vásárolj most!
                        </p>
                        <div className="d-flex pt-4 mt-5">
                            <OrangeButton name="Vásárlok" href="#" variant="discover" />
                            <span className="mx-4"></span>
                            <BlueButton name="Kedvezményes termékek" href="#" variant="discover" />
                        </div>
                    </div>
                    <div className="col-12 col-md-5">
                        <div className="position-relative h-100">
                            <Image src={ram} alt="ram" className="ram"/>
                            <Image src={gpu} alt="gpu" className="gpu"/>
                            <Image src={motherb} alt="motherb"  className="motherb"/>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}