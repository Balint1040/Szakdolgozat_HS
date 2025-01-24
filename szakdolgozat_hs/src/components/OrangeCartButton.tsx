import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { faCartShopping } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default function OrangeCartButton({
    href
} : {
    href: string
}) {

    
    return (
        <a className="orangeCartButton" href={href}>
            <FontAwesomeIcon icon={faCartShopping as IconProp} />
        </a>
    )
}