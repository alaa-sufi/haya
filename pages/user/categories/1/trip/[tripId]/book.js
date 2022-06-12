import React, { useState, useEffect } from "react";
import Link from "next/link";
import Head from "next/head"
import { Grid, IconButton } from "@mui/material";
import { Modal } from "react-bootstrap";
import { Formik, FieldArray } from "formik";
import { Info, Person, LocalPhone, Edit } from "@mui/icons-material";
import EditSeatModal from "components/Modals/EditSeatModal"
import BookWithDelivery from "components/Modals/BookWithDelivery"
import BookWithDelivery2 from "components/Modals/BookWithDelivery2"
import LoadingSpinner from "components/UI/LoadingSpinner"
import * as Yup from "yup";
import NumberToStrignSeat from "@/Functions/NumberToStrignSeat";
import { GenerateNumBusArr, ShowBus } from "@/Functions/Bus";
import { TextField, ImgField2, HeaderField } from "@/UI/Inputs"
import { useRouter } from "next/router"
import axios from '@/lib/axios'
import toast from "react-hot-toast";
import useTranslation from 'next-translate/useTranslation'
import DefaultImg from "public/images/DefultImg.svg"
export default function BookBus() {
    const { t, lang } = useTranslation("all")
    const router = useRouter();
    //to convert number to string  المقعد الاول و المقعد الثاني
    const [seat, setSeat] = useState(NumberToStrignSeat(t));
    const totalBusBook = router.query.total;

    //current user
    const [currentStep, setCurrentStep] = useState(0);
    const [arrRecommend, setArrRecommend] = useState([]);

    //total of seats want user to book it

    //next step
    const handleNextStep = (newData, final = false) => {
        setData((prev) => ({ ...prev, ...newData }));
        window.scrollTo(0, 0);


        if (final) {
            makeRequest(newData);
            return;
        }

        setCurrentStep((prev) => prev + 1);
    };

    //prev step
    const handlePrevStep = (newData) => {
        window.scrollTo(0, 0);


        setData((prev) => ({ ...prev, ...newData }));
        setCurrentStep((prev) => prev - 1);
    };

    //for initial values
    let a = {
        city: "",
        region: "",
        street: "",
        building_number: ""
    }
    let b = {}
    for (let i = 0; i < totalBusBook; i++) {
        b[`first_name${i}`] = ""
        b[`last_name${i}`] = ""
        b[`seats__image_base64${i}`] = ""
        b[`father_name${i}`] = ""
        b[`mother_name${i}`] = ""
        // b[`email${i}`] = ""
        b[`seats__address${i}`] = ""
        b[`phone_number${i}`] = ""
        b[`date_of_birthday${i}`] = ""
        b[`front_idCard${i}`] = ""
        b[`back_idCard${i}`] = ""
        b[`id_number${i}`] = ""
    }
    let c = Object.assign(a, b)
    const [data, setData] = useState(c)
    const steps = [ <ChooseSeatStep next={handleNextStep} prev={handlePrevStep} data={data} key={totalBusBook + 2} />,
    ...Array(Number.parseInt(+totalBusBook)).fill(
        <SeatsSteps next={handleNextStep} data={data} totalBusBook={totalBusBook} currentStep={+currentStep} seat={seat} prev={handlePrevStep} tripId={router.query.tripId} />,
    ),
    <EditSeats key={totalBusBook + 1} prev={handlePrevStep} next={handleNextStep} seat={seat} />,
   
    <AddressStep next={handleNextStep} prev={handlePrevStep} data={data} key={totalBusBook + 3} />,
    ]

    return (
        <>
            <Head>
                <title>{t("all:al_hayat_company")} - {t("book_the_journey")}</title>
            </Head>
            <section className="h-book-info ">
                <div className="container">
                    {steps[currentStep]}
                </div>
            </section>
        </>
    )
}

