import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowTrendDown, faCircleCheck, faGaugeHigh, faShieldHalved } from '@fortawesome/free-solid-svg-icons'
import { IconProp } from "@fortawesome/fontawesome-svg-core";

//import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default function Strengths() {
    return (
        <section id="strengths" className="position-relative">
            <div className="container">
                <div className="row">
                    <div className="col-12 col-sm-3">
                        <div className="d-flex justify-content-center flex-column sCardWrap">
                            <FontAwesomeIcon icon={faGaugeHigh as IconProp} />
                            <div className="text-center fs-3 mt-2">Gyors</div>
                        </div>
                    </div>
                    <div className="col-12 col-sm-3">
                        <div className="d-flex justify-content-center flex-column sCardWrap">
                            <FontAwesomeIcon icon={faCircleCheck as IconProp} />
                            <div className="text-center fs-3 mt-2">Megbízható</div>
                        </div>
                    </div>
                    <div className="col-12 col-sm-3">
                        <div className="d-flex justify-content-center flex-column sCardWrap">
                            <FontAwesomeIcon icon={faShieldHalved as IconProp} />
                            <div className="text-center fs-3 mt-2">Biztonságos</div>
                        </div>
                    </div>
                    <div className="col-12 col-sm-3">
                        <div className="d-flex justify-content-center flex-column sCardWrap">
                            <FontAwesomeIcon icon={faArrowTrendDown as IconProp} />
                            <div className="text-center fs-3 mt-2">Kedvező áron</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}