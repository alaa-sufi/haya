import React from 'react'
import   Link from "next/link"
import { Info, Person, LocalPhone, Mail } from "@mui/icons-material";
import { IconButton } from "@mui/material";


export default function UserInfoUl({ head, seatNumber, firstName, lastName, phoneNumber, link }) {
    return (
        <div>
            <div className="d-between">
                {head === "h3" ? <h3 className="h-dot-blue fw-bold">{`المقعد ${seatNumber}`} </h3> : <h4 className="h-dot-blue">{`المقعد  ${seatNumber}`} </h4>}
                {link && <Link href={link}>
                   <a>
                   <IconButton>
                        <Info color="primary" fontSize="large" alt="info" />
                    </IconButton>
                   </a>
                </Link>}
            </div>

            <ul className="h-avialabel-trip pe-5 fw-bold">
                <li>
                    <Person color="primary" fontSize="small" alt="name" className="ms-2" />
                    <bdi>{firstName}</bdi>
                    <bdi> </bdi>
                    <bdi>{lastName}</bdi>
                </li>
                <li>
                    <a href={`tel:${phoneNumber}`}>
                        <LocalPhone color="primary" fontSize="small" alt="phone" className="ms-2" />
                        <bdi>{phoneNumber}</bdi>
                    </a>
                </li>
            </ul>
        </div>
    )
}
