export type AgentStatus = "available" | "busy" | "offline";
export type ConversationStatus = "active" | "closed" | "unassigned";
export type EventType = "assigned" | "retained" | "message" | "closed" | "status_change";

export interface Agent {
  id: string;
  name: string;
  phone: string;
  status: AgentStatus;
  activeConversations: number;
  lastAssignment: string | null;
  createdAt: string;
  avatar?: string;
  initials: string;
}

export interface Message {
  id: string;
  conversationId: string;
  content: string;
  direction: "inbound" | "outbound";
  timestamp: string;
  agentId?: string;
  status?: "sent" | "delivered" | "read";
}

export interface Conversation {
  id: string;
  customerPhone: string;
  customerName?: string;
  assignedAgentId: string | null;
  status: ConversationStatus;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  createdAt: string;
  messages?: Message[];
}

export interface ActivityEvent {
  id: string;
  type: EventType;
  customerPhone: string;
  agentName: string | null;
  description: string;
  method?: string;
  timestamp: string;
  status: "success" | "failed" | "pending";
}

export const agents: Agent[] = [
  {
    id: "a1",
    name: "Ahmed Khan",
    phone: "+92 300 1234567",
    status: "available",
    activeConversations: 5,
    lastAssignment: "2 min ago",
    createdAt: "2024-01-10",
    initials: "AK",
  },
  {
    id: "a2",
    name: "Muneeb Malik",
    phone: "+92 301 7654321",
    status: "available",
    activeConversations: 3,
    lastAssignment: "8 min ago",
    createdAt: "2024-01-12",
    initials: "MM",
  },
  {
    id: "a3",
    name: "Ali Raza",
    phone: "+92 302 1112233",
    status: "busy",
    activeConversations: 8,
    lastAssignment: "5 min ago",
    createdAt: "2024-01-15",
    initials: "AR",
  },
  {
    id: "a4",
    name: "Usman Ahmed",
    phone: "+92 303 4455667",
    status: "offline",
    activeConversations: 0,
    lastAssignment: "Yesterday",
    createdAt: "2024-02-01",
    initials: "UA",
  },
  {
    id: "a5",
    name: "Sara Qureshi",
    phone: "+92 304 9988776",
    status: "available",
    activeConversations: 4,
    lastAssignment: "15 min ago",
    createdAt: "2024-02-10",
    initials: "SQ",
  },
  {
    id: "a6",
    name: "Bilal Hassan",
    phone: "+92 305 3344556",
    status: "busy",
    activeConversations: 6,
    lastAssignment: "1 min ago",
    createdAt: "2024-02-15",
    initials: "BH",
  },
  {
    id: "a7",
    name: "Fatima Noor",
    phone: "+92 306 6677889",
    status: "available",
    activeConversations: 2,
    lastAssignment: "32 min ago",
    createdAt: "2024-03-01",
    initials: "FN",
  },
  {
    id: "a8",
    name: "Hamza Iqbal",
    phone: "+92 307 2233445",
    status: "offline",
    activeConversations: 0,
    lastAssignment: "2 days ago",
    createdAt: "2024-03-05",
    initials: "HI",
  },
];

