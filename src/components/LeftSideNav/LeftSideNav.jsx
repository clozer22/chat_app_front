import Cookies from "js-cookie";
import React, { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs";
import { CiSearch } from "react-icons/ci";
import { FaEdit, FaTimes, FaBell, FaCheck } from "react-icons/fa";
import { TiUserAdd } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Loading from "../Loading/Loading";
import { IoIosSettings } from "react-icons/io";
import SuccessModal from "../Modals/SuccessModal";
import ErrorModal from "../Modals/ErrorModal";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Profile from "../Profile/Profile";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const LeftSideNav = ({ ...props }) => {
  const navigate = useNavigate();
  const [isFormOpen, setFormOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [showAddedModal, setAddedModal] = useState(false);
  const [showNotExistModal, setShowNotExistModal] = useState(false);
  const [showAlreadyFriend, setShowAlreadyFriend] = useState(false);
  const [showSettingButton, setShowSettingButton] = useState(false);
  const [showSettingForm, setShowSettingForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const newlyAdded = () => toast.success("Friend request sent");
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [backgroundImage, setBackgroundImage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const alreadyFriend = () => toast.error("This user is already your friend");
  const notExist = () => toast.error("This user doesn't exist!");

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBackgroundImage(file.name);
      setShowModal(!showModal);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredUsers = props.userInfo.filter(
    (user) =>
      user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.last_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleChangeCover = async () => {
    const user_id = Cookies.get("user_id");
    setShowModal(false);
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/changeCover`,
        {
          cover_img: backgroundImage,
          user_id: user_id,
        }
      );
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

  const handleShowModal = () => {
    setShowModal(!showModal);
  };

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

  const handleFormOpen = () => {
    setFormOpen(!isFormOpen);
  };

  const handleSendRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormOpen(false);
    const user_id = Cookies.get("user_id");
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/sendFriendRequest`,
        {
          userId: user_id,
          userName: props.userName,
          sentUserId: props.sendUserId,
        }
      );

      if (response.data.message === "Successfully sent") {
        console.log(response.data.message);
        newlyAdded();
        return;
      }

      if (response.data.message === "That user is not exist.") {
        notExist();
        return;
      }
      if (response.data.message === "That user is already your friend.") {
        alreadyFriend();
        return;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (userId) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/acceptFriend`,
        {
          user_id: userId,
        }
      );

      if (response.data.message === "accepted") {
        return console.log("accepted");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectRequest = async (userId) => {
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/rejectRequest`,
        {
          user_id: userId,
        }
      );

      if (response.data.message === "rejected") {
        return console.log("accepted");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSettings = () => {
    setShowSettingButton(!showSettingButton);
  };

  const handleOpenSettings = () => {
    setShowSettingButton(false);
    setShowSettingForm(!showSettingForm);
  };

  // Function to handle search input change
  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
    console.log("Search input:", e.target.value);
  };

  return (
    <div className="w-1/4 border flex flex-col ">
      {isLoading && <Loading />}
      {showNotExistModal && (
        <ErrorModal
          setShowAlert1={setShowNotExistModal}
          label="User doesn't exist"
        />
      )}
      {showAlreadyFriend && (
        <ErrorModal
          setShowAlert1={setShowAlreadyFriend}
          label="That user is already your friend."
        />
      )}
      <div className="py-2 px-3 bg-gray-900  flex flex-row justify-between items-center">
        <div className="py-2">
          <h1
            className="text-2xl font-bold text-white tracking-widest"
            style={{ fontFamily: "Curetro" }}
          >
            Chat{" "}
            <span className="px-2 rounded-md py-1 bg-orange-500 text-black">
              Hub
            </span>{" "}
          </h1>
        </div>
        <div className="flex items-center">
          <div className="relative">
            <TiUserAdd
              onClick={handleFormOpen}
              className="text-white text-2xl cursor-pointer"
            />
            {isFormOpen && (
              <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50 bg-black bg-opacity-55">
                <div className="absolute inset-0 flex justify-center items-center">
                  <div className="absolute bg-gray-900 flex  justify-center items-center px-5 rounded-md">
                    <div className="absolute top-2 right-2">
                      <FaTimes
                        onClick={handleFormOpen}
                        className="text-2xl text-white cursor-pointer"
                      />
                    </div>
                    <form action="" method="post" onSubmit={handleSendRequest}>
                      <h1
                        className="text-white text-center text-2xl py-5"
                        style={{ fontFamily: "Curetro" }}
                      >
                        SEND A FRIEND REQUEST
                      </h1>
                      <input
                        type="text"
                        id="username"
                        value={props.userName}
                        onChange={(e) => props.setUserName(e.target.value)}
                        placeholder="Username"
                        className="mr-2 focus:outline-none py-2 border-none rounded-md bg-gray-700 px-2 text-white placeholder:text-gray-300"
                      />
                      <input
                        type="number"
                        id="userId"
                        value={props.sendUserId}
                        onChange={(e) => props.setUserId(e.target.value)}
                        placeholder="User ID"
                        min={0}
                        className="focus:outline-none appearance-none  py-2 border-none rounded-md bg-gray-700 px-2 text-white placeholder:text-gray-300"
                      />
                      <div className="w-full mx-auto">
                        <button
                          type="submit"
                          className="mx-auto flex px-4 py-2 rounded-md bg-orange-500 text-white my-4 tracking-widest"
                          style={{ fontFamily: "Curetro" }}
                        >
                          Send
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}
            {showSettingForm && (
              <Profile
                userName={props.userName}
                setUserData={props.setUserData}
                handleShowModal={handleShowModal}
                handleSettings={handleOpenSettings}
                userData={props.userData}
                userInfo={props.userInfo}
              />
            )}
          </div>
          <div className="ml-4 relative">
            <FaBell
              onClick={props.handleMenuOpen}
              className="text-white text-2xl cursor-pointer"
            />
            <div className="absolute top-[-1rem] right-[-.3rem]">
              <h2 className="text-red-600 font-bold">
                {props.friendReq.length === 0 ? "" : props.friendReq.length}
              </h2>
            </div>
            {props.isMenuOpen && (
              <div className="absolute bg-gray-900 px-4 py-3 w-[20rem] h-[15rem] overflow-y-auto right-0 rounded-md">
                <h2
                  className="text-center text-white tracking-widest"
                  style={{ fontFamily: "Curetro" }}
                >
                  Friend Request
                </h2>
                {props.friendReq.map((user, index) => (
                  <div key={user.friendship_id}>
                    <div className="flex items-center mt-1 justify-between border border-gray-600 px-2 py-2 rounded-md">
                      <div>
                        <img src="../../assets/defaultPic.png" alt="" />
                        <h1 className="text-white">
                          {user.first_name} {user.last_name}
                        </h1>
                      </div>
                      <div className="flex gap-2 items-center">
                        <button
                          onClick={() =>
                            handleAcceptRequest(user.friendship_id)
                          }
                        >
                          <FaCheck className="text-green-500 text-lg" />
                        </button>
                        <button
                          onClick={() =>
                            handleRejectRequest(user.friendship_id)
                          }
                        >
                          <FaTimes className="text-red-500 text-lg" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="py-2 px-2 bg-gray-900 bg-opacity-45 flex items-center">
        <CiSearch className="text-2xl text-white" />
        <input
          type="text"
          className="w-full px-2 py-2 text-sm bg-transparent text-white"
          placeholder="Search or start new chat"
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
      </div>

      <div className="bg-gray-900 bg-opacity-40 overflow-y-auto flex-1 ">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user, index) => {
            const userMessages = props.messages.filter(
              (message) =>
                (message.sender_id === parseInt(props.userId) &&
                  message.receiver_id === parseInt(user.user_id)) ||
                (message.sender_id === parseInt(user.user_id) &&
                  message.receiver_id === parseInt(props.userId))
            );

            const lastMessage =
              userMessages.length > 0
                ? userMessages[userMessages.length - 1]
                : null;

            const conversationClosed =
              user.user_id !== parseInt(props.recipientId);

            const lastMessageTime = lastMessage
              ? new Date(lastMessage.time).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "";

            const lastMessageSenderId = lastMessage
              ? lastMessage.sender_id
              : null;
            const isLastMessageSentByCurrentUser =
              lastMessageSenderId === parseInt(props.userId);

            return (
              <button
                key={index}
                onClick={() =>
                  navigate(
                    `/messages/${Cookies.get("user_id")}/${user.user_id}`
                  )
                }
                className="w-full"
              >
                <div
                  key={index}
                  className={`px-3 flex justify-start items-center mb-1 ${
                    !conversationClosed ? "bg-gray-500" : "bg-gray-700"
                  } bg-opacity-35 cursor-pointer`}
                >
                  <div>
                    <img
                      className={`h-12 w-12 rounded-full border-4 ${
                        user.status === "Active Now"
                          ? "border-green-500"
                          : "border-gray-500"
                      }`}
                      src={require(`../../assets/${
                        user.profile_img ? user.profile_img : "defaultPic.png"
                      }`)}
                      alt=""
                    />
                  </div>
                  <div className="ml-4 flex-1 py-4">
                    <div className="flex items-bottom justify-between">
                      <p
                        className="text-white tracking-widest"
                        style={{ fontFamily: "Curetro" }}
                      >
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-xs text-white text-ellipsis">
                        {lastMessageTime}
                      </p>
                    </div>
                    <div className="flex">
                      <p className="text-white mt-1 text-end text-sm">
                        {lastMessage && isLastMessageSentByCurrentUser
                          ? "You: "
                          : ""}
                        {lastMessage && (
                          <span className="px-1">
                            {lastMessage.message.length > 8
                              ? `${lastMessage.message.substring(0, 8)}...`
                              : lastMessage.message}
                          </span>
                        )}
                      </p>
                    </div>

                    {conversationClosed && (
                      <div className="flex">
                        <p className="text-white text-end  mt-1 text-sm">
                          Click to open conversation
                        </p>
                      </div>
                    )}
                    {!conversationClosed && !lastMessage && (
                      <div className="flex">
                        <p className="text-white text-end mt-1 text-sm">
                          Send a message
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        ) : (
          <h1
            className="text-white text-2xl text-center pt-2 tracking-widest"
            style={{ fontFamily: "Curetro" }}
          >
            Connect with Others
          </h1>
        )}
      </div>
      <div className="w-full bg-gray-900 h-[4.5rem]">
        {props.userData &&
          props.userData.map((user, index) => (
            <div key={user.user_id} className=" grid grid-cols-5">
              <div className="flex justify-start items-center gap-2 p-2 col-span-3">
                <img
                  src={`${process.env.REACT_APP_BACKEND_URL}/${
                    user.profile_img ? user.profile_img : "defaultPic.png"
                  }`}
                  className={`h-12 w-12 border-2 rounded-full ${
                    user.status === "Active Now"
                      ? "border-green-500"
                      : "border-gray-500"
                  }`}
                  alt=""
                />
                <div>
                  <h1
                    className="text-white text-md tracking-widest whitespace-nowrap"
                    style={{ fontFamily: "Curetro" }}
                  >
                    {user.first_name} {user.last_name}
                  </h1>
                  <p className="text-white tracking-wider font-bold">
                    ID: {user.user_id}
                  </p>
                </div>
              </div>
              <div className="flex justify-center items-center col-span-2 gap-1">
                <button
                  onClick={props.handleLogout}
                  className="px-2 py-1 border-none bg-gray-600 hover:bg-gray-700 duration-300 text-white rounded-md"
                >
                  Log out
                </button>
                <div className="relative">
                  {showSettingButton && (
                    <div className="absolute bg-gray-600 top-[-3rem] rounded-md left-[-4rem]">
                      <button
                        onClick={handleOpenSettings}
                        className="whitespace-nowrap px-2 py-2 text-white"
                      >
                        User Profile
                      </button>
                    </div>
                  )}
                  <IoIosSettings
                    onClick={handleSettings}
                    className="text-white text-2xl cursor-pointer"
                  />
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default LeftSideNav;
