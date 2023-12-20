import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import localization from '../../consts/i10n';
import LanguageContext from '../../contexts/languageContext';

function ConfirmPasswordInput({ setConfirmPasswordParent, isConfirmPasswordInvalid, setConfirmPasswordInvalid }) {
  const [Confirmpassword, setConfirmPassword] = useState('');
  const { language } = useContext(LanguageContext);
  const { ConfirmPasswordPlaceholder } = localization[language];
  
  function ConfirmpasswordChangeHandlerWrapper(value) {
    if (isConfirmPasswordInvalid) {
      setConfirmPasswordInvalid(false);
    }
    setConfirmPassword(value);
    setConfirmPasswordParent(value);
  }

  return (
    <input
      type="password"
      className={"note-auth__input" + (isConfirmPasswordInvalid && " text-red border-red placeholder-red")}
      defaultValue={Confirmpassword}
      onChange={(e) => ConfirmpasswordChangeHandlerWrapper(e.target.value)}
      placeholder={ConfirmPasswordPlaceholder} />
  );
}

ConfirmPasswordInput.propTypes = {
  isConfirmPasswordInvalid: PropTypes.bool.isRequired,
  setConfirmPasswordParent: PropTypes.func.isRequired,
  setConfirmPasswordInvalid: PropTypes.func.isRequired,
}

export default ConfirmPasswordInput;