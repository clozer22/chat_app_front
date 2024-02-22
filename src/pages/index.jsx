import React, { useEffect, useState } from "react";
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
  const [userData, setUserData] = useState([]);
  const user_id = Cookies.get("user_id");


  const handleEmojiClick = (emojiData, event) => {
    const emoji = emojiData.emoji;

    setNewMessage((prevMessage) => prevMessage + emoji);
  };

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
      axios.post("http://localhost:5000/messages", {
        sender: userId,
        recipient: recipientId,
        message: newMessage,
      });
      setMessage([
        ...messages,
        { sender_id: parseInt(userId), message: newMessage },
      ]);
      setNewMessage("");
      console.log("Message sent and input cleared:", newMessage);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  useEffect(() => {
    if (recipientId && userId) {
      fetchMessages();
    }
  }, [recipientId, userId, messages]);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/messages/${recipientId}/${userId}`
      );
      setMessage(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      sendMessage();
    }
  };

  useEffect(() => {
    const LoggedIn = Cookies.get("LoggedIn");
    if (LoggedIn) {
      setShowAlert(true);
      setTimeout(() => {
        Cookies.remove("LoggedIn");
        setShowAlert(false);
      }, 5000);
    }
  }, []);

  useEffect(() => {
    const user_id = Cookies.get("user_id");

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/getUsers/${user_id}`
        );
        if (response.data.message === "Successfully get all the users") {
          setUserInfo(response.data.users);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [messages]);

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

  const handleLogout = async () => {
    const userId = Cookies.get("user_id");
    setLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      axios
        .post("http://localhost:5000/logout", { userId })
        .then((response) => {
          if (response.data.message === "Logged out successfully") {
            Cookies.remove("user_id");
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
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleSendRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormOpen(false);
    const user_id = Cookies.get("user_id");
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const response = await axios.post(
        "http://localhost:5000/sendFriendRequest",
        { userId: user_id, userName: userName, sentUserId: sendUserId }
      );

      if (response.data.message === "Successfully sent") {
        console.log(response.data.message);
        setAddedModal(true);
        window.location.reload();
        return;
      }

      if (response.data.message === "That user is not exist.") {
        setShowNotExistModal(true);
        return;
      }
      if (response.data.message === "That user is already your friend.") {
        setShowAlreadyFriend(true);
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
        const response = await axios.get(`http://localhost:5000/getUserData/${user_id}`);
          setUserData(response.data.user_data);
          console.log(response.data.user_data)
     
      } catch (error) {
      }
    };
    fetchData();
    return () => {
    };
  }, [user_id]); 

  return (
    <div className="flex justify-center items-center w-full mx-0">
      {showAlert ? <SuccessModal label="Welcome to CHAT HUB" /> : null}
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
            <div className="w-1/4 border flex flex-col ">
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
                            <form
                              action=""
                              method="post"
                              onSubmit={handleSendRequest}
                            >
                              <h1
                                className="text-white text-center text-2xl py-5"
                                style={{ fontFamily: "Curetro" }}
                              >
                                SEND A FRIEND REQUEST
                              </h1>
                              <input
                                type="text"
                                id="username"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                placeholder="Username"
                                className="mr-2 focus:outline-none py-2 border-none rounded-md bg-gray-700 px-2 text-white placeholder:text-gray-300"
                              />
                              <input
                                type="number"
                                id="userId"
                                value={sendUserId}
                                onChange={(e) => setUserId(e.target.value)}
                                placeholder="User ID"
                                min={0}
                                className="focus:outline-none py-2 border-none rounded-md bg-gray-700 px-2 text-white placeholder:text-gray-300"
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
                  </div>
                  <div className="ml-4 relative">
                    <BsThreeDotsVertical
                      onClick={handleMenuOpen}
                      className="text-white text-2xl cursor-pointer"
                    />
                    {isMenuOpen && (
                      <div className="absolute bg-white px-2 py-2 right-0 rounded-md">
                        <button
                          type="submit"
                          onClick={handleLogout}
                          className="whitespace-nowrap text-red-500 font-bold"
                        >
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="py-2 px-2 bg-gray-900 bg-opacity-45 flex items-center">
                <CiSearch className="text-2xl text-white" />
                <input
                  type="text"
                  className="w-full px-2 py-2 text-sm bg-transparent"
                  placeholder="Search or start new chat"
                />
              </div>

              <div className="bg-gray-900 bg-opacity-40 overflow-y-auto flex-1">
                {userInfo.length === 0 && (
                  <h1
                    className="text-white text-2xl text-center pt-2 tracking-widest"
                    style={{ fontFamily: "Curetro" }}
                  >
                    Connect with Others
                  </h1>
                )}
                {userInfo.length > 0
                  ? userInfo.map((user, index) => {
                      const userMessages = messages.filter(
                        (message) =>
                          (message.sender_id === parseInt(userId) &&
                            message.receiver_id === parseInt(user.user_id)) ||
                          (message.sender_id === parseInt(user.user_id) &&
                            message.receiver_id === parseInt(userId))
                      );

                      const lastMessage =
                        userMessages.length > 0
                          ? userMessages[userMessages.length - 1]
                          : null;

                      const conversationClosed =
                        user.user_id !== parseInt(recipientId);

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
                        lastMessageSenderId === parseInt(userId);

                      return (
                        <a
                          key={index}
                          href={`/messages/${Cookies.get("user_id")}/${
                            user.user_id
                          }`}
                        >
                          <div
                            className={`px-3 flex items-center mb-1 ${
                              !conversationClosed
                                ? "bg-gray-500"
                                : "bg-gray-700"
                            } bg-opacity-35 cursor-pointer`}
                          >
                            <div>
                              <img
                                className={`h-12 w-12 rounded-full border-4 ${
                                  user.status === "Active Now"
                                    ? "border-green-500"
                                    : "border-gray-500"
                                }`}
                                src={require(`../assets/${
                                  user.profile_img
                                    ? user.profile_img
                                    : "defaultPic.png"
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
                                <p className="text-xs text-white">
                                  {lastMessageTime}
                                </p>
                              </div>
                              <p className="text-white mt-1 text-sm">
                                {lastMessage && isLastMessageSentByCurrentUser
                                  ? "You: "
                                  : ""}
                                {lastMessage && (
                                  <span className="px-1">
                                    {lastMessage.message}
                                  </span>
                                )}
                              </p>
                              {conversationClosed && (
                                <p className="text-white mt-1 text-sm">
                                  Click to open conversation
                                </p>
                              )}
                              {!conversationClosed && !lastMessage && (
                                <p className="text-white mt-1 text-sm">
                                  Send a message
                                </p>
                              )}
                            </div>
                          </div>
                        </a>
                      );
                    })
                  : ""}
              </div>
              <div className="w-full bg-gray-900 h-[4.5rem] grid grid-cols-5">
                {userData.map((user, index) => (
                  <>
                  <div className="flex justify-start items-center gap-2 p-2 col-span-3">
                    <img src={require(`../assets/${user.profile_img ? user.profile_img : 'defaultPic.png'}`)} className={`h-12 w-12 border-2 rounded-full ${user.status === 'Active Now' ? 'border-green-500' : 'border-gray-500'}`} alt="" />
                  <div>
                  <h1 className="text-white text-md tracking-widest whitespace-nowrap"  style={{ fontFamily: "Curetro" }}>{user.first_name} {user.last_name}</h1>
                  <p className="text-white tracking-wider font-bold" >ID: {user.user_id}</p>
                  </div>
                </div>
                <div className="flex justify-center items-center col-span-2">
                  <button onClick={handleLogout} className="px-4 py-2 border-none bg-gray-600 hover:bg-gray-700 duration-300 text-white rounded-md">Log out</button>
                </div>
                  </>
                ))}

              </div>
            </div>
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
                                src={require(`../assets/${
                                  user.profile_img
                                    ? user.profile_img
                                    : "defaultPic.png"
                                }`)}
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
                              {/* Add code to display user's status */}
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
                    <div>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="w-6 h-6 text-gray-700"
                      >
                        <path
                          fill="currentColor"
                          d="M15.9 14.3H15l-.3-.3c1-1.1 1.6-2.7 1.6-4.3 0-3.7-3-6.7-6.7-6.7S3 6 3 9.7s3 6.7 6.7 6.7c1.6 0 3.2-.6 4.3-1.6l.3.3v.8l5.1 5.1 1.5-1.5-5-5.2zm-6.2 0c-2.6 0-4.6-2.1-4.6-4.6s2.1-4.6 4.6-4.6 4.6 2.1 4.6 4.6-2 4.6-4.6 4.6z"
                        ></path>
                      </svg>
                    </div>
                    <div className="ml-6">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="w-6 h-6 text-gray-700"
                      >
                        <path
                          fill="currentColor"
                          d="M1.816 15.556v.002c0 1.502.584 2.912 1.646 3.972s2.472 1.647 3.974 1.647a5.58 5.58 0 0 0 3.972-1.645l9.547-9.548c.769-.768 1.147-1.767 1.058-2.817-.079-.968-.548-1.927-1.319-2.698-1.594-1.592-4.068-1.711-5.517-.262l-7.916 7.915c-.881.881-.792 2.25.214 3.261.959.958 2.423 1.053 3.263.215l5.511-5.512c.28-.28.267-.722.053-.936l-.244-.244c-.191-.191-.567-.349-.957.04l-5.506 5.506c-.18.18-.635.127-.976-.214-.098-.097-.576-.613-.213-.973l7.915-7.917c.818-.817 2.267-.699 3.23.262.5.501.802 1.1.849 1.685.051.573-.156 1.111-.589 1.543l-9.547 9.549a3.97 3.97 0 0 1-2.829 1.171 3.975 3.975 0 0 1-2.83-1.173 3.973 3.973 0 0 1-1.172-2.828c0-1.071.415-2.076 1.172-2.83l7.209-7.211c.157-.157.264-.579.028-.814L11.5 4.36a.572.572 0 0 0-.834.018l-7.205 7.207a5.577 5.577 0 0 0-1.645 3.971z"
                        ></path>
                      </svg>
                    </div>
                    <div className="ml-6">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="w-6 h-6 text-gray-700"
                      >
                        <path
                          fill="currentColor"
                          fillOpacity=".6"
                          d="M12 7a2 2 0 1 0-.001-4.001A2 2 0 0 0 12 7zm0 2a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 9zm0 6a2 2 0 1 0-.001 3.999A2 2 0 0 0 12 15z"
                        ></path>
                      </svg>
                    </div>
                  </div>
                )}
              </div>

              <ScrollToBottom className="flex-1 overflow-y-auto bg-gray-900 bg-opacity-40">
                <div className="py-2 px-3">
                  <div className="py-2 px-3">
                    {userId && recipientId ? (
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
                              <span className="px-1 py-1 rounded-full hover:bg-gray-500 mr-2 bg-opacity-35">
                                <BsThreeDotsVertical className="text-white cursor-pointer" />
                              </span>
                            </>
                          ) : (
                            <>
                              <div className="ml-2 py-2 px-2 bg-gray-400 rounded-br-3xl rounded-tr-3xl rounded-tl-xl text-white">
                                <div>{message.message}</div>
                              </div>
                              <span className="px-1 py-1 rounded-full hover:bg-gray-500 mr-2 bg-opacity-35">
                                <BsThreeDotsVertical className="text-white cursor-pointer" />
                              </span>
                            </>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="flex justify-center items-center h-full">
                        <h1
                          className="text-[2rem] text-white absolute top-[15rem]"
                          style={{ fontFamily: "Curetro" }}
                        >
                          No chats selected
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
              <div className="w-1/4  border flex flex-col bg-gray-900">
                {userInfo.map((user) => {
                  if (user.user_id === parseInt(recipientId)) {
                    return (
                      <>
                        <div className="w-full h-[10rem] border-4 border-gray-500 flex justify-center items-center relative overflow-hidden object-cover object-center bg-center bg-cover">
                          <img
                            src={require(`../assets/varon_bg2.png`)}
                            alt=""
                          />
                          <div className="absolute inline-block right-0 bottom-0 p-2">
                            <label
                              htmlFor="fileInput"
                              className="cursor-pointer bg-white opacity-40 hover:opacity-100 text-black font-bold   rounded"
                            >
                              <FaEdit className="text-2xl" />
                            </label>
                            <input
                              id="fileInput"
                              type="file"
                              className="hidden"
                            />
                          </div>
                        </div>
                        <div className=" h-full relative flex justify-center items-center">
                          <div className="absolute left-2 top-[-4rem]">
                            <img
                              className={`w-[7rem] h-[7rem] rounded-full border-4 ${
                                user.status === "Active Now"
                                  ? "border-green-500"
                                  : "border-gray-500"
                              } `}
                              src={require(`../assets/${
                                user.profile_img
                                  ? user.profile_img
                                  : "defaultPic.png"
                              }`)}
                              alt=""
                            />
                          </div>
                          <div className="w-3/4 h-2/4 rounded-lg bg-gray-800 p-4">
                            <h1
                              className="text-white tracking-widest"
                              style={{ fontFamily: "Curetro" }}
                            >
                              {user.first_name} {user.last_name}
                            </h1>
                            <p className="text-white">
                              USER ID: {user.user_id}
                            </p>
                            <div className="border-b border-gray-500 w-full"></div>
                            <div className="mt-5">
                              <h1
                                className="text-white tracking-widest"
                                style={{ fontFamily: "Curetro" }}
                              >
                                STATUS
                              </h1>
                              <p className="text-white">{user.status}</p>
                              <div className="border-b border-gray-500 w-full"></div>
                            </div>
                          </div>
                        </div>
                      </>
                    );
                  }
                  return null;
                })}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
