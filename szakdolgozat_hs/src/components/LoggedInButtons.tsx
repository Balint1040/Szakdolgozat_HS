import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faCartShopping, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function LoggedInButtons() {
    return (
        <div className="d-flex flex-row justify-content-between">
            <a className="loggedInCartButton me-3" href="">
                <FontAwesomeIcon icon={faCartShopping as IconProp} />
            </a>
            <a className="loggedInCartButton" href="">
                <FontAwesomeIcon icon={faUser as IconProp} />
            </a>
        </div>
    )
}