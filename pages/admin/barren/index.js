import React, { useState, useEffect } from 'react'
import BlueArea from "@/UI/Short/BlueArea";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import useSWR, { useSWRConfig } from 'swr'
import { Pagination } from '@mui/material';
import LoadingSpinner from "@/UI/LoadingSpinner"
import { useAuth } from "hooks/use-Auth"
import Head from 'next/head'
import useTranslation from 'next-translate/useTranslation'
import NoInfo from "components/UI/NoInfo"

export default function AdminBarren() {
    const { t, lang } = useTranslation("all")
    const {user, isLoading} = useAuth({middleware: 'auth'})
    const [count, setCount] = useState()
    const [page, setPage] = useState(1)
    const [loading, setLoading] = useState(true)
    const [allBaren, setAllBarren] = useState([])
    const [start_date, setStart_date] = useState("")
    const [end_date, setEnd_date] = useState("")
    const url =`${process.env.NEXT_PUBLIC_SERVER}/booking?page=${page}&perPage=10&filter[start_date]=${start_date}&filter[end_date]=${end_date}`;
    const { data: barren, error } = useSWR(url);
    const { mutate } = useSWRConfig()
    useEffect(() => {
        if (barren) {
            setAllBarren(barren.data.bookings);
            setCount(+barren.data.total);
        }
        setLoading(barren ? false : true)
    }, [barren])
    const handleChangePage = (event, value) => {
        setPage(value);
        mutate(url);
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
    if (isLoading || !user ||!barren){
        return <div className="loading-parent"><LoadingSpinner/></div>
    }
    return (
        <>
          <Head>
        <title>{t("all:al_hayat_company")} - الجرد</title>
      </Head>
        <BlueArea  >
            <h1 className="h-h1 text-center "> الجرد</h1>
            <label className="mb-4">
                بحث:
                <div className="row align-items-center">
                    <div className="col-md-5 mb-3 mb-md-0 d-flex align-items-center gap-2">
                        <span>
                        من 
                        </span>
                         
                        <input type="date" className="form-control"  value={start_date} onChange={(e) => { setStart_date(e.target.value); }} />
                    </div>
                    <div className="col-md-5 mb-3 mb-md-0 d-flex align-items-center gap-2">
                        <span>
                        الى
                        </span>
                        <input type="date" className="form-control" value={end_date} onChange={(e) => { setEnd_date(e.target.value); }} />
                    </div>
                    <div className="col-md-1">
                        <button className="h-button mr-auto d-block" onClick={()=>{ mutate(`${url}`)}}>بحث</button>
                    </div>
                </div>
            </label>
            {loading ?<LoadingSpinner/>:<TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="right">تاريخ الحجز</TableCell>
                            <TableCell align="right">اسم الرحلة</TableCell>
                            <TableCell align="center">عدد التذاكر</TableCell>
                            <TableCell align="right">المبلغ الاجمالي</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {allBaren.map((row) => (
                            <TableRow
                                key={row.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell align="right" component="th" scope="row">
                                    {new Date(row.booking_date).toLocaleDateString('zh-Hans-CN')}
                                </TableCell>
                                <TableCell align="right">{row.booking_name}</TableCell>
                                <TableCell align="center">{row.seat_count}</TableCell>
                                <TableCell align="right">{row.all_price}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>}
            <div className="p-4">
            {(!loading && count > 0) &&  <Pagination count={count} color="primary" page={page} onChange={handleChangePage} />}
            </div>

        </BlueArea>
        </>
    )
}
