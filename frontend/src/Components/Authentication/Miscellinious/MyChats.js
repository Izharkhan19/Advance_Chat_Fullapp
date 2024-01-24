import { AddIcon } from "@chakra-ui/icons";
import { Avatar, Box, Button, Stack, Text, useToast } from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import ChatLoading from "./Modal/CommonComp/ChatLoading";
import { getSender } from "../../../Config/ChatLogics";
import { ChatState } from "../../Context/Context";
import GroupChatModal from "./Modal/GroupChatModal";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();

  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      };

      const { data } = await axios.get(
        `/api/chat`,
        config
      );
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occures!",
        description: "Failed to load chats.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
      return;
    }
  };

  useEffect(() => {
    let loggedUserData = JSON.parse(localStorage.getItem("userInfo"));
    setLoggedUser(loggedUserData.user);

    fetchChats();
  }, [fetchAgain]);

  return (
    <>
      <Box
        d={{ base: selectedChat ? "none" : "flex", md: "flex" }}
        flexDir={"column"}
        alignItems={"center"}
        p={3}
        bg={"white"}
        w={{ base: "100%", md: "31%" }}
        borderRadius={"lg"}
        borderWidth={"1px"}
        style={{ backgroundColor: "hsl(320.9deg 25.83% 86.51%)" }}
      >
        <Box
          pb={{ base: 2, md: 3 }}
          px={{ base: 2, md: 3 }}
          fontSize={{ base: "20px", md: "30px" }}
          p={{ base: 2, md: 3 }}
          fontFamily={"Work sans"}
          d={"flex"}
          flexWrap="wrap"
          alignItems={"center"}
          style={{
            display: "flex",
            backgroundColor: "hsl(197.94deg 55.43% 65.69%)",
          }}
          justifyContent={"space-between"}
          w="100%"
          p="5px 10px 5px 10px"
        >
          <span>My chats</span>
          <GroupChatModal>
            <Button
              mt={{ base: 2, md: 0 }}
              fontSize={{ base: "15px", md: "17px", lg: "20px" }}
              rightIcon={<AddIcon />}
            >
              New Group Chat
            </Button>
          </GroupChatModal>
        </Box>
        <Box
          d={"flex"}
          flexDir={"column"}
          p={3}
          bg={"#F8F8F8"}
          w={"100%"}
          // h={"100%"}
          borderRadius={"lg"}
          overflowY={"hidden"}
        >
          {chats ? (
            <Stack overflowY={"scroll"}>
              {chats.map((chat) => {
                return (
                  <Box
                    onClick={() => {
                      setSelectedChat(chat);
                    }}
                    cursor={"pointer"}
                    bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                    color={selectedChat === chat ? "white" : "black"}
                    px={3}
                    py={2}
                    borderRadius={"lg"}
                    key={chat._id}
                    // style={{ display: "flex" }}
                  >
                    <Text>
                      {!chat.isGroupChat
                        ? getSender(loggedUser, chat.users)
                        : chat.chatName}
                    </Text>
                  </Box>
                );
              })}
            </Stack>
          ) : (
            <ChatLoading />
          )}
        </Box>
      </Box>
    </>
  );
};

export default MyChats;
