import Image from 'next/image'
import React from 'react'

export default function LogoCompany({name , img}) {
    return (
        <div className="d-flex align-items-center mb-3 gap-3">
        {/* <Image src={img} alt={name} className="radius-1 shadow h-logo-company-img" width="130"  style={{maxWidth: "30vw"}}/> */}
        <Image src={img} alt={name} className="radius-1 shadow h-logo-company-img" width="130" height="130"  style={{maxWidth: "30vw"}}/>
        <h3 className="fw-bold">{name}</h3>
        </div>
    )
}
