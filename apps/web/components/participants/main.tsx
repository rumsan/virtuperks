import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import ParticipantList from "./list";

interface RouterType {
  router: AppRouterInstance;
}

const Participant = ({ router }: RouterType) => {
  return (
    <main className="w-full flex flex-col items-center">
      <ParticipantList router={router} />
    </main>
  );
};

export default Participant;