const SeatsSteps = (props) => {
    const [currentStep, setCurrentStep] = useState(0)
    const [change, setChange] = useState(false)
    const [tripId, setTripId] = useState(props.tripId)
    const [token, setToken] = useState("")
    const [seat, setSeat] = useState(props.seat)
    const [loadingButton, setLoadingButton] = useState(false)
    const [totalBusBook, setTotalBusBook] = useState(props.totalBusBook)
    const { t, lang } = useTranslation("all")

    let obj = [...Array.from({ length: props.totalBusBook + 1 }, () => new Object())]
    obj[currentStep][`first_name${currentStep}`] = Yup.string().required(t("please_enter_the_name"))
    obj[currentStep][`last_name${currentStep}`] = Yup.string().required(t("please_enter_the_last_name"))
    obj[currentStep][`mother_name${currentStep}`] = Yup.string().required(t("please_enter_the_mothers_name_and_last_name"))
    obj[currentStep][`father_name${currentStep}`] = Yup.string().required(t("please_enter_the_fathers_name"))
    // obj[currentStep][`id_number${currentStep}`] = Yup.number().min(11 , t("please_enter_the_id_number")).max(11 , t("please_enter_the_id_number")).required(t("please_enter_the_id_number"))
    obj[currentStep][`id_number${currentStep}`] = Yup.number().required(t("please_enter_the_id_number"))
    obj[currentStep][`phone_number${currentStep}`] = Yup.string().required(t("please_enter_the_phone_number"))
    // obj[currentStep][`email${currentStep}`] = Yup.string().required(t("please_enter_the_email"))
    obj[currentStep][`date_of_birthday${currentStep}`] = Yup.date().default(function () { return new Date(); })
    obj[currentStep][`front_idCard${currentStep}`] = Yup.string().required(t("please_enter_the_first_face"))
    obj[currentStep][`back_idCard${currentStep}`] = Yup.string().required(t("please_enter_the_back_face"))
    const SeatsStepsValidationSchema = [
        ...Array.from({ length: Number.parseInt(props.totalBusBook) }, (item, index) => (
            Yup.object({
                ...obj[index]
            })
        ))
    ]
    const handleSubmit = (values) => {
        const sendData = {
            token: token,
            number_of_seat: totalBusBook,
            first_name: values[`first_name${currentStep}`],
            last_name: values[`last_name${currentStep}`],
            mother_name: values[`mother_name${currentStep}`],
            father_name: values[`father_name${currentStep}`],
            date_of_birthday: values[`date_of_birthday${currentStep}`],
            id_number: values[`id_number${currentStep}`],
            phone_number: values[`phone_number${currentStep}`],
            // email: values[`email${currentStep}`],
            front_idCard: values[`front_idCard${currentStep}`],
            back_idCard: values[`back_idCard${currentStep}`],
        }
        setLoadingButton(true);
        axios
            .post(`${process.env.NEXT_PUBLIC_SERVER}/${tripId}/booking/seat`, sendData)
            .then((response) => {
                //console.log("response", response)
                setToken(response.data.data.token)
                sessionStorage.setItem("bus-token", response.data.data.token)
                setCurrentStep(currentStep + 1)
                props.next(values);
                setLoadingButton(false);
            })
            .catch((error) => {
                setLoadingButton(false);
                toast.error(t("sorry_a_problem_occurred"));
                console.error("There was an error!", error);
            });
    };
    const handlePrev = (values) => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
            props.prev(values)
        }
    }
    useEffect(() => {
        setChange(false)
        setChange(true)
    }, [currentStep])

    return (
        <Formik
            validationSchema={SeatsStepsValidationSchema[currentStep]}
            initialValues={{ ...props.data, token: "", number_of_seat: totalBusBook }}
            onSubmit={handleSubmit}
        >
            {(props) => (
                <form onSubmit={props.handleSubmit}>
                    <div className={`h-block-blue big`} >
                        <div >
                            <h4 className="fw-bold">{lang === "en" ? `${seat[currentStep + 1]} ${t("the_seat")}` : `${t("the_seat")} ${seat[currentStep + 1]}`} :</h4>
                            <div className={`row `}>
                                <div className="col-md-6">
                                    <TextField name={`first_name${currentStep}`} type="text" label={t("the_name")} />
                                </div>
                                <div className="col-md-6">
                                    <TextField name={`last_name${currentStep}`} type="text" label={t("the_last_name")} />
                                </div>
                                <div className="col-md-6">
                                    <TextField name={`father_name${currentStep}`} type="text" label={t("name_of_the_father")} />
                                </div>
                                <div className="col-md-6">
                                    <TextField name={`mother_name${currentStep}`} type="text" label={t("mothers_name_and_last_name")} />
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <TextField name={`date_of_birthday${currentStep}`} type="date" label={t("place_and_date_of_birth")} />
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <TextField name={`id_number${currentStep}`} type="text" label={t("the_id_number")} />
                                </div>
                                <div className="col-md-6">
                                    <TextField name={`phone_number${currentStep}`} type="text" label={t("mobile_number")} />
                                </div>
                                <div className="col-md-6">
                                    {/* <TextField name={`email${currentStep}`} type="email" label={t("e_mail")} /> */}
                                </div>
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label className="h-label">{t("the_image_of_the_identity")}</label>
                                    </div>
                                </div>
                                <div className="col-12">
                                    <h5>
                                        {t("a_passport_image_can_be_included_if_you_are_non_syrian_or_a_family_book_on_the_babys_page")}
                                    </h5>
                                </div>
                                <div className="col-md-6">
                                    <ImgField2 name={`front_idCard${currentStep}`} label={t("the_first_face")} aspect={2.5 / 1} add={true} width="600" height="250" />
                                </div>
                                <div className="col-md-6">
                                    <ImgField2 name={`back_idCard${currentStep}`} label={t("the_second_face")} aspect={2.5 / 1} add={true} width="600" height="250" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="buttons-parent">
                                {/* <span className={`btn h-button cancle big ${currentStep === 0 ? "disabled" : ""}`} onClick={handlePrev}>{t("prev")}</span> */}
                                <button type="submit" className="btn h-button  big position-relative" >
                                    {loadingButton ? <><LoadingSpinner /> <span className="opacity-0">load</span></> : t("next")}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            )}
        </Formik>
    );
};




const EditSeats = (props) => {
    const { t, lang } = useTranslation("all")
    const [seats, setSeats] = useState(props.seat)
    const [seatsData, setSeatsData] = useState([])
    const [loading, setLoading] = useState(true)
    const [openEditSeat, setOpenEditSeat] = useState(false)
    const [openEditSeatId, setOpenEditSeatId] = useState(null)
    const [indexSeat, setIndexSeat] = useState(null)
    const handleSubmit = () => {
        props.next();
    };
    useEffect(() => {
        axios
            .post(`${process.env.NEXT_PUBLIC_SERVER}/booking/seat/index`, { token: sessionStorage.getItem("bus-token") || "" })
            .then((response) => {
                setLoading(false)
                //console.log(response.data.data.seats);
                setSeatsData(response.data.data.seats);
            })
            .catch((error) => {
                console.error("There was an error!", error);
                setLoading(false)
                toast.error(t("sorry_a_problem_occurred"));
            });
    }, [])
    const handleChangeEdit = (value) => {
        setSeatsData(seatsData.map((x) => (x.id == openEditSeatId ? value : x)));
        setOpenEditSeatId(null)

    }
    return (
        <>
            <div className="h-bus mt-md-24 mt-3" >
                <h4 className="fw-bold mb-md-5 mb-3">{t("the_seized_seats_are_you_can_modify_the_information")}</h4>
                <div className="row">
                    {loading ?
                        <div className="position-relative" style={{ height: "5rem" }}>
                            <LoadingSpinner />
                        </div>
                        :
                        seatsData.map((seat, index) => (
                            <div className="col-lg-4 col-md-6 mb-3" key={index}>
                                <div className="h-bus-seat">
                                    <div className="d-between">
                                        <h4 className="fw-bold">{lang === "en" ? `${seats[index + 1]} ${t("the_seat")}` : `${t("the_seat")} ${seats[index + 1]}`} :</h4>
                                        <IconButton
                                            onClick={() => {
                                                setOpenEditSeat(true)
                                                setIndexSeat(index)
                                                setOpenEditSeatId(seat.id)
                                            }}
                                        >
                                            <Edit color="primary" fontSize="small" alt="edit" />
                                        </IconButton>
                                    </div>
                                    <ul className="h-avialabel-trip pe-5 fw-bold">
                                        <li>
                                            <Person color="primary" fontSize="small" alt="name" className="ms-2" />
                                            <bdi>{seat.first_name}</bdi>
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
                            </div>
                        ))
                    }
                </div>
                <div className="row">
                    <div className="col-12">
                        <div className="buttons-parent">
                            {/* <span className="btn h-button cancle big " onClick={() => props.prev(values)}>{t("prev")}</span> */}
                            <button onClick={handleSubmit} className="btn h-button  big position-relative" >
                                {t("next")}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            {(openEditSeatId && openEditSeat) && <EditSeatModal openModal={openEditSeat} onCloseModal={() => { setOpenEditSeat(false) }} dataEdit={seatsData.find((x) => x.id === +openEditSeatId)} handleChange={handleChangeEdit} indexSeat={indexSeat} />}

        </>
    );
};

