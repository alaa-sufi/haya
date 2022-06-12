import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik } from "formik";
import { ButtonsField } from "components/UI/Inputs";
import * as Yup from "yup";
import { TextField, ImgField, HeaderField ,CheckField} from "components/UI/Inputs";
import axios from '@/lib/axios'
import useSWR from "swr";
import toast from "react-hot-toast";

export default function AddEditCar({
  openModal,
  onCloseModal,
  add,
  edit,
  dataEdit,
  handleChange,
  editId
}) {
  const [loadingButton, setLoadingButton] = useState(false);
  const { data: carType, error } = useSWR(
    `${process.env.NEXT_PUBLIC_SERVER}/carType`
  );
  const onSubmit = (values) => {
    setLoadingButton(true);
    axios
      .post(add ? `${process.env.NEXT_PUBLIC_SERVER}/car` : `${process.env.NEXT_PUBLIC_SERVER}/car/${editId}`, values)
      .then((response) => {
        onCloseModal();
        setLoadingButton(false);
       handleChange(response.data.data.car)
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
      type: Yup.string().required("يرجى ادخال نوع السيارة"),
      car_type_id: Yup.number().required("يرجى ادخال صنف السيارة"),
      image: add && Yup.string().required("يرجى تحميل الصورة"),
      price: Yup.string().required("يرجى ادخال السعر  "),
      seats: Yup.string().required("يرجى ادخال عدد المقاعد  "),
    }
    );
  };
  return (
    <Modal
      show={openModal}
      onHide={() => {
        onCloseModal();
      }}
      centered
    >
      <HeaderField title={add ? "+ إضافة سيارة جديدة" : " تعديل السيارة "} />
      <Formik
        initialValues={edit ?{ type: dataEdit.type, price: dataEdit.price, seats: dataEdit.seats , image:"", is_available:dataEdit.is_available ? true : false,category_id:3 , car_type_id:dataEdit.car_type_id}  :  { type: "", price: "", seats: "" ,   image:"", is_available:true ,category_id:3,car_type_id:""}}
        onSubmit={onSubmit}
        validationSchema={validateSchema()}
      >
        {(props) => (
          <form onSubmit={props.handleSubmit}>
            <Modal.Body>
            <div className="w-200 mw-full mx-auto  ">
              <ImgField
                name="image"
                label="صورة السيارة"
                aspect={1 / 1}
                add={add}
                width="200"
                height="200"
                img={edit && dataEdit.image}
              />
            </div>
              <TextField name="type" type="text" label=" نوع السيارة" />
              <TextField name="car_type_id" component="select" label=" صنف السيارة " >
                <option >إختر صنف السيارة</option>
                {(!error && carType) && carType.data.carTypes.map((type, index)=>(
                  <option key={index} value={type.id}>{type.name}</option>
                ))}
              </TextField>
              <TextField name="seats" type="number" label=" عدد المقاعد " />
              <TextField name="price"  type="number" label="  السعر " />
              <CheckField name="is_available" label="هل السيارة متوفرة"  />
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
