import { Product } from "@/app/termekek/page";


interface CartProps {
    product: {
        id: number;
        name: string;
        price: number;
        imageUrl?: string;
        url?: string;
    };
    quantity: number;
    onQuantityChange: (quantity: number) => void;
    onRemove: () => void;
}

export default function Cart({
    product,
    quantity,
    onQuantityChange,
    onRemove
} : CartProps) {
    
    if(!product){
        console.error('Product is missing', product)
    }

    return (
        <div className="row cartItemRow">
            <div className="col-4 p-0 position-relative h-100">
                <div className="cartImgWrap">
                    <img src={!product.imageUrl ? product.url : product.imageUrl} alt={product.name} />
                </div>
            </div>
            <div className="col-8 h-100 position-relative">
                <div className="d-flex flex-column h-100 justify-content-between">
                    <div className="row">
                        <div className="col-9">
                            {product.name}
                        </div>
                        <div className="col-3 text-end">
                            <span className="text-Blue">{(product.price*quantity).toFixed(0).replace(/(\d)(?=(\d{3})+$)/g, "$1.")}</span>,-
                        </div>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                        <button
                        className="btn btn-sm btn-danger"
                        onClick={onRemove}
                        arai-label="Törlés"
                        >
                            Törlés
                        </button>
                    </div>
                    <div className="d-flex justify-content-end">
                        <div className="quantityWrap">
                            <a 
                            className="pointer"
                            onClick={() => quantity > 1 && onQuantityChange(quantity - 1)}
                            >
                            -
                            </a>
                            <h3>{quantity}</h3>
                            <a 
                            className="pointer"
                            onClick={() => onQuantityChange(quantity + 1)}
                            >
                                +
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}