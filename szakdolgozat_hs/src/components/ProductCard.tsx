import { Product } from "@/app/termekek/page"
import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { faArrowRight, faMagnifyingGlassPlus } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState } from "react"
import Link from "next/link"
import OrangeCartButton from "./OrangeCartButton"
import fallbackImg from "../../public/static/imgNotFound.png"
import { Quantity } from "./RecommendationCard"
import { addToCart } from "@/utils/addToCart"

interface ProductCardProps{
    data: Product
}

export default function ProductCard({
    data,
} : ProductCardProps) {

    const [quantity, setQuantity] = useState<Quantity>(1 as Quantity)

    const handleAddToCart = async(e: React.MouseEvent) => {
        e.preventDefault()
        try {
            await addToCart(data, quantity)
        } catch (e) {
            console.error(e)
        }
    }

    let quantityClass = ""
    if (quantity === 1) {
        quantityClass = "disabled"
    } else {
        quantityClass = ""
    }

    const [imageError, setImageError] = useState(false)

    const fallbackImageUrl = fallbackImg.src

    function handleLoadingError() {
        setImageError(true)
    }

    const imageSrc = imageError || !data.imageUrl ? (!data.url ? fallbackImageUrl : data.url) : data.imageUrl

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
                <h4>{/*data.name.length < 60 ? data.name : `${data.name.slice(0, 60)}...`*/ data.name}</h4>
            </Link>
            <div className="propertiesWrap">
                {
                    Object.entries(data.properties).map(([key, value], i) => (
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
                            <a 
                                className={`pointer ${quantityClass}`}
                                onClick={() => quantity > 1 && setQuantity(q => (q - 1) as Quantity)}
                            >
                                -
                            </a>
                            <h3>{quantity}</h3>
                            <a 
                                className="pointer"
                                onClick={() => setQuantity(q => (q + 1) as Quantity)}
                            >
                                +
                            </a>
                        </div>
                        <OrangeCartButton href="#" onClick={handleAddToCart} />
                    </div>
                </div>
            </div>
    )
}
