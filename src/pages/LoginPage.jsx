import React, { useContext, useState } from 'react';

// Icons
import Header from '../layout/header';
import { Link, useNavigate } from 'react-router-dom';
import { homeRoute, registerRoute } from '../consts/routes';
import useInput from '../hooks/input';
import PropTypes from 'prop-types';
import { validateEmail } from '../helpers/validateEmail';
import { validatePassword } from '../helpers/validatePassword';

// Localization
import localization from '../consts/i10n';
import LanguageContext from '../contexts/languageContext';
import { toTitleCase } from '../helpers/helpers';
import Loading from '../components/Loading';
import { getUserLogged, login, putAccessToken } from '../utils/network-data';
import LoadingContext from '../contexts/loadingContext';
import EmailInput from '../components/Inputs/EmailInput';
import PasswordInput from '../components/Inputs/PasswordInput';

function LoginPage({ isLoading, toggleAuthStatus, setAuthUser }) {
  const navigate = useNavigate();

  // Email
  const [email, setEmail] = useInput('');
  const [isEmailInvalid, setEmailInvalid] = useState(false);
  
  // Password
  const [password, setPassword] = useInput('');
  const [isPasswordInvalid, setPasswordInvalid] = useState(false);

  // Localization
  const { language } = useContext(LanguageContext);
  const { login: loginLocalization, dontHaveAccount, register, submit } = localization[language];

  // Loading
  const { setLoading } = useContext(LoadingContext);

  async function handleSubmit(event) {
    event.preventDefault();

    const emailValidity = validateEmail(email);
    const passwordValidity = validatePassword(password);

    if (!emailValidity && !passwordValidity) {
      setEmailInvalid(true);
      setPasswordInvalid(true);
      return;
    }

    if (!emailValidity) {
      setEmailInvalid(true);
      return;
    }

    if (!passwordValidity) {
      setPasswordInvalid(true);
      return;
    }

    setLoading(true);
    const { error, errorMessage, data: { accessToken } } = await login({ email: email, password: password });
    setLoading(false);

    if (error) {
      if (errorMessage.toLowerCase().includes('email')) {
        setEmailInvalid(true);
        setPasswordInvalid(true);
        return;
      }
  
      if (errorMessage.toLowerCase().includes('password')) {
        setPasswordInvalid(true);
        return;
      }
    }

    putAccessToken(accessToken);
    const { user } = getUserLogged();
    setAuthUser(user);
    toggleAuthStatus();
    navigate(homeRoute);
  }

  return (
    <>
      {isLoading && <Loading />}
      <Header />
      <div className="note-auth__wrapper">
        <div className="note-auth__header">
          <h2>{toTitleCase(loginLocalization)}</h2>
        </div>
        <main className="note-auth__body">
          <form className="grid" onSubmit={handleSubmit}>
            <EmailInput setEmailParent={setEmail} isEmailInvalid={isEmailInvalid} setEmailInvalid={setEmailInvalid} />
            <PasswordInput setPasswordParent={setPassword} isPasswordInvalid={isPasswordInvalid} setPasswordInvalid={setPasswordInvalid} />
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
  toggleAuthStatus: PropTypes.func.isRequired,
}

export default LoginPage;
