import { Product } from "@/app/termekek/page"
import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { faArrowRight, faMagnifyingGlassPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { Quantity } from "./RecommendationCard"
import OrangeButton from "./OrangeButton"
import OrangeCartButton from "./OrangeCartButton"
import Link from "next/link"


export default function ProductCard({
    data
} : {
    data: Product
}) {
    return (
        <div className="recommendationCard productCard">
            <Link href={"/termekek/" + data.id} className="imgWrap">
                <img src={data.imageUrl} />
                <div className="imgHover"><FontAwesomeIcon icon={faMagnifyingGlassPlus as IconProp} /></div>
            </Link>
            <h4>{(data.name.slice(0, 60).length) < 60 ? data.name : (data.name.slice(0, 60) + "...")}</h4>
            <div className="propertiesWrap">
                {
                    [...Object.entries(data.properties)].map(([key, value], i) => {
                        if (i < 4) {
                            return (
                                <div key={i} className="row propertyRow">
                                    <span className="w-50 propertyKey">{key}:</span>
                                    <span className="w-50 propertyValue">{value}</span>
                                </div>
                            )
                        }
                        return null // if no properties are defined then just return null
                    })
                }
            </div>

            <div className="d-flex justify-content-between recommendationBottomRowWrap">
                <div className="d-flex justify-content-between">
                    <Link href={"/termekek/" + data.id} className="recommendationMore">Bővebben <FontAwesomeIcon icon={faArrowRight as IconProp} className="ms-2" /></Link>
                    <div className="recommendationPrice"><span className="text-Blue">{data.price.toFixed(0).replace(/(\d)(?=(\d{3})+$)/g, "$1.")}</span>,-</div>
                </div>
                <div className="d-flex flex-row justify-content-between mt-3">
                    <div className="quantityWrap">
                        <a className="" onClick={() => { data.price = (data.price - 1) as Quantity }}>-</a>
                        <h3>1</h3>
                        <a className="" onClick={() => { data.price = (data.price + 1) as Quantity }}>+</a>
                    </div>
                    <OrangeCartButton href={"#"} />
                </div>
            </div>
        </div>
    )
}