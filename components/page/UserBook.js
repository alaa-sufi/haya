import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import {Grid} from "@mui/material"
import * as Yup from "yup";
import NumberToStrignSeat from "@/Functions/NumberToStrignSeat";
import { GenerateNumBusArr, ShowBus } from "@/Functions/Bus";
import { TextField, ImgField, HeaderField } from "@/UI/Inputs"
import useTranslation from 'next-translate/useTranslation'

export default function UserBook(props) {
  const [value, setValue] = useState(new Date());
  const { t, lang } = useTranslation("all")

  const [seat, setSeat] = useState(NumberToStrignSeat(t));
  const [row, setRow] = useState(11);
  const [right, setRight] = useState(2);
  const [left, setLeft] = useState(2);
  const [last, setLast] = useState(5);
  const [arrBus, setArrBus] = useState([]);
  const [arrRecommend, setArrRecommend] = useState([]);
  const [arrBusBook, setarrBusBook] = useState([[1, 2, 5, 7], [6, 8, 12]]);
//   const queryParams = new URLSearchParams(location.search);
  const queryParams = 5;
//   const [TotalPeople, setTotalPeople] = useState(+queryParams.get("total"));
  const [TotalPeople, setTotalPeople] = useState('5');
  let a = {
    city: "",
    region: "",
    street: "",
    building_number: ""
  }
  let b = {}
  for (let i = 0; i < TotalPeople; i++) {
    b[`seats__first_name${i}`] = ""
    b[`seats__last_name${i}`] = ""
    b[`seats__image_base64${i}`] = ""
    b[`seats__father_name${i}`] = ""
    b[`seats__email${i}`] = ""
    b[`seats__address${i}`] = ""
    b[`seats__phone_number${i}`] = ""
    b[`seats__date_of_birthday${i}`] = ""
    b[`seats__front_idCard${i}`] = ""
    b[`seats__back_idCard${i}`] = ""
    b[`seats__id_number${i}`] = ""
  }

  let c = Object.assign(a, b)
  const [data, setData] = useState(c)
  const [currentStep, setCurrentStep] = useState(0);

  const pull_data2 = (n) => {
    setArrRecommend(n);
  }
  const pull_data = (n) => {
    let temp = arrBusBook;
    temp[1] = n;
    setarrBusBook(temp);
  }
    const handleChange = (newValue) => {
    setValue(newValue);
  };
  const makeRequest = (formData) => {
  };
  const handleNextStep = (newData, final = false) => {
    setData((prev) => ({ ...prev, ...newData }));
    window.scrollTo(0, 0);


    if (final) {
      makeRequest(newData);
      return;
    }

    setCurrentStep((prev) => prev + 1);
  };
  const handlePrevStep = (newData) => {
    window.scrollTo(0, 0);


    setData((prev) => ({ ...prev, ...newData }));
    setCurrentStep((prev) => prev - 1);
  };

  useEffect(() => {
    setArrBus(GenerateNumBusArr(row, right, left, last, " ", ...arrBusBook));
  }, [arrBusBook,last,left,right,row]);
  const steps = [...Array(TotalPeople , index).fill(
    <SeatsSteps key={index} next={handleNextStep} data={data} TotalPeople={TotalPeople} currentStep={currentStep} seat={seat} prev={handlePrevStep} />,
  ),
  <AddressStep key="a" next={handleNextStep} prev={handlePrevStep} data={data} />,
  <ChooseSeatStep key="b" next={handleNextStep} prev={handlePrevStep} data={data} row={row} last={last} pull_data={pull_data} pull_data2={pull_data2}  arrBusBook={arrBusBook}  left={left}  right={right} arrBus={arrBus}/>
  ]
  return (
    <section className="h-book-info ">
      <div className="container">
        {steps[currentStep]}
      </div>
    </section>
  );
}

const SeatsSteps = (props) => {
  let obj = [...Array.from({ length: props.TotalPeople }, () => new Object())]
  obj[props.currentStep][`seats__first_name${props.currentStep}`] = Yup.string().required("???????? ?????????? ??????????")
  obj[props.currentStep][`seats__last_name${props.currentStep}`] = Yup.string().required("???????? ?????????? ????????????")
  obj[props.currentStep][`seats__mother_name${props.currentStep}`] = Yup.string().required("???????? ?????????? ?????? ?????????? ????????")
  obj[props.currentStep][`seats__father_name${props.currentStep}`] = Yup.string().required("???????? ?????????? ?????? ????????")
  // obj[props.currentStep][`seats__id_number${props.currentStep}`] = Yup.number().required("???????? ?????????? ?????? ????????????")
  // obj[props.currentStep][`seats__phone_number${props.currentStep}`] =Yup.string().required("???????? ?????????? ??????????")
  // obj[props.currentStep][`seats__email${props.currentStep}`] =Yup.string().required("???????? ?????????? ??????????????")
  // obj[props.currentStep][`seats__date_of_birthday${props.currentStep}`] =Yup.date().default(function () {   return new Date();}),
  // obj[props.currentStep][`seats__front_idCard${props.currentStep}`] =Yup.string().required("???????? ?????????? ?????????? ??????????")
  // obj[props.currentStep][`seats__back_idCard${props.currentStep}`] =Yup.string().required("???????? ?????????? ?????????? ????????????")
  const SeatsStepsValidationSchema = [
    ...Array.from({ length: Number.parseInt(props.TotalPeople) }, (item, index) => (
      Yup.object({
        ...obj[index]
      })
    ))
  ]
  const handleSubmit = (values) => {
    props.next(values);
  };
  const handlePrev = (values) => {
    props.prev(values)
  }
  return (
    <Formik
      validationSchema={SeatsStepsValidationSchema[props.currentStep]}
      initialValues={props.data}
      onSubmit={handleSubmit}
    >
      {(values) => (
        <Form>
          <div className={`h-block-blue big`} >
            <div >
              <h4 className="fw-bold">???????????? {props.seat[props.currentStep + 1]}:</h4>
              <div className={`row `}>
                <div className="col-md-6">
                  <TextField name={`seats__first_name${props.currentStep}`} type="text" label="??????????" />
                </div>
                <div className="col-md-6">
                  <TextField name={`seats__last_name${props.currentStep}`} type="text" label="????????????" />
                </div>
                <div className="col-md-6">
                  <TextField name={`seats__father_name${props.currentStep}`} type="text" label="?????? ????????" />
                </div>
                <div className="col-md-6">
                  <TextField name={`seats__mother_name${props.currentStep}`} type="text" label="?????? ?????????? ????????" />
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="h-label">?????? ???????????? ??????????????</label>
                    {/* <LocalizationProvider dateAdapter={AdapterDateFns}>
                              <MobileDatePicker
                                className="h-input form-control"
                                name={`seats.${index}.date_of_birthday`}
                                inputFormat="MM/dd/yyyy"
                                value={value}
                                onChange={handleChange}
                                renderInput={(params) => <TextField {...params} />}
                              />
                            </LocalizationProvider> */}
                  </div>
                </div>
                <div className="col-md-6">
                  <TextField name={`seats__id_number${props.currentStep}`} type="text" label="?????????? ????????????" />
                  {/* <div className="form-group">
                            <label className="h-label">?????????? ????????????</label>
                            <input
                              type="number"
                              className="h-input form-control"
                              pattern="\d{11}"
                            />
                          </div> */}
                </div>
                <div className="col-md-6">
                  <TextField name={`seats__phone_number${props.currentStep}`} type="text" label="?????? ????????????????" />
                  {/* <div className="form-group">
                            <label className="h-label">?????? ????????????????</label>
                            <input type="tel" className="h-input form-control" />
                          </div> */}
                </div>
                <div className="col-md-6">
                  <TextField name={`seats__email${props.currentStep}`} type="email" label="??????????" />
                  {/* <div className="form-group">
                            <label className="h-label">??????????</label>
                            <input type="email" className="h-input form-control" />
                          </div> */}
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="h-label">???????? ??????????????</label>
                  </div>
                </div>
                <div className="col-12">
                  <h5>
                    ???????? ?????????? ???????? ???????? ?????? ?????? ?????? ?????? ???????? ???? ???????? ????????
                    ?????????? ?????????? ??????????
                  </h5>
                </div>
                <div className="col-md-6">
                  <ImgField name={`seats__front_idCard${props.currentStep}`} label="?????????? ????????????" aspect={2.5 / 1} add={true} />
                  {/* <div className="form-group">
                            <label className="h-label">?????????? ????????????</label>
                            <input type="email" className="h-input form-control" />
                          </div> */}
                </div>
                <div className="col-md-6">
                  <ImgField name={`seats__back_idCard${props.currentStep}`} label="?????????? ????????????" aspect={2.5 / 1} add={true} />
                  {/* <div className="form-group">
                            <label className="h-label">?????????? ????????????</label>
                            <input type="email" className="h-input form-control" />
                          </div> */}
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="buttons-parent">
                <button type="submit" className="btn h-button  big" >????????????</button>
                <span className={`btn h-button cancle big ${props.currentStep === 0 ? "disabled" : ""}`} onClick={handlePrev}>????????</span>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};


const AddressStep = (props) => {
  const handleSubmit = (values) => {
    props.next(values);
  };

  return (
    <Formik
      validationSchema={AddressStepValidationSchema}
      initialValues={props.data}
      onSubmit={handleSubmit}
    >
      {(values) => (
        <Form>
          <div >
            <div className="h-block-blue big">
              <h4 className="fw-bold">??????????????:</h4>
              <div className="row">
                <div className="col-md-6">
                  <TextField name="city" label="????????????????" component="select">
                    <option value="">???????????? ??????????????</option>
                    <option value="aleppo">??????</option>
                    <option value="homs">??????</option>
                    <option value="hama">????????</option>
                  </TextField>
                </div>
                <div className="col-md-6">
                  <TextField type="text" name="region" dir="auto" label="??????????????" />
                </div>
                <div className="col-md-6">
                  <TextField type="text" name="street" dir="auto" label="????????????" />
                </div>
                <div className="col-md-6">
                  <TextField type="text" name="building_number" dir="auto" label="?????? ????????????" />
                </div>
                <div className="col-md-6">
                  <TextField type="text" name="address_details" dir="auto" label="???????????? ????????" />
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="h-label">???????????? ?????? ??????????????</label>
                    <input
                      type="number"
                      className="h-input form-control"
                      pattern="\d{11}"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-12">
              <div className="buttons-parent">
                <button type="submit" className="btn h-button  big">????????????</button>
                <span className="btn h-button cancle big " onClick={() => props.prev(values)}>????????</span>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};
const AddressStepValidationSchema = Yup.object({
  city: Yup.string().required("???????? ???????????? ??????????"),
  region: Yup.string().required("???????? ???????????? ??????????????"),
  street: Yup.string().required("???????? ?????????? ????????????"),
  building_number: Yup.string().required("???????? ?????????? ?????? ????????????"),
});
const ChooseSeatStep = (props) => {
  const handleSubmit = (values) => {
    props.next(values);
  };

  return (
    <Formik
      // validationSchema={AddressStepValidationSchema}
      initialValues={props.data}
      onSubmit={handleSubmit}
    >
      {(values) => (
        <Form>
          <div className="h-bus" style={{ marginTop: "8rem" }}>
            <h4 className="fw-bold">???????????? ?????????? ????????????:</h4>
            <Grid item md={6} className="mx-auto">
                  <ShowBus  arrBus={props.arrBus}
                    book={"user"}

                    bookArrTotal={props.pull_data}
                    recommendArr={props.pull_data2}
                    bookArr={props.arrBusBook}

                    row={props.row}
                    left={props.left}
                    right={props.right}
                    last={props.last}
                  />
                </Grid>

          </div>
          <div className="row">
            <div className="col-12">
              <div className="buttons-parent">
                <button type="submit" className="btn h-button  big">????????????</button>
                <span className="btn h-button cancle big " onClick={() => props.prev(values)}>????????</span>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};



