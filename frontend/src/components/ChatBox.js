import { Box } from "@chakra-ui/layout";
import SingleChat from "./SingleChat.js"
import { StoreContext } from '../context/StoreContext.js'
import { useContext } from "react";

const Chatbox = ({ fetchChatAgain, setFetchAgain }) => {
    const { selectedChat } = useContext(StoreContext);

    return (
        <Box
            display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
            alignItems="center"
            flexDir="column"
            p={3}
            bg="white"
            w={{ base: "100%", md: "68%" }}
            borderRadius="lg"
            borderWidth="1px"
        >
            <SingleChat fetchChatAgain={fetchChatAgain} setFetchAgain={setFetchAgain} />
        </Box>
    );
};

export default Chatbox;