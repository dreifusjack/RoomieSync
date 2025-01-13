"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import styles from "../styles/Feature.module.css";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.push("/login");
  }, [router]);

  return (
    <div className={styles.mainContent}>
      <div className={styles.header}>
        <h1>Welcome to Roomie Sync</h1>
        <button onClick={() => router.push("/login")}>Login</button>
      </div>
    </div>
  );
}
