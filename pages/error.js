import NoInfo from "@/UI/NoInfo"
import Head from 'next/head'
import useTranslation from 'next-translate/useTranslation'

export default function Error(){
    const { t, lang } = useTranslation("all")

    return(
        <>
        <Head>
        <title>{t("al_hayat_company")} - {t("error_in_page")}</title>
      </Head>
        <NoInfo error/>
        </>
    )
}