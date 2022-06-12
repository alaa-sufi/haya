import Head from 'next/head'
import React, { useState, useEffect } from 'react'
import BlueArea from "components/UI/Short/BlueArea";
import { Grid, Typography, Container, Avatar } from '@mui/material';
import { IconButton } from '@mui/material';
import { Autorenew } from '@mui/icons-material';
import AddEditNotification from "@/Modals/AddEditNotification"
import Image from "next/image";
import add from "public/images/add circle.svg"
import { Pagination } from '@mui/material';
import NoInfo from "@/ui/NoInfo"
import useSWR, { useSWRConfig } from 'swr'
import { useAuth } from "hooks/use-Auth"
import LoadingSpinner from "@/UI/LoadingSpinner"
import useTranslation from 'next-translate/useTranslation'
export default function About({ dataPage }) {
  const {user, isLoading} = useAuth({middleware: 'auth'})
const { t, lang } = useTranslation("all")
  const [addModal, setAddModal] = useState(false)
  const [editModal, setEditModal] = useState(false)
  const [allNotification, setAllNotification] = useState([])
  const [editNotificationId, setEditNotificationId] = useState(null)
  const [count, setCount] = useState()
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)

  const { data: notifications, error } = useSWR(`${process.env.NEXT_PUBLIC_SERVER}/notification?page=${page}&perPage=10`);
  const { mutate } = useSWRConfig()

  useEffect(() => {
    if (notifications) {
      setAllNotification(notifications.data.notifications)
      setCount(+notifications.data.total)
    }
    setLoading(notifications ? false : true)

  }, [notifications])
  const handleChange = (data) => {
    setAllNotification([data, ...allNotification])
  }
  const handleChangePage = (event, value) => {
    setPage(value);
    mutate(`${process.env.NEXT_PUBLIC_SERVER}/notification?page=${page}&perPage=10`)
  };
  if(error){
    return(
        <section >
        <div className="container">
            <div className="h-block-blue">
                <NoInfo error/>
            </div>
        </div>
    </section>
    )
}
  if (isLoading || !user || !allNotification){
    return <div className="loading-parent"><LoadingSpinner/></div>
}
  return (
    <>
     <Head>
        <title>{t("all:al_hayat_company")} - الإشعارات</title>
      </Head>
      <BlueArea  className="h-notification">
        <h1 className="h-h1">الاشعارات</h1>
        <Container component="main" >
          {allNotification.length ? allNotification.map((notification, index) => (
            <Grid container className="h-notification-item mb-2" key={index}>
              <Grid item xs={1}>
                <Avatar alt={notification.title} src={notification.image} sx={{ width: 56, height: 56 }} />
              </Grid>
              <Grid item xs={7}>
                <Typography component="h6" sx={{ fontWeight: "bold" }}>{notification.title} </Typography>
                <Typography component="span" color="text.secondary" >{notification.body}</Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="small" component="bdi" color="text.secondary"> {new Date(notification.updated_at).toLocaleDateString('zh-Hans-CN')} </Typography>
              </Grid>
              <Grid item xs={2}>
                <ul className="d-flex gap-3 flex-row-reverse">
                  <li>
                    <IconButton onClick={() => { setEditModal(true); setEditNotificationId(notification.id) }}>
                      <Autorenew color="primary" fontSize="large" alt="edit" />
                    </IconButton>
                  </li>

                </ul>
              </Grid>
            </Grid>
          )) :
            <></>
          }
        </Container>
        <button className="h-add-drivers" onClick={() => { setAddModal(true); }} >
          <Image src={add} alt="alt" width="50" height="50" />
        </button>
        {(!loading && count > 0) && <Pagination count={count} color="primary" page={page} onChange={handleChangePage} />}

      </BlueArea>
      <AddEditNotification openModal={addModal} onCloseModal={() => { setAddModal(false) }} add handleChange={handleChange} />
      {editNotificationId && <AddEditNotification openModal={editModal} onCloseModal={() => { setEditModal(false) }} edit dataEdit={allNotification.find((x) => x.id === +editNotificationId)} handleChange={handleChange} />
      }    </>
  )
}

