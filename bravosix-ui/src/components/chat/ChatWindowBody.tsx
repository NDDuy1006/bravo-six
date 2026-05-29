import { useChatStore } from "@/stores/useChatStore"
import ChatWelcomeScreen from "./ChatWelcomeScreen"
import MessageItem from "./MessageItem"
import { useEffect, useState } from "react"


const ChatWindowBody = () => {
  const {
    activeConversationId,
    conversations,
    conversationMessages: allMessages
  } = useChatStore()

  const [lastMessageStatus, setLastMessageStatus] = useState<"delivered" | "seen">("delivered")

  const messages = allMessages[activeConversationId!]?.items ?? []
  
  const selectedConvo = conversations.find((c) => c._id === activeConversationId)
  console.log("Selected Convo: ", selectedConvo);
  

  useEffect(() => {
    const lastMessage = selectedConvo?.lastMessage
    if (!lastMessage) {
      return
    }

    const seenBy = selectedConvo?.seenBy ?? []

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLastMessageStatus(seenBy.length > 0 ? "seen" : "delivered")
  }, [selectedConvo])

  if (!selectedConvo) {
    return <ChatWelcomeScreen />
  }

  if (!messages.length) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        Start a conversation with this person
      </div>
    )
  }
  
  return (
    <div className="p-4 bg-primary-foreground h-full flex flex-col overflow-hidden">
      <div className="flex flex-col overflow-y-auto overflow-x-hidden beautiful-scroll-bar">
        {messages.map((message, index) => (
          <MessageItem
            key={message._id ?? index}
            message={message}
            index={index}
            messages={messages}
            selectedConvo={selectedConvo}
            lastMessageStatus={lastMessageStatus}
          />
        ))}
      </div>
    </div>
  )
}

export default ChatWindowBody