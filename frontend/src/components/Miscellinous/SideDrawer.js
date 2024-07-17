import {
    Box,
    Tooltip,
    Button,
    Text,
    Flex,
    Menu,
    MenuButton,
    MenuList,
    Avatar,
    MenuItem,
    MenuDivider,
    Drawer,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerBody,
    Input,
    Spinner,
    useDisclosure
} from '@chakra-ui/react';
import { BellIcon, SearchIcon, ChevronDownIcon } from '@chakra-ui/icons';
import React, { useContext, useState } from 'react';
import { StoreContext } from '../../context/StoreContext.js';
import ProfileModal from "./ProfileModel.js";
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { useToast } from "@chakra-ui/toast";
import ChatLoading from './ChatLoading.js'; // Ensure the import path is correct
import UserListItem from '../UserAvatar/UserListItem.js'; // Ensure the import path is correct
import { getSender } from '../../config/chatLogics.js';
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";

const SideDrawer = () => {
    const { user, setUser, setSelectedChat, chats, setChats, notifications, setNotification } = useContext(StoreContext);
    const navigate = useNavigate();
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    const logout = () => {
        localStorage.removeItem("userInfo");
        setUser(null);
        navigate("/");
    };

    const handleSearch = async () => {
        if (!search) {
            toast({
                title: "Please Enter something in search",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top-left",
            });
            return;
        }

        try {
            setLoading(true);
            console.log(user)
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`
                },
            };

            const { data } = await axios.get(`https://chat-app-backend-fzjv.onrender.com/api/v1/user/?search=${search}`, config);

            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            toast({
                title: "Error Occurred!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    };

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true);

            const config = {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${user.token}`
                }
            };

            const { data } = await axios.post("https://chat-app-backend-fzjv.onrender.com/api/v1/chat/accesschat", { userId }, config);

            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
            setSelectedChat(data);
            setLoadingChat(false);
            onClose();

        } catch (error) {
            toast({
                title: "Error in fetching chat!",
                description: error.message,
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
            setLoadingChat(false);
        }
    };

    return (
        <>
            <Box display="flex"
                justifyContent="space-between"
                alignItems="center"
                bg="white"
                w="100%"
                p="5px 10px 5px 10px"
                borderWidth="5px">
                <Tooltip label="Search user to chat" hasArrow placement='bottom-end'>
                    <Button variant="ghost" onClick={onOpen}>
                        <Flex alignItems="center">
                            <SearchIcon mr={2} />
                            <Text display={{ base: "none", md: "flex" }} px="4">Search User</Text>
                        </Flex>
                    </Button>
                </Tooltip>
                <Text fontSize="2xl" fontFamily="Work sans" pr="80px">
                    Chat With Any One
                </Text>
                <div>
                    <Menu>
                        <MenuButton p="1">
                            <NotificationBadge
                                count={notifications.length}
                                effect={Effect.SCALE}
                            />
                            <BellIcon fontSize="2xl" m={1} />
                        </MenuButton>
                        <MenuList pl={2}>
                            {!notifications.length && "No New Messages"}
                            {notifications.map((notif) => (
                                <MenuItem
                                    key={notif._id}
                                    onClick={() => {
                                        setSelectedChat(notif.chat);
                                        setNotification(notifications.filter((n) => n !== notif));
                                    }}
                                >
                                    {notif.chat.isGroupChat
                                        ? `New Message in ${notif.chat.chatName}`
                                        : `New Message from ${getSender(user, notif.chat.users)}`}
                                </MenuItem>
                            ))}
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            <Avatar size="sm" cursor="pointer" name={user.name} src={user.pic} />
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user}>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModal>
                            <MenuDivider />
                            <MenuItem onClick={logout}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Box>

            <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
                    <DrawerBody>
                        <Box display="flex" pb={2}>
                            <Input
                                placeholder="Search by name or email"
                                mr={2}
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Button onClick={handleSearch}>Go</Button>
                        </Box>
                        {loading ? (
                            <ChatLoading />
                        ) : (
                            searchResult.map((user) => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => accessChat(user._id)}
                                />
                            ))
                        )}
                        {loadingChat && <Spinner ml="auto" display="flex" />}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
};

export default SideDrawer;
