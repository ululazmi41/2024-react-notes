import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import localization from '../../consts/i10n';
import LanguageContext from '../../contexts/languageContext';

function NameInput({ setNameParent, isNameInvalid, setNameInvalid }) {
  const [name, setName] = useState('');
  const { language } = useContext(LanguageContext);
  const { namePlaceholder } = localization[language];
  
  function nameChangeHandlerWrapper(value) {
    if (isNameInvalid) {
      setNameInvalid(false);
    }
    setName(value);
    setNameParent(value);
  }

  return (
    <input
      type="text"
      className={"note-auth__input" + (isNameInvalid && " text-red border-red placeholder-red")}
      defaultValue={name}
      onChange={(e) => nameChangeHandlerWrapper(e.target.value)}
      placeholder={namePlaceholder} />
  );
}

NameInput.propTypes = {
  setNameParent: PropTypes.func.isRequired,
  isNameInvalid: PropTypes.bool.isRequired,
  setNameInvalid: PropTypes.func.isRequired,
}

export default NameInput;