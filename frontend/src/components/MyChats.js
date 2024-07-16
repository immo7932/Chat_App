import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../context/StoreContext.js';
import { useToast } from '@chakra-ui/react';
import axios from 'axios';
import { Button } from '@chakra-ui/react';
import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import ChatLoading from './Miscellinous/ChatLoading.js';
import { getSender } from '../config/chatLogics.js';
import GroupChatModal from './Miscellinous/GroupChatModel.js';

const MyChats = ({ fetchAgain }) => {
    const [loggeduser, setLoggeduser] = useState();
    const { user, selectedChat, setSelectedChat, chats, setChats } = useContext(StoreContext);
    const toast = useToast();

    const fetchchat = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                }
            }

            const { data } = await axios.get("https://chat-app-backend-fzjv.onrender.com/api/v1/chat/fetchchat", config);

            setChats(Array.isArray(data) ? data : []);
        } catch (error) {
            toast({
                title: "Error Occurred!",
                description: "Failed to load the chats",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    }

    useEffect(() => {
        setLoggeduser(JSON.parse(localStorage.getItem("userInfo")));
        fetchchat();
    }, [fetchAgain]);

    return (
        <Box
            display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
            flexDir="column"
            alignItems="center"
            p={3}
            bg="white"
            w={{ base: "100%", md: "31%" }}
            borderRadius="lg"
            borderWidth="1px"
        >
            <Box
                pb={3}
                px={3}
                fontSize={{ base: "28px", md: "30px" }}
                fontFamily="Work sans"
                display="flex"
                w="100%"
                justifyContent="space-between"
                alignItems="center"
            >
                My Chats
                <GroupChatModal>
                    <Button
                        display="flex"
                        fontSize={{ base: "17px", md: "10px", lg: "17px" }}
                        rightIcon={<AddIcon />}
                    >
                        New Group Chat
                    </Button>
                </GroupChatModal>
            </Box>
            <Box
                display="flex"
                flexDir="column"
                p={3}
                bg="#F8F8F8"
                w="100%"
                h="100%"
                borderRadius="lg"
                overflowY="hidden"
            >
                {Array.isArray(chats) ? (
                    <Stack overflowY="scroll">
                        {chats.map((chat) => (
                            <Box
                                onClick={() => setSelectedChat(chat)}
                                cursor="pointer"
                                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                                color={selectedChat === chat ? "white" : "black"}
                                px={3}
                                py={2}
                                borderRadius="lg"
                                key={chat._id}
                            >
                                <Text>
                                    {!chat.isGroupChat
                                        ? getSender(loggeduser, chat.users)
                                        : chat.chatName}
                                </Text>
                                {chat.latestMessage && chat.latestMessage.sender && (
                                    <Text fontSize="xs">
                                        <b>{chat.latestMessage.sender.name} : </b>
                                        {chat.latestMessage.content.length > 50
                                            ? chat.latestMessage.content.substring(0, 51) + "..."
                                            : chat.latestMessage.content}
                                    </Text>
                                )}
                            </Box>
                        ))}
                    </Stack>
                ) : (
                    <ChatLoading />
                )}
            </Box>
        </Box>
    );
}

export default MyChats;
