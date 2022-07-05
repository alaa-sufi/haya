import React, { useState , useEffect} from 'react'
import { Field, ErrorMessage, useField } from "formik";
import { Modal, Button } from "react-bootstrap";
import CircularProgress from '@mui/material/CircularProgress';
import CropImage from "@/other/CropImage"
import CropImage2 from "@/other/CropImage2"
import DefaultImg from "public/images/DefultImg.svg"
import axios from "axios"
import DateFnsUtils from '@date-io/date-fns';
import MomentUtils from "@date-io/moment";
import toast from "react-hot-toast";
import useTranslation from 'next-translate/useTranslation'
import { MuiPickersUtilsProvider, DateTimePicker, KeyboardDatePicker } from "@material-ui/pickers";

import LoadingSpinner from "components/UI/LoadingSpinner"
export function TextField({ label, ...props }) {
  return (
    <FieldHaya label={label} name={props.name} required={props.required}>
      {props.show ?
        <p className='px-4'>{props.view}</p>
        :
        <Field
          name={props.name}
          className={`h-input form-control m-0 ${props.light && "light"}`} dir="auto"
          {...props}
        >
          {props.children}
        </Field>
      }
    </FieldHaya>
  );
};
export function ImgField2({ label, ...props }) {
  const [field, meta, helpers] = useField(props.name);
  const [loading, setLoading] = useState(false);
  const [defaultImage, setDefaultImage] = useState(DefaultImg);
  const imgSrc = (data) => {
    setLoading(true);
    axios
      .post(`${process.env.NEXT_PUBLIC_SERVER}/image64Upload`, { image64: data })
      .then((response) => {
        setLoading(false);
        helpers.setValue(response.data.data.imageUrl);
      })
      .catch((error) => {
        // console.error("There was an error!", error);
        setLoading(false);
        toast.error("عذرا حدثت مشكلة ما");

      });
  };




  useEffect(() => {
    setDefaultImage(props.add ? DefaultImg : props.img);
    console.log(defaultImage)
  }, [props.name])




  return (
    <FieldHaya label={label} name={props.name} required={props.required}>
      {/* {defaultImage} */}
      <CropImage2
        defaultImage={defaultImage}
        aspect={props.aspect}
        imgSrc={imgSrc}
        circle={props.circle}
        width={props.width}
        height={props.height}
        name={props.name}
      />
      {loading && <LoadingSpinner />}
    </FieldHaya>
  );
}
export function ImgField({ label, ...props }) {
  const [field, meta, helpers] = useField(props.name);
  const [loading, setLoading] = useState(false);
  const imgSrc = (data) => {
    setLoading(true);
    axios
      .post(`${process.env.NEXT_PUBLIC_SERVER}/image64Upload`, { image64: data })
      .then((response) => {
        setLoading(false);
        helpers.setValue(response.data.data.imageUrl);
      })
      .catch((error) => {
        // console.error("There was an error!", error);
        setLoading(false);
        toast.error("عذرا حدثت مشكلة ما");

      });
  };
  return (
    <FieldHaya label={label} name={props.name} required={props.required}>
      <CropImage
        defaultImage={props.add ? DefaultImg : props.img}
        aspect={props.aspect}
        imgSrc={imgSrc}
        circle={props.circle}
        width={props.width}
        height={props.height}
      />
      {loading && <LoadingSpinner />}
    </FieldHaya>
  );
}
export function CheckField({ ...props }) {
  const [field, meta, helpers] = useField(props.name);
  const handleChange = (value) => {
    helpers.setValue(value);
  };
  return (
    <div className="form-check">
      <label className="form-check-label" >
        {props.label}
        <Field className="form-check-input" type="checkbox" name={props.name} dir="auto" />
      </label>
    </div>

  );
}
export function DateField({ ...props }) {
  const [field, meta, helpers] = useField(props.name);
  const handleChange = (value) => {
    helpers.setValue(value);
  };
  const [selectedDate, handleDateChange] = useState();

  return (
    <div className="form-check">
      <label className="form-check-label" >
        {props.label}
        <input type="datetime-local" name={props.name} />
        {/* <MuiPickersUtilsProvider utils={MomentUtils}>
          <KeyboardDatePicker
            label="picker"
            value={selectedDate}
            onChange={date => handleDateChange(date)}
            minDate={new Date()}
            format="DD/MM/YYYY"
          />

        </MuiPickersUtilsProvider> */}
      </label>
    </div>

  );
}

export function ButtonsField({ modalState, onCancle, loading = false }) {
  const { t, lang } = useTranslation("all")
  return (
    <Modal.Footer className="d-flex justify-content-center gap-3">
      {!modalState.show && <Button className="btn h-button position-relative" type="submit" >
        {loading ? <><LoadingSpinner /> <span className="opacity-0">load</span></> :
          modalState.add && t("addition") || modalState.edit && t("Modify") || modalState.book && t("Reservation") || modalState.next && t("next") || modalState.delete && t("Delete")}
      </Button>}
      {onCancle && <span className="btn h-button cancle" onClick={onCancle} >{modalState.show ? t("close") : t("cancel")}</span>}
    </Modal.Footer>
  )
}
export function HeaderField(props) {
  return (
    <Modal.Header  >
      <Modal.Title>
        <h5 className="fw-bold">{props.title && props.title}</h5>
      </Modal.Title>
    </Modal.Header>
  )
}

const FieldHaya = ({ label, name, ...props }) => {
  return (
    <div className="form-group position-relative">
      <label className="h-label"><bdi><span>{label}</span><span>{props.required && <span className="text-danger px-2" >*</span>}</span></bdi></label>
      {props.children}
      <ErrorMessage name={name} component="span" className="text-input-modal-error text-danger" />
    </div>
  )
}