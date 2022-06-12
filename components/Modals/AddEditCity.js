import React, { useState, useEffect } from 'react'
import { Modal, Button } from "react-bootstrap";
import { Formik } from "formik";
import { ButtonsField } from '../UI/Inputs';
import * as Yup from "yup";
import { TextField, ImgField, HeaderField } from "../UI/Inputs"
import axios from '@/lib/axios'
import toast from "react-hot-toast";


export default function AddEditTypes({ openModal, onCloseModal, add, edit, dataEdit, handleChange, editId }) {


    const [loadingButton, setLoadingButton] = useState(false)
    const onSubmit = (values) => {
        setLoadingButton(true);
        axios
            .post(add ? `${process.env.NEXT_PUBLIC_SERVER}/city` : `${process.env.NEXT_PUBLIC_SERVER}/city/${editId}`, values)
            .then((response) => {
                onCloseModal();
                setLoadingButton(false);
                handleChange({ id: response.data.data.city.id, name: response.data.data.city.name, image_main: response.data.data.city.image_main, image1: response.data.data.city.image1, image2: response.data.data.city.image2, image3: response.data.data.city.image3, starting_place:response.data.data.city.starting_place })
            })
            .catch((error) => {
                if(error.response){
                    if(error.response.status === 500){
                        toast.error("يرجى ادخال خط طول وعرض صحيحين من موقع google map");
                        setLoadingButton(false);
                    }

                }else{
                    onCloseModal();
                    setLoadingButton(false);
                    toast.error("عذرا حدثت مشكلة ما");
                }

            });


    };
    const validateSchema = () => {
        return Yup.object().shape({
            name: Yup.string().required("يرجى ادخال اسم الصنف"),
            image_main: add && Yup.string().required("يرجى تحميل الصورة"),
            starting_place: add && Yup.string().required("يرجى  كتابة مكان الانطلاق"),
            latitude: Yup.number().required(" يرجى ادخال خط العرض"),
            longitude: Yup.number().required("يرجى ادخال خط الطول"),
        }
        );
    }
    return (
        <Modal show={openModal} onHide={() => { onCloseModal() }} centered>
            <HeaderField title={add ?
                "+ إضافة موقع جديد" :
                " تعديل الموقع "}
            />
            <Formik initialValues={edit ? { name: dataEdit.name, image_main: "", image1: "", image2: "", image3: "", latitude: dataEdit.latitude, longitude: dataEdit.longitude , starting_place:dataEdit.starting_place} : { name: "", image_main: "", image1: "", image2: "", image3: "", latitude: "", longitude: "" , starting_place:"" }} onSubmit={onSubmit} validationSchema={validateSchema()}>
                {(props) => (
                    <form onSubmit={props.handleSubmit}>
                        <Modal.Body>
                            <div className="w-200 mw-full mx-auto  ">
                                <ImgField name="image_main" label="الصورة الرئيسية للموقع" aspect={1 / 1} add={add} width="200" height="200" img={edit && dataEdit.image_main} />
                            </div>
                            <TextField name="name" type="text" label="اسم الموقع" />
                            <TextField name="starting_place" type="text" label="مكان الانطلاق" />
                            <div className="row">
                                <div className="col-md-6">
                                    <TextField name="latitude" type="number" label="خط العرض" step="0.0000000001" />
                                </div>
                                <div className="col-md-6">
                                    <TextField name="longitude" type="number" label="خط الطول" step="0.0000000001" />
                                </div>
                            </div>
                            <label className='h-label'>الصور الفرعية</label>
                            <div className="row">
                                <div className="col-md-6">
                                    <ImgField name="image1" aspect={1 / 1} add={add} width="100" height="100" img={edit && dataEdit.image1} />
                                </div>
                                <div className="col-md-6">
                                    <ImgField name="image2" aspect={1 / 1} add={add} width="100" height="100" img={edit && dataEdit.image2} />
                                </div>
                                <div className="col-md-12">
                                    <ImgField name="image3" aspect={2 / 1} add={add} width="200" height="100" img={edit && dataEdit.image3} />
                                </div>
                            </div>
                           
                        </Modal.Body>
                        <ButtonsField modalState={{ add: add, edit: edit }} loading={loadingButton} />
                    </form>
                )}
            </Formik>
        </Modal>
    )
}
