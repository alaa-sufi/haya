import React, { useState } from 'react'
import { Modal, Button } from "react-bootstrap";
import { Formik } from "formik";
import { ButtonsField } from '../UI/Inputs';
import * as Yup from "yup";
import { TextField, ImgField, HeaderField } from "../UI/Inputs"


export default function AddEditCars({ openModal, onCloseModal, add, edit }) {
    const [addForm, setAddForm] = useState({ image: "",type:"", name: "",seats:"", user: "", password: "" })
    const [loadingButton, setLoadingButton] = useState(false)
    const onSubmit = (values) => {
        setLoadingButton(true)
        // postApi("/api/category", values).then(response => {
        //   setAddModal(false);
        //   setLoading(true)
        //   setLoadingButton(false)
        //   getApi("/api/category").then(response => {
        //     setHTypes(response.data.data);
        //     setLoading(false)
        //   })
        // })
    };
    const validateSchema = () => {
        return Yup.object().shape({
            image: Yup.string().required("يرجى ادخال الصورة"),
            type: Yup.string().required("يرجى ادخال نوع السيارة"),
            seats: Yup.string().required("يرجى ادخال عدد المقاعد "),
            user: Yup.string().required("يرجى ادخال اسم المستخدم"),
            password: Yup.string().required("يرجى ادخال كلمة المرور"),
        });
    }
    return (
        <Modal show={openModal} onHide={() => { onCloseModal() }} centered>
            <HeaderField title={add ?
                 "+ إضافة سيارة جديدة" :
                " تعديل السيارة "}
                />
            <Formik initialValues={addForm} onSubmit={onSubmit} validationSchema={validateSchema()}>
                {(props) => (
                    <form onSubmit={props.handleSubmit}>
                        <Modal.Body>
                            <ImgField name="image" label="صورة الصنف" aspect={2 / 1} add={add} />
                            <TextField name="type" type="text" label="نوع السيارة" />
                            <TextField name="seats" type="text" label="عدد المقاعد" />
                            <TextField name="user" type="text" label="اسم المستخدم" />
                            <TextField name="password" type="password" label="كلمة المرور" />
                        </Modal.Body>
                        <ButtonsField modalState={{ add: add, edit: edit }} loading={loadingButton} />
                    </form>
                )}
            </Formik>
        </Modal>
    )
}
