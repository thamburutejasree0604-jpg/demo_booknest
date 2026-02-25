import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleAuthProvider } from "../../firebase";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import classes from "./Login.module.css";

const Login = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const trimmedConfirmPassword = confirmPassword.trim();

    try {
      if (isSignUp) {
        // check passwords match
        if (trimmedPassword !== trimmedConfirmPassword) {
          toast.error("Passwords do not match.");
          return;
        }
        // Sign up logic
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          trimmedEmail,
          trimmedPassword
        );
        const user = userCredential.user;
        toast.success("Account created successfully!");
        console.log("User signed up:", user);
      } else {
        // Login logic
        const userCredential = await signInWithEmailAndPassword(
          auth,
          trimmedEmail,
          trimmedPassword
        );
        const user = userCredential.user;
        toast.success("Logged in successfully!");
        console.log("User logged in:", user);
      }
      // Close the dialog
      onClose();
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleAuthProvider);
      const user = userCredential.user;
      toast.success("Signed in with Google!");
      console.log("Google user signed in:", user);
      // Close the dialog
      onClose();
    } catch (error) {
      console.error("Google Sign-In Error:", error.message);
    }
  };

  const toggleSignUp = () => {
    setIsSignUp((prevState) => !prevState);
    setPassword("");
    setConfirmPassword("");
  };

  return (
    <div className={classes["login-dialog"]}>
      <span className={classes["close-icon"]} onClick={onClose}>
        &times;
      </span>
      <h2>{isSignUp ? "Sign Up" : "Login"}</h2>
      <form className={classes["login-form"]} onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
        />
        {isSignUp && (
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
            required
          />
        )}
        <button type="submit">{isSignUp ? "Sign Up" : "Login"}</button>
      </form>
      <div className={classes["or-divider"]}>or</div>
      <button className={classes["google-signin"]} onClick={handleGoogleSignIn}>
        <i className="fab fa-google"></i> Sign in with Google
      </button>
      <div className={classes["switch-to-signup"]}>
        {isSignUp ? (
          <>
            Already have an account? <span onClick={toggleSignUp}>Login</span>
          </>
        ) : (
          <>
            Don't have an account? <span onClick={toggleSignUp}>Sign up</span>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