export const conversations: Conversation[] = [
  {
    id: "c1",
    customerPhone: "+92 300 1234567",
    customerName: "Asif Mahmood",
    assignedAgentId: "a1",
    status: "active",
    lastMessage: "I need pricing for the enterprise plan",
    lastMessageTime: "2 min ago",
    unreadCount: 3,
    createdAt: "2024-09-08T10:40:00",
    messages: [
      { id: "m1", conversationId: "c1", content: "Hi, I want to know more about your services", direction: "inbound", timestamp: "10:38 AM" },
      { id: "m2", conversationId: "c1", content: "Hello! Welcome to RouteFlow. How can I help you today?", direction: "outbound", timestamp: "10:39 AM", agentId: "a1", status: "read" },
      { id: "m3", conversationId: "c1", content: "I need pricing for the enterprise plan", direction: "inbound", timestamp: "10:42 AM" },
    ],
  },
  {
    id: "c2",
    customerPhone: "+92 301 7654321",
    customerName: "Nadia Farooq",
    assignedAgentId: "a3",
    status: "active",
    lastMessage: "Are you available tomorrow for a demo?",
    lastMessageTime: "5 min ago",
    unreadCount: 1,
    createdAt: "2024-09-08T10:35:00",
    messages: [
      { id: "m4", conversationId: "c2", content: "Hello, I saw your ad online", direction: "inbound", timestamp: "10:30 AM" },
      { id: "m5", conversationId: "c2", content: "Are you available tomorrow for a demo?", direction: "inbound", timestamp: "10:37 AM" },
    ],
  },
  {
    id: "c3",
    customerPhone: "+92 302 1112233",
    assignedAgentId: "a2",
    status: "active",
    lastMessage: "Thanks, I'll check it out",
    lastMessageTime: "12 min ago",
    unreadCount: 0,
    createdAt: "2024-09-08T10:28:00",
    messages: [
      { id: "m6", conversationId: "c3", content: "What's included in the starter plan?", direction: "inbound", timestamp: "10:25 AM" },
      { id: "m7", conversationId: "c3", content: "The starter plan includes up to 3 agents, 500 conversations/month, and basic routing.", direction: "outbound", timestamp: "10:27 AM", agentId: "a2", status: "delivered" },
      { id: "m8", conversationId: "c3", content: "Thanks, I'll check it out", direction: "inbound", timestamp: "10:30 AM" },
    ],
  },
  {
    id: "c4",
    customerPhone: "+92 303 4455667",
    assignedAgentId: "a1",
    status: "active",
    lastMessage: "Can I get a refund?",
    lastMessageTime: "18 min ago",
    unreadCount: 2,
    createdAt: "2024-09-08T10:22:00",
    messages: [
      { id: "m9", conversationId: "c4", content: "Can I get a refund?", direction: "inbound", timestamp: "10:22 AM" },
    ],
  },
  {
    id: "c5",
    customerPhone: "+92 304 9988776",
    assignedAgentId: null,
    status: "unassigned",
    lastMessage: "Hello, is anyone there?",
    lastMessageTime: "3 min ago",
    unreadCount: 2,
    createdAt: "2024-09-08T10:38:00",
    messages: [
      { id: "m10", conversationId: "c5", content: "Hello, is anyone there?", direction: "inbound", timestamp: "10:38 AM" },
      { id: "m11", conversationId: "c5", content: "I need help urgently", direction: "inbound", timestamp: "10:39 AM" },
    ],
  },
  {
    id: "c6",
    customerPhone: "+92 305 3344556",
    customerName: "Kamran Butt",
    assignedAgentId: "a5",
    status: "closed",
    lastMessage: "Perfect, thank you so much!",
    lastMessageTime: "1 hr ago",
    unreadCount: 0,
    createdAt: "2024-09-08T09:30:00",
  },
  {
    id: "c7",
    customerPhone: "+92 306 6677889",
    assignedAgentId: "a3",
    status: "active",
    lastMessage: "What's your pricing model?",
    lastMessageTime: "25 min ago",
    unreadCount: 1,
    createdAt: "2024-09-08T10:15:00",
  },
  {
    id: "c8",
    customerPhone: "+92 307 2233445",
    assignedAgentId: null,
    status: "unassigned",
    lastMessage: "Looking for bulk pricing",
    lastMessageTime: "7 min ago",
    unreadCount: 1,
    createdAt: "2024-09-08T10:33:00",
  },
];

export const activityEvents: ActivityEvent[] = [
  {
    id: "e1",
    type: "assigned",
    customerPhone: "+92 300 1234567",
    agentName: "Ahmed Khan",
    description: "New conversation assigned via Round Robin",
    method: "Round Robin",
    timestamp: "10:42 AM",
    status: "success",
  },
  {
    id: "e2",
    type: "message",
    customerPhone: "+92 301 7654321",
    agentName: "Ali Raza",
    description: "Inbound message received",
    method: "Inbound",
    timestamp: "10:40 AM",
    status: "success",
  },
  {
    id: "e3",
    type: "retained",
    customerPhone: "+92 302 1112233",
    agentName: "Muneeb Malik",
    description: "Conversation retained — existing owner",
    method: "Existing Owner",
    timestamp: "10:38 AM",
    status: "success",
  },
  {
    id: "e4",
    type: "assigned",
    customerPhone: "+92 303 4455667",
    agentName: "Sara Qureshi",
    description: "New conversation assigned via Round Robin",
    method: "Round Robin",
    timestamp: "10:35 AM",
    status: "success",
  },
  {
    id: "e5",
    type: "status_change",
    customerPhone: "",
    agentName: "Usman Ahmed",
    description: "Agent status changed to Offline",
    method: "Manual",
    timestamp: "10:30 AM",
    status: "success",
  },
  {
    id: "e6",
    type: "assigned",
    customerPhone: "+92 305 3344556",
    agentName: "Bilal Hassan",
    description: "New conversation assigned via Round Robin",
    method: "Round Robin",
    timestamp: "10:28 AM",
    status: "success",
  },
  {
    id: "e7",
    type: "closed",
    customerPhone: "+92 305 3344556",
    agentName: "Sara Qureshi",
    description: "Conversation closed",
    method: "Manual",
    timestamp: "10:22 AM",
    status: "success",
  },
  {
    id: "e8",
    type: "assigned",
    customerPhone: "+92 308 9900112",
    agentName: null,
    description: "No available agents — conversation queued",
    method: "Round Robin",
    timestamp: "10:18 AM",
    status: "failed",
  },
];

export const kpiData = {
  activeConversations: 124,
  activeChange: 12,
  unassigned: 7,
  availableAgents: 8,
  totalAgents: 12,
  messagesToday: 1284,
  messagesChange: 8,
};

export const getAgentById = (id: string) => agents.find((a) => a.id === id);

export const getAgentName = (id: string | null) => {
  if (!id) return null;
  return agents.find((a) => a.id === id)?.name ?? null;
};
