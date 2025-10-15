import React, { useState } from "react";
import LogoutIcon from "@mui/icons-material/Logout";
import AlarmIcon from "@mui/icons-material/Alarm";
import ReceiptIcon from "@mui/icons-material/Receipt";
import SidebarElement from "./SidebarElement";
import ChecklistIcon from "@mui/icons-material/Checklist";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-gray-900 p-3 rounded-lg shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? (
          <CloseIcon sx={{ fontSize: "28px", color: "#A2A2A2" }} />
        ) : (
          <MenuIcon sx={{ fontSize: "28px", color: "#A2A2A2" }} />
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed left-0 top-0 z-30 bg-gray-900 shadow-lg transition-transform duration-300 ease-in-out
          w-64 h-screen
          md:w-28 md:translate-x-0
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <ul className="list-none p-0 pt-20 md:pt-0">
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
    </>
  );
};

export default Sidebar;
