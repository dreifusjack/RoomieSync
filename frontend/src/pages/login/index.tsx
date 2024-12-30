import React, { useState } from "react";
import "./styles.css";
import { useAuth } from "@/hooks/AuthenticationHooks";
import { Button } from "@mui/material";

const LoginForm: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { handleLogin, handleSignUp, error, loading, isSignup, setIsSignup } =
    useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSignup) {
      await handleSignUp(email, password, firstName, lastName);
    } else {
      await handleLogin(email, password);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>{isSignup ? "Sign Up" : "Login"}</h2>
        {error && <div className="error-message">{error}</div>}

        {isSignup && (
          <>
            <div className="form-group">
              <label>First Name:</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>Last Name:</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </>
        )}

        <div className="form-group">
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <Button type="submit" disabled={loading}>
          {loading ? "Processing..." : isSignup ? "Sign Up" : "Login"}
        </Button>

        <Button
          type="button"
          onClick={() => setIsSignup(!isSignup)}
          className="toggle-button"
        >
          {isSignup
            ? "Already have an account? Login"
            : "Need an account? Sign Up"}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
