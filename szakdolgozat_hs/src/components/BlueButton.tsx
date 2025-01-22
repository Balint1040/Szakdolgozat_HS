import { IconDefinition, IconProp } from "@fortawesome/fontawesome-svg-core"
import { faArrowRight, faSortDown } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default function BlueButton({
    name,
    href,
    variant
} : {
    name: string,
    href: string,
    variant?: string,
}) {

    let icon = null
    if (variant == "discover") {
        icon = <FontAwesomeIcon icon={faArrowRight as IconProp} />
    } else if (variant == "order") {
        icon = <FontAwesomeIcon icon={faSortDown as IconProp} />
    }
    
    return (
        <a className="blueButton" href={href}>
            {name}
            {icon == null ? "" : icon}
        </a>
    )
}