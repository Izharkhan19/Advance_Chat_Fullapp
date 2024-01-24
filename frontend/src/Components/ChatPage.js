import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import SideDrower from "./Authentication/Miscellinious/SideDrower";
import MyChats from "./Authentication/Miscellinious/MyChats";
import ChatBox from "./Authentication/Miscellinious/ChatBox";
import { ChatState } from "./Context/Context";

const ChatPage = () => {
  const { user, setUser } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    setUser(userInfo);

    if (!userInfo) {
      // window.location.pathname = "/";
    }
  }, []);

  return (
    <Box w="100%">
      {user && <SideDrower setFetchAgain={setFetchAgain} />}
      <Box
        display={{ base: "block", md: "flex" }}
        justifyContent={{ base: "initial", md: "space-between" }}
        width="100%"
        minHeight={{ base: "auto", md: "91.5vh" }}
        padding={{ base: "10px", md: "0" }}
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </Box>
  );
};

export default ChatPage;
