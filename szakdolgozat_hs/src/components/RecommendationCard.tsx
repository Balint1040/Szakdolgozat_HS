import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import OrangeButton from "./OrangeButton"
import { faArrowRight, faMagnifyingGlassPlus } from "@fortawesome/free-solid-svg-icons"
import { IconProp } from "@fortawesome/fontawesome-svg-core"

type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
    ? Acc[number]
    : Enumerate<N, [...Acc, Acc['length']]>
type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>
export type Quantity = IntRange<1, 50>

import { Product } from "@/app/termekek/page"



export default function RecommendationCard({
    data
} : {
    data: Product
}) {
    return (
        <div className="recommendationCard">
            <a href="#" className="imgWrap">
                <img src={data.url} />
                <div className="imgHover"><FontAwesomeIcon icon={faMagnifyingGlassPlus as IconProp} /></div>
            </a>
            <h4>{data.name}</h4>
            <p>{JSON.stringify(data.properties).slice(0, 120 - 3) + '...'}</p>
            
            <div className="d-flex justify-content-between recommendationBottomRowWrap">
                <div className="d-flex justify-content-between">
                    <a href="#" className="recommendationMore">Bővebben <FontAwesomeIcon icon={faArrowRight as IconProp} className="ms-2" /></a>
                    <div className="recommendationPrice"><span className="text-Blue">{data.price}</span>.-</div>
                </div>
                <div className="d-flex flex-row justify-content-between mt-3">
                    <div className="quantityWrap">
                        <a className="" onClick={() => {data.price = (data.price - 1) as Quantity}}>-</a>
                        <h3>1</h3>
                        <a className="" onClick={() => {data.price = (data.price + 1) as Quantity}}>+</a>
                    </div>
                    <OrangeButton name="Kosárba" href="#" />
                </div>
            </div>
        </div>
    )
}