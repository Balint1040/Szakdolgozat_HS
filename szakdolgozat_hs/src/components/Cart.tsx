import { Product } from "@/app/termekek/page";

export default function Cart({
    product
} : {
    product: Product
}) {
    return (
        <div className="row cartItemRow">
            <div className="col-4 p-0 position-relative h-100">
                <div className="cartImgWrap">
                    <img src={!product.imageUrl ? product.url : product.imageUrl} />
                </div>
            </div>
            <div className="col-8 h-100 position-relative">
                <div className="d-flex flex-column h-100 justify-content-between">
                    <div className="row">
                        <div className="col-9">
                            {product.name}
                        </div>
                        <div className="col-3 text-end">
                            <span className="text-Blue">{product.price.toFixed(0).replace(/(\d)(?=(\d{3})+$)/g, "$1.")}</span>,-
                        </div>
                    </div>
                    <div className="d-flex justify-content-end">
                        <div className="quantityWrap">
                            <a className="">-</a>
                            <h3>1</h3>
                            <a className="">+</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}