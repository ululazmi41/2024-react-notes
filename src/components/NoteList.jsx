import React from 'react';

// Third-party
import PropTypes from 'prop-types';

// Utils
import { showFormattedDate } from '../utils';

// Components
import NoteItem from './NoteItem';

function NotesList({ notes, onDelete, onToggleArchive }) {
  return (
    <div className="notes-list">
      {notes.map((note) => (
        <NoteItem
          id={note.id}
          key={note.title}
          title={note.title}
          date={showFormattedDate(note.createdAt)}
          body={note.body}
          archived={note.archived}
          onDelete={onDelete}
          onToggleArchive={onToggleArchive}
        />
      ))}
    </div>
  );
}

NotesList.propTypes = {
  notes: PropTypes.array.isRequired,
  onDelete: PropTypes.func.isRequired,
  onToggleArchive: PropTypes.func.isRequired,
}

export default NotesList;