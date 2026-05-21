import type { Socket } from "socket.io-client"
import type { Conversation, ConversationMessages, Message } from "./chat"
import type { User } from "./user"

export interface AuthState {
  accessToken: string | null
  user: User | null
  loading: boolean

  setAccessToken: (accessToken: string) => void
  clearState: () => void

  signUp: (
    username: string,
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<void>

  signIn: (username: string, password: string) => Promise<void>

  signOut: () => Promise<void>

  fetchMe: () => Promise<void>

  refresh: () => Promise<void>
}

export interface ThemeState {
  isDark: boolean
  toggleTheme: () => void
  setTheme: (dark: boolean) => void
}

export interface ChatState {
  conversations: Conversation[]
  conversationMessages: ConversationMessages
  activeConversationId: string | null
  convoLoading: boolean
  messageLoading: boolean

  reset: () => void
  setActiveConversation: (id: string | null) => void
  fetchConversations: () => Promise<void>
  fetchMessages: (conversationId?: string) => Promise<void>
  sendDirectMessage: (
    recipientId: string,
    content: string,
    imgUrl?: string
  ) => Promise<void>
  sendGroupMessage: (
    conversationId: string,
    content: string,
    imgUrl?: string
  ) => Promise<void>

  // append messages
  appendMessage: (message: Message) => Promise<void>

  // update conversation
  updateConversation: (conversation: Conversation) => void

  // update unread counts

  // update last message

  // update seen status
}

export interface SocketState {
  socket: Socket | null
  onlineUsers: string[]
  connectSocket: () => void
  disconnectSocket: () => void
}