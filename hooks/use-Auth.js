import useSWR, { useSWRConfig } from 'swr'
import axios from '@/lib/axios'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import toast from "react-hot-toast";

export const useAuth = ({ middleware } = {}) => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)
    const [loadingLogin, setLoadingLogin] = useState(false)
    const [loadingLogout, setLoadingLogout] = useState(false)
    const { data: user, error, mutate } = useSWR(`${process.env.NEXT_PUBLIC_SERVER}/admin/auth/profile`, () =>
        axios
            .get(`${process.env.NEXT_PUBLIC_SERVER}/admin/auth/profile`)
            .then(res => {
                return res.data.data
            })
            .catch(error => {
                if (error.response.status != 422) throw error
                // setErrors(Object.values(error.response.data.errors).flat())
            })
    )
    const login = async ({ setErrors, ...props }) => {
        // setErrors([])
        setLoadingLogin(true)
        axios
            .post(`${process.env.NEXT_PUBLIC_SERVER}/admin/auth/login`, props)
            .then(res => {
                setLoadingLogin(false)
                localStorage.setItem('token', res.data.access_token)
                // mutate() && router.push('/admin/categories')
                // router.push('/admin/categories')
                window.location.href="/admin/categories"
                // mutate()
            })
            .catch(error => {
                setLoadingLogin(false)
                if (error.response) {
                    if (error.response.status === 500) {
                        toast.error("username_or_the_wrong_password");
                    }
                    // setErrors(Object.values(error.response.data.errors).flat())
                }else{
                    toast.error("sorry_a_problem_occurred");
                }

            })
    }

    const logout = async () => {
        setLoadingLogout(true)
        await axios.get(`${process.env.NEXT_PUBLIC_SERVER}/admin/auth/logout`).then((response) => {
            setLoadingLogout(false)
            localStorage.removeItem('token')
            mutate(null)
            router.push('/login')
        })
    }

    useEffect(() => {
        if (user || error || middleware === 'user') {
            setIsLoading(false);
        }
        if (middleware == 'guest' && user) router.push('/admin/categories')
        if (middleware == 'auth' && !user && error) router.push('/login')

    }, [user, error, router])

    return {
        login,
        logout,
        isLoading,
        user,
        loadingLogin,
        loadingLogout
    }
}
