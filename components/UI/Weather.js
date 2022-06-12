import React , {useEffect , useState} from 'react'
import weather from "public/images/weather.png"
import HayaPage from "@/UI/Short/HayaPage"
import Image from 'next/image'
import useTranslation from 'next-translate/useTranslation'

export default function Weather(props) {
  const { t, lang } = useTranslation("all")

  const [lastTime , setLastTime]= useState("")
  const convertDate = (date) => {
    const d = new Date(date)
    return `${d.toLocaleString().split(",")[0]} ${d.toLocaleString().split(",")[1].replace(":00", "")}`
  }
 useEffect(() => {
  const dateFromServer = new Date(); //now
  const serverOffset = props.city.timezone_offset; // in second, from that API call
  const serverOffsetMillis =  1000 * serverOffset;
  const localOffset = new Date().getTimezoneOffset(); // in minutes
  const localOffsetMillis = 60 * 1000 * localOffset;
  const localMidnight = new Date(dateFromServer.getTime() - serverOffsetMillis - localOffsetMillis);
  setLastTime(localMidnight)
 })
  return (
    <HayaPage>
      <div className="h-city-weather">
        <div className="p-3 position-relative">
          <Image src={props.city.image_main} className="radius-2" alt="weather" width="200"  height="200" />
         
        </div>
        <div className=" h-city-weather-info ">
              <h1 className="h-h1 mb-1 text-initial ">{props.city.name}</h1>
              <h3 className="m-1">{props.city.weater_main ? <><bdi>{props.city.weater_main || ""}</bdi> <bdi>{`${props.city.weater_temp}°` || ""}</bdi></> : t("there_is_no_weather_information")}</h3>
              <h5 className="m-1"><bdi>{new Date(new Date().getTime() - 1000 * props.city.timezone_offset - 60 * 1000 * new Date().getTimezoneOffset()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || t("there_is_no_time_information")}</bdi></h5>
        </div>
      </div>
    </HayaPage>
  )
}
