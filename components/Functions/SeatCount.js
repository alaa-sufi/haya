const SeatCount =(seats , t)=>{
    return +seats === 1 ? t("seat") : 
    +seats === 2 ? t("two_seats") :
    (+seats > 2 && +seats < 11) ? ` ${seats} ${t("seats")}` :
    ` ${seats} ${t("seat")}`
}
export default SeatCount