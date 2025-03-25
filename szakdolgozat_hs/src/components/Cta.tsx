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
                    <div className="col-12 col-lg-7">
                        <p data-aos="zoom-in-up" data-aos-offset="400">
                        <span className="text-Blue">Fedezd fel a <span className="text-Orange">legjobb</span> számítógép alkatrészeket!</span> Frissítsd géped, és élvezd a teljesítményt! Ne várj tovább, válaszd ki álmaid alkatrészét, és vásárolj most!
                        </p>
                        <div className="d-flex flex-wrap pt-4 mt-5" data-aos="zoom-in-up" data-aos-offset="300">
                            <OrangeButton name="Vásárlok" href="/termekek" variant="discover" />
                            <span className="mx-4 my-2 my-xl-0 d-lg-inline d-block ctaButtonSpan"></span>
                            <BlueButton name="Kedvezményes termékek" href="/termekek" variant="discover" />
                        </div>
                    </div>
                    <div className="col-12 col-lg-5 ctaImgColumn" data-aos="zoom-in-up" data-aos-offset="400">
                        <div className="position-relative h-100">
                            <Image src={ram} alt="floading effect ram" className="ram"/>
                            <Image src={gpu} alt="floading effect gpu" className="gpu"/>
                            <Image src={motherb} alt="floading effect motherb"  className="motherb"/>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}