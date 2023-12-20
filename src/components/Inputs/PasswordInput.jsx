import React, { useState } from 'react';
import PropTypes from 'prop-types';

function PasswordInput({ setPasswordParent, isPasswordInvalid, setPasswordInvalid }) {
  const [password, setPassword] = useState('');
  
  function passwordChangeHandlerWrapper(value) {
    if (isPasswordInvalid) {
      setPasswordInvalid(false);
    }
    setPassword(value);
    setPasswordParent(value);
  }

  return (
    <input
      type="password"
      className={"note-auth__input" + (isPasswordInvalid && " text-red border-red placeholder-red")}
      defaultValue={password}
      onChange={(e) => passwordChangeHandlerWrapper(e.target.value)}
      placeholder="Password" />
  );
}

PasswordInput.propTypes = {
  isPasswordInvalid: PropTypes.bool.isRequired,
  setPasswordParent: PropTypes.func.isRequired,
  setPasswordInvalid: PropTypes.func.isRequired,
}

export default PasswordInput;