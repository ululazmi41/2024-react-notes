import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import localization from '../../consts/i10n';
import LanguageContext from '../../contexts/languageContext';

function EmailInput({ setEmailParent, isEmailInvalid, setEmailInvalid }) {
  const [email, setEmail] = useState('');
  const { language } = useContext(LanguageContext);
  const { emailPlaceholder } = localization[language];
  
  function emailChangeHandlerWrapper(value) {
    if (isEmailInvalid) {
      setEmailInvalid(false);
    }
    setEmail(value);
    setEmailParent(value);
  }

  return (
    <input
      type="text"
      className={"note-auth__input" + (isEmailInvalid && " text-red border-red placeholder-red")}
      defaultValue={email}
      onChange={(e) => emailChangeHandlerWrapper(e.target.value)}
      placeholder={emailPlaceholder} />
  );
}

EmailInput.propTypes = {
  isEmailInvalid: PropTypes.bool.isRequired,
  setEmailParent: PropTypes.func.isRequired,
  setEmailInvalid: PropTypes.func.isRequired,
}

export default EmailInput;