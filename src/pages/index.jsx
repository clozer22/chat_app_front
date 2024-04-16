import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { TiUserAdd } from "react-icons/ti";
import Profile from "../assets/profile.jpg";
import { useNavigate, useParams } from "react-router-dom";
import ScrollToBottom, { useScrollToBottom } from "react-scroll-to-bottom";
import { CiSearch } from "react-icons/ci";
import Cookies from "js-cookie";
import SuccessModal from "../components/Modals/SuccessModal";
import ErrorModal from "../components/Modals/ErrorModal";
import { BsThreeDotsVertical } from "react-icons/bs";
import EmojiPicker from "emoji-picker-react";
import "../Fonts/fonts.css";
import { VscSmiley } from "react-icons/vsc";
import { FaEdit, FaTimes } from "react-icons/fa";
import Loading from "../components/Loading/Loading";
import { useFetchUser } from "../components/CustomHook/CustomHook";
import LeftSideNav from "../components/LeftSideNav/LeftSideNav";
import RightSideNav from "../components/RightSideNav/RightSideNav";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Index = () => {
  const [messages, setMessage] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const { userId, recipientId } = useParams();
  const scrollBottom = useScrollToBottom();
  const navigate = useNavigate();
  const [showAlert, setShowAlert] = useState(false);
  const [userInfo, setUserInfo] = useState([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFormOpen, setFormOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [userName, setUserName] = useState("");
  const [sendUserId, setUserId] = useState("");
  const [showNotExistModal, setShowNotExistModal] = useState(false);
  const [showAlreadyFriend, setShowAlreadyFriend] = useState(false);
  const [showAddedModal, setAddedModal] = useState(false);
  const [isDeleteFormOpen, setDeleteFormOpen] = useState(false);
  const [isRemovedOpen, setRemovedOpen] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [userData, setUserData] = useState([]);
  const [friendReq, setFriendReq] = useState([]);
  const [isShowUnsend, setShowUnsend] = useState(null);
  const user_id = Cookies.get("user_id");
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const welcomeMess = () => toast.success("Welcome to CHAT HUB!")

  const handleEmojiClick = (emojiData, event) => {
    const emoji = emojiData.emoji;

    setNewMessage((prevMessage) => prevMessage + emoji);
  };

  
  const axiosWithCredentials = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    withCredentials: true,
    withXSRFToken: true
  });

  useEffect(() => {
    scrollBottom();
  }, []);

  useEffect(() => {
    if (!Cookies.get("user_id")) {
      navigate("/login");
    }
  });

  const sendMessage = () => {
    console.log("sendMessage function called");
    if (newMessage.trim() === "") {
      return;
    }

    try {
      axios.post(`${process.env.REACT_APP_BACKEND_URL}/messages`, {
        sender: userId,
        recipient: recipientId,
        message: newMessage,
      });
      setMessage([
        ...messages,
        { sender_id: parseInt(userId), message: newMessage },
      ]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const fetchMessages = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_BACKEND_URL}/messages/${recipientId}/${userId}`
      );
      if (response.data.message === "messages fetched") {
        setMessage(response.data.messageData);
      } else {
        setMessage(response.data.messageData);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  }, [recipientId, userId]);

  useEffect(() => {
    if (recipientId && userId) {
      fetchMessages();
    }
  }, [recipientId, userId, fetchMessages, messages]);

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  useEffect(() => {
    const LoggedIn = Cookies.get("LoggedIn");
    if (LoggedIn) {
      welcomeMess()
      setTimeout(() => {
        Cookies.remove("LoggedIn");
      }, 2000);
    }
  }, []);

  useEffect(() => {
    const user_id = Cookies.get("user_id");

    const fetchData = async () => {
      try {
        if(user_id){
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_URL}/getUsers/${user_id}`
        );
        if (response.data.message === "Successfully get all the users") {
          return setUserInfo(response.data.users);
        }

        if(response.data.message === "No users"){
          return setUserInfo(response.data.users)
        }
      }else{
        console.log("User ID is empty or not existing in cookies");
      }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [messages, userInfo]);

  useEffect(() => {
    const user_id = Cookies.get("user_id");
  
    const fetchData = async () => {
      try {
        if (user_id) {
          const response = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/getFriendReq/${user_id}`
          );
          if (response.data.message === "Successfully get all the users") {
            return setFriendReq(response.data.users);
          }
          if (response.data.message === "No users") {
            return setFriendReq(response.data.users);
          }
        } else {
          console.log("User ID is empty or not existing in cookies");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, [messages, userInfo]);
  

  const handleMenuOpen = () => {
    if (!isMenuOpen) {
      setIsMenuOpen(true);
    } else {
      setIsMenuOpen(false);
    }
  };

  const handleFormOpen = () => {
    setFormOpen(!isFormOpen);
  };

  // In handleLogout function
const handleLogout = async () => {
  const userId = Cookies.get("user_id");
  setLoading(true);
  try {
      console.log("User ID from cookie:", userId); // Debugging: Log userId from cookie
      if(userId){
          await new Promise((resolve) => setTimeout(resolve, 2000));
          axiosWithCredentials
              .post(`${process.env.REACT_APP_BACKEND_URL}/logout`, { userId: userId })
              .then((response) => {
                  if (response.data.message === "Failed to logout") {
                      Cookies.remove("user_id");
                      Cookies.remove("userName")
                      navigate("/login");
                  } else {
                      console.log("may mali");
                  }
              })
              .catch((error) => {
                  console.error("Error logging out:", error);
              })
              .finally(() => {
                  setLoading(false);
              });
      }else{
          console.log("the user id is not existing")
      }
  } catch (error) {
      console.error("Error logging out:", error);
  }
};


 

  const handleDeleteForm = () => {
    setDeleteFormOpen(!isDeleteFormOpen);
  };

  const handleRemovedForm = () => {
    setRemovedOpen(!isRemovedOpen);
  };

  const handleDeleteConvo = async (e, messageId) => {
    e.preventDefault();
    setLoading(true);
    setDeleteFormOpen(false);
    setShowUnsend(false);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/deleteMessage/${messageId}`
      );
      if (response.data.message === "Deleted successfully") {
        setDeleted(true);
        setMessage([]);
        return;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (e, messageId) => {
    e.preventDefault();
    setLoading(true);
    setRemovedOpen(false);
    setShowUnsend(false);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/removeMessage/${messageId}`
      );
      if (response.data.message === "Deleted successfully") {
        setDeleted(true);
        setMessage([]);
        return;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if(user_id){
          const response = await axiosWithCredentials.get(
            `${process.env.REACT_APP_BACKEND_URL}/getUserData/${user_id}`
          );
          setUserData(response.data.user_data);
        }else{
          console.log("User ID is empty or not existing in cookies")
        }
      } catch (error) {}
    };
    fetchData();
    return () => {};
  }, [user_id, userData]);

  const handleShowUnsend = (index, messageId) => {
    setShowUnsend((prevIndex) => (prevIndex === index ? null : index));
    setSelectedMessageId(messageId);
  };
  return (
    <div className="flex justify-center items-center w-full mx-0">
        <ToastContainer />
      {showAddedModal ? <SuccessModal label="Added Successfully" /> : null}

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
      <div className=" w-full ">
        <div className=" h-screen w-full">
          <div className="flex w-full mx-0   rounded shadow-lg h-full">
            <LeftSideNav
              handleLogout={handleLogout}
              userData={userData}
              userId={userId}
              recipientId={recipientId}
              messages={messages}
              userInfo={userInfo}
              isMenuOpen={isMenuOpen}
              handleMenuOpen={handleMenuOpen}
              sendUserId={sendUserId}
              setUserId={setUserId}
              setUserName={setUserName}
              userName={userName}
              setUserData={setUserData}
              handleFormOpen={handleFormOpen}
              friendReq={friendReq}
            />
            <div
              className={`${
                userId && recipientId ? "w-2/4" : "w-3/4"
              } border flex flex-col`}
            >
              <div className="py-2 px-3 bg-gray-900 flex flex-row justify-between items-center">
                {userId && recipientId ? (
                  <div className="flex items-center">
                    {userInfo.map((user) => {
                      if (user.user_id === parseInt(recipientId)) {
                        return (
                          <React.Fragment key={user.user_id}>
                            <div>
                              <img
                                className="w-10 h-10 rounded-full"
                                src={`${process.env.REACT_APP_BACKEND_URL}/uploaded_img/${
                                  user.profile_img
                                    ? user.profile_img
                                    : "defaultPic.png"
                                }`}
                                alt=""
                              />
                            </div>
                            <div className="ml-4">
                              <p className="text-white text-lg">
                                {user.first_name} {user.last_name}
                              </p>
                              <p className="text-white text-sm">
                                {user.status}
                              </p>
                            </div>
                          </React.Fragment>
                        );
                      }
                      return null;
                    })}
                  </div>
                ) : (
                  ""
                )}
                {userId && recipientId && (
                  <div className="flex">
                    <button onClick={(() => navigate('/'))} className="text-white tracking-widest px-2 py-1 rounded-full bg-gray-500 hover:bg-gray-700 duration-300" style={{ fontFamily: "Curetro" }}>Close</button>
                  </div>
                )}
              </div>
              <ScrollToBottom className="flex-1 overflow-y-auto bg-gray-900 bg-opacity-40">
                <div className="py-2 px-3">
                  <div className="py-2 px-3">
                    {userId && recipientId ? (
                      messages.length > 0 ? (
                        messages.map((message, index) => (
                          <div
                            key={index}
                            className={`col-start-1 col-end-8 py-2  rounded-lg ${
                              message.sender_id === parseInt(userId)
                                ? "flex items-center justify-start flex-row-reverse"
                                : "flex  items-center"
                            }`}
                          >
                            {message.sender_id === parseInt(userId) ? (
                              <>
                                <div className="relative mr-3 text-sm bg-indigo-100 py-2 px-4 max-w-[15rem] break-words shadow rounded-bl-3xl rounded-tr-3xl rounded-tl-3xl">
                                  <div>{message.message}</div>
                                </div>
                                <div className="relative px-1 py-1 rounded-full  mr-2 bg-opacity-35">
                                  {isShowUnsend === index && (
                                    <div
                                      key={index}
                                      className="bg-gray-500 top-[-2rem] left-[-4rem] absolute px-2 py-2 rounded-md"
                                    >
                                      <button
                                        onClick={handleDeleteForm}
                                        name="delete"
                                        className="whitespace-nowrap z-50 text-white  duration-300 rounded-md"
                                      >
                                        Unsend
                                      </button>
                                    </div>
                                  )}
                                  <BsThreeDotsVertical
                                    onClick={() =>
                                      handleShowUnsend(
                                        index,
                                        message.message_id
                                      )
                                    }
                                    className="text-white cursor-pointer"
                                  />
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="ml-2 py-2 px-2 bg-gray-400 rounded-br-3xl rounded-tr-3xl max-w-[15rem] break-words rounded-tl-xl text-white">
                                  <div>{message.message}</div>
                                </div>
                                <div className="relative  px-1 py-1 rounded-full  mr-2 bg-opacity-35">
                                  {isShowUnsend === index && (
                                    <div
                                      key={index}
                                      className="bg-gray-500  top-[-2.5rem] right-[-7rem] absolute px-2 py-2 rounded-md"
                                    >
                                      <button
                                        onClick={handleRemovedForm}
                                        name="remove"
                                        className="whitespace-nowrap  text-white  duration-300 rounded-md"
                                      >
                                        Remove for you
                                      </button>
                                    </div>
                                  )}
                                  <BsThreeDotsVertical
                                    onClick={() =>
                                      handleShowUnsend(
                                        index,
                                        message.message_id
                                      )
                                    }
                                    className="text-white cursor-pointer"
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        ))
                      ) : (
                        <>
                          {userInfo.map((user) => {
                            if(user.user_id === parseInt(recipientId)){
                              return(
                                <div key={user.user_id} className="flex justify-center w-full items-center h-full">
                                <h1
                                className="text-[2rem] text-white absolute top-[15rem]"
                                style={{ fontFamily: "Curetro" }}
                              >
                                Say hello to {user.user_name}
                              </h1>
                                </div>
                              )
                            }
                            return null;
                          }
                          )}
                          </>
                      )
                    ) : (
                      <div className="flex justify-center items-center h-full">
                        <h1
                          className="text-[2rem] text-white absolute top-[15rem]"
                          style={{ fontFamily: "Curetro" }}
                        >
                          NO CHATS SELECTED
                        </h1>
                      </div>
                    )}
                  </div>
                </div>
              </ScrollToBottom>

              <div className="bg-gray-900 px-4 py-4 flex items-center">
                <div>
                  <button
                    className="text-2xl text-white"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  >
                    <VscSmiley />
                  </button>
                  {showEmojiPicker && (
                    <div className="absolute top-[7rem]">
                      {" "}
                      <EmojiPicker onEmojiClick={handleEmojiClick} />
                    </div>
                  )}
                </div>
                <div className="flex-1 ml-4">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className={`w-full bg-gray-100 px-3 py-2 rounded-full`}
                    placeholder="Type a message"
                    onKeyDown={handleKeyDown}
                  />
                </div>
                <div className="ml-4">
                  <button
                    onClick={sendMessage}
                    className="bg-orange-500 tracking-wider px-4 py-2 rounded-full text-white"
                    style={{ fontFamily: "Curetro" }}
                  >
                    Send
                  </button>
                </div>
              </div>
            </div>
            {userId && recipientId ? (
              <RightSideNav
                handleRemovedForm={handleRemovedForm}
                handleRemove={handleRemove}
                selectedMessageId={selectedMessageId}
                isRemovedOpen={isRemovedOpen}
                handleDeleteForm={handleDeleteForm}
                handleDeleteConvo={handleDeleteConvo}
                isDeleteFormOpen={isDeleteFormOpen}
                recipientId={recipientId}
                userId={userId}
                userInfo={userInfo}
              />
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
