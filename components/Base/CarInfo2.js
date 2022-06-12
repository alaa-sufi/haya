import SeatCount from "../Functions/SeatCount"
import { IconButton } from '@mui/material';
import { LocationOn,DateRange } from '@mui/icons-material';
import Image from "next/image";

export default function CarInfo2({ img, name, seats, location,date }) {
    return (
        <div className="row align-items-center mb-3">
            <div className="col-lg-4 col-md-6">
                <Image src={img} alt={name} className="radius-1 w-100" style={{ aspectRatio: "2 / 1" }} />
            </div>
            <div className="col">
                <ul>
                    <li><h4 className="fw-bold">{name} - {SeatCount(seats)}</h4></li>
                    {location && <li><LocationOn color="primary" fontSize="small" alt="location" className="ms-2" />{location}</li>}
                    {date && <li><DateRange color="primary" fontSize="small" alt="dateRange" className="ms-2" />{date}</li>}
                </ul>
            </div>
        </div>
    )
}
