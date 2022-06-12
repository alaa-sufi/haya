import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import { Formik } from "formik";
import { ButtonsField } from "components/UI/Inputs";
import * as Yup from "yup";
import { TextField, ImgField, HeaderField } from "components/UI/Inputs";
import axios from '@/lib/axios'
import toast from "react-hot-toast";

export default function AddEditCategories({
  openModal,
  onCloseModal,
  add,
  edit,
  isBus,
  dataEdit,
  handleChange,
  editId
}) {
  

  const [loadingButton, setLoadingButton] = useState(false);
  const onSubmit = (values) => {
    setLoadingButton(true);
    axios
      .post(add ? `${process.env.NEXT_PUBLIC_SERVER}/category` : `${process.env.NEXT_PUBLIC_SERVER}/category/${editId}`, values)
      .then((response) => {
        onCloseModal();
        // setLoading(true);
        setLoadingButton(false);
       handleChange({name:response.data.data.category.name, image:response.data.data.category.image , id: response.data.data.category.id})
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
      image: add && Yup.string().required("يرجى تحميل الصورة")
     
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
        initialValues={edit ?{ image: "",name: dataEdit.name }  : { image: "", name: "" } }
        onSubmit={onSubmit}
        validationSchema={validateSchema()}
      >
        {(props) => (
          <form onSubmit={props.handleSubmit}>
            <Modal.Body>
              <TextField name="name" type="text" label="اسم الصنف" />
              <ImgField
                name="image"
                label="صورة الصنف"
                aspect={2 / 1}
                add={add}
                width="700"
                height="250"
                img={edit && dataEdit.image}
              />
              
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
