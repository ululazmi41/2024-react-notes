import React from 'react';
import NoteSearch from './components/NoteSearch';
import NoteInput from './components/NoteInput';
import { getInitialData, showFormattedDate } from './utils/index';
import ActiveNotes from './components/ActiveNotes';
import Header from './components/layout/header';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      charsLeft: 50,
      notes: getInitialData(),
      archived: [],
      search: '',
      showing: 'notes', // notes | archives | bin
      isLoading: false,
      loadingTimeout: null,
      currentPage: '', // '' | note
    }

    // others
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    // actions on note
    this.onDelete = this.onDelete.bind(this);
    this.onToggleArchive = this.onToggleArchive.bind(this);

    // home navigation
    this.doTimeout = this.doTimeout.bind(this); // loading animation
    this.showNotes = this.showNotes.bind(this);
    this.showArchives = this.showArchives.bind(this);
    this.showBin = this.showBin.bind(this);

    // page navigation
    this.navigateTo = this.navigateTo.bind(this);
    this.getCurrentPage = this.getCurrentPage.bind(this);
    this.setCurrentPage = this.setCurrentPage.bind(this);
    this.handlePopState = this.handlePopState.bind(this);
  }

  /**
   * Page Navigation
   */
  componentDidMount() {
    window.addEventListener('popstate', this.handlePopState);
  }

  componentWillUnmount() {
    window.removeEventListener('popState', this.handlePopState);
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

  navigateTo(page) {
    history.pushState({}, '', `/${page}`);
    this.setCurrentPage(page);
  }

  /**
   * Others
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
    }
    );
    console.log(`New note added witb title: ${title}`);
  }

  handleSearch(event) {
    event.preventDefault();
    this.setState({
      search: event.target.value.toLowerCase(),
    });
  }

  /**
   * Actions on note
   */
  onDelete(id) {
    const filteredNotes = this.state.notes.filter((note) => note.id !== id);

    this.setState({
      notes: filteredNotes,
    })

    console.log(`Note with id of ${id} deleted`)
  }

  onToggleArchive(id) {
    this.setState(() => {
      const copy = this.state.notes.slice();
      const index = copy.findIndex((note) => note.id === id);
      copy[index].archived = !copy[index].archived;
      if (copy[index].archived) {
        console.log(`Archiving note with id of ${id}`);
      } else {
        console.log(`Unarchiving note with id of ${id}`);
      }
      return {
        notes: copy,
      }
    })
  }

  doTimeout() {
    if (this.state.loadingTimeout != null) {
      clearTimeout(this.state.loadingTimeout);
    }

    this.setState({
      isLoading: true,
    })

    this.setState({
      loadingTimeout: setTimeout(() => {
        this.setState({
          isLoading: false,
        });
      }, 1600),
    });
  }

  /**
   * Note Pages
   */
  showNotes() {
    this.doTimeout();

    this.setState({
      showing: 'notes',
    });
  }

  showArchives() {
    this.doTimeout();

    this.setState({
      showing: 'archives',
    });
  }

  showBin() {
    this.doTimeout();

    this.setState({
      showing: 'bin',
    });
  }

  handleRender() {
    let notes = [];
    let archives = [];
    let bin = [];

    if (this.state.search === '') {
      notes = this.state.notes.filter((note) => note.archived === false);
      archives = this.state.notes.filter((note) => note.archived === true);
    } else {
      const tempNotes = this.state.notes.filter((note) => note.archived === false);
      notes = tempNotes.filter((note) => {
        const isIncludingTitle = note.title.toLowerCase().includes(this.state.search);
        const isIncludingDate = showFormattedDate(note.date).toLowerCase().includes(this.state.search);
        const isIncludingBody = note.body.toLowerCase().includes(this.state.search);

        if (isIncludingTitle || isIncludingDate || isIncludingBody) {
          return true;
        } else {
          return false;
        }
      })

      const tempArchives = this.state.notes.filter((note) => note.archived === true);
      archives = tempArchives.filter((note) => {
        const isIncludingTitle = note.title.toLowerCase().includes(this.state.search);
        const isIncludingDate = showFormattedDate(note.date).toLowerCase().includes(this.state.search);
        const isIncludingBody = note.body.toLowerCase().includes(this.state.search);

        if (isIncludingTitle || isIncludingDate || isIncludingBody) {
          return true;
        } else {
          return false;
        }
      })
    }

    if (this.state.showing === 'notes') {
      return notes;
    } else if (this.state.showing === 'archives') {
      return archives;
    } else if (this.state.showing === 'bin') {
      return bin;
    }
  }

  render() {
    switch (this.state.currentPage) {
      case '':
        return <>
          <Header />
          <main className='note-app__body'>
            <NoteInput onSubmit={this.handleSubmit} />
            <div className='note-app__body__actions'>
              <button className="notes-app__body__button-add" onClick={() => this.navigateTo('note')}>Tambah</button>
              <NoteSearch onChange={this.handleSearch} />
            </div>
            <div className="note-app__body__buttons">
              <button onClick={this.showNotes} className="notes-app__button__selected">Catatan</button>
              <button onClick={this.showArchives} className="notes-app__button__idle">Arsip</button>
              <button onClick={this.showBin} className="notes-app__button__idle">Sampah</button>
            </div>
            <ActiveNotes
              notes={this.handleRender()}
              isLoading={this.state.isLoading}
              onDelete={this.onDelete}
              onToggleArchive={this.onToggleArchive}
            />
          </main>
        </>
      case 'note':
        return <>
          <Header />
          <>Baca Catatan</>
        </>
      default:
        return <>404 Page not Found</>
    }
  };
}

export default App;