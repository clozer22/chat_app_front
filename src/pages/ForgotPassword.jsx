import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading/Loading';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import Cookies from 'js-cookie';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgotPassword = () => {
  const [showPassword1, setShowPassword1] = useState(false); 
  const [showPassword2, setShowPassword2] = useState(false); 
  const [newPassword, setNewPassword] = useState(""); 
  const [confirmPass, setConfirmPass] = useState(""); 
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility1 = () => {
    setShowPassword1((prevState) => !prevState);
  };

  const togglePasswordVisibility2 = () => {
    setShowPassword2((prevState) => !prevState);
  };
  
  const UserName = Cookies.get("user_name")

  const VerifiedMessage = () => toast.success("Your username is verified")


  useEffect(() => {
    const Verified = Cookies.get("verified");

    if(Verified){
        VerifiedMessage()

        setTimeout(() => {
            Cookies.remove("verified")
        },3000)
    }
  },[UserName])


  const handleForgotPass = async(e) => {
    e.preventDefault()
    setIsLoading(true)
    try{
        await new Promise((resolve) => setTimeout(resolve, 2000));

        const response = await axios.post("http://localhost:5000/resetPassword", {email: UserName, newPass: newPassword, conPass: confirmPass})

        if(response.data.message === "updated password"){
            Cookies.set("passReset", true)
            navigate('/login')
        }

    }catch(error){

    }finally{
        setIsLoading(false)
    }
  }

  return (
    <div className="h-screen font-sans login bg-cover">
      <div className="container mx-auto h-full flex flex-1 justify-center items-center">
        <div className="w-full max-w-lg">
          <div className="">
          <ToastContainer />
            <form onSubmit={handleForgotPass} className="m-4 p-10 bg-gray-800 bg-opacity-35 rounded shadow-xl">
              <p
                className="text-white text-center text-2xl font-bold tracking-wider"
                style={{ fontFamily: 'Curetro' }}
              >
                RESET PASSWORD
              </p>
              <div className="grid grid-cols-6 gap-4 pt-3">
                {/* Username Field */}
                <div className="col-span-6">
                  <label className="block  text-sm text-white" htmlFor="username">
                    Username
                  </label>
                  <input
                    className="w-full px-5 py-2 text-gray-700 bg-gray-300 rounded focus:outline-none"
                    type="text"
                    disabled
                    id="userName"
                    name="userName"
                    value={UserName}
                    placeholder="Enter your username"
                  />
                </div>
                <div className="col-span-6 relative">
                  <label className="block  text-sm text-white" htmlFor="password1">
                    New Password
                  </label>
                  <input
                    className="w-full px-5 py-2 text-gray-700 bg-gray-300 rounded focus:outline-none"
                    type={showPassword1 ? 'text' : 'password'}
                    id="password1"
                    name="password1"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter your password"
                  />
                  <span
                    className="absolute inset-y-0 top-[1.2rem] right-0 flex items-center pr-3 cursor-pointer"
                    onClick={togglePasswordVisibility1}
                  >
                    {showPassword1 ? <AiOutlineEye className="text-2xl" /> : <AiOutlineEyeInvisible className="text-2xl" />}
                  </span>
                </div>
                <div className="col-span-6 relative">
                  <label className="block  text-sm text-white" htmlFor="password2">
                    Confirm Password
                  </label>
                  <input
                    className="w-full px-5 py-2 text-gray-700 bg-gray-300 rounded focus:outline-none"
                    type={showPassword2 ? 'text' : 'password'}
                    id="password2"
                    name="password2"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    placeholder="Enter your password"
                  />
                  <span
                    className="absolute inset-y-0 top-[1.2rem] right-0 flex items-center pr-3 cursor-pointer"
                    onClick={togglePasswordVisibility2}
                  >
                    {showPassword2 ? <AiOutlineEye className="text-2xl" /> : <AiOutlineEyeInvisible className="text-2xl" />}
                  </span>
                </div>
              </div>
              <div className="mt-4 items-center flex justify-between">
                <button
                  className="px-4 py-2 text-white duration-300 font-bold tracking-widest bg-orange-500 hover:bg-orange-600  rounded"
                  type="submit"
                  style={{ fontFamily: 'Curetro' }}
                >
                  Reset Password
                </button>
              </div>
              <div className="text-center">
                <button
                  onClick={() => navigate('/login')}
                  className="inline-block text-white right-0 duration-300 align-baseline font-light text-sm text-500 hover:text-orange-400 cursor-pointer"
                >
                  Go back to login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {isLoading && <Loading />}
    </div>
  );
};

export default ForgotPassword;
