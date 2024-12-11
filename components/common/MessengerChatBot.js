import { FacebookProvider, CustomChat } from "react-facebook";

const MessengerChatBot = () => {
  return (
    <FacebookProvider appId="712893813515775" chatSupport>
      <CustomChat pageId="328628510589174" minimized={true} />
    </FacebookProvider>
  );
};

export default MessengerChatBot;
