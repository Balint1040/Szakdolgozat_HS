import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { faCartShopping } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

interface OrangeCartButtonProps {
    href: string
    onClick: (e: React.MouseEvent) => void
}

export default function OrangeCartButton({href, onClick} : OrangeCartButtonProps) {
    return (
        <a 
        className="orangeCartButton" 
        href={href}
        onClick={onClick}
        >
            <FontAwesomeIcon icon={faCartShopping as IconProp} />
        </a>
    )
}