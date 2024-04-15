import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Loading from '../components/Loading/Loading'
import axios from 'axios'
import Cookies from 'js-cookie'

const Verify = () => {
    const [isLoading, setIsLoading] = useState()
    const [userName, setUserName] = useState("")
    const navigate = useNavigate()


    const handleSubmitVerify = async(e) => {
        e.preventDefault()
        setIsLoading(true)
        try{
            await new Promise((resolve) => setTimeout(resolve, 2000));
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/verify`, {email: userName});

            if(response.data.message === "verified"){
                Cookies.set("verified", true);
                Cookies.set("user_name", userName)
                navigate('/resetPassword')
            }
        }catch(error){
            console.log(error)
        }finally{
            setIsLoading(false)
        }
    }

  return (
    <div className="h-screen font-sans login bg-cover">
        <div className="container mx-auto h-full flex flex-1 justify-center items-center">
            <div className="w-full max-w-lg">
                <div className="">
                    <form onSubmit={handleSubmitVerify} className="m-4 p-10 bg-gray-800 bg-opacity-35 rounded shadow-xl">
                        <p className="text-white text-center text-2xl font-bold tracking-wider" style={{ fontFamily: 'Curetro' }}>Verify your username</p>
                        <div className="">
                            <label className="block text-sm text-white" htmlFor="username">Username</label>
                            <input
                                className="w-full px-5 py-2 text-gray-700 bg-gray-300 rounded focus:outline-none"
                                autoComplete='username'
                                type="text"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                id="userName"
                                name="userName"
                                placeholder="Enter your username"
                            />
                           
                        </div>
                        <div className="mt-4 items-center flex justify-between">
                            <button
                                className="px-4 py-2 text-white font-light tracking-wider bg-orange-500 hover:bg-orange-700 duration-300 rounded"
                                type="submit"
                                style={{ fontFamily: 'Curetro' }}
                            >
                                Verify
                            </button>
                        </div>
                        <div className="text-center">
                            <button
                                onClick={() => navigate('/login')}
                                className="inline-block right-0 align-baseline font-light text-sm text-white  text-500 duration-300 hover:text-orange-500 cursor-pointer"
                                
                            >
                                Go back to Login
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        {isLoading && <Loading />}
    </div>
  )
}

export default Verify