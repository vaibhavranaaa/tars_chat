import ChatArea from "@/components/chat/ChatArea";
import { Id } from "@/../convex/_generated/dataModel";

export default function ConversationPage({
  params,
}: {
  params: { conversationId: string };
}) {
  return <ChatArea conversationId={params.conversationId as Id<"conversations">} />;
}