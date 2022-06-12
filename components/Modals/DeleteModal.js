import React, { useState } from 'react'
import { useRouter }  from "next/router";
import { Modal } from "react-bootstrap";
import { ButtonsField } from '../UI/Inputs';
import { HeaderField } from "../UI/Inputs"
import axios from '@/lib/axios'
import toast from "react-hot-toast";

export default function DeleteModal(props) {
  const router = useRouter();
  const [loadingButton, setLoadingButton] = useState(false)
  const deleteModal = async (e) => {
    e.preventDefault()
    setLoadingButton(true)

      axios
      .delete(`${process.env.NEXT_PUBLIC_SERVER}${props.url}`)
      .then((response) => {
        props.onCancle();
        setLoadingButton(false);
        props.back && router.push(props.back);
        props.handledelete1 && props.handledelete1();
      })
      .catch((error) => {
        setLoadingButton(false);
        console.error("There was an error!", error);
        props.onCancle() 
        toast.error("عذرا حدثت مشكلة ما");
      });
     
  }
  return (

    <Modal show={props.openModal} onHide={() => { props.onCancle() }} centered>
      <HeaderField title={`هل أنت متأكد من حذف ${props.name}`} />
      <form onSubmit={deleteModal}>
        <ButtonsField modalState={{ delete: true }} loading={loadingButton}  onCancle={() => { props.onCancle() }} />
      </form>
    </Modal>

  )
}
