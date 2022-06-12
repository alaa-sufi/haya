import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik } from "formik";
import { ButtonsField } from "components/UI/Inputs";
import * as Yup from "yup";
import { TextField, ImgField, HeaderField } from "components/UI/Inputs";
import axios from '@/lib/axios'
import toast from "react-hot-toast";

export default function AddEditCarType({
  openModal,
  onCloseModal,
  add,
  edit,
  dataEdit,
  handleChange,
  editId
}) {
  

  
  const [loadingButton, setLoadingButton] = useState(false);
  const onSubmit = (values) => {
    setLoadingButton(true);
    axios
      .post(add ? `${process.env.NEXT_PUBLIC_SERVER}/carType` : `${process.env.NEXT_PUBLIC_SERVER}/carType/${editId}`, values)
      .then((response) => {
        onCloseModal();
        // setLoading(true);
        setLoadingButton(false);
       handleChange({name:response.data.data.carType.name , id:response.data.data.carType.id })
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
      name: Yup.string().required("يرجى ادخال اسم الصنف"),
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
      <HeaderField title={add ? "+ إضافة صنف جديد" : " تعديل الصنف "} />
      <Formik
        initialValues={edit ?{ name: dataEdit.name }  : {name: "" } }
        onSubmit={onSubmit}
        validationSchema={validateSchema()}
      >
        {(props) => (
          <form onSubmit={props.handleSubmit}>
            <Modal.Body>
              <TextField name="name" type="text" label="اسم الصنف" />
            </Modal.Body>
            <ButtonsField
              modalState={{ add: add, edit: edit }}
              loading={loadingButton}
            />
          </form>
        )}
      </Formik>
    </Modal>
  );
}
