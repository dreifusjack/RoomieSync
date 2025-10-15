import React from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import AlarmIcon from "@mui/icons-material/Alarm";
import ReceiptIcon from "@mui/icons-material/Receipt";
import SidebarElement from "./SidebarElement";
import ChecklistIcon from "@mui/icons-material/Checklist";

const Sidebar: React.FC = () => {
  return (
    <div className="w-28 h-screen bg-gray-900 shadow-lg fixed left-0 top-0 z-10">
      <ul className="list-none p-0">
        <SidebarElement
          icon={<LogoutIcon sx={{ fontSize: "50px", color: "#A2A2A2" }} />}
          href="/"
        />
        <SidebarElement
          title="Alarms"
          icon={<AlarmIcon fontSize="small" sx={{ color: "#a2a2a2" }} />}
          href="/alarms"
        />
        <SidebarElement
          title="Expenses"
          icon={<ReceiptIcon fontSize="small" sx={{ color: "#a2a2a2" }} />}
          href="/expenses"
        />
        <SidebarElement
          title="Chores"
          icon={<ChecklistIcon fontSize="small" sx={{ color: "#a2a2a2" }} />}
          href="/chores"
        />
      </ul>
    </div>
  );
};

export default Sidebar;
