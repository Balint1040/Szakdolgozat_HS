"use client"

import { useEffect } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowTrendDown, faCircleCheck, faGaugeHigh, faShieldHalved } from '@fortawesome/free-solid-svg-icons'
import { IconProp } from "@fortawesome/fontawesome-svg-core"

export default function Strengths() {
    useEffect(() => {
        const sCardWraps = document.querySelectorAll('.sCardWrap')
        let index = 0
        const className = 'highlight' 
        
        const addClassInSequence = () => {
            sCardWraps.forEach((wrap) => wrap.classList.remove(className))
            sCardWraps[index].classList.add(className)
            index = (index + 1) % sCardWraps.length 
            setTimeout(addClassInSequence, 2000) 
        }

        addClassInSequence() 

    }, []) 

    return (
        <section id="strengths" className="position-relative">
            <div className="container">
                <div className="row">
                    <div className="col-12 col-sm-6 col-lg-3 mb-sm-4">
                        <div className="d-flex justify-content-center flex-column sCardWrap">
                            <FontAwesomeIcon icon={faGaugeHigh as IconProp} />
                            <div className="text-center fs-3 mt-2">Gyors</div>
                        </div>
                    </div>
                    <div className="col-12 col-sm-6 col-lg-3 mb-sm-4">
                        <div className="d-flex justify-content-center flex-column sCardWrap">
                            <FontAwesomeIcon icon={faCircleCheck as IconProp} />
                            <div className="text-center fs-3 mt-2">Megbízható</div>
                        </div>
                    </div>
                    <div className="col-12 col-sm-6 col-lg-3 mb-sm-4">
                        <div className="d-flex justify-content-center flex-column sCardWrap">
                            <FontAwesomeIcon icon={faShieldHalved as IconProp} />
                            <div className="text-center fs-3 mt-2">Biztonságos</div>
                        </div>
                    </div>
                    <div className="col-12 col-sm-6 col-lg-3 mb-sm-4">
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
