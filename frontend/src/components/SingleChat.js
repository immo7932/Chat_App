import React, { useContext, useState, useEffect, useCallback } from 'react';
import { StoreContext } from "../context/StoreContext.js";
import { IconButton, Spinner, useToast } from "@chakra-ui/react";
import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import { getSender, getSenderFull } from '../config/chatLogics.js';
import ProfileModal from './Miscellinous/ProfileModel.js';
import UpdateGroupChatModal from './Miscellinous/UpdateGroupChatModal.js';
import Lottie from "react-lottie";
import { ArrowBackIcon } from "@chakra-ui/icons";
import axios from 'axios';
import "./styles.css"
import ScrollableChat from "./ScrollableChat.js"
import io from "socket.io-client";
import animationData from "../animations/typing.json"

const ENDPOINT = "http://localhost:4000";
let socket, selectedChatCompare;

const SingleChat = ({ fetchChatAgain, setFetchAgain }) => {
    const { user, selectedChat, setSelectedChat, notifications, setNotification } = useContext(StoreContext);
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);
    const [socketConnected, setSocketConnected] = useState(false);
    const toast = useToast();

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    const fetchMessages = useCallback(async () => {
        if (!selectedChat) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            setLoading(true);

            const { data } = await axios.get(
                `http://localhost:4000/api/v1/message/${selectedChat._id}`,
                config
            );

            setMessages(data);
            setLoading(false);
            socket.emit("join chat", selectedChat._id);
        } catch (error) {
            toast({
                title: "Error Occurred!",
                description: "Failed to Load the Messages",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
        }
    }, [selectedChat, user.token, setLoading, setMessages, toast]);

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));
        socket.on("message received", (newMessageRecieved) => {
            if (!newMessageRecieved.chat) {
                console.error("newMessageRecieved does not have a chat property:", newMessageRecieved);
                return;
            }

            if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {
                if (!notifications.includes(newMessageRecieved)) {
                    setNotification([newMessageRecieved, ...notifications]);
                    setFetchAgain(!fetchChatAgain);
                }
            } else {
                setMessages((prevMessages) => [...prevMessages, newMessageRecieved]);
            }
        });

        return () => {
            socket.off("message received");
        };
    }, [user, notifications, setNotification, fetchChatAgain, setFetchAgain]);

    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat, fetchMessages]);

    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            socket.emit('stop typing', selectedChat._id)
            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                setNewMessage(""); // Clear the input field after sending the message
                const { data } = await axios.post("http://localhost:4000/api/v1/message",
                    {
                        content: newMessage,
                        chatId: selectedChat._id, // Use selectedChat._id instead of selectedChat
                    },
                    config
                );
                socket.emit('new message', { ...data, chat: selectedChat }); // Ensure chat property is included
                setMessages([...messages, data]);

            } catch (error) {
                toast({
                    title: "Error Occurred!",
                    description: "Failed to send the Message",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            }
        }
    };

    const typingHandler = (e) => {
        setNewMessage(e.target.value);
        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }

        let lastTypingTime = new Date().getTime();
        var timerLength = 3000;
        setTimeout(() => {
            var timeNow = new Date().getTime();
            var timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    };

    return (
        <>
            {selectedChat ? (
                <>
                    <Text fontSize={{ base: "28px", md: "30px" }}
                        pb={3}
                        px={2}
                        w="100%"
                        fontFamily="Work sans"
                        display="flex"
                        justifyContent={{ base: "space-between" }}
                        alignItems="center">
                        <IconButton
                            display={{ base: "flex", md: "none" }}
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectedChat(null)} // Use null to clear selected chat
                        />
                        {
                            !selectedChat.isGroupChat ? (
                                <>
                                    {getSender(user, selectedChat.users)}
                                    <ProfileModal user={getSenderFull(user, selectedChat.users)} />
                                </>
                            ) : (
                                <>
                                    {selectedChat.chatName.toUpperCase()}
                                    <UpdateGroupChatModal
                                        fetchChatAgain={fetchChatAgain}
                                        setFetchAgain={setFetchAgain}
                                        fetchMessages={fetchMessages}
                                    />
                                </>
                            )
                        }
                    </Text>
                    <Box
                        display="flex"
                        flexDir="column"
                        justifyContent="flex-end"
                        p={3}
                        bg="#E8E8E8"
                        w="100%"
                        h="100%"
                        borderRadius="lg"
                        overflowY="hidden"
                    >
                        {loading ? (
                            <Spinner
                                size="xl"
                                w={20}
                                h={20}
                                alignSelf="center"
                                margin="auto"
                            />
                        ) : (
                            <div className="messages">
                                <ScrollableChat messages={messages} />
                            </div>
                        )}
                        <FormControl
                            onKeyDown={sendMessage}
                            id="first-name"
                            isRequired
                            mt={3}
                        >
                            {istyping ? <div>
                                <Lottie
                                    options={defaultOptions}
                                    // height={50}
                                    width={70}
                                    style={{ marginBottom: 15, marginLeft: 0 }}
                                />
                            </div> : (<></>)}
                            <Input
                                variant="filled"
                                bg="#E0E0E0"
                                placeholder="Enter a message.."
                                value={newMessage}
                                onChange={typingHandler}
                            />
                        </FormControl>
                    </Box>
                </>
            ) : (
                <Box display="flex" alignItems="center" justifyContent="center" h="100%">
                    <Text fontSize="3xl" pb={3} fontFamily="Work sans">
                        Click on a user to start chatting
                    </Text>
                </Box>
            )}
        </>
    );
};

export default SingleChat;
