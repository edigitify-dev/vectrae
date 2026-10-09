import { r2Asset } from "@/lib/site-images";

export type LeadershipProfile = {
  id: string;
  name: string;
  designation: string;
  bio: string;
  imageUrl: string;
  linkedinUrl: string;
  isFeatured: boolean;
  sortOrder: number;
};

// The existing published profiles. Stable IDs make the initial import repeatable.
export const defaultLeadership: LeadershipProfile[] = [
  {
    id: "a0eade00-0000-4000-8000-000000000001",
    name: "Dinesh Kamra", designation: "Managing Director",
    bio: "Dinesh Kamra is the Managing Director, driving the organization’s strategic vision and growth. With a focus on innovation, leadership, and excellence, he continues to shape the company’s journey forward.",
    imageUrl: r2Asset("/images/team/dineshKamra.jpeg"), linkedinUrl: "", isFeatured: true, sortOrder: 0,
  },
  {
    id: "a0eade00-0000-4000-8000-000000000002",
    name: "Rajesh Suri", designation: "Director, Unified Collaboration", bio: "",
    imageUrl: r2Asset("/images/team/rajeshSuri.jpeg"), linkedinUrl: "", isFeatured: false, sortOrder: 1,
  },
  {
    id: "a0eade00-0000-4000-8000-000000000003",
    name: "Swarup Nag", designation: "Business Head - IT Infrastructure and Data Center solutions", bio: "",
    imageUrl: r2Asset("/images/team/swarup.jpeg"), linkedinUrl: "", isFeatured: false, sortOrder: 2,
  },
  {
    id: "a0eade00-0000-4000-8000-000000000004",
    name: "Kapil Gunglani", designation: "Business Head, Delhi", bio: "",
    imageUrl: "", linkedinUrl: "", isFeatured: false, sortOrder: 3,
  },
  {
    id: "a0eade00-0000-4000-8000-000000000005",
    name: "Madhusudhan Sharma", designation: "Business Head, Bangalore", bio: "",
    imageUrl: r2Asset("/images/team/madhuSudhanSharma.jpeg"), linkedinUrl: "", isFeatured: false, sortOrder: 4,
  },
  {
    id: "a0eade00-0000-4000-8000-000000000006",
    name: "Awanish Singh", designation: "Business Head, Mumbai", bio: "",
    imageUrl: r2Asset("/images/team/awanishSingh.png"), linkedinUrl: "", isFeatured: false, sortOrder: 5,
  },
  {
    id: "a0eade00-0000-4000-8000-000000000007",
    name: "Sagar Ahuja", designation: "Business Head, Pune", bio: "",
    imageUrl: r2Asset("/images/team/sagarAhuja.png"), linkedinUrl: "", isFeatured: false, sortOrder: 6,
  },
];

export function splitLeadership(members: LeadershipProfile[]) {
  const featured = members.find((member) => member.isFeatured);
  return { featured, team: members.filter((member) => member.id !== featured?.id) };
}
