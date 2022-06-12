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
  const [seatCount, setSeatCount] = useState(0)
  const [avalibleChairList, setAvalibleChairList] = useState([])
  const [selectedChiarList, setSelectedChiarList] = useState([])
  const [checkRecommend, setCheckRecommend] = useState(false)
  const checkSeat = (event, index, seat) => {
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
    const v = selectedChiarList.filter((x) => x != seat)
    setSelectedChiarList([...v])
    event.target.classList.remove("bookUser");
    handleChooseBook(seat);
    setAvalibleChairList([])
    // stop checkRecommend
    setCheckRecommend(false)
    // if selectedChiarList == all total book seats return 

    //if last seat choose like company book
    if (Number.parseInt(index / last) == (row - 1)) {
      setCheckRecommend(false)
      return
    };
    //   if left seat
    if (index % last < left) {
      for (var i = (Number.parseInt(index / last) * last); i < (Number.parseInt(index / last) * last + left); i++) {
        if ((arrBus[i] != null) && (selectedChiarList.indexOf(+arrBus[i]) === -1) && (allBookSeatsFromApi.indexOf(Math.abs(+arrBus[i])) == -1)) {
          //so add to avalibleChairList
          setAvalibleChairList([...avalibleChairList, Math.abs(+arrBus[i])])
          setCheckRecommend(true)
        }
        if ((selectedChiarList.indexOf(+arrBus[i]) === -1) && (allBookSeatsFromApi.indexOf(Math.abs(+arrBus[i])) != -1)) {
          setSeatCount(seatCount + 1)
        }
      }
      if ((avalibleChairList.length + seatCount) == left) {
        setAvalibleChairList([])
      }
      //set avalibleChairList style
    }
    //if right seat
    else {
      //console.log("right")
      for (var i = (((Number.parseInt(index / last) + 1) * last)) - right - 1; i < (((Number.parseInt(index / last) + 1) * last)); i++) {

        if ((arrBus[i] != null) && (selectedChiarList.indexOf(+arrBus[i]) === -1) && (allBookSeatsFromApi.indexOf(Math.abs(+arrBus[i])) === -1)) {
          //so add to avalibleChairList
          setAvalibleChairList([...avalibleChairList, Math.abs(+arrBus[i])])
          //console.log("avalibleChairList", avalibleChairList)
          setCheckRecommend(true)
        }
        if ((selectedChiarList.indexOf(+arrBus[i]) === -1) && (allBookSeatsFromApi.indexOf(Math.abs(+arrBus[i])) != -1)) {
          setSeatCount(seatCount + 1)
        }
        
      }
      if ((avalibleChairList.length + seatCount) == right) {
        setAvalibleChairList([])
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
              ${`${([...selectedChiarList, ...allBookSeatsFromApi].indexOf(seat) != -1) ? "bookUser" : ""}`}
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
    </Box>
  );
}
///////////////////////////////////////////////////////////// end GenerateNumBusArr

///////////////////////////////////////////////////////////// start chooseUserSeat
export function chooseUserSeat(row, right, left, last, seat, ...bookArr) {
  var arrBus = new Array(row),
    arrBusBool = new Array(row),
    //totla people - 1
    recommendNumber = window.location.pathname.split("/").pop() - 1,
    v = [],
    temp,
    arrRe = [],
    arrLast = [],
    vNumber = [];
  var recomm = Array.from(Array(row), (_) => Array(5).fill(0));
  var arrBusBool = Array.from(Array(row), (_) => Array(5).fill(0));
  function convertBusArrToBool() {
    for (let i = 0; i < arrBusBool.length; i++)
      for (let j = 0; j < 5; j++) arrBusBool[i][j] = arrBus[i][j] === 0 ? 0 : 1;
  }

  function chooseSeat(n) {
    for (let i = 0; i < arrBus.length; i++)
      for (let j = 0; j < 5; j++)
        if (Number.parseInt(n) === arrBus[i][j]) return [i, j];
  }
  function recommend(i, j, weight) {
    if (i < 0 || i > arrBus.length - 1 || j < 0 || j > 4) return;
    if (weight <= recomm[i][j]) return;
    recomm[i][j] = weight;
    recommend(i - 1, j, weight - 2); // right
    recommend(i + 1, j, weight - 2); // left
    recommend(i, j - 1, weight - 1); // up
    recommend(i, j + 1, weight - 1); //down
  }
  function inti_recommend(i, j, weight, recommendNumber) {
    arrBusBool[i][j] = 0; //booked choose seat

    recommend(i, j, weight); //weight for all seats for recomm array

    for (let i = 0; i < arrBus.length; i++)
      for (let j = 0; j < 5; j++) {
        temp = arrBusBool[i][j] * recomm[i][j]; //convert 1 to number else 0 to 0 // if the chair is not booked let its weight
        if (temp) v.push({ t: temp, number: arrBus[i][j] }); // push obj in arr {weight , seat} return from weight
      }

    v.sort(function (a, b) {
      return b.t - a.t;
    });
    vNumber = v.map(function (a) {
      return a.number;
    });
    for (
      let i = 0;
      i < recommendNumber;
      i++ //recommendNumber number of recommend arr
    ) {
      arrLast.push(vNumber[i]);
    }
    return arrLast;
  }

  function getRecommendation(seat) {
    arrBus = GenerateNumBusArr(row, right, left, last, "user", ...bookArr);
    convertBusArrToBool();
    arrRe = inti_recommend(
      chooseSeat(seat)[0],
      chooseSeat(seat)[1],
      1000,
      recommendNumber
    );
  }
  getRecommendation(seat);
  return arrRe;
}
///////////////////////////////////////////////////////////// end chooseUserSeat
