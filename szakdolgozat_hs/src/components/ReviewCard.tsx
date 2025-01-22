import { IconProp } from "@fortawesome/fontawesome-svg-core"
import { faStar } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

type Star = 1|2|3|4|5
export interface IReviewCard {
    id: number
    name: string,
    text: string,
    star: Star
}

export default function ReviewCard({
    data
} : {
    data: IReviewCard
}) {
    return (
        <div className="reviewCard d-flex flex-column justify-content-center align-items-center p-5" key={data.id}>
            <p className="text-center fs-3">{data.text}</p>
            <span>
                {[...Array(data.star).keys()].map((i = 1) => (
                    <FontAwesomeIcon icon={faStar as IconProp}  key={"star-" + i++}/>
                ))}
            </span>
            <span className="fs-4 text-Orange">- {data.name}</span>
        </div>
    )
}