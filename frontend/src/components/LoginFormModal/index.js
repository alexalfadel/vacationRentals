import React, { useState, useEffect } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch, useSelector } from "react-redux";
// import { Redirect } from "react-router-dom";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [disabled, setDisabled] = useState(true);
  const { closeModal } = useModal();

  useEffect(() => {
    if (credential.length >= 4 && password.length >= 6) setDisabled(false);
    else setDisabled(true);
  }, [credential, password]);

  console.log(errors, '----errors')

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const demoUser = async () => {
    // let loggedInUser;
    const loggedInUser = await dispatch(
      sessionActions.login({
        credential: "demo",
        password: "password",
      })
    ).catch(async (res) => {
      const data = await res.json();

      return false;
    });

    if (!loggedInUser) {
      await dispatch(
        sessionActions.signup({
          email: "demo@demo.com",
          username: "demo",
          firstName: "Demo",
          lastName: "Account",
          password: "password",
        })
      );
    }
    closeModal();
  };

  return (
    <div className="log-in-modal">
      <h1>Log In</h1>
      {errors.credential && <p className="errors">{errors.credential}</p>}
      {errors.message && <p className='errors'>{errors.message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="input-box">
          <label className="login-label">Username or Email</label>
          <input
            className="login-input"
            type="text"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </div>
        <div className="input-box">
          <label className="login-label">Password</label>
          <input
            className="login-input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {/* {errors.credential && (
          <p>{errors.credential}</p>
        )} */}
        <button
          className={disabled ? "disabled" : "not-disabled"}
          disabled={disabled}
          type="submit"
        >
          Log In
        </button>
      </form>
      <p className="demo-link" onClick={demoUser}>
        Log In as Demo User
      </p>
    </div>
  );
}

export default LoginFormModal;
