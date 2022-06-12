import React, { useState } from "react";
import { useRouter } from "next/router";
import { Grid, Container } from "@mui/material";
import { LogoLogin } from "public/svg";
import Earth from "public/images/earth.png";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Image from "next/image";
import { useAuth } from "../hooks/use-Auth"
import LoadingSpinner from "@/UI/LoadingSpinner";
import useTranslation from 'next-translate/useTranslation'
import Head from 'next/head'

export default function LoginPage() {
  const { t, lang } = useTranslation()

  const router = useRouter();
  const [error, setError] = useState();
  const { login, isLoading, user, loadingLogin } = useAuth({ middleware: 'guest' })


  const onSubmit = (values) => {
    login(values)
  };
  if (isLoading || user) {
    return <div className="loading-parent"><LoadingSpinner /></div>
  }
  return (
    <>
      <Head>
        <title>{t("all:al_hayat_company")} - {t("all:sign_in")}</title>
      </Head>
      <section className="h-login">
        <div className="container">
          <Grid container alignItems="center">
            <Grid
              item
              md={6}
              sm={12}
              align="center"
              mx={"auto"}
              sx={{ mt: { xs: 10, md: 0 } }}
            >
              <Container>
                <LogoLogin width="150" height="150" />
                <h2>{t("all:sign_in")}</h2>
                <Formik
                  initialValues={{
                    username: "",
                    password: ""
                  }}
                  onSubmit={onSubmit}
                  validationSchema={() => {
                    return Yup.object().shape({
                      username: Yup.string().required(t("all:please_enter_the_name")),
                      password: Yup.string()
                        .required(t("all:please_write_the_password"))
                    });
                  }}
                >
                  {(props) => (
                    <form onSubmit={props.handleSubmit}>
                      <div className="form-group">
                        <Field name="username" type="text" className="h-input form-control big " placeholder={t("all:user_name")} dir="auto" />
                        <ErrorMessage name="username" className="text-danger text-center my-2" component="h6" />
                      </div>
                      <div className="form-group">
                        <Field name="password" type="password" className="h-input form-control big " placeholder={t("all:password")} />
                        <ErrorMessage name="password" className="text-danger text-center my-2" component="h6" />
                      </div>
                      {error && <h6 className="text-danger text-center my-2">{t("all:username_or_the_wrong_password")}</h6>}
                      <button className="btn h-button d-block mx-auto big mt-5 position-relative">
                        {loadingLogin ? <><LoadingSpinner /> <span className="opacity-0">load</span>  </> : t("all:sign_in")}
                      </button>
                    </form>
                  )}
                </Formik>
              </Container>
            </Grid>
            <Grid item md={6} sm={12} sx={{ mt: { xs: 5, md: 0 } }}>
              <div className="h-login-earth position-relative">
                <Image src={Earth} alt="earth" responsive="fill" />
              </div>
            </Grid>
          </Grid>
        </div>
      </section>
    </>
  );
}
LoginPage.getLayout = function PageLayout(page) {
  return <>
    {page}
  </>
}
