import React from 'react';
import { getInitialData } from './utils/index';
import Home from './page/home';
import Note from './page/Note';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notes: getInitialData(),
      charsLeft: 50,
      currentPage: '', // '' | note
    }

    // others
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.getNoteById = this.getNoteById.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

    // page navigation
    this.navigateTo = this.navigateTo.bind(this);
    this.getCurrentPage = this.getCurrentPage.bind(this);
    this.setCurrentPage = this.setCurrentPage.bind(this);
    this.handlePopState = this.handlePopState.bind(this);
  }

  /**
   * Add Note
   */
  handleSubmit(title, content) {
    const newNote = {
      id: +new Date(),
      title: title,
      body: content,
      createdAt: +new Date(),
      archived: false,
    };
    this.setState((prevState) => {
      return {
        notes: [
          ...prevState.notes,
          newNote,
        ],
      };
    });
    console.log(`New note added witb title: ${title}`);
  }

  /**
   * Update Note
   */
  handleUpdate(note) {
    const copyNotes = this.state.notes;
    const noteIndex = copyNotes.findIndex((innerNote) => innerNote.id === note.id);

    copyNotes[noteIndex] = note;

    this.setState({
      notes: copyNotes,
    });
    console.log(`note updated witb title: ${note.title}`);
  }

  /**
   * Page Navigation
   */
  componentDidMount() {
    this.handlePopState(); // init page checking and rendering on mount
    window.addEventListener('popstate', this.handlePopState);
  }

  componentWillUnmount() {
    window.removeEventListener('popState', this.handlePopState);
  }

  getNoteById(id) {
    const note = this.state.notes.find((note) => note.id === id);
    return note;
  }

  navigateTo(page) {
    history.pushState({}, '', `/${page}`);
    if (page.includes('/')) {
      this.setCurrentPage(page.split('/')[0]);
    } else {
      this.setCurrentPage(page);
    }
  }

  getCurrentPage() {
    const url = window.location.pathname;
    const page = url.split('/')[1];
    return page;
  }

  setCurrentPage(page) {
    this.setState({
      currentPage: page,
    });
  }

  handlePopState(event) {
    const page = this.getCurrentPage();
    this.setCurrentPage(page);
  }

  handleDelete(id) {
    const filteredNotes = this.state.notes.filter((note) => note.id !== id);

    this.setState({
      notes: filteredNotes,
    })

    console.log(`Note with id of ${id} deleted`)
  }

  render() {
    switch (this.state.currentPage) {
      case '':
        return <Home
          notes={this.state.notes}
          onDelete={this.handleDelete}
          navigateTo={this.navigateTo}
        />
      case 'note':
        return <Note
          note={this.state.viewingNote}
          handleSubmit={this.handleSubmit}
          handleUpdate={this.handleUpdate}
          navigateTo={this.navigateTo}
          getNoteById={this.getNoteById}
        />
      default:
        return <>404 Page not Found</>
    }
  };
}

export default App;