import axios from 'axios';
import React, { useState } from 'react'
import { FaEdit } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Loading from '../Loading/Loading';
import Button from '../Button';

const RightSideNav = ({...props}) => {
  const [isLoading, setLoading] = useState(false);
  const [showUnfriendMessage, setShowUnfriendMessage] = useState(false);
  const navigate = useNavigate();


  const handleUnfriend = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        const response = await axios.post(
            `http://localhost:5000/unfriend`, { user_id: props.userId, friend_id: props.recipientId }
        );
        if (response.data.message === "Deleted") {
            setShowUnfriendMessage(true);
            navigate('/');
            // window.location.reload();
        }
    } catch (error) {
        console.log(error); 
    } finally {
        setLoading(false);
    }
};
  return (
    <div className="w-1/4  border flex flex-col bg-gray-900">
      {isLoading && <Loading /> }
                {props.userInfo.map((user) => {
                  if (user.user_id === parseInt(props.recipientId)) {
                    return (
                      <div key={user.user_id}>
                        <div className="w-full h-[10rem] border-4 border-gray-500 flex justify-center items-center relative overflow-hidden object-cover object-center bg-center bg-cover">
                          <img
                            src={require(`../../assets/${user.cover_img}`)}
                            alt=""
                          />
                        </div>
                        <div className=" h-full relative flex justify-center items-center">
                          <div className="absolute left-2 top-[-4rem]">
                            <img
                              className={`w-[7rem] h-[7rem] rounded-full border-4 ${
                                user.status === "Active Now"
                                  ? "border-green-500"
                                  : "border-gray-500"
                              } `}
                              src={require(`../../assets/${
                                user.profile_img
                                  ? user.profile_img
                                  : "defaultPic.png"
                              }`)}
                              alt=""
                            />
                          </div>
                          <div className="w-3/4  rounded-lg bg-gray-800 p-4">
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
                            <div className="mt-5">
                              <h1
                                className="text-white tracking-widest"
                                style={{ fontFamily: "Curetro" }}
                              >
                                Conversation Options
                              </h1>
                              <form action="" method="post" onSubmit={handleUnfriend}>
                              <div className="flex justify-start items-center gap-2 py-2">
                                <button type='submit' className="whitespace-nowrap text-white px-2 py-1 bg-red-600 hover:bg-red-700 duration-300 rounded-md">
                                  Unfriend
                                </button>
                              </div>
                              </form>
                              <div className="border-b border-gray-500 w-full"></div>
                            </div>
                            {props.isDeleteFormOpen && (
                              <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50 bg-black bg-opacity-55">
                                <div className="absolute inset-0 flex justify-center items-center">
                                  <div className="absolute bg-gray-900 flex  justify-center items-center px-5 rounded-md">
                                    <div className="absolute top-2 right-2"></div>
                                    <form
                                      action=""
                                      method="post"
                                      onSubmit={(e) =>
                                        props.handleDeleteConvo(e, props.selectedMessageId)
                                      }
                                    >
                                      <div className="w-full m-5">
                                        <h2
                                          className="text-white tracking-widest"
                                          style={{ fontFamily: "Curetro" }}
                                        >
                                          Are you sure?
                                        </h2>
                                        <p className="text-white">
                                          If you delete this message, it will be
                                          removed permanently.
                                        </p>
                                      </div>
                                      <div className="w-full flex justify-end gap-2">
                                        <button
                                          onClick={props.handleDeleteForm}
                                          type="submit"
                                          className=" flex px-4 py-2 rounded-md bg-gray-500 text-white my-4 tracking-widest"
                                          style={{ fontFamily: "Curetro" }}
                                        >
                                          Cancel
                                        </button>
                                        <button
                                          type="submit"
                                          className=" flex px-4 py-2 rounded-md bg-red-600 text-white my-4 tracking-widest"
                                          style={{ fontFamily: "Curetro" }}
                                        >
                                          Delete
                                        </button>
                                      </div>
                                    </form>
                                  </div>
                                </div>
                              </div>
                            )}
                            {props.isRemovedOpen && (
                              <div className="fixed top-0 left-0 w-full h-full flex justify-center items-center z-50 bg-black bg-opacity-55">
                                <div className="absolute inset-0 flex justify-center items-center">
                                  <div className="absolute bg-gray-900 flex max-w-[40rem] justify-center items-center px-5 rounded-md">
                                    <div className="absolute top-2 right-2"></div>
                                    <form
                                      action=""
                                      method="post"
                                      onSubmit={(e) =>
                                        props.handleRemove(e, props.selectedMessageId)
                                      }
                                    >
                                      <div className="w-full m-5">
                                        <h2
                                          className="text-white tracking-widest"
                                          style={{ fontFamily: "Curetro" }}
                                        >
                                          Are you sure?
                                        </h2>
                                        <p className="text-white">
                                          If you remove this message, it will be
                                          removed from your side of the
                                          conversation. However, it will still
                                          remain visible to the other person.
                                        </p>
                                      </div>
                                      <div className="w-full flex justify-end gap-2">
                                        <button
                                          onClick={props.handleRemovedForm}
                                          type="submit"
                                          className=" flex px-4 py-2 rounded-md bg-gray-500 text-white my-4 tracking-widest"
                                          style={{ fontFamily: "Curetro" }}
                                        >
                                          Cancel
                                        </button>
                                        <button
                                          type="submit"
                                          className=" flex px-4 py-2 rounded-md bg-red-600 text-white my-4 tracking-widest"
                                          style={{ fontFamily: "Curetro" }}
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    </form>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
  )
}

export default RightSideNav