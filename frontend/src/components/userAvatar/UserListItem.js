import { Avatar } from "@chakra-ui/avatar";
import { Box, Text } from "@chakra-ui/layout";
import { ChatState } from "../../Context/ChatProvider";

const UserListItem = ({ handleFunction }) => {
  const { user } = ChatState();

  return (
    <Box
      onClick={handleFunction}
      cursor="pointer"
      bg="#174AE4"
      _hover={{
        background: "#FFFFFF",
        color: "#000000",
      }}
      w="100%"
      d="flex"
      alignItems="center"
      color="#FFFFFF"
      px={3}
      py={2}
      mb={2}
      borderRadius="lg"
    >
      <Avatar
        mr={2}
        size="sm"
        cursor="pointer"
        name={user.name}
        src={user.pic}
      />
      <Box>
        <Text>{user.name}</Text>
        <Text fontSize="xs">
          <b>Email : </b>
          {user.email}
        </Text>
      </Box>
    </Box>
  );
};

export default UserListItem;
