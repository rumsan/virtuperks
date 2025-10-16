import { Loader2 } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import ParticipantList from "./list";

interface RouterType {
  router: AppRouterInstance;
}

const Participant = ({ router }: RouterType) => {
  return (
    <main className="w-full flex flex-col items-center">
      <ParticipantList router={router} />

      {/* Work in Progress message */}
      <div className="mt-8 flex flex-col items-center text-center">
        <Loader2 className="h-16 w-16 text-blue-500 mb-4 animate-spin" />
        <span className="text-blue-600 text-2xl font-semibold">
          Work in Progress
        </span>
        <p className="text-gray-500 text-base mt-2">
          We're currently updating this section. Please check back soon!
        </p>
      </div>
    </main>
  );
};

export default Participant;
