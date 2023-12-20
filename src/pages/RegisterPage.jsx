import React, { useContext, useState } from 'react';

// Third-party
import toast from 'react-hot-toast';
import { Link, useNavigate } from 'react-router-dom';

// Layout
import Header from '../layout/header';

// Hooks
import useInput from '../hooks/input';

// consts
import localization from '../consts/i10n';
import { loginRoute } from '../consts/routes';

// Helpers
import { register } from '../utils/network-data';
import { toTitleCase } from '../helpers/helpers';
import { validateEmail } from '../helpers/validateEmail';
import { validatePassword } from '../helpers/validatePassword';

// Contexts
import LoadingContext from '../contexts/loadingContext';
import LanguageContext from '../contexts/languageContext';

import NameInput from '../components/Inputs/NameInput';
import EmailInput from '../components/Inputs/EmailInput';
import PasswordInput from '../components/Inputs/PasswordInput';
import ConfirmPasswordInput from '../components/Inputs/ConfirmPasswordInput';

function RegisterPage() {
  const navigate = useNavigate();

  // Name
  const [name, setName] = useInput('');
  const [isNameInvalid, setNameInvalid] = useState(false);

  // Email
  const [email, setEmail] = useInput('');
  const [isEmailInvalid, setEmailInvalid] = useState(false);

  // Password
  const [password, setPassword] = useInput('');
  const [isPasswordInvalid, setPasswordInvalid] = useState(false);

  // Confirm Password
  const [confirmPassword, setConfirmPassword] = useInput('');
  const [isConfirmPasswordInvalid, setConfirmPasswordInvalid] = useState(false);

  // Localization
  const { language } = useContext(LanguageContext);
  const { submit, login, register: registerLocalization, alreadyHaveAccount } = localization[language];

  // Loading
  const { setLoading } = useContext(LoadingContext);

  async function handleSubmit(event) {
    event.preventDefault();

    const nameValidity = name.length > 0;
    const emailValidity = validateEmail(email);
    const passwordValidity = validatePassword(password);
    const confirmPasswordValidity = password === confirmPassword;

    if (!nameValidity) {
      setNameInvalid(true);
    }

    if (!emailValidity) {
      setEmailInvalid(true);
    }

    if (!passwordValidity) {
      setPasswordInvalid(true);
      setConfirmPasswordInvalid(true);
    }

    if (!confirmPasswordValidity) {
      setConfirmPasswordInvalid(true);
    }

    if (!nameValidity || !emailValidity || !passwordValidity || !confirmPasswordValidity) {
      return;
    }

    setLoading(true);
    const { error } = await register({ name: name, email: email, password: password });
    setLoading(false);

    if (error) {
      console.error('Unexpected error when attempting to register');
      return;
    }

    toast.success('Account registered');
    navigate(loginRoute);
  }

  return (
    <>
      <Header />
      <div className="note-auth__wrapper">
        <div className="note-auth__header">
          <h2>{toTitleCase(registerLocalization)}</h2>
        </div>
        <main className="note-auth__body">
          <form className="grid" onSubmit={handleSubmit}>
            <NameInput setNameParent={setName} isNameInvalid={isNameInvalid} setNameInvalid={setNameInvalid}  />
            <EmailInput setEmailParent={setEmail} isEmailInvalid={isEmailInvalid} setEmailInvalid={setEmailInvalid}  />
            <PasswordInput setPasswordParent={setPassword} isPasswordInvalid={isPasswordInvalid} setPasswordInvalid={setPasswordInvalid}  />
            <ConfirmPasswordInput setConfirmPasswordParent={setConfirmPassword} isConfirmPasswordInvalid={isConfirmPasswordInvalid} setConfirmPasswordInvalid={setConfirmPasswordInvalid}  />
            <p className="auth-nav-description">{alreadyHaveAccount} <Link className="auth-nav" to={loginRoute}>{toTitleCase(login)}</Link></p>
            <button className="notes-auth__button">{submit}</button>
          </form>
        </main>
      </div>
    </>
  );
}

export default RegisterPage;
