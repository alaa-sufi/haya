import React, { useState, useEffect } from "react";
import { Grid, Typography, TextField, Container, Box } from "@mui/material";
// import LocalizationProvider from "@mui/lab/LocalizationProvider";
// import AdapterDateFns from "@mui/lab/AdapterDateFns";
// import MobileDatePicker from "@mui/lab/MobileDatePicker";
// import { postApi } from "@/Functions/ApiFunc";
import LoadingSpinner from "@/UI/LoadingSpinner";
// import RichEditor from "@/component/other/RichEditor";
import { GenerateNumBusArr, ShowBus } from "@/Functions/Bus";
import axios from '@/lib/axios'
import useSWR from "swr";
import { useRouter } from "next/router";
import { useAuth } from "hooks/use-Auth"
import toast from "react-hot-toast";
import Head from 'next/head'
import useTranslation from 'next-translate/useTranslation'
export default function AddTrip() {
  const { t, lang } = useTranslation("all")
  const router = useRouter();
  const { user, isLoading } = useAuth({ middleware: 'auth' })

  const { data: cites, error } = useSWR(
    `${process.env.NEXT_PUBLIC_SERVER}/city`
  );
  const convertDate = (date) => {
    const currentDate = new Date(date);
    currentDate.setMinutes(currentDate.getMinutes() - currentDate.getTimezoneOffset());
    return currentDate.toISOString().slice(0, 16);
  }
  const [row, setRow] = useState(12);
  const [right, setRight] = useState(2);
  const [left, setLeft] = useState(2);
  const [last, setLast] = useState(5);
  const [total, setTotal] = useState("");
  const [frontDoor, setFrontDoor] = useState(-1);
  const [lastDoor, setLastDoor] = useState(-1);
  const [arrBus, setArrBus] = useState([]);
  const [current, setCurrent] = useState(1);
  const [begin_date, setbegin_date] = useState(convertDate(new Date()));
  const [period, setperiod] = useState("");
  const [details, setdetails] = useState("");
  const [price, setPrice] = useState(0);
  const [from_city_id, setFrom_city_id] = useState("");
  const [to_city_id, setTo_city_id] = useState("");
  const [errorperiod, setErrorPeriod] = useState(false);
  const [errorprice, setErrorPrice] = useState(false);
  const [errorTo_city_id, setErrorTo_city_id] = useState(false);
  const [errorFrom_city_id, setErrorFrom_city_id] = useState(false);
  const [errorDetails, setErrorDetails] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingButton, setLoadingButton] = useState(false);


  useEffect(() => {
    setLoading(false);
  }, [right, left, row, last, details]);
  useEffect(() => {
    const { chairList, total } = GenerateNumBusArr(row, right, left, last, frontDoor, lastDoor);
    setArrBus(chairList);
    setTotal(total);
  }, [row, right, left, last, frontDoor, lastDoor])
  useEffect(() => {
    setLast(+right + +left + 1);
  }, [right, left])
  const next = () => {

    if (!period) {
      setErrorPeriod(true);
    }
    if (!details) {
      setErrorDetails(true);
    }
    if (!price) {
      setErrorPrice(true);
    }
    if (!from_city_id) {
      setErrorFrom_city_id(true);
    }
    if (!to_city_id) {
      setErrorTo_city_id(true);
    }

    if (current < 2 && period && details && price && from_city_id && to_city_id) {
      setCurrent(current + 1);
      window.scrollTo(0, 0);
    }
  };
  const prev = () => {
    if (current > 1) {
      setCurrent(current - 1);
      window.scrollTo(0, 0);
    }
  };
  const handleSubmit = (e) => {
    setLoadingButton(true);
    e.preventDefault();
    const data = new FormData();
    data.append("begin_date", begin_date);
    data.append("period", period);
    data.append("details", details);
    data.append("price", price);
    data.append("number_of_seat", total);
    data.append("number_of_rows", row);
    data.append("last_seats", last);
    data.append("left_seats", left);
    data.append("right_seats", right);
    data.append("category_id", 1);
    data.append("from_city_id", from_city_id);
    data.append("to_city_id", to_city_id);
    data.append("front_door", frontDoor);
    data.append("last_door", lastDoor);
    axios
      .post(`${process.env.NEXT_PUBLIC_SERVER}/trip/bus`, data)
      .then((response) => {
        router.push("/admin/categories/1")
        //   onCloseModal();
        setLoadingButton(false);
        //  handleChange(response.data.data.trip)
      })
      .catch((error) => {
        console.error("There was an error!", error);
        setLoadingButton(false);
        toast.error("عذرا حدثت مشكلة ما");

      });

  };
  if (isLoading || !user) {
    return <div className="loading-parent"><LoadingSpinner /></div>
  }
  return (
    <>
      <Head>
        <title>{t("all:al_hayat_company")} - إضافة رحلة جديدة</title>
      </Head>
      <form onSubmit={handleSubmit}>
        <section className="h-bus">
          <div className="container">
            <div className={current != 1 ? "d-none" : "h-book-info "}>
              <div className="h-block-blue big ">
                <h3 className="fw-bold text-center mb-3"> إضافة رحلة جديدة</h3>
                <div className={`row `}>
                  <div className="col-md-6">
                    <div className="form-group">
                      <label className="h-label">تاريخ بداية الرحلة</label>
                      <input type="datetime-local" className="h-input form-control" value={begin_date} onChange={(e) => setbegin_date(e.target.value)} required />
                      {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <MobileDatePicker
                          className="h-input form-control"
                          inputFormat="MM/dd/yyyy"
                          value={begin_date}
                          onChange={handleChangeDate}
                          required
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </LocalizationProvider> */}
                    </div>
                    <div className="form-group">
                      <label className="h-label">مدة الرحلة</label>
                      <input
                        type="number"
                        dir="auto"
                        className={`h-input form-control ${errorperiod && "required"
                          }`}
                        required
                        value={period}
                        onChange={(event) => {
                          setperiod(event.target.value);
                          setErrorPeriod(false);
                        }}
                      />
                    </div>
                    <div className="form-group">
                      <label className="h-label"> سعر الرحلة</label>
                      <input
                        type="number"
                        dir="auto"
                        className={`h-input form-control ${errorprice && "required"
                          }`}
                        value={price}
                        required
                        onChange={(event) => {
                          setPrice(event.target.value);
                          setErrorPrice(false);
                        }}
                      />
                    </div>
                    <div className="form-group">
                      <label className="h-label"> من مدينة</label>
                      <select
                        className={`h-input form-control ${errorFrom_city_id && "required"
                          }`}
                        value={from_city_id}
                        required
                        onChange={(event) => {
                          setFrom_city_id(event.target.value);
                          setErrorFrom_city_id(false);
                        }}
                      >
                        <option value="">اختر مدينة</option>
                        {(!error && cites) && cites.data.cities.map((city, index) => (
                          <option key={index} value={city.id}  >{city.name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label className="h-label">الى مدينة </label>
                      <select
                        className={`h-input form-control ${errorTo_city_id && "required"
                          }`}
                        value={to_city_id}
                        required
                        onChange={(event) => {
                          setTo_city_id(event.target.value);
                          setErrorTo_city_id(false);
                        }}
                      >
                        <option value="">اختر مدينة</option>
                        {(!error && cites) && cites.data.cities.map((city, index) => (
                          <option key={index} value={city.id}  >{city.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="col-md-6">
                    <div className="form-group h-90">
                      <label className="h-label">تفاصيل الرحلة</label>
                      <div className={`h-90 ${errorDetails && "required"}`}>
                        <textarea
                          value={details}
                          onChange={(e) => { setErrorDetails(false); setdetails(e.target.value) }}
                          className={`h-input form-control h-90 ${errorDetails && "required"
                            }`}
                          dir="auto"
                          required>

                        </textarea>
                        {/* <RichEditor
                          value={details}
                          setValue={setdetails}
                          className={`h-input form-control h-90 ${
                            errorDetails && "required"
                          }`}
                          dir="auto"
                          required
                        /> */}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className={current != 2 ? "d-none" : ""}>
              <h2 className="fw-bold h-h1 top text-end"> مقاعد الرحلة</h2>
              <Container maxWidth="md">
                <Grid container spacing={4} alignItems="center">
                  <Grid item md={6}>
                    <Box className="h-block-blue mt-xs-0">
                      <Grid container className="h-bus-inputs">
                        <Grid item xs={10}>
                          عدد الصفوف
                        </Grid>
                        <Grid item xs={2}>
                          <TextField
                            select
                            required
                            type="number"
                            SelectProps={{ native: true }}
                            variant="standard"
                            value={row}
                            onInput={(event) => {
                              setRow(event.target.value);
                            }}
                          >
                            {Array.from(
                              { length: Number.parseInt(31) },
                              (item, index) => (
                                <option key={index} value={index + 10}>
                                  {index + 10}
                                </option>
                              )
                            )}
                          </TextField>
                        </Grid>
                      </Grid>
                      <Grid container className="h-bus-inputs">
                        <Grid item xs={10}>
                          عدد المقاعد على اليمين
                        </Grid>
                        <Grid item xs={2}>
                          <TextField
                            select
                            required
                            type="number"
                            variant="standard"
                            value={right}
                            SelectProps={{ native: true }}
                            onChange={(event) => {
                              setRight(event.target.value);
                            }}
                          >
                            {Array.from(
                              { length: Number.parseInt(2) },
                              (item, index) => (
                                <option key={index + 1} value={index + 1}>
                                  {index + 1}
                                </option>
                              )
                            )}
                          </TextField>
                        </Grid>
                      </Grid>
                      <Grid container className="h-bus-inputs">
                        <Grid item xs={10}>
                          عدد المقاعد على اليسار
                        </Grid>
                        <Grid item xs={2}>
                          <TextField
                            select
                            required
                            type="number"
                            variant="standard"
                            value={left}
                            SelectProps={{ native: true }}
                            onChange={(event) => {
                              setLeft(event.target.value);
                            }}
                          >
                            {Array.from(
                              { length: Number.parseInt(2) },
                              (item, index) => (
                                <option key={index + 1} value={index + 1}>
                                  {index + 1}
                                </option>
                              )
                            )}
                          </TextField>
                        </Grid>
                      </Grid>
                      <Grid container className="h-bus-inputs">
                        <Grid item xs={10}>
                          عدد مقاعد الصف الأخير
                        </Grid>
                        <Grid item xs={2}>
                          <TextField
                            select
                            required
                            type="number"
                            variant="standard"
                            value={last}
                            SelectProps={{ native: true }}
                            onChange={(event) => {
                              setLast(event.target.value);
                            }}
                          >
                            {Array.from(
                              { length: Number.parseInt(3) },
                              (item, index) => (
                                <option key={index + +right + +left + 1} value={index + +right + +left + 1}>
                                  {index + +right + +left + 1}
                                </option>
                              )
                            )}
                          </TextField>
                        </Grid>
                      </Grid>
                      <Grid container className="h-bus-inputs">
                        <Grid item xs={10}>
                          صف المقعد الأمامي
                        </Grid>
                        <Grid item xs={2}>
                          <TextField
                            select
                            required
                            type="number"
                            variant="standard"
                            value={frontDoor}
                            SelectProps={{ native: true }}
                            onChange={(event) => {
                              setFrontDoor(event.target.value);
                            }}
                          >
                            <option value={-1}>بدون</option>
                            {Array.from(
                              { length: Number.parseInt(row - 1) },
                              (item, index) => (
                                <option key={index + 1} value={index + 1}>
                                  {index + 1}
                                </option>
                              )
                            )}
                          </TextField>
                        </Grid>
                      </Grid>
                      <Grid container className="h-bus-inputs">
                        <Grid item xs={10}>
                          صف المقعد الخلفي
                        </Grid>
                        <Grid item xs={2}>
                          <TextField
                            select
                            required
                            type="number"
                            variant="standard"
                            value={lastDoor}
                            SelectProps={{ native: true }}
                            onChange={(event) => {
                              setLastDoor(event.target.value);
                            }}
                          >
                            <option value={-1}>بدون</option>
                            {Array.from(
                              { length: Number.parseInt(row - 1) },
                              (item, index) => (
                                <option key={index + 1} value={index + 1}>
                                  {index + 1}
                                </option>
                              )
                            )}
                          </TextField>
                        </Grid>
                      </Grid>
                      <Grid container className="h-bus-inputs">
                        <Grid item xs={10}>
                          عدد المقاعد الكلي
                        </Grid>
                        <Grid item xs={2}>
                          <Typography
                            required
                            variant="span"
                            color="primary.main"
                          >
                            {total}
                          </Typography>
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                  <Grid item md={6}>
                    <ShowBus arrBus={arrBus} last={last} book="show" allBookSeatsFromApi={[]} />
                  </Grid>
                </Grid>
              </Container>
            </div>
          </div>
        </section>
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="buttons-parent">
                <span
                  className={`btn h-button  big ${current == 2 ? "d-none" : ""
                    }`}
                  onClick={() => {
                    next();
                  }}
                >
                  التالي
                </span>
                <button
                  type="submit"
                  className={`btn h-button position-relative  big ${current == 2 ? "" : "d-none"
                    }`}
                >
                  {loadingButton ? <><LoadingSpinner /> <span className="opacity-0">load</span></> : "تأكيد"}

                </button>
                <span
                  className={`btn h-button cancle big ${current <= 1 ? "disabled" : ""
                    }`}
                  onClick={() => {
                    prev();
                  }}
                >
                  رجوع
                </span>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
