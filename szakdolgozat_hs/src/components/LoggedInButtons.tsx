import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faCartShopping, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Link from "next/link";


export default function LoggedInButtons() {
    return (
        <div className="d-flex flex-row justify-content-between">
            <Link className="loggedInCartButton me-3" href="">
                <FontAwesomeIcon icon={faCartShopping as IconProp} />
            </Link>
            <Link className="loggedInCartButton loggedInProfileButton" href="/vezerlopult">
                <FontAwesomeIcon icon={faUser as IconProp} />
            </Link>
        </div>
    )
}