import React from "react";
import { ChatState } from "../../Context/Context";
import { Box } from "@chakra-ui/react";
import SingleChat from "../../SingleChat";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();

  return (
    <>
      <Box
        d={{ base: selectedChat ? "flex" : "none", md: "flex" }}
        flexDir={"column"}
        alignItems={"center"}
        p={3}
        bg={"white"}
        w={{ base: "100%", md: "68%" }}
        borderRadius={"lg"}
        borderWidth={"1px"}
        style={{ backgroundColor: "hsl(320.9deg 25.83% 86.51%)" }}
      >
        <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      </Box>
    </>
  );
};

export default ChatBox;
