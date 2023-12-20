import React, { useContext } from 'react';

// Third-party
import PropTypes from 'prop-types';

// Localization
import localization from '../consts/i10n';
import LanguageContext from '../contexts/languageContext';

function NoteSearch({ value, onChange }) {
  const { language } = useContext(LanguageContext);
  const { searchPlaceholder } = localization[language];

  return (
    <form className='note-search' onSubmit={(e) => e.preventDefault()}>
      <input type="text" name="kueri" id="kueri" value={value} onChange={onChange} placeholder={searchPlaceholder} />
    </form>
  );
}

NoteSearch.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default NoteSearch;