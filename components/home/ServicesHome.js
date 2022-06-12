import React from 'react'
import img1 from 'public/images/trips.jpg'
import img2 from 'public/images/airplane-seating-pain.jpg'
import img3 from 'public/images/car-driver-services-in-delhi-500x500.jpg'
import Image from 'next/image'
import useTranslation from 'next-translate/useTranslation'

export default function ServicesHome() {
    const { t, lang } = useTranslation()

    const datas = [
        { img: img3, head: t("all:private_car"), text: t("all:you_can_travel_in_a_car_for_a_more_special_and_speed_trip" )},
        { img: img2, head: t("all:choose_your_seat"), text: t("all:you_can_choose_your_seat_on_the_trip") },
        { img: img1, head: t("all:various_trips"), text: t("all:daily_trips_and_visa_to_various_cities") },
    ]
    return (
        <div className="h-home-services">
            <div className="container">
                <div className="row">
                    {datas.map((data, index) => (
                        <div className="col-md-4" key={index}>
                            <div className="card radius-2 text-center">
                                <div className="img  radius-2">
                                    <Image src={data.img} alt="service1" className="w-100" /></div>
                                <h3 >{data.head}</h3>
                                <p>{data.text}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
