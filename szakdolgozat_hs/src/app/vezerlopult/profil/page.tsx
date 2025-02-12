import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Page() {
    return (
        <>
            <div className="row">
                <div className="col-4">
                    <div className="d-flex flex-column justify-content-center align-items-center w-100">
                        <div className="dashboardProfilKepWrap">
                            <FontAwesomeIcon icon={faUser as IconProp} />
                        </div>
                        <h1 className="mt-3">Példa Név</h1>
                        <h5>pelda@email.hu</h5>
                    </div>
                </div>
                <div className="col-8">

                </div>
            </div>
        </>
    )
}