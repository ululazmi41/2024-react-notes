import React, { useState } from 'react';

// Icons
import Header from '../layout/header';
import { Link, useNavigate } from 'react-router-dom';
import { homeRoute, registerRoute } from '../consts/routes';
import useInput from '../hooks/input';
import PropTypes from 'prop-types';
import { validateEmail } from '../helpers/validateEmai';
import { validatePassword } from '../helpers/validatePassword';

function LoginPage({ toggleAuthStatus, setAuthUser }) {
  const navigate = useNavigate();

  // Email
  const [email, emailChangeHandler] = useInput('');
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);
  
  // Password
  const [password, passwordChangeHandler] = useInput('');
  const [isPasswordInvalid, setIsPasswordInvalid] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();

    const emailValidity = validateEmail(email);
    const passwordValidity = validatePassword(password);

    if (!emailValidity && !passwordValidity) {
      setIsEmailInvalid(true);
      setIsPasswordInvalid(true);
      return;
    }

    if (!emailValidity) {
      setIsEmailInvalid(true);
      return;
    }

    if (!passwordValidity) {
      setIsPasswordInvalid(true);
      return;
    }

    // TODO: remote logic
    setAuthUser(1);

    toggleAuthStatus();
    navigate(homeRoute);
  }

  function emailChangeHandlerWrapper(value) {
    if (isEmailInvalid) {
      setIsEmailInvalid(false);
    }
    emailChangeHandler(value);
  }

  function passwordChangeHandlerWrapper(value) {
    if (isPasswordInvalid) {
      setIsPasswordInvalid(false);
    }
    passwordChangeHandler(value);
  }

  return (
    <>
      <Header />
      <div className="note-auth__wrapper">
        <div className="note-auth__header">
          <h2>Login</h2>
        </div>
        <main className="note-auth__body">
          <form className="grid" onSubmit={handleSubmit}>
            <input
            type="text"
            className={"note-auth__input" + (isEmailInvalid && " text-red border-red placeholder-red")}
            defaultValue={email}
            onChange={(e) => emailChangeHandlerWrapper(e.target.value)}
            placeholder="email ..." />
            <input
            type="password"
            className={"note-auth__input" + (isPasswordInvalid && " text-red border-red placeholder-red")}
            defaultValue={password}
            onChange={(e) => passwordChangeHandlerWrapper(e.target.value)}
            placeholder="password ..." />
            <p className="text-11pt">Dont`t have an account? <Link to={registerRoute}>Register</Link></p>
            <button className="notes-auth__button">Submit</button>
          </form>
        </main>
      </div>
    </>
  );
}

LoginPage.propTypes = {
  setAuthUser: PropTypes.func.isRequired,
  toggleAuthStatus: PropTypes.func.isRequired,
}

export default LoginPage;
