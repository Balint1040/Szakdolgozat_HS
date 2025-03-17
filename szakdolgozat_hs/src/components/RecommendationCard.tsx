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
import { useState } from "react"
import { addToCart } from "@/utils/addToCart"
import OrangeCartButton from "./OrangeCartButton"



export default function RecommendationCard({
    data
} : {
    data: Product
}) {

    const [quantity, setQuantity] = useState<Quantity>(1 as Quantity)

    const handleAddToCart = async(e: React.MouseEvent) => {
        e.preventDefault()
        try{
            await addToCart(data, quantity)
        }catch(e){
            console.error(e)
        }
    }

    const imageSrc = data.imageUrl ? data.imageUrl : (data.url ? data.url : undefined)

    return (
        <div className="recommendationCard">
            <a href="#" className="imgWrap">
                <img src={imageSrc} alt={data.name} />
                <div className="imgHover"><FontAwesomeIcon icon={faMagnifyingGlassPlus as IconProp} /></div>
            </a>
            <h4>{data.name}</h4>
            <div className="propertiesWrap">
                {
                    Object.entries(data.properties).slice(0, 4).map(([key, value], i) => (
                        <div key={i} className="row propertyRow">
                            <span className="w-50 propertyKey">{key}:</span>
                            <span className="w-50 propertyValue">{value}</span>
                        </div>
                    ))
                }
            </div>
            
            <div className="d-flex justify-content-between recommendationBottomRowWrap">
                <div className="d-flex justify-content-between">
                    <a href={"/termekek/" + data.id} className="recommendationMore">Bővebben <FontAwesomeIcon icon={faArrowRight as IconProp} className="ms-2" /></a>
                    <div className="recommendationPrice"><span className="text-Blue">{data.price.toFixed(0).replace(/(\d)(?=(\d{3})+$)/g, "$1.")}</span>.-</div>
                </div>
                <div className="d-flex flex-row justify-content-between mt-3">
                    <div className="quantityWrap">
                        <a className="pointer" onClick={() => quantity > 1 && setQuantity(q => (q - 1) as Quantity) }>-</a>
                        <h3>{quantity}</h3>
                        <a className="pointer" onClick={() => setQuantity(q => (q + 1) as Quantity)}>+</a>
                    </div>
                    <button className="orangeButton" onClick={handleAddToCart}>Kosárba</button>
                </div>
            </div>
        </div>
    )
}