import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik } from "formik";
import { ButtonsField } from "components/UI/Inputs";
import * as Yup from "yup";
import { TextField, ImgField, HeaderField ,DateField} from "components/UI/Inputs";
import axios from '@/lib/axios'
import useSWR from "swr";
import toast from "react-hot-toast";

export default function AddEditOther2({
  openModal,
  onCloseModal,
  add,
  edit,
  dataEdit,
  handleChange,
  editId,
  category_id
}) {
  const [loadingButton, setLoadingButton] = useState(false);
  const { data: cites, error } = useSWR(
    `${process.env.NEXT_PUBLIC_SERVER}/city`
  );
  const onSubmit = (values) => {
    setLoadingButton(true);
    axios
      .post(add ? `${process.env.NEXT_PUBLIC_SERVER}/trip` : `${process.env.NEXT_PUBLIC_SERVER}/trip/${editId}`, values)
      .then((response) => {
        onCloseModal();
        setLoadingButton(false);
       handleChange(response.data.data.trip)
      })
      .catch((error) => {
        console.error("There was an error!", error);
        onCloseModal();
        setLoadingButton(false);
        toast.error("عذرا حدثت مشكلة ما");

      });
  };
  const validateSchema = () => {
    return Yup.object().shape({
      details: Yup.string().required("يرجى ادخال الشرح"),
      begin_date: Yup.string().required("يرجى ادخال التاريخ"),
      from_city_id: Yup.number().required("يرجى اختيار مدينة الانطلاق   "),
      to_city_id: Yup.number().required("يرجى اختيار مدينة الوصول  "),
      price: Yup.number().required("يرجى اختيار السعر  "),
    }
    );
  };
  const convertDate = (date)=>{
    const currentDate = new Date(date);
    currentDate.setMinutes(currentDate.getMinutes() - currentDate.getTimezoneOffset());
    return  currentDate.toISOString().slice(0, 16);
  }
  return (
    <Modal
      show={openModal}
      onHide={() => {
        onCloseModal();
      }}
      centered
    >
      <HeaderField title={add ? "+ إضافة  رحلة  " : " تعديل رحلة  "} />
      <Formik
        initialValues={edit ? { begin_date: convertDate(dataEdit.begin_date), from_city_id: dataEdit.from_city_id ,  to_city_id:dataEdit.to_city_id , category_id:category_id,price:dataEdit.price, details:dataEdit.details }  :  { begin_date: "", from_city_id: "" ,   to_city_id:"",category_id:category_id,price:"" , details:""}}
        onSubmit={onSubmit}
        validationSchema={validateSchema()}
      >
        {(props) => (
          <form onSubmit={props.handleSubmit}>
            <Modal.Body>
              <TextField name="begin_date" type="datetime-local"  label="وقت الرحلة" />
              <TextField name="from_city_id" as="select" label="مدينة الانطلاق"  >
                <option>اختر مدينة</option>
              {(!error && cites) && cites.data.cities.map((city,index)=>(
                <option key={index} value={city.id}  >{city.name}</option>
              ))}
              </TextField>
              <TextField name="to_city_id" component="select" label="مدينة الوصول" >
                <option>اختر مدينة</option>
              {(!error && cites) && cites.data.cities.map((city,index)=>(
                <option key={index} value={city.id}>{city.name}</option>
              ))}
              </TextField>
              <TextField name="price" type="number"  label="السعر" />
              <TextField name="details" component="textarea"  label="شرح الرحلة" />
            </Modal.Body>
            <ButtonsField
              modalState={{ add: add, edit: edit }}
              loading={loadingButton}
              onCancle={onCloseModal}
            />
          </form>
        )}
      </Formik>
    </Modal>
  );
}
