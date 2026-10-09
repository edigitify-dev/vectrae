import { getLeadershipMembers } from "@/lib/leadership";
import AboutLeadershipClient from "./AboutLeadershipClient";

export default async function AboutLeadership() {
  const members = await getLeadershipMembers();
  return <AboutLeadershipClient members={members} />;
}
