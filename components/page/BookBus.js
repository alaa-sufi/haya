import React, { useState, useEffect } from "react";
import {useRouter} from "next/router";
import { Grid, Container, } from "@mui/material";
import { GenerateNumBusArr, ShowBus } from "@/Functions/Bus";
import usePage from "hooks/use-Page"
import HayaPage from "@/UI/Short/HayaPage"
import UserInfoUl from '@/UI/Short/UserInfoUl';
import NumberToStrignSeat from "@/Functions/NumberToStrignSeat";
import CarInfo2 from "@/Base/CarInfo2";
import img from "public/temp/bus1.jpg"
import { useAuth } from "hooks/use-Auth"
import LoadingSpinner from "@/UI/LoadingSpinner"
export default function BookBus({ role, vehicle }) {
    const { user, isLoading } = useAuth({ middleware: role === 'admin' ? 'auth' : 'user' })
    const router = useRouter();
    const [row, setRow] = useState(11);
    const [right, setRight] = useState(2);
    const [left, setLeft] = useState(2);
    const [last, setLast] = useState(5);
    const [total, setTotal] = useState();
    const [arrBus, setArrBus] = useState([]);
    const [arrBusBook, setarrBusBook] = useState([[1, 2, 5, 7], [6, 8, 12]]);
    const [arrBusBookAdminForShow, setarrBusBookAdminForShow] = useState([1, 2, 5, 7]); //just for show admin book arr
    const [arrBusBookUserForShow, setarrBusBookUserForShow] = useState([6, 8, 12]); //just for show user book arr
    const { loading, sendRequest, dataPage, setDataPage, errorPage } = usePage();
    
    const [stringSeat, setStringSeat] = useState(NumberToStrignSeat(t));
    useEffect(() => {

        setArrBus(GenerateNumBusArr(row, right, left, last, " ", ...arrBusBook));
    }, [arrBusBook, last, left, right, row]);
    const pull_data = (n) => {
        // let arrBusBook[0]
        let temp = arrBusBook;
        temp[0] = n;
        setarrBusBookAdminForShow(n);
        setarrBusBookUserForShow(temp[1])
        setarrBusBook(temp);
    }
    if (isLoading || (role === "admin" && !user)){
        return <div className="loading-parent"><LoadingSpinner /></div>
    }
    return (
        //todo change loading
        <HayaPage loading={false} errorPage={errorPage} height="100vh">
            <form >
                <section className="h-bus mt-9">
                    <div className="container">
                        {vehicle === "car" &&
                            <CarInfo2 img={img} name="سوناتا" seats="12" date="12/2/2020" location="حلب - دمشق"/>
                        }
                        <div >
                            <Container maxWidth="md">
                                <h1 className="fw-bold h-h1 text-end">حجوزات الرحلة:</h1>
                                <Grid container spacing={4} >
                                    <Grid item md={6}>
                                        <h3 className="fw-bold h-dot-blue" >مقاعد الشركة:</h3>
                                        <div className="h-book-adminarr">
                                            {arrBusBookAdminForShow.join(", ")}
                                        </div>
                                        <div className="h-book-users-parent">
                                            {arrBusBookUserForShow.map((seat, index) => (
                                                <div key={index} className="h-book-users">
                                                    {/* // todo change 1 to user id */}
                                                    <UserInfoUl head="h4" seatNumber={stringSeat[seat]} firstName="محمد" lastName="محمد" phoneNumber="0952370058" email="mohammed@gmail.com" link={`${router.asPath}/seat/${seat}`} />
                                                </div>
                                            ))}
                                        </div>
                                    </Grid>
                                    <Grid item md={6}>
                                        <ShowBus row={row} last={last} arrBus={arrBus} book={"admin"} bookArr={arrBusBook} bookArrTotal={pull_data}
                                        //  bookArrGenerate={arrBusBookFromApi}
                                        />
                                    </Grid>
                                </Grid>
                            </Container>
                        </div>
                    </div>
                </section>
            </form>
        </HayaPage>
    );
}
