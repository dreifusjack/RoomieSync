import React from "react";
import styles from "./Landing.module.css"; // Create this CSS module for styling.

const LandingPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Welcome to Our Landing Page</h1>
        <p>Your gateway to amazing features.</p>
      </header>
      <main className={styles.mainContent}>
        <section>
          <h2>About Us</h2>
          <p>We provide solutions that matter.</p>
        </section>
        <section>
          <h2>Get Started</h2>
          <button className={styles.button}>Learn More</button>
        </section>
      </main>
    </div>
  );
};

export default LandingPage;
