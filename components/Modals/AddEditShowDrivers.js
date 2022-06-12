import React, { useState } from 'react'
import { Modal, Button } from "react-bootstrap";
import { Formik } from "formik";
import { ButtonsField } from '../UI/Inputs';
import * as Yup from "yup";
import { TextField, ImgField, HeaderField } from "../UI/Inputs"
import axios from '@/lib/axios'
import toast from "react-hot-toast";

export default function AddEditShowDrivers({ openModal, onCloseModal, add, edit , editId ,show , handleChange,dataEdit}) {
    const [addForm, setAddForm] = useState()
    const [loadingButton, setLoadingButton] = useState(false)
    const onSubmit = (values) => {
        setLoadingButton(true)
        axios
            .post(add ? `${process.env.NEXT_PUBLIC_SERVER}/driver/auth/register` : `${process.env.NEXT_PUBLIC_SERVER}/driver/${editId}` , values)
            .then((response) => {
                onCloseModal();
                setLoadingButton(false);
                handleChange(response.data.data.driver)
            })
            .catch((error) => {
                onCloseModal();
                setLoadingButton(false);
                if(error.response.status === 422 ){
                    toast.error("عذرا اسم المستخدم مستخدم سابقا");
                }else{
                    console.error("There was an error !", error);
                    toast.error("عذرا حدثت مشكلة ما");
                }

            });
      
    };
    const validateSchema = () => {
        return Yup.object().shape({
            full_name: Yup.string().required("يرجى ادخال الاسم الكامل"),
            username: Yup.string().required("يرجى ادخال اسم المستخدم"),
            car_color: Yup.string().required("يرجى ادخال لون السيارة"),
            car_number: Yup.number().required("يرجى ادخال رقم السيارة"),
            phone_number: Yup.string().required("يرجى ادخال رقم الهاتف"),
            seat_number: Yup.number().required("يرجى ادخال  عدد المقاعد"),
            password: Yup.string().required("يرجى ادخال كلمة المرور")
        });
    }
    return (
        <Modal show={openModal} onHide={() => { onCloseModal() }} centered   size="lg"
        >
            <HeaderField title={add ? "+ إضافة سائق جديد" :  edit ? " تعديل  " : "عرض"}/>
            <Formik initialValues={
                add ? { full_name:"",username:"",car_color: "", car_number: "",phone_number:"", password: "",seat_number:"" }:
                 dataEdit 
            } onSubmit={onSubmit} validationSchema={validateSchema()}>
                {(props) => (
                    <form onSubmit={props.handleSubmit}>
                        <Modal.Body>
                            <div className="row">
                                <div className="col-md-6">
                                    <TextField name="full_name" type="text" label="الاسم الكامل" show={show} view={props.values.full_name} />
                                </div>
                                <div className="col-md-6">
                                    <TextField name="phone_number" type="tel" label="رقم الموبايل" show={show} view={props.values.phone_number} />
                                </div>
                                <div className="col-md-6">
                                    <TextField name="car_number" type="number" label=" رقم السيارة المستلمة" show={show} view={props.values.car_number} />
                                </div>
                                <div className="col-md-6">
                                    <TextField name="car_color" type="text" label="لون السيارة" show={show} view={props.values.car_color} />
                                </div>
                                <div className="col-md-6">
                                    <TextField name="seat_number" type="number" label="عدد المقاعد" show={show} view={props.values.seat_number} />
                                </div>
                                <div className="col-md-6">
                                    <TextField name="username" type="text" label="اسم المستخدم" show={show}  view={props.values.username}/>
                                </div>
                                <div className="col-md-6">
                                    <TextField name="password" type="text" label="كلمة المرور" show={show} view={props.values.password } />
                                </div>
                            </div>
                        </Modal.Body>
                        <ButtonsField modalState={{ add: add, edit: edit ,show:show }} loading={loadingButton} onCancle={onCloseModal}  />
                    </form>
                )}
            </Formik>
        </Modal>
    )
}
