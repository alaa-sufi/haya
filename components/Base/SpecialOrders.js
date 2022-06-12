import { DateRange, AccessTime, LocalPhone, LocationOn } from '@mui/icons-material';
import LoadingSpinner from "../UI/LoadingSpinner"
import NoInfo from "../UI/NoInfo"

export default function SpecialOrders({ data, loading }) {
    return (
        <div className="h-city">
            <h2 className="h-h1">طلبات الرحلات الخاصة</h2>
            <div className="row position-relative">
                {loading ? <LoadingSpinner /> :
                    data ? data.map((trip) => (
                        <div className="col-md-6 " key={trip.id}>
                            <ul className="h-avialabel-trip islink radius-2">
                                <li>
                                    <LocationOn color="primary" fontSize="small" alt="icon" className="ms-2" />
                                    {trip.period}
                                </li>
                                <li>
                                    <DateRange color="primary" fontSize="small" alt="icon" className="ms-2" />
                                    {trip.begin_date}
                                </li>
                                <li>
                                    <LocalPhone color="primary" fontSize="small" alt="icon" className="ms-2" />
                                    {trip.price}</li>
                            </ul>
                        </div>
                    ))
                        :
                        <NoInfo size="small" />
                }
            </div>
        </div>
    )
}
