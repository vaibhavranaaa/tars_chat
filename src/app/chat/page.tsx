import { currentUser } from "@clerk/nextjs/server";

export default async function ChatPage() {
  const user = await currentUser();

  return (
    <div className="flex-1 flex items-center justify-center bg-gray-50 h-full">
      <div className="text-center max-w-md px-4">
        <div className="text-7xl mb-6">💬</div>
        <h2 className="text-2xl font-bold text-gray-800">
          Welcome back, {user?.firstName ?? "there"}!
        </h2>
        <p className="text-gray-500 mt-3 text-sm leading-relaxed">
          Select a conversation from the sidebar to continue chatting, or click
          the search icon to find someone new to message.
        </p>

        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl mb-1">⚡</div>
            <p className="text-xs text-gray-500 font-medium">Real-time</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl mb-1">🔒</div>
            <p className="text-xs text-gray-500 font-medium">Private</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="text-2xl mb-1">🌐</div>
            <p className="text-xs text-gray-500 font-medium">Any device</p>
          </div>
        </div>
      </div>
    </div>
  );
}