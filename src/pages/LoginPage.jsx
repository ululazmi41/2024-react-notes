import React, { useContext, useState } from 'react';

// Icons
import Header from '../layout/header';
import { Link, useNavigate } from 'react-router-dom';
import { homeRoute, registerRoute } from '../consts/routes';
import useInput from '../hooks/input';
import PropTypes from 'prop-types';
import { validateEmail } from '../helpers/validateEmai';
import { validatePassword } from '../helpers/validatePassword';

// Localization
import localization from '../consts/i10n';
import LanguageContext from '../contexts/languageContext';
import { toTitleCase } from '../helpers/helpers';
import Loading from '../components/Loading';

function LoginPage({ isLoading, renderLoading, toggleAuthStatus, setAuthUser }) {
  const navigate = useNavigate();

  // Email
  const [email, emailChangeHandler] = useInput('');
  const [isEmailInvalid, setIsEmailInvalid] = useState(false);
  
  // Password
  const [password, passwordChangeHandler] = useInput('');
  const [isPasswordInvalid, setIsPasswordInvalid] = useState(false);

  // Localization
  const { language } = useContext(LanguageContext);
  const { login, dontHaveAccount, register, submit, emailAddress } = localization[language];

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
    renderLoading(() => {
      setAuthUser(1);
      toggleAuthStatus();
      navigate(homeRoute);
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

  return (
    <>
      {isLoading && <Loading />}
      <Header />
      <div className="note-auth__wrapper">
        <div className="note-auth__header">
          <h2>{toTitleCase(login)}</h2>
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
            <p className="auth-nav-description">{dontHaveAccount} <Link className="auth-nav" to={registerRoute}>{register}</Link></p>
            <button className="notes-auth__button">{submit}</button>
          </form>
        </main>
      </div>
    </>
  );
}

LoginPage.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  setAuthUser: PropTypes.func.isRequired,
  renderLoading: PropTypes.func.isRequired,
  toggleAuthStatus: PropTypes.func.isRequired,
}

export default LoginPage;
