import { NavLink } from "react-router-dom";
import {
  Home,
  MessageSquare,
  ListChecks,
  BookOpen,
  Microscope,
} from "lucide-react";

const tabs = [
  { to: "/detect", label: "Detect", Icon: Microscope },
  { to: "/", label: "Home", Icon: Home },
  { to: "/ask", label: "Ask", Icon: MessageSquare },
  { to: "/queries", label: "Queries", Icon: ListChecks },
  { to: "/advisory", label: "Advisory", Icon: BookOpen },
];

export default function BottomNav() {
  return (
    <nav className="bottomNav bottomNav5">
      {tabs.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            "navItem " + (isActive ? "navItemActive" : "")
          }
        >
          <Icon size={20} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
