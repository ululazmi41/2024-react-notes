import React, { useContext } from "react";

// icons
import iconNote2 from '../public/note-2.svg';

// Localization
import localization from '../consts/i10n';
import LanguageContext from "../contexts/languageContext";
import { toTitleCase } from "../helpers/helpers";

function NoteEmpty() {
  const { language } = useContext(LanguageContext);
  const { emptyNote } = localization[language];

  return (
    <div className="notes-list__empty-message">
      <img src={iconNote2} alt={emptyNote} />
      <p>{toTitleCase(emptyNote)}</p>
    </div>
  )
}

export default NoteEmpty;