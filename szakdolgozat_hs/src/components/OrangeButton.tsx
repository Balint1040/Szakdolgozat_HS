import { IconDefinition, IconProp } from "@fortawesome/fontawesome-svg-core"
import { faArrowRight, faSortDown } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import Link from "next/link"
//import React from "react"

/*interface IProps {
    props: {
        name: string,
        href: string
    }
}*/

export default function OrangeButton({
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
        <Link className="orangeButton" href={href}>
            {name}
            {icon == null ? "" : icon}
        </Link>
    )
}