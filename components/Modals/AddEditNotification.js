import React, { useState  , useEffect} from 'react'
import { Modal, Button } from "react-bootstrap";
import { Formik } from "formik";
import { ButtonsField } from '../UI/Inputs';
import * as Yup from "yup";
import { TextField, ImgField, HeaderField } from "../UI/Inputs"
import axios from '@/lib/axios'
import toast from "react-hot-toast";

export default function AddEditNotification({ openModal, onCloseModal, add, edit ,handleChange,dataEdit}) {
    const [loadingButton, setLoadingButton] = useState(false);
    const onSubmit = (values) => {
        setLoadingButton(true);
        axios
            .post(`${process.env.NEXT_PUBLIC_SERVER}/notification` , values)
            .then((response) => {
                onCloseModal();
                setLoadingButton(false);
                handleChange({ id: response.data.data.notification.id, title: response.data.data.notification.title, body: response.data.data.notification.body, image: response.data.data.notification.image ,updated_at: response.data.data.notification.updated_at  })
            })
            .catch((error) => {
                console.error("There was an error !", error);
                onCloseModal();
                setLoadingButton(false);
                toast.error("عذرا حدثت مشكلة ما");

            });
       
    };
    const validateSchema = () => {
        return Yup.object().shape({
            image:add && Yup.string().required("يرجى ادخال الصورة"),
            title: Yup.string().required("يرجى ادخال عنوان "),
            body: Yup.string().required("يرجى ادخال  الشرح "),
        });
    }
    return (
        <Modal show={openModal} onHide={() => { onCloseModal() }} centered>
            <HeaderField title={add ?
                "+ إضافة إشعار " :
                "  إعادة ارسال الاشعار "}
            />
            <Formik initialValues={edit ? { title: dataEdit.title, body: dataEdit.body, image: dataEdit.image } : { title: "", body: "", image: "" }} onSubmit={onSubmit} validationSchema={validateSchema()}>
                {(props) => (
                    <form onSubmit={props.handleSubmit}>
                        <Modal.Body>
                                <div className="circle-img">
                                    <ImgField name="image"  circle aspect={1/ 1} add={add} width="100" height="100" img={edit && dataEdit.image}/>
                                </div>
                                    <TextField name="title" type="text" label="العنوان" />
                                    <TextField name="body" component="textarea" height="100" label="الشرح" />
                            
                        </Modal.Body>
                        <ButtonsField modalState={{ add: add, edit: edit }} loading={loadingButton} onCancle={()=>onCloseModal()}/>
                    </form>
                )}
            </Formik>
        </Modal>
    )
}
