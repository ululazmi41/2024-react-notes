import React from 'react';

// Third-party
import PropTypes from 'prop-types';

function NoteSearch({ value, onChange }) {
  return (
    <form className='note-search' onSubmit={(e) => e.preventDefault()}>
      <input type="text" name="kueri" id="kueri" value={value} onChange={onChange} placeholder='Cari catatan ...' />
    </form>
  );
}

NoteSearch.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
}

export default NoteSearch;