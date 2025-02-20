import { Product } from "@/app/termekek/page"
import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { faArrowRight, faMagnifyingGlassPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react"
import Link from "next/link"
import OrangeCartButton from "./OrangeCartButton"
import fallbackImg from "../../public/static/imgNotFound.png"

export default function ProductCard({
    data
}: {
    data: Product
}) {

    const [imageError, setImageError] = useState(false)

    const fallbackImageUrl = fallbackImg.src

    function handleLoadingError() {
        setImageError(true)
    }

    const imageSrc = imageError || !data.imageUrl ? fallbackImageUrl : data.imageUrl

    return (
        <div className="recommendationCard productCard">
            <Link href={"/termekek/" + data.id} className="imgWrap">
                <img 
                    src={imageSrc} 
                    onError={handleLoadingError} 
                    alt={data.name}
                />
                <div className="imgHover"><FontAwesomeIcon icon={faMagnifyingGlassPlus as IconProp} /></div>
            </Link>
            <Link href={"/termekek/" + data.id} className="productCardNameLink">
                <h4>{data.name.length < 60 ? data.name : `${data.name.slice(0, 60)}...`}</h4>
            </Link>
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
                    <Link href={"/termekek/" + data.id} className="recommendationMore">Bővebben <FontAwesomeIcon icon={faArrowRight as IconProp} className="ms-2" /></Link>
                    <div className="recommendationPrice">
                        <span className="text-Blue">{data.price.toFixed(0).replace(/(\d)(?=(\d{3})+$)/g, "$1.")}</span>,-</div>
                </div>
                <div className="d-flex flex-row justify-content-between mt-3">
                    <div className="quantityWrap">
                        <a className="">-</a>
                        <h3>1</h3>
                        <a className="">+</a>
                    </div>
                    <OrangeCartButton href={"#"} />
                </div>
            </div>
        </div>
    )
}
