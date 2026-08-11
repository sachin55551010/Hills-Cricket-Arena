import { Shield, Star, Users } from "lucide-react";

export const ROLE = [
  {
    id: "Captain",
    name: "Captain",
    icon: Star,
    gradient: "from-yellow-500 to-orange-500",
    conflictWith: "Vice Captain",
  },
  {
    id: "Vice Captain",
    name: "Vice Captain",
    icon: Shield,
    gradient: "from-blue-500 to-cyan-500",
    conflictWith: "Captain",
  },
  {
    id: "Wicket Keeper",
    name: "Wicket Keeper",
    icon: Users,
    gradient: "from-green-500 to-emerald-500",
  },
];
