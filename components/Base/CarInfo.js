import Image from "next/image"
import SeatCount from "../Functions/SeatCount"

export default function CarInfo({ img, name, seats }) {
    return (
        <>
            <Image src={img} alt={name ? name: "car"} className="radius-1 w-100" style={{ aspectRatio: "2 / 1" }} />
                <div className="d-flex justify-content-between my-2 fw-bold" >
                    <h5 >{name}</h5>
                    <span>{SeatCount(seats)}</span>
                </div>
        </>
    )
}
