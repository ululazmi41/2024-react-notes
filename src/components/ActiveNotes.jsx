import React from 'react';
import { showFormattedDate } from '../utils';
import NoteItem from './NoteItem';

function ActiveNotes({ notes, isLoading, onDelete, onToggleArchive }) {
  if (isLoading) {
    return (
      <div className="notes-list__empty-message">
        <div className="dots-bars-6 notes-list__loading"></div>
      </div>
    );
  }

  if (notes.length > 0) {
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
  
  return (
    <div className="notes-list__empty-message">
      <img src="note-2.svg" alt="tidak ada catatatn" />
      <p>Tidak ada catatan</p>
    </div>
  )
}

export default ActiveNotes;