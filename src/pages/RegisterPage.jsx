import React, { useContext, useState } from 'react';
import Header from '../layout/header';
import useInput from '../hooks/input';
import { loginRoute } from '../consts/routes';
import { Link, useNavigate } from 'react-router-dom';
import { validateEmail } from '../helpers/validateEmai';
import { validatePassword } from '../helpers/validatePassword';

import PropTypes from 'prop-types';

// Localization
import localization from '../consts/i10n';
import LanguageContext from '../contexts/languageContext';
import { toTitleCase } from '../helpers/helpers';
import Loading from '../components/Loading';

function RegisterPage({ isLoading, renderLoading }) {
  const navigate = useNavigate();

  // Email
  const [email, emailChangeHandler] = useInput('');
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);

  // Password
  const [password, passwordChangeHandler] = useInput('');
  const [isPasswordInvalid, setIsPasswordInvalid] = useState(false);

  // Confirm Password
  const [confirmPassword, confirmPasswordChangeHandler] = useInput('');
  const [isConfirmPasswordInvalid, setIsConfirmPasswordInvalid] = useState(false);

  // Localization
  const { language } = useContext(LanguageContext);
  const { submit, login, register, alreadyHaveAccount, emailAddress, confirmPassword: confirmPasswordLocalization } = localization[language];

  function handleSubmit(event) {
    event.preventDefault();

    const emailValidity = validateEmail(email);
    const passwordValidity = validatePassword(password);
    const confirmPasswordValidity = password === confirmPassword;

    if (!emailValidity) {
      setIsEmailInvalid(true);
    }

    if (!passwordValidity) {
      setIsPasswordInvalid(true);
      setIsConfirmPasswordInvalid(true);
    }

    if (!confirmPasswordValidity) {
      setIsConfirmPasswordInvalid(true);
    }

    if (!emailValidity || !passwordValidity || !confirmPasswordValidity) {
      return;
    }

    // TODO: remote logic
    renderLoading(() => {
      navigate(loginRoute);
    }, 750);
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

  function confirmPasswordChangeHandlerWrapper(value) {
    if (isConfirmPasswordInvalid) {
      setIsConfirmPasswordInvalid(false);
    }
    confirmPasswordChangeHandler(value);
  }

  return (
    <>
      {isLoading && <Loading />}
      <Header />
      <div className="note-auth__wrapper">
        <div className="note-auth__header">
          <h2>{toTitleCase(register)}</h2>
        </div>
        <main className="note-auth__body">
          <form className="grid" onSubmit={handleSubmit}>
            <input
              type="text"
              className={"note-auth__input" + (isEmailInvalid && " text-red border-red placeholder-red")}
              defaultValue={email}
              onChange={(e) => emailChangeHandlerWrapper(e.target.value)}
              placeholder={emailAddress} />
            <input
              type="password"
              className={"note-auth__input" + (isPasswordInvalid && " text-red border-red placeholder-red")}
              defaultValue={password}
              onChange={(e) => passwordChangeHandlerWrapper(e.target.value)}
              placeholder="Password" />
            <input
              type="password"
              className={"note-auth__input" + (isConfirmPasswordInvalid && " text-red border-red placeholder-red")}
              defaultValue={confirmPassword}
              onChange={(e) => confirmPasswordChangeHandlerWrapper(e.target.value)}
              placeholder={confirmPasswordLocalization} />
            <p className="auth-nav-description">{alreadyHaveAccount} <Link className="auth-nav" to={loginRoute}>{toTitleCase(login)}</Link></p>
            <button className="notes-auth__button">{submit}</button>
          </form>
        </main>
      </div>
    </>
  );
}

RegisterPage.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  renderLoading: PropTypes.func.isRequired,
}

export default RegisterPage;
