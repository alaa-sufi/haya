import React, { useState } from 'react'
import { Modal, Button } from "react-bootstrap";
import { Formik } from "formik";
import { ButtonsField } from '../UI/Inputs';
import * as Yup from "yup";
import { TextField, ImgField, HeaderField } from "../UI/Inputs"


export default function AddEditCompanies({ openModal, onCloseModal, add, edit }) {
    const [addForm, setAddForm] = useState({ image: "", name: "", user: "", password: "" })
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
            name: Yup.string().required("يرجى ادخال اسم الشركة"),
            user: Yup.string().required("يرجى ادخال اسم المستخدم"),
            password: Yup.string().required("يرجى ادخال كلمة المرور"),
        });
    }
    return (
        <Modal show={openModal} onHide={() => { onCloseModal() }} centered>
            <HeaderField title={add ?
                 "+ إضافة شركة جديدة" :
                " تعديل الشركة"}
                />
            <Formik initialValues={addForm} onSubmit={onSubmit} validationSchema={validateSchema()}>
                {(props) => (
                    <form onSubmit={props.handleSubmit}>
                        <Modal.Body>
                            <div style={{ width: "150px", margin: "auto" }}>
                                <ImgField name="image" label="لوغو الشركة" aspect={1 / 1} add={add} />
                            </div>
                            <TextField name="name" type="text" label="اسم الشركة" />
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
