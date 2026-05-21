export interface Participant {
  _id: string;
  displayName: string
  avatarUrl?: string | null
  joinedAt: string
}

export interface SeenUser {
  _id: string
  displayName?: string
  avatarUrl?: string | null
}

export interface Group {
  name: string
  createdBy: string
}

export interface LastMessage {
  _id: string
  content: string
  createdAt: string
  sender: {
    _id: string
    displayName: string
    avatarUrl?: string | null
  };
}

export interface Conversation {
  _id: string;
  type: "direct" | "group"
  group: Group
  participants: Participant[]
  lastMessageAt: string
  seenBy: SeenUser[]
  lastMessage: LastMessage | null
  unreadCounts: Record<string, number> // key = userId, value = unread count
  createdAt: string
  updatedAt: string
}

export interface ConversationResponse {
  conversations: Conversation[];
}

// individual message
export interface Message {
  _id: string
  conversationId: string
  senderId: string
  content: string | null
  imgUrl?: string | null
  updatedAt?: string | null
  createdAt: string
  isOwn?: boolean
}

// messages belong to a particular conversation with ID
export type ConversationMessages = Record<string, {
  items: Message[]
  hasMore: boolean
  nextCursor?: string | null
}>
// e.g.
// {
//   "conversationid1234": {
//     items: ["msg1", "msg2"],
//     hasMore: true,
//     nextCursor: "xyz"
//   }
// }
