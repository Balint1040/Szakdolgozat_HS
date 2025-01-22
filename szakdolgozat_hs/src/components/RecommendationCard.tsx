import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import OrangeButton from "./OrangeButton"
import { faArrowRight, faMagnifyingGlassPlus } from "@fortawesome/free-solid-svg-icons"
import { IconProp } from "@fortawesome/fontawesome-svg-core"

type Enumerate<N extends number, Acc extends number[] = []> = Acc['length'] extends N
    ? Acc[number]
    : Enumerate<N, [...Acc, Acc['length']]>
type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>
type Quantity = IntRange<1, 50>

export interface IRecommendationCard {
    id: number
    name: string
    desc: string
    img: string
    price: number
    quantity: Quantity
}



export default function RecommendationCard({
    data
} : {
    data: IRecommendationCard
}) {
    return (
        <div className="recommendationCard">
            <a href="#" className="imgWrap">
                <img src={data.img} />
                <div className="imgHover"><FontAwesomeIcon icon={faMagnifyingGlassPlus as IconProp} /></div>
            </a>
            <h4>{data.name}</h4>
            <p>{data.desc}</p>
            
            <div className="d-flex justify-content-between recommendationBottomRowWrap">
                <div className="d-flex justify-content-between">
                    <a href="#" className="recommendationMore">Bővebben <FontAwesomeIcon icon={faArrowRight as IconProp} className="ms-2" /></a>
                    <div className="recommendationPrice"><span className="text-Blue">{data.price}</span>.-</div>
                </div>
                <div className="d-flex flex-row justify-content-between mt-3">
                    <div className="quantityWrap">
                        <a className="" onClick={() => {data.quantity = (data.quantity - 1) as Quantity}}>-</a>
                        <h3>{data.quantity}</h3>
                        <a className="" onClick={() => {data.quantity = (data.quantity + 1) as Quantity}}>+</a>
                    </div>
                    <OrangeButton name="Kosárba" href="#" />
                </div>
            </div>
        </div>
    )
}