import React from "react";
import styles from "../styles/Sidebar.module.css";
import LogoutIcon from "@mui/icons-material/Logout";
import AlarmIcon from "@mui/icons-material/Alarm";
import ReceiptIcon from "@mui/icons-material/Receipt";
import SidebarElement from "./SidebarElement";
import ChecklistIcon from "@mui/icons-material/Checklist";

const Sidebar: React.FC = () => {
  return (
    <div className={styles.sidebar}>
      <ul>
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
