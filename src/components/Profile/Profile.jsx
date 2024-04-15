import axios from "axios";
import Cookies from "js-cookie";
import React, { useState } from "react";
import { FaEdit, FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";
import Loading from "../Loading/Loading";
import { useFormik } from "formik";
import * as Yup from "yup";
import SuccessModal from '../Modals/SuccessModal'
import ErrorModal from '../Modals/ErrorModal'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = ({ ...props }) => {
  const [backgroundImage, setBackgroundImage] = useState("");
  const [profileImg, setProfileImg] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showModalProfile, setModalProfile] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [showModalPassword, setModalPassword] = useState(false);
  const [showPasswordNotMatch, setPasswordNotmatch] = useState(false);
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const incorrectCurrentPass = () => toast.error("Incorrect current password")


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackgroundImage(file);
      setShowModal(!showModal);
    }
  };

  const handleFileChange2 = (e) => {
    const file = e.target.files[0];
      setProfileImg(file);
      setModalProfile(!showModalProfile);
  };

  const handleProfileSubmit = () => {
        setProfileImg('')
        setModalProfile(!showModalProfile)
  }

  const handleOpenAndCloseModal = () => {
    setShowModal(!showModal)
    setProfileImg('')
    setModalProfile(!showModalProfile)
  }
  
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const togglePasswordVisibility = (input) => {
    setShowPassword((prevState) => ({
      ...prevState,
      [input]: !prevState[input],
    }));
  };

  const handleButtonClick = (event, input) => {
    event.preventDefault();
    togglePasswordVisibility(input);
  };

  const handleCloseProfileModal = () => {
    setProfileImg('')
    setModalProfile(false)
  }

  const passwordChanged = () => toast.success("Successfully changed password")
  const passwordDoesNotmatch = () => toast.error("New and confirm password does not match.")

  const handleChangePass = async (event) => {
    setPasswordNotmatch(false)
    event.preventDefault();
    setLoading(true)
    try{
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/changePassword`, {
        user_id: Cookies.get("user_id"),
        currentPass: currentPass,
        newPass: newPass,
        confirmPass: confirmPass
      });

      if(response.data.message === "password changed"){
        console.log("PASSWORD CHANGED!!")
        passwordChanged()
        setCurrentPass('')
        setConfirmPass('')
        setNewPass('')
        return;
      }

      if(response.data.message === "The current password is incorrect."){
        return incorrectCurrentPass()
      }

      if(response.data.message === "New password and confirm password does not matched."){
        return passwordDoesNotmatch();
        
      }
    }catch(error){
      console.log(error)
    }finally{
      setLoading(false)
    }
  }

  const handleChangeCover = async () => {
    const user_id = Cookies.get("user_id");
    setShowModal(false);
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const formData = new FormData();
      formData.append("cover_img", backgroundImage);
      formData.append("user_id", user_id);
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/changeCover`, formData);
      if (response.data.message === "cover changed") {
        console.log("cover changed");
        console.log(backgroundImage);
        console.log(props.userId);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeProfile = async (event) => {
    event.preventDefault();
    setModalProfile(!showModalProfile)
    const user_id = Cookies.get("user_id");
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000))
      const formData = new FormData();
      formData.append("profile_img", profileImg);
      formData.append("user_id", user_id);
  
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/changeProfile`, formData);
      if (response.data.message === "profile changed") {
        console.log("profile changed");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  


  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      user_name: "",
      bio: "",
      user_id: Cookies.get("user_id"),
    },
    validationSchema: Yup.object({
      bio: Yup.string()
        .max(15, "Bio must be at most 15 characters"),
    }),
    onSubmit: async (values, {resetForm}) => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 3000))
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/updateInfo`, values);
        resetForm();
        if(response.data.message === "Updated"){
        props.setUserData([])
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-40 bg-black bg-opacity-55">
      {isLoading && <Loading />}
      {showModalPassword && <SuccessModal label="Your password is now updated" />}
      {showPasswordNotMatch && <ErrorModal setShowAlert1={setPasswordNotmatch} label="Please double-check your new password and confirm password." />}
      <div className="absolute inset-0 flex justify-center items-center">
        <div className="absolute bg-gray-900 w-9/12 h-4/5  flex justify-center  rounded-md">
          <div className="absolute top-2 right-5 z-50">
            <FaTimes
              onClick={props.handleSettings}
              className="text-2xl text-white z-50 cursor-pointer"
            />
          </div>
          {props.userData.map((user, index) => {
            return (
              <div key={index} className="border w-full  overflow-y-auto">
                <div
                  className="relative w-full border-b h-2/4 bg-center bg-cover bg-no-repeat object-cover object-center"
                  style={{
                    backgroundImage: `url(${process.env.REACT_APP_BACKEND_URL}/uploaded_img/${user.cover_img})`,
                  }}
                >
                  <div className="absolute inline-block right-0 bottom-0 p-2">
                    <label
                      htmlFor="fileInput"
                      className="cursor-pointer bg-white opacity-40 hover:opacity-100 duration-300 px-2 flex items-center text-black font-bold   rounded"
                    >
                      <FaEdit className="text-2xl" />
                      Upload file
                    </label>
                    <input
                      id="fileInput"
                      onChange={handleFileChange}
                      type="file"
                      className="hidden"
                    />
                  </div>
                </div>
                {/* MODAL FOR COVER PHOTO */}

                {showModal && (
                  <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50 bg-black bg-opacity-55">
                    <div className="absolute inset-0 flex justify-center items-center">
                      <div className="absolute bg-gray-900 flex max-w-[40rem] justify-center items-center px-5 rounded-md">
                        <div className="absolute top-2 right-2"></div>
                        <form
                          action=""
                          method="post"
                          onSubmit={handleChangeCover}
                        >
                          <div className="w-full m-5">
                            <h2
                              className="text-white tracking-widest"
                              style={{ fontFamily: "Curetro" }}
                            >
                              Hit "Save" to apply changes.
                            </h2>
                          </div>
                          <div className="w-full flex justify-end gap-2">
                            <button
                              onClick={handleOpenAndCloseModal}
                              className=" flex px-4 py-2 rounded-md bg-gray-500 text-white my-4 tracking-widest"
                              style={{ fontFamily: "Curetro" }}
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className=" flex px-4 py-2 rounded-md bg-orange-600 text-white my-4 tracking-widest"
                              style={{ fontFamily: "Curetro" }}
                            >
                              Save
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                )}

                {showModalProfile && (
                  <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50 bg-black bg-opacity-55">
                    <div className="absolute inset-0 flex justify-center items-center">
                      <div className="absolute bg-gray-900 flex max-w-[40rem] justify-center items-center px-5 rounded-md">
                        <div className="absolute top-2 right-2"></div>
                        <form
                          action=""
                          onSubmit={handleChangeProfile}
                        >
                          <div className="w-full m-5">
                            <h2
                              className="text-white tracking-widest"
                              style={{ fontFamily: "Curetro" }}
                            >
                              Hit "Save" to change profile picture.
                            </h2>
                          </div>
                          <div className="w-full flex justify-end gap-2">
                            <button
                              onClick={handleCloseProfileModal}
                              className=" flex px-4 py-2 rounded-md bg-gray-500 text-white my-4 tracking-widest"
                              style={{ fontFamily: "Curetro" }}
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className=" flex px-4 py-2 rounded-md bg-orange-600 text-white my-4 tracking-widest"
                              style={{ fontFamily: "Curetro" }}
                            >
                              Save
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                )}
                {/* END FOR COVER PHOTO */}
                <div className="relative">
                  <div className="absolute left-2 top-[-4rem]">
                    <div className="relative">
                    <img
                      className={`w-[8rem] h-[8rem] rounded-full border-4 `}
                      src={`${process.env.REACT_APP_BACKEND_URL}/uploaded_img/${user.profile_img}`}
                      alt=""
                    />
                    <div className="absolute bottom-0 right-0">
                    <label
                      htmlFor="profile"
                      className="cursor-pointer  flex items-center text-black font-bold   rounded"
                    >
                      <FaEdit className="text-lg text-white" />
                    </label>
                    <input
                      id="profile"
                      onChange={handleFileChange2}
                      name="profile_img"
                      type="file"
                      className="hidden"
                    />
                    </div>
                    </div>
                  </div>
                  <div className="absolute left-[10rem]">
                    <h1
                      className="text-2xl text-white tracking-wider"
                      style={{ fontFamily: "Curetro" }}
                    >
                      {user.first_name} {user.last_name}{" "}
                      <span className="text-sm tracking-widest">
                        ({user.bio})
                      </span>
                    </h1>
                    <p className="text-white">
                      {props.userInfo.length} Friends
                    </p>
                  </div>
                </div>
                <div className="flex justify-center items-center h-full w-full p-5">
                  <div className="relative border w-full border-gray-500  rounded-md mt-[3rem]">
                    <div className="absolute top-[-2rem]">
                      <h1 className="text-white">Information</h1>
                    </div>
                    <form method="post" onSubmit={formik.handleSubmit}>
                      <div className="w-full grid grid-cols-2 p-5 gap-2">
                        <div className="col-span-1">
                          <label htmlFor="first_name" className="text-gray-400">
                            First name:
                          </label>
                          <input
                            type="text"
                            id="first_name"
                            name="first_name"
                            placeholder={user.first_name}
                            value={formik.values.first_name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="w-full px-2 py-2 bg-transparent border border-gray-400 focus:outline-none text-white rounded-md"
                          />
                        </div>
                        <div className="col-span-1">
                          <label htmlFor="first_name" className="text-gray-400">
                            Last name:
                          </label>
                          <input
                            type="text"
                            id="last_name"
                            name="last_name"
                            placeholder={user.last_name}
                            value={formik.values.last_name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="w-full px-2 py-2 bg-transparent border border-gray-400 focus:outline-none text-white rounded-md"
                          />
                        </div>
                        <div className="col-span-1">
                          <label htmlFor="first_name" className="text-gray-400">
                            User name:
                          </label>
                          <input
                            type="text"
                            id="user_name"
                            name="user_name"
                            placeholder={user.user_name}
                            value={formik.values.user_name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="w-full px-2 py-2 bg-transparent border border-gray-400 focus:outline-none text-white rounded-md"
                          />
                        </div>
                        <div className="col-span-1">
                          <label htmlFor="first_name" className="text-gray-400">
                            Bio:
                          </label>
                          <input
                            type="text"
                            id="bio"
                            name="bio"
                            placeholder={user.bio ? user.bio : 'Say something about you...'}
                            value={formik.values.bio}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="w-full px-2 py-2 bg-transparent border border-gray-400 focus:outline-none text-white rounded-md"
                          />
                        </div>
                        <div className="col-span-1">
                        {formik.values.first_name.length > 0 || formik.values.user_name.length > 0 || formik.values.last_name.length > 0 || formik.values.bio.length > 0 ?(
                        <button
                        type="submit"
                        className="px-3 tracking-widest hover:bg-orange-700 duration-300 rounded-md py-2 text-white text-md bg-orange-500"
                        style={{ fontFamily: "Curetro" }}
                        >
                            Save
                        </button>
                        ) : (
                            <button
                            type="submit"
                            disabled
                            className="px-3 tracking-widest  duration-300 rounded-md py-2 text-white text-md bg-gray-500"
                            style={{ fontFamily: "Curetro" }}
                          >
                              Save
                          </button>
                        )}
                     
                      </div>
                      </div>
                     
                    </form>
                  </div>
                </div>
                <div className="flex justify-center items-center h-full w-full p-5">
                  <div className="relative border w-full border-gray-500 rounded-md ">
                    <div className="absolute top-[-2rem]">
                      <h1 className="text-white">Change password</h1>
                    </div>
                    <form onSubmit={handleChangePass}>
                      <div className="w-full grid grid-cols-1 p-5 gap-2">
                        <div className="col-span-1">
                          <label htmlFor="" className="text-gray-400">
                            Current password
                          </label>
                          <div className="relative">
                            <input
                              autoComplete="current-password"
                              value={currentPass}
                             onChange={((e) => setCurrentPass(e.target.value))}
                              type={showPassword.current ? "text" : "password"}
                              className="w-full px-2 py-2 bg-transparent border border-gray-400 focus:outline-none text-white rounded-md"
                            />
                            <button
                              className="absolute right-0 bottom-0 mr-2 mb-2"
                              onClick={(e) => handleButtonClick(e, "current")}
                            >
                              {showPassword.current ? (
                                <FaEyeSlash className="text-white text-2xl" />
                              ) : (
                                <FaEye className="text-white text-2xl" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div className="col-span-1">
                          <label htmlFor="" className="text-gray-400">
                            New password
                          </label>
                          <div className="relative">
                            <input
                            autoComplete="new-password"
                              value={newPass}
                             onChange={((e) => setNewPass(e.target.value))}
                              type={showPassword.new ? "text" : "password"}
                              className="w-full px-2 py-2 bg-transparent border border-gray-400 focus:outline-none text-white rounded-md"
                            />
                            <button
                              className="absolute right-0 bottom-0 mr-2 mb-2"
                              onClick={(e) => handleButtonClick(e, "new")}
                            >
                              {showPassword.new ? (
                                <FaEyeSlash className="text-white text-2xl" />
                              ) : (
                                <FaEye className="text-white text-2xl" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div className="col-span-1">
                          <label htmlFor="" className="text-gray-400">
                            Confirm password
                          </label>
                          <div className="relative">
                            <input
                              autoComplete="confirm-password"
                              value={confirmPass}
                              onChange={((e) => setConfirmPass(e.target.value))}
                              type={showPassword.confirm ? "text" : "password"}
                              className="w-full px-2 py-2 bg-transparent border border-gray-400 focus:outline-none text-white rounded-md"
                            />
                            <button
                              className="absolute right-0 bottom-0 mr-2 mb-2"
                              onClick={(e) => handleButtonClick(e, "confirm")}
                            >
                              {showPassword.confirm ? (
                                <FaEyeSlash className="text-white text-2xl" />
                              ) : (
                                <FaEye className="text-white text-2xl" />
                              )}
                            </button>
                          </div>
                        </div>
                        <div className="col-span-1">
                          <button
                          type="submit"
                            className="px-3 tracking-widest hover:bg-orange-700 duration-300 rounded-md  py-2 text-white text-md bg-orange-500"
                            style={{ fontFamily: "Curetro" }}
                          >
                            Save
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Profile;
