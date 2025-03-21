import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import ParticipantList from "./list";

interface RouterType {
  router: AppRouterInstance;
}

const Participant = ({ router }: RouterType) => {
  return <ParticipantList router={router} />;
};

export default Participant;
