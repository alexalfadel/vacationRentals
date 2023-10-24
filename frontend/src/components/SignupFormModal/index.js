import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom'
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignUpForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [ secure, setSecure ] = useState(false)
  const [confirmPassword, setConfirmPassword] = useState("");
  const [ disabled, setDisabled ] = useState(false)
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();

  useEffect(() => {
    if (!email.length || username.length < 4 || password.length < 6 || !firstName.length || !lastName.length || confirmPassword.length < 6) setDisabled(true)
    else setDisabled(false)
  }, [email, username, firstName, lastName, password, confirmPassword])

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      await dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setErrors(data.errors);
          }
        });
        history.push('/')
    } else {
    return setErrors({
      ...errors,
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  }
  };

  return (
    <div className='sign-up-modal'>
      <h1>Sign Up</h1>
      {/* <div className='sign-up-errors-box'> */}
      {errors.email && <p className='sign-up-errors'>{errors.email}</p>}
      {errors.username && <p className='sign-up-errors'>{errors.username}</p>}
      {errors.firstName && <p className='sign-up-errors'>{errors.firstName}</p>}
      {errors.password && <p className='sign-up-errors'>{errors.password}</p>}
      {errors.lastName && <p className='sign-up-errors'>{errors.lastName}</p>}
      {errors.confirmPassword && (
          <p className='sign-up-errors'>{errors.confirmPassword}</p>
        )}
      {/* </div> */}
      <form className='sign-up-form' onSubmit={handleSubmit}>
        {/* <label>
          Email </label> */}
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        
        {/* {errors.email && <p className='sign-up-errors'>{errors.email}</p>} */}
        {/* <label>
          Username</label> */}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        
        {/* {errors.username && <p>{errors.username}</p>} */}
        {/* <label>
          First Name</label> */}
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        
        {/* {errors.firstName && <p>{errors.firstName}</p>} */}
        {/* <label>
          Last Name</label> */}
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        
        {/* {errors.lastName && <p>{errors.lastName}</p>} */}
        {/* <label>
          Password </label> */}
          <input
            placeholder="Password"
            value={password}
            type={secure ? 'password' : 'text'}
            onChange={(e) => {
              setPassword(e.target.value)
              setSecure(true)
            }}
            required
          />
        
        {/* {errors.password && <p>{errors.password}</p>} */}
        {/* <label>
          Confirm Password </label> */}
          <input
            type={secure ? 'password' : 'text'}
            value={confirmPassword}
            placeholder='Confirm Password'
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        
        {/* {errors.confirmPassword && (
          <p>{errors.confirmPassword}</p>
        )} */}
        <button id="sign-up-button" className={disabled ? 'disabled' : 'not-disabled'} disabled={disabled} type="submit">Sign Up</button>
      </form>
    </div>
  );
}

export default SignupFormModal;