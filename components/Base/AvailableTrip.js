import React, { useState } from 'react'
import Link  from "next/link";
import {useRouter}  from "next/router";
import { DateRange, AccessTime, LocalAtm, Room, EventSeat ,LocationOn} from '@mui/icons-material';
import { Modal } from "react-bootstrap";
import LoadingSpinner from "components/UI/LoadingSpinner"
import NoInfo from "components/UI/NoInfo"
import { TextField, ImgField, HeaderField, ButtonsField } from "@/UI/Inputs"
import SeatCount from "../Functions/SeatCount"
import { Formik } from "formik";
import * as Yup from "yup";
export default function AvailableTrip({ data, loading, car, prefix,bus, role }) {
    const router = useRouter();
    const [modal, setModal] = useState(false)
    const [tripId, setTripId] = useState()
    const onSubmit = (values) => {
        if (values.count > 0) {
            router.push(`${router.asPath}/trip/${tripId}?total=${values.count}`);
        }
    }
    return (
        <>
            <div className="h-city">
                <h2 className="h-h1">الرحلات المتوفرّة:</h2>
                <div className="row position-relative">
                    {loading ? <LoadingSpinner/>:
                        data.length ? data.map((trip) => (
                            <div className="col-lg-3 col-sm-6 " key={trip.id}>
                                <ul className="h-avialabel-trip radius-2">
                                    {car ?
                                        <>
                                            {role === "user" ? <span className="h-global-a" onClick={() => { setModal(true); setTripId(trip.id) }}></span> :
                                                <Link href={prefix ? `${router.asPath}/${prefix}/${trip.id}` : `${router.asPath}/${trip.id}`}  >
                                                    <a className="h-global-a"></a>
                                                </Link>
                                                }
                                            <li>
                                                <Room color="primary" fontSize="small" alt="icon" className="ms-2" />
                                                {"حلب - دمشق"}</li>

                                            <li>
                                                <DateRange color="primary" fontSize="small" alt="icon" className="ms-2" />
                                                {trip.begin_date}</li>
                                            <li>
                                                <EventSeat color="primary" fontSize="small" alt="icon" className="ms-2" />
                                                <bdi> باقي </bdi><bdi>{SeatCount(trip.period)}</bdi>
                                            </li>
                                            <li>
                                                <LocalAtm color="primary" fontSize="small" alt="icon" className="ms-2" />
                                                {trip.price} ل.س</li>
                                        </>
                                        :
                                        <>
                                              <Link href={prefix ? `${router.asPath}/${prefix}/${trip.id}` : `${router.asPath}/${trip.id}`}  >
                                                    <a className="h-global-a"></a>
                                                </Link>
                                            <li>
                                                <DateRange color="primary" fontSize="small" alt="icon" className="ms-2" />
                                                {new Date(trip.begin_date).toLocaleDateString('zh-Hans-CN')}</li>
                                            <li>
                                                <AccessTime color="primary" fontSize="small" alt="icon" className="ms-2" />
                                                {trip.period} أيام</li>
                                            <li>
                                                <LocalAtm color="primary" fontSize="small" alt="icon" className="ms-2" />
                                                {trip.price} ل.س</li>
                                            <li>
                                                <LocationOn color="primary" fontSize="small" alt="icon" className="ms-2" />
                                                 من {trip.from_city}</li>
                                            <li>
                                                <LocationOn color="primary" fontSize="small" alt="icon" className="ms-2" />
                                                إلى {trip.to_city}</li>
                                        </>
                                    }
                                </ul>
                            </div>
                        ))
                            :
                            <NoInfo size="small" />
                    
                    }
                </div>
            </div>
         
        </>
    )
}
