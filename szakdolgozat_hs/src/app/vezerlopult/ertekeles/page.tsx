"use client"

import OrangeButton from "@/components/OrangeButton";
import ReviewCard, { IReviewCard } from "@/components/ReviewCard";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faStar, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

const review1 = {
    id: 1,
    name: "Horváth Győző",
    text: '"Kiváló webshop, szép termékválaszték. Pontos és gyors szállítás. Volt egy garanciális jellegű problémám, de ez az én hibám volt, és a személyzet minden segítséget megadott, amire szükségem volt, műszaki és pénzügyi tanácsokkal kiegészítve. Ennél jobb ügyfélszolgálatot nem is lehet kérni."',
    star: 5,
    date: "2025. 02. 11."
}

export default function Page() {

    useEffect(() => {
        require('bootstrap/dist/js/bootstrap.bundle.min.js')
    }, [])

    const [activeStars, setActiveStars] = useState<number>(0); // Tracks how many stars are active

    const handleStar = (event: React.MouseEvent) => {
        const clickedElement = event.currentTarget as HTMLElement;
        const id = clickedElement.id; // This gets the ID of the clicked star wrapper
        const starNumber = parseInt(id.replace("starWrap-", ""), 10); // Extract the number from the ID

        // Set the active stars based on the clicked star
        setActiveStars(starNumber);
    };

    return (
        <div className="container-fluid py-3 dashboardReviewsContainer">
            <div className="row">
                <div className="d-flex flex-column flex-sm-row justify-content-between align-items-center">
                    <h1 className="mb-0">Értékelések</h1>
                    <a
                        className="orangeButton"
                        data-bs-toggle="modal" 
                        data-bs-target="#reviewModal"
                    >
                        Értékelés írása
                    </a>
                </div>
            </div>
            <hr />
            <div className="row py-3">
                <div className="col-12 mb-3 position-relative">
                    <ReviewCard data={review1 as IReviewCard} />
                    <button
                        className="reviewDelete"
                    >
                        <FontAwesomeIcon icon={faTrash as IconProp} />
                    </button>
                </div>
                <div className="col-12 mb-3 position-relative">
                    <ReviewCard data={review1 as IReviewCard} />
                    <button
                        className="reviewDelete"
                    >
                        <FontAwesomeIcon icon={faTrash as IconProp} />
                    </button>
                </div>
            </div>

            <div className="modal fade" id="reviewModal" tabIndex={-1} aria-labelledby="reviewModal" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered modal-fullscreen">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Értékelés írása</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            
                            <form onSubmit={(e) => e.preventDefault()}>
                                <div className="form-floating">
                                    <textarea className="form-control" placeholder="Leave a comment here" id="floatingTextarea">
                                    </textarea>
                                    <label htmlFor="floatingTextarea">Értékelés</label>
                                </div>
                                <div className="d-flex w-100 justify-content-center mt-5 fs-3">
                                    {[...Array(5).keys()].map((i) => (
                                        <span
                                            key={"star-" + (i + 1)} // The key needs to be unique
                                            id={"starWrap-" + (i + 1)} // This is the wrapper ID
                                            className={`star-wrapper ${i + 1 <= activeStars ? "activeStar" : ""}`} // Apply activeStar to active stars
                                            onClick={handleStar} // Click handler
                                        >
                                            <FontAwesomeIcon
                                                icon={faStar as IconProp}
                                                className={`star ${i + 1 <= activeStars ? "activeStar" : ""}`} // Apply activeStar to the icon
                                                id={"star-" + (i + 1)} // The star ID
                                            />
                                        </span>
                                    ))}
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="blueButton" data-bs-dismiss="modal">Mégse</button>
                            <button type="button" className="orangeButton ms-3">Mentés</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}