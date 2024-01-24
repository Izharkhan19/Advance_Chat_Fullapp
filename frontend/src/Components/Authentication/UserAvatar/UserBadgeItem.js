import { CloseIcon } from "@chakra-ui/icons";
import { Box } from "@chakra-ui/react";
import React from "react";

const UserBadgeItem = ({ user, handleFunction }) => {
  return (
    <>
      <Box
        onClick={handleFunction}
        cursor={"pointer"}
        backgroundColor={"purple"}
        fontSize={12}
        variant={"solid"}
        color={"white"}
        px={2}
        py={1}
        mb={2}
        ml={1}
        borderRadius={"lg"}
      >
        {user.name}
        <CloseIcon pl={1} />
      </Box>
    </>
  );
};

export default UserBadgeItem;
