import React from "react";
import styles from "../styles/Sidebar.module.css";
import LogoutIcon from "@mui/icons-material/Logout";

const Sidebar: React.FC = () => {
  return (
    <div className={styles.sidebar}>
      <ul>
        <li>
          <a href="/">
            <LogoutIcon sx={{ fontSize: "50px" }} />
          </a>
        </li>
        <li>
          <a href="/alarms">Alarms</a>
        </li>
        <li>
          <a href="/expenses">Expenses</a>
        </li>
        <li>
          <a href="/chores">Chores</a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
