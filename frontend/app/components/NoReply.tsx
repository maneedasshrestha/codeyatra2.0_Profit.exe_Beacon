import { MessageCircle } from "lucide-react";

const NoReply = () => {
  return (
    <div className="flex flex-col items-center gap-2 py-10">
      <MessageCircle size={32} className="text-gray-200" />
      <p className="text-[13px] text-gray-400 font-medium">
        No replies yet. Be the first!
      </p>
    </div>
  );
};

export default NoReply;
