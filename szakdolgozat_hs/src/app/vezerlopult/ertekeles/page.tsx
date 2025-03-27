"use client"

import OrangeButton from "@/components/OrangeButton";
import ReviewCard, { IReviewCard } from "@/components/ReviewCard";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faCartShopping, faCircleXmark, faStar, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { enqueueSnackbar } from "notistack";
import { useEffect, useState } from "react";


export default function Page() {

    useEffect(() => {
        require('bootstrap/dist/js/bootstrap.bundle.min.js')
    }, [])

    const [activeStars, setActiveStars] = useState<number>(0); // Tracks how many stars are active
    const [reviews, setReviews] = useState<IReviewCard[]>([])
    const [reviewText, setReviewText] = useState<string>("")
    const [count, setCount] = useState(0)

    const fetchReviews = async () => {
        try {
            const res = await fetch("/api/reviews", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "X-Api-Key": process.env.NEXT_PUBLIC_API_KEY || ""
                },
                credentials: "include"
            })
            const data = await res.json()
            if (res.ok) {
                setReviews(data)
            }
        } catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        fetchReviews()
    }, [])

    const handleSubmit = async() => {

        if(reviewText === ""){
            enqueueSnackbar("Az értékelés mező nem lehet üres", {variant: "error", autoHideDuration: 2000})
            return
        }

        if(activeStars === 0){
            enqueueSnackbar("Elfelejtettél csillagot megadni", {variant: "error", autoHideDuration: 2000})
            return
        }

        try{
            const res = await fetch("/api/reviews", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Api-Key": process.env.NEXT_PUBLIC_API_KEY || ""
                },
                credentials: "include",
                body: JSON.stringify({
                    text: reviewText,
                    rating: activeStars
                })
            })
            if(res.ok){
                setReviewText("")
                setActiveStars(0)
                fetchReviews()
                enqueueSnackbar("Vélemény sikeres létrehozva", {variant: "success", autoHideDuration: 2000})
            }
        }catch(e){
            console.error(e)
        }
    }

    const handleDelete = async(id: number) => {
        try{
            const res = await fetch(`/api/reviews/?id=${id}`, {
                method: "DELETE",

                headers: {
                    "Content-Type": "application/json",
                    "X-Api-Key": process.env.NEXT_PUBLIC_API_KEY || ""
                },
                credentials: "include"
            })

            console.log('res?', res.status)

            if(res.ok){
                fetchReviews()
                enqueueSnackbar("Vélemény sikeresen törölve", {variant: "success", autoHideDuration: 2000})
            }
        }catch(e){
            console.error(e)
            enqueueSnackbar("A véleményt nem sikerült törölni", {variant: "error", autoHideDuration: 2000})
        }
    }


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
                {reviews.length === 0 ? (
                    <div className="emptyCart">
                        <div className="emptyIconWrap">
                            <FontAwesomeIcon icon={faStar as IconProp} />
                            <FontAwesomeIcon icon={faCircleXmark as IconProp} />
                        </div>
                        Még nincs értékelésed
                    </div>
                ) : (
                    
                    <>
                        {reviews.map((review) => (
                            <div key={review.id} className="col-12 mb-3 position-relative">
                                <ReviewCard
                                    /*data={{
                                        ...review,
                                        createdAt: new Date(review.createdAt).toLocaleDateString("hu-HU")
                                    }}*/
                                   data={review}
                                />
                                <button 
                                    className="reviewDelete"
                                    onClick={() => {
                                        handleDelete(review.id)
                                    }}
                                    >
                                    <FontAwesomeIcon icon={faTrash as IconProp}/>
                                </button>
                            </div>
                        ))}
                    </>
                )}
            </div>

            <div className="modal fade" id="reviewModal" tabIndex={-1} aria-labelledby="reviewModal" aria-hidden="true">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Értékelés írása</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            
                            <form onSubmit={(e) => e.preventDefault()}>
                                <div className="form-floating">
                                    <textarea 
                                        className="form-control" 
                                        placeholder="Leave a comment here" 
                                        id="floatingTextarea"
                                        value={reviewText}
                                        maxLength={350}
                                        onChange={(e) => {
                                            setReviewText(e.target.value)
                                            /*setCount(e.target.value.length)*/
                                        }}
                                        >
                                    </textarea>
                                    <label htmlFor="floatingTextarea">Értékelés</label>
                                    <span>{count} / 350</span>
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
                            <button 
                                type="button" 
                                className="orangeButton ms-3"
                                onClick={handleSubmit}
                                data-bs-dismiss="modal"
                            >
                                Mentés
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}