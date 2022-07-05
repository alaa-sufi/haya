import React, { useState } from "react";
import { Grid, Box } from "@mui/material";
import toast from "react-hot-toast";
import Trans from "next-translate/Trans";
import LoadingSpinner from "components/UI/LoadingSpinner"

export default function Bus() {
  return <div></div>;
}
export function GenerateNumBusArr(row, right, left, last, frontDoor = -1, lastDoor = -1, busSeats) {
  var chairList = [];
  var total = 0;
  var i = 1;
  for (var index = 0; index < (last * row); index++) {
    if (Number.parseInt(index / last) + 1 == row ||
      ((index % last) < left ||
        (index % last >= (last - right) &&
          (Number.parseInt(index / last) + 1) != frontDoor &&
          (Number.parseInt(index / last) + 1) != lastDoor))) {
      if (busSeats) {
        if (busSeats[i - 1].is_company === 1) {
          chairList.push(`--${i++}`);
        } else if (busSeats[i - 1].is_booking === 1) {
          chairList.push(`-${i++}`);
        } else {
          chairList.push(i++);
        }

      } else {
        chairList.push(i++);
      }
      total = i - 1;

    } else {
      chairList.push(null);
    }
  }
  return { chairList: chairList, total: total };
}
///////////////////////////////////////////////////////////// end GenerateNumBusArr

///////////////////////////////////////////////////////////// start GenerateNumBusArr
// const selectedChiarList  = [];
export function ShowBus({ arrBus, last, row, right, left, book, total, allBookSeatsFromApi, handleChooseBook, loading }) {
  const [avalibleChairList, setAvalibleChairList] = useState([])
  const [selectedChiarList, setSelectedChiarList] = useState([])
  const [checkRecommend, setCheckRecommend] = useState(false)
  const [unCheck, setUncheck] = useState(false)
  const [indexMore, setIndexMore] = useState(-1)
  const [indexLess, setIndexLess] = useState(-1)
  const checkSeat = (event, index, seat) => {
    setUncheck(false)
    // index selected seat
    // selectedChiarList : selected List
    // avalibleChairList : recommend 
    // arrBus : all seats list 
    // allBookSeatsFromApi : book seats from api
    // setSelectedChiarList([...selectedChiarList , seat])
    //empty all avalibleChairList
    setAvalibleChairList([])
    // stop checkRecommend
    setCheckRecommend(false)
    // if selectedChiarList == all total book seats return 
    if (selectedChiarList.length === +total) {
      //console.log("%cnot allow","color:red");
      toast.error(<Trans i18nKey="all:sorry_it_is_not_possible_to_reserve_more_than_the_specified_number"></Trans>);
      setAvalibleChairList([])
      setCheckRecommend(false)
      // avalibleChairList.value = List.of(avalibleChairList.value)..add(-1);//??
      return;
    }
    setSelectedChiarList([...selectedChiarList, seat])
    // selectedChiarList.push(seat)

    event.target.classList.add("bookUser");
    handleChooseBook(seat)

    //if last seat choose like company book
    if (Number.parseInt(index / last) == (row - 1)) {
      //console.log("last")
      setAvalibleChairList([])
      setCheckRecommend(false)

      return
    };
    //   if left seat
    if (index % last < left) {
      //console.log("left")
      for (var i = (Number.parseInt(index / last) * last); i < (Number.parseInt(index / last) * last + left); i++) {
        // if seat is not empty  && seat is not book before && it is not choosen seat
        //console.log("jj",arrBus[i] != null && i != index)
        //console.log("selectedChiarList" ,selectedChiarList )
        // if ((arrBus[i] != null ) && (selectedChiarList.indexOf(+arrBus[i]) != -1) && ( i != index)) {
        //console.log("arrBus[i]",arrBus[i])
        if ((arrBus[i] != null) && (selectedChiarList.indexOf(+arrBus[i]) === -1) && (allBookSeatsFromApi.indexOf(Math.abs(+arrBus[i])) == -1) && (i != index)) {
          //so add to avalibleChairList
          setAvalibleChairList([...avalibleChairList, Math.abs(arrBus[i])])
          //console.log("avalibleChairList", avalibleChairList);
          setCheckRecommend(true)
        }
      }
      //set avalibleChairList style
    }
    //if right seat
    else {
      //console.log("right")
      for (var i = (((Number.parseInt(index / last) + 1) * last)) - right - 1; i < (((Number.parseInt(index / last) + 1) * last)); i++) {
        // if seat is not empty  && seat is not book before && it is not choosen seat
        //console.log("jj",arrBus[i] != null  && i != index)
        //console.log("arrBus[i]",arrBus[i])
        //console.log("selectedChiarList" ,selectedChiarList )
        //console.log("arrBus[i]",arrBus[i])
        if ((arrBus[i] != null) && (selectedChiarList.indexOf(+arrBus[i]) === -1) && (allBookSeatsFromApi.indexOf(Math.abs(+arrBus[i])) === -1) && (i != index)) {
          //so add to avalibleChairList
          setAvalibleChairList([...avalibleChairList, Math.abs(arrBus[i])])

          //console.log("avalibleChairList", avalibleChairList)
          setCheckRecommend(true)
        }
      }
    }

  }
  const uncheckSeat = (event, index, seat) => {
    setIndexMore(index + 1)
    setIndexLess(index - 1)
    setUncheck(true)
    const selectedChiarListArr = selectedChiarList.filter((x) => x != seat)
    setSelectedChiarList(selectedChiarList.filter((x) => x != seat))
    event.target.classList.remove("bookUser");
    handleChooseBook(seat);
    const avalibleChairListArr = []
    setAvalibleChairList([])
    // stop checkRecommend
    setCheckRecommend(false)
    // if selectedChiarList == all total book seats return 

    //if last seat choose like company book
    if (Number.parseInt(index / last) == (row - 1)) {
      setCheckRecommend(false)
      return
    };
    const seatCount = 0;
    //   if left seat
    if (index % last < left) {
      for (var i = (Number.parseInt(index / last) * last); i < (Number.parseInt(index / last) * last + left); i++) {
        if ((arrBus[i] != null) && (selectedChiarListArr.indexOf(+arrBus[i]) === -1) && (allBookSeatsFromApi.indexOf(Math.abs(+arrBus[i])) == -1)) {
          //so add to avalibleChairList
          setAvalibleChairList([...avalibleChairListArr, Math.abs(+arrBus[i])])
          avalibleChairListArr.push(Math.abs(+arrBus[i]))
          setCheckRecommend(true)
        }
        if ((selectedChiarListArr.indexOf(+arrBus[i]) === -1) && (allBookSeatsFromApi.indexOf(Math.abs(+arrBus[i])) != -1)) {
          seatCount = seatCount + 1;
        }
      }
      if ((avalibleChairListArr.length + seatCount) == left) {
        setAvalibleChairList([])
        avalibleChairListArr = []
        setCheckRecommend(false)

      }
      //set avalibleChairList style
    }
    //if right seat
    else {
      //console.log("right")
      for (var i = ((Number.parseInt(index / last) + 1) * last) - right - 1; i < ((Number.parseInt(index / last) + 1) * last); i++) {
        if ((arrBus[i] != null) && (selectedChiarListArr.indexOf(+arrBus[i]) === -1) && (allBookSeatsFromApi.indexOf(Math.abs(+arrBus[i])) === -1)) {
          //so add to avalibleChairList
          setAvalibleChairList([...avalibleChairListArr, Math.abs(+arrBus[i])])
          avalibleChairListArr.push(Math.abs(+arrBus[i]))
          setCheckRecommend(true)
        }
        if (((selectedChiarListArr.indexOf(+arrBus[i]) === -1) || (arrBus[i] != null))&& ((allBookSeatsFromApi.indexOf(Math.abs(+arrBus[i])) != -1) || (arrBus[i] != null))) {
          seatCount = seatCount + 1;
        }

      }
      if ((selectedChiarListArr.length + seatCount) == right) {
        setAvalibleChairList([])
        avalibleChairListArr = []
        setCheckRecommend(false)
      }
    }
    // 


  }
  const handleBook = (event, index, seat, book) => {
    if (book === "admin") {
      //admin book 
      // toggle class
      event.target.classList.toggle("bookAdmin");
      if (event.target.innerText.startsWith("--")) {
        //return number from --seat to seat
        event.target.innerText = event.target.innerText.slice(-1);
      }
      handleChooseBook(seat)
    } else if (book === "user") {
      //user book
      //toggle class
      if (event.target.classList.contains("bookUser")) {
        // event.target.classList.remove("bookUser");
        uncheckSeat(event, index, seat)
      } else {
        // event.target.classList.add("bookUser");
        checkSeat(event, index, seat)
      }
    }
    //up data to collect company book arr
  }
  return (
    <Box className={`h-bus-block dir-ltr`}>
      <Grid container columns={{ xs: +last }}>
        {!loading ? arrBus.map((seat, index) => (
          <Grid item xs={1} component="div" key={index}>
            <Box
              onClick={(event) => {
                handleBook(event, index, seat, book);
              }}
              // seat == null  : empty seat
              //admin
              // seat == -seat : book user seat      = bookAdmin
              // seat == --seat : company user seat  = bookUser
              //user
              // seat == --seat ||  seat == -seat    = bookUser
              // if seat in avalibleChairList "recommend" else "unrecommend" 
              className={`h-bus-block-item 
              ${seat === null ? "bg-transparent pointer-events-none" : ""}  
              ${(String(seat).startsWith("--") ? book === "admin" : "") ? "bookAdmin" : (String(seat).startsWith("-") && book === "admin") ? "bookUser pointer-events-none" : ""}
              ${(String(seat).startsWith("-") && book === "user") ? "bookUser pointer-events-none" : ""} 
              ${`${selectedChiarList.length < +total ? (avalibleChairList.indexOf(seat) === -1 && checkRecommend) ? "unrecommend" : checkRecommend && "recommend" : ""} `}
              ${`${((selectedChiarList.length == +total) && (selectedChiarList.indexOf(seat) === -1)) && "unrecommend"}`}
              ${`${([...selectedChiarList, ...allBookSeatsFromApi].indexOf(seat) != -1) ? "bookUser" : ""}`}
              ${`${(selectedChiarList.indexOf(seat) != -1 && checkRecommend && unCheck && seat != null && (indexMore == index || indexLess == index)) && "pointer-events-initial"}`}
            `} >
              {seat}
            </Box>
          </Grid>
        ))
          :
          <div className="h-500">
            <LoadingSpinner />
          </div>
        }
      </Grid>
    </Box >
  );
}
///////////////////////////////////////////////////////////// end GenerateNumBusArr


