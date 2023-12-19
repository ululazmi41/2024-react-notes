import React from 'react';

// Third-party
import PropTypes from 'prop-types';

function NoteSearch({ onChange }) {
  return (
    <form className='note-search' onChange={onChange} onSubmit={(e) => e.preventDefault()}>
      <input type="text" name="kueri" id="kueri" placeholder='Cari catatan ...' />
    </form>
  );
}

NoteSearch.propTypes = {
  onChange: PropTypes.func.isRequired,
}

export default NoteSearch;