import React, { useContext } from 'react';

// Third-party
import PropTypes from 'prop-types';

// Utils
import { showFormattedDate } from '../utils';

// Components
import NoteItem from './NoteItem';

// Localization
import LanguageContext from '../contexts/languageContext';

function NotesList({ notes, onDelete, handleArchive, handleUnarchive }) {
  const { language } = useContext(LanguageContext);
  return (
    <div className="notes-list">
      {notes.map((note) => (
        <NoteItem
          id={note.id}
          key={note.id}
          title={note.title}
          date={showFormattedDate(note.createdAt, language)}
          body={note.body}
          archived={note.archived}
          onDelete={onDelete}
          handleArchive={handleArchive}
          handleUnarchive={handleUnarchive}
        />
      ))}
    </div>
  );
}

NotesList.propTypes = {
  notes: PropTypes.array.isRequired,
  onDelete: PropTypes.func.isRequired,
  handleArchive: PropTypes.func.isRequired,
  handleUnarchive: PropTypes.func.isRequired,
}

export default NotesList;