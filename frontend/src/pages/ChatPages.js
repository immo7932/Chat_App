import { useContext, useState } from "react";
import { StoreContext } from "../context/StoreContext.js";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../components/Miscellinous/SideDrawer.js";
import MyChats from "../components/MyChats.js";
import ChatBox from "../components/ChatBox.js";

const ChatPages = () => {
    const { user } = useContext(StoreContext);
    const [fetchChatAgain, setFetchAgain] = useState(false);
    return (
        <>
            <div style={{ width: "100%" }}>
                {user && <SideDrawer />}

                <Box
                    display="flex" justifyContent='space-between' w='100%' h='91.5vh' p='10px'>
                    {user && <MyChats fetchChatAgain={fetchChatAgain} />}
                    {user && <ChatBox fetchChatAgain={fetchChatAgain} setFetchAgain={setFetchAgain} />}
                </Box>
            </div >
        </>
    );
};

export default ChatPages;
