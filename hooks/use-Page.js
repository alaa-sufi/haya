import React, { useState } from "react";
// import { useParams } from "react-router-dom";
import useHttp from "./use-Http";

const usePage = (props) => {
  let { id } = 1
  const { UseApi } = useHttp();
  const [modalState, setModalState] = useState({
    add: false,
    edit: false,
    show: false
  });
  const [loading, setLoading] = useState({
    button: false,
    second: false,
    modal: false,
    page: true
  });
  const [paginationState, setPaginationState] = useState({
    activePage: 1,
    total: 0,
    perPage: 10
  });
  const [dataPage, setDataPage] = useState([]);
  const [editId, setEditId] = useState([]);
  const [errorSecond, setErrorSecond] = useState("");
  const [errorPage, setErrorPage] = useState("");
  const [pageHaed, setPageHead] = useState("");
//   const [pageForm, setPageForm] = useState(props.pageForm );
  const [pageForm, setPageForm] = useState("");
  const sendRequest = async (requestConfig, transformData, first = false , outRequest = false) => {
    first
      ? setLoading((p) => {
          return { ...p, page: true };
        })
      : setLoading((p) => {
          return { ...p, second: true, page: false };
        });
    try {
      await UseApi("Get", requestConfig.url,outRequest).then((response) => {
        first
          ? setLoading((p) => {
              return { ...p, page: false };
            })
          : setLoading((p) => {
              return { ...p, second: false };
            });
        setErrorSecond("");
        setErrorPage("");
        transformData(response);
        // setPaginationState((p) => {
        //   return { ...p, total: response.data.total };
        // });
      });
    } catch (error) {
      setLoading((p) => {
        return { ...p, page: false, second: false };
      });
      setErrorPage(error.message);
      console.error("error send request", error.message);
    }
  };
  const addFunc = () => {
    setModalState({ show: true, edit: false, add: true });
  };
  //open modal for edit
  const editFunc = (id, editForm) => {
    setModalState({ show: true, edit: true, add: false });
    setEditId(id);
    setPageForm(editForm);
  };
  //close modal
  const closeFunc = () => {
    setModalState((p) => {
      return { ...p, show: false };
    });
  };
  //send add or edit
  const submitFunc = async (apiurl, values, successAddEdit) => {
    setLoading((p) => {
      return { ...p, button: true };
    });
    try {
      await UseApi("Post", apiurl,false, values).then((response) => {
        setLoading((p) => {
          return { ...p, second: false };
        });
        setErrorSecond("");
        setErrorPage("");
        setLoading((p) => {
          return { ...p, button: false };
        });
        closeFunc();
        successAddEdit(response);
      });
    } catch (error) {
      setErrorSecond(error.message);
      setLoading((p) => {
        return { ...p, button: false };
      });
    //   toaster.push(
    //     <Notification type="error" header="عذرا هناك خطأ" closable>
    //       <p>{error.message}</p>
    //     </Notification>,
    //     { placement: "topStart" }
    //   );
    }
  };

  return {
    modalState,
    loading,
    sendRequest,
    addFunc,
    editFunc,
    closeFunc,
    submitFunc,
    paginationState,
    setPaginationState,
    dataPage,
    setDataPage,
    editId,
    setEditId,
    pageHaed,
    setPageHead,
    pageForm,
    setPageForm,
    id,
    errorSecond,
    errorPage
  };
};
export default usePage;