const ChooseSeatStep = (props) => {
    const { t, lang } = useTranslation("all")
    const [loadingButton, setLoadingButton] = useState(false)
    const [loadingBus, setLoadingBus] = useState(false)
    const router = useRouter();
    //for bus
    const [row, setRow] = useState();
    const [right, setRight] = useState();
    const [left, setLeft] = useState();
    const [last, setLast] = useState();
    const [arrBusBookSeats, setArrBusBookSeats] = useState([]);
    const [arrBus, setArrBus] = useState([]);
    const [arrBusBook, setArrBusBook] = useState([]);
    const [allBookSeatsFromApi, setAllBookSeatsFromApi] = useState([]);
    const [chooseSeats, setChooseSeats] = useState([]);
    // to show model to delivery
    const [showBookWithDelivery, setShowBookWithDelivery] = useState(false);
    const [showBookWithDelivery2, setShowBookWithDelivery2] = useState(false);
    const [trip, setTrip] = useState("");
    const [reGenerate, setReGenerate] = useState(false);

    const handleSubmit = (values) => {
        const sendData = {
            token: sessionStorage.getItem("bus-token") || "",
            seats_numbers: [...chooseSeats]
        }
        setLoadingButton(true);
        axios
            .post(`${process.env.NEXT_PUBLIC_SERVER}/booking/seat/confirmation`, sendData)
            .then((response) => {

                setShowBookWithDelivery2(true)
                setLoadingButton(false);
            })
            .catch((error) => {
                setLoadingButton(false);
                if (error.status === 414) {
                    //عدد المقاعد لا يكفي
                    toast.error(t("sorry_the_number_of_seats_required_is_not_enough_to_reserve_please_reserve_again"));
                    router.replace("/user/categories/1");
                }else if (error.status === 415) {
                    // تم حجز نفس الكرسي 
                    toast.error(t("sorry_the_same_pre_chosen_seats_have_been_reserved_please_choose_the_seats_again"));
                    setReGenerate(!reGenerate);
                    setChooseSeats([])
                }else{
                    toast.error(t("sorry_a_problem_occurred"));
                    console.error("There was an error!", error);
                }
            });
    };
    const handleUserBook = (seat) => {
        if (chooseSeats.findIndex(x => x === +seat) == -1) {
            setChooseSeats([...chooseSeats, seat])
        } else {
            setChooseSeats(chooseSeats.filter((x) => x !== +seat))
        }
    }
    //get bus info
    useEffect(() => {
        setLoadingBus(true)
        axios
            .get(`${process.env.NEXT_PUBLIC_SERVER}/trip/${router.query.tripId}/generate/bus`)
            .then((response) => {
                if (response.status === 200) {
                    setLoadingBus(false)
                    //console.log(response.data.data.busVariable)
                    const bus = response.data.data.busVariable;
                    setLast(bus.last_seats);
                    setArrBus(GenerateNumBusArr(bus.number_of_rows, bus.right_seats, bus.left_seats, bus.last_seats, bus.front_door, bus.last_door, response.data.data.busSeats).chairList);
                    console.log("GenerateNumBusArr",GenerateNumBusArr(bus.number_of_rows, bus.right_seats, bus.left_seats, bus.last_seats, bus.front_door, bus.last_door, response.data.data.busSeats).chairList)
                    //all book seat info (company , booking) from api
                    setRow(bus.number_of_rows)
                    setRight(bus.right_seats)
                    setLeft(bus.left_seats)
                    setArrBusBook(response.data.data.busSeats)
                    setTrip(response.data.data.trip)
                    //all book seat number from api
                    setArrBusBookSeats(response.data.data.busSeats.map(x => x.seat_number))
                    setAllBookSeatsFromApi(response.data.data.busSeats.filter(x => (x.is_company === 1 || x.is_booking === 1)).map(x => x.seat_number))

                    //book seats from api

                    // setLoading(false)
                }
            })
            .catch((error) => {
                console.error("There was an error!", error);
                // setLoading(false)
                toast.error(t("sorry_a_problem_occurred"));
            });
    }, [router.query.tripId , reGenerate]);
    return (
        <>
            <Formik
                // validationSchema={AddressStepValidationSchema}
                initialValues={props.data}
                onSubmit={handleSubmit}
            >
                {(props) => (
                    <form onSubmit={props.handleSubmit}>
                        <div className="h-bus" style={{ marginTop: "8rem" }}>
                            <h4 className="fw-bold mb-5">{t("choose_a_trip_seats")}:</h4>
                            <Grid item md={6} className="mx-auto">
                                <ShowBus arrBus={arrBus} last={last} book="user" handleChooseBook={handleUserBook} row={row} right={right} left={left} total={router.query.total} allBookSeatsFromApi={allBookSeatsFromApi} loading={loadingBus} />
                            </Grid>

                        </div>
                        <div className="row">
                            <div className="col-12">
                                <div className="buttons-parent">
                                    {/* <span className="btn h-button cancle big " onClick={() => props.prev(values)}>{t("prev")}</span> */}
                                    <button type="submit" className={`btn h-button  big position-relative ${chooseSeats.length != +router.query.total ? "disabled" : ""}`}  >
                                        {loadingButton ? <><LoadingSpinner /> <span className="opacity-0">load</span></> : t("next")}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                )}
            </Formik>
            <BookWithDelivery2 openModal={showBookWithDelivery2} onCloseModal={() => { setShowBookWithDelivery2(false); }} handleCancel={() => { router.replace("/"); toast.success(t("the_reservation_has_been_successful")); sessionStorage.setItem("bus-token", "") }} handleOpenNext={() => props.next()} date={trip.begin_date} place={trip.starting_place} />
            <BookWithDelivery openModal={showBookWithDelivery} onCloseModal={() => setShowBookWithDelivery(false)} handleOpenNext={() => props.next()} />
        </>
    );
};

