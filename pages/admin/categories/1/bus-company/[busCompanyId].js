import React, { useState, useEffect } from "react";
import LoadingSpinner from "@/UI/LoadingSpinner";
import { GenerateNumBusArr, ShowBus } from "@/Functions/Bus";
import axios from '@/lib/axios'
import { useRouter } from "next/router"
import UserInfoUl from '@/UI/Short/UserInfoUl';
import NumberToStrignSeat from "@/Functions/NumberToStrignSeat";
import { useAuth } from "hooks/use-Auth"
import toast from "react-hot-toast";
import NoInfo from "@/Ui/NoInfo";
import useTranslation from 'next-translate/useTranslation'
import { Info, Person, LocalPhone, Delete } from "@mui/icons-material";
import Link from "next/link"
import { IconButton, Container, Grid } from "@mui/material";
import DeleteModal from "@/Modals/DeleteModal";

export default function BusCompany({ match }) {
    const { user, isLoading } = useAuth({ middleware: 'auth' })
    const { t, lang } = useTranslation("all")

    const router = useRouter()
    const [stringSeat, setStringSeat] = useState(NumberToStrignSeat(t));
    const [deleteSeat, setDeleteSeat] = useState(false);
    const [deleteSeatId, setDeleteSeatId] = useState(null);

    const [error, setError] = useState(false);
    const [loadingButton, setLoadingButton] = useState(false);
    const [last, setLast] = useState(5);
    const [arrBus, setArrBus] = useState([]);
    const [busBookSeats, setBusBookSeats] = useState([]);
    const [arrBusBookAdminCompany, setArrBusBookAdminCompany] = useState([]); //just for show admin book arr
    const [loading, setLoading] = useState(true);
    const [allBookSeatsFromApi, setAllBookSeatsFromApi] = useState([]);
    const handledelete1 = () => {
        setBusBookSeats(busBookSeats.filter((x) => x.id !== +setDeleteSeatId));
        setDeleteSeatId(null)
      };
    const handleCompanyBook = (seat) => {
        if (arrBusBookAdminCompany.findIndex(x => x === +seat) == -1) {
            setArrBusBookAdminCompany([...arrBusBookAdminCompany, seat])
        } else {
            setArrBusBookAdminCompany(arrBusBookAdminCompany.filter((x) => x !== +seat))
        }
    }
    useEffect(() => {
        if (router.query.busCompanyId) {

            axios
                .get(`${process.env.NEXT_PUBLIC_SERVER}/trip/${router.query.busCompanyId}/generate/bus`)
                .then((response) => {
                    if (response.status === 200) {
                        const bus = response.data.data.busVariable;
                        setLast(bus.last_seats);
                        setArrBus(GenerateNumBusArr(bus.number_of_rows, bus.right_seats, bus.left_seats, bus.last_seats, bus.front_door, bus.last_door, response.data.data.busSeats).chairList);
                        setArrBusBookAdminCompany(response.data.data.busSeats.filter(x => x.is_company === 1).map(x => x.seat_number))
                        setBusBookSeats(response.data.data.busSeats.filter(x => (x.is_booking === 1 && x.is_company != 1)))
                        setAllBookSeatsFromApi(response.data.data.busSeats.filter(x => (x.is_company === 1 || x.is_booking === 1)).map(x => x.seat_number))
                        setLoading(false)
                        setError(false)

                    }
                })
                .catch((error) => {
                    console.error("There was an error!", error);
                    setLoading(false)
                    setError(true)
                    toast.error("عذرا حدثت مشكلة ما");

                });
        }
    }, [router.query.busCompanyId]);

    const handleSubmit = (e) => {
        setLoadingButton(true);
        e.preventDefault();
        axios
            .post(`${process.env.NEXT_PUBLIC_SERVER}/trip/${router.query.busCompanyId}/companySeat/add`, { company_seat: arrBusBookAdminCompany })
            .then((response) => {
                setLoadingButton(false);
                router.push("/admin/categories/1")
            })
            .catch((error) => {
                console.error("There was an error!", error);
                setLoadingButton(false);
                toast.error("عذرا حدثت مشكلة ما");

            });

    };

    if (error) {
        return <NoInfo error />;
    }
    if (isLoading || !user || loading) {
        return <div className="loading-parent"><LoadingSpinner /></div>
    }
    return (
        <>
            {/* start AdminBus */}
            <form onSubmit={handleSubmit}>
                <section className="h-bus">
                    <div className="container">
                        <div >
                            <h2 className="fw-bold h-h1 top text-end">حجوزات الرحلة:</h2>
                            <Container maxWidth="md">
                                <Grid container spacing={4} >
                                    <Grid item md={6}>
                                        <h6 className="fw-bold" >مقاعد الشركة:</h6>
                                        <div className="h-book-adminarr">
                                            {arrBusBookAdminCompany.length ? arrBusBookAdminCompany.join(", ") : "لا يوجد مقاعد"}
                                        </div>
                                        <div className="company-seats">
                                            {busBookSeats && busBookSeats.map((seat, index) => (
                                                <div className="mb-3" key={index}>
                                                    <div>
                                                        <div className="d-between">
                                                            <h4 className="h-dot-blue">{`المقعد  ${stringSeat[seat.seat_number]}`} </h4>
                                                            <Link href={`/admin/seat/${seat.id}`}>
                                                                <a>
                                                                    <IconButton>
                                                                        <Info color="primary" fontSize="large" alt="info" />
                                                                    </IconButton>
                                                                </a>
                                                            </Link>
                                                            <IconButton
                                                                onClick={() => {
                                                                    setDeleteSeat(true);
                                                                    setDeleteSeatId(seat.id);
                                                                }}
                                                            >
                                                                <Delete color="primary" fontSize="large" alt="delete" />
                                                            </IconButton>

                                                        </div>

                                                        <ul className="h-avialabel-trip pe-5 fw-bold">
                                                            <li>
                                                                <Person color="primary" fontSize="small" alt="name" className="ms-2" />
                                                                <bdi>{seat.name}</bdi>
                                                                <bdi> </bdi>
                                                                <bdi>{seat.last_name}</bdi>
                                                            </li>
                                                            <li>
                                                                <a href={`tel:${seat.phone_number}`}>
                                                                    <LocalPhone color="primary" fontSize="small" alt="phone" className="ms-2" />
                                                                    <bdi>{seat.phone_number}</bdi>
                                                                </a>
                                                            </li>
                                                        </ul>
                                                    </div>

                                                    {/* <UserInfoUl head="h4" seatNumber={stringSeat[seat.seat_number]} firstName={seat.name} lastName={seat.last_name} phoneNumber={seat.phone_number} link={`/admin/seat/${seat.id}`} /> */}
                                                </div>
                                            ))}
                                        </div>
                                        <button
                                            className={`btn h-button  big my-4 mx-auto d-block position-relative`}
                                            type="submit"
                                        >
                                            {loadingButton ? <><LoadingSpinner /> <span className="opacity-0">load</span></> : "حفظ"}
                                        </button>
                                    </Grid>
                                    <Grid item md={6}>
                                        <ShowBus arrBus={arrBus} last={last} book="admin" handleChooseBook={handleCompanyBook} allBookSeatsFromApi={[]}
                                        // row={row} last={last} arrBus={arrBus} book={"admin"} bookArr={arrBusBook} bookArrTotal={pull_data}
                                        //  bookArrGenerate={arrBusBookFromApi}
                                        />
                                    </Grid>
                                </Grid>
                            </Container>
                        </div>
                    </div>
                </section>

            </form>
            {deleteSeatId && (
                <DeleteModal
                    openModal={deleteSeat}
                    name={` الحجز باسم ${busBookSeats.find((x) => x.id === +deleteSeatId).name || ""}`}
                        // !change root
                    url={`/car/${deleteSeatId}`}
                    onCancle={() => setDeleteSeat(false)}
                    handledelete1={handledelete1}
                />
            )}
            {/* end AdminBus */}
        </>
    );
}