const AddressStep = (props) => {
    const { t, lang } = useTranslation("all")
    const [loadingButton, setLoadingButton] = useState(false)
    const router = useRouter();

    const handleSubmit = (values) => {
        setLoadingButton(true);
        axios
            .post(`${process.env.NEXT_PUBLIC_SERVER}/booking/delivery/request`, values)
            .then((response) => {
                toast.success(t("the_reservation_has_been_successful"));
                sessionStorage.setItem("bus-token", "")
                router.replace("/");
                setLoadingButton(false);
            })
            .catch((error) => {
                setLoadingButton(false);
                toast.error(t("sorry_a_problem_occurred"));
                console.error("There was an error!", error);
            });


    };
    const handleCancle = () => {
        toast.success(t("the_reservation_has_been_successful"));
        sessionStorage.setItem("bus-token", "")
        router.replace("/");


    };
    const AddressStepValidationSchema = Yup.object({
        address: Yup.string().required(t("please_enter_a_address")),
        latitude: Yup.number().required(t("please_enter_a_latitude")),
        longtude: Yup.number().required(t("please_enter_a_longtude")),
        city_name: Yup.string().required(t("please_enter_a_city")),
        region: Yup.string().required(t("please_enter_the_area")),
        street: Yup.string().required(t("please_enter_the_street")),
        building_number: Yup.string().required(t("please_enter_the_construction_number")),
        address_details: Yup.string().required(t("please_enter_the_address_details")),
    });
    return (
        <Formik
            validationSchema={AddressStepValidationSchema}
            initialValues={{ token: sessionStorage.getItem("bus-token") || "", address: "", latitude: "", longtude: "", city_name: "", region: "", street: "", building_number: "", address_details: "" }}
            onSubmit={handleSubmit}
        >
            {(props) => (
                <form onSubmit={props.handleSubmit}>
                    <div >
                        <div className="h-block-blue big">
                            <h4 className="fw-bold">{t("address_details")}:</h4>
                            <div className="row">
                                <div className="col-md-6">
                                    <TextField name="address" label={t("the_address")} />
                                </div>
                                <div className="col-md-6 d-flex gap-2">
                                    <div className="w-50">
                                        <TextField name="latitude" label={t("latitude")} type="number" step="0.0000000001" />
                                    </div>
                                    <div className="w-50">
                                        <TextField name="longtude" label={t("longtude")} type="number" step="0.0000000001" />
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <TextField name="city_name" label={t("city")} />
                                </div>
                                <div className="col-md-6">
                                    <TextField type="text" name="region" dir="auto" label={t("region")} />
                                </div>
                                <div className="col-md-6">
                                    <TextField type="text" name="street" dir="auto" label={t("street")} />
                                </div>
                                <div className="col-md-6">
                                    <TextField type="text" name="building_number" dir="auto" label={t("building_number")} />
                                </div>
                                <div className="col-md-6">
                                    <TextField type="text" name="address_details" dir="auto" label={t("other_details")} />
                                </div>
                                {/* <div className="col-md-6">
                                    <div className="form-group">
                                        <label className="h-label">{t("the_site_on_the_map")}</label>
                                        <input
                                            type="number"
                                            className="h-input form-control"
                                            pattern="\d{11}"
                                        />
                                    </div>
                                </div> */}
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <div className="buttons-parent">
                                <button type="submit" className="btn h-button  big position-relative" >
                                    {loadingButton ? <><LoadingSpinner /> <span className="opacity-0">load</span></> : t("next")}
                                </button>
                                <span className="btn h-button cancle big " onClick={handleCancle}>{t("canceling_the_car_request")}</span>
                            </div>
                        </div>
                    </div>
                </form>
            )}
        </Formik>
    );
};
