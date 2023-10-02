import React from 'react';
import { getInitialData } from './utils/index';
import Home from './page/home/Home';
import Note from './page/Note';

// Toasters
import Toasters from './components/Toasters';
import ToasterAdded from './components/toaster/ToasterAdded';
import ToasterEdited from './components/toaster/ToasterEdited';
import ToasterDeleted from './components/toaster/ToasterDeleted';
import ToasterArchived from './components/toaster/ToasterArchived';
import ToasterRestored from './components/toaster/ToasterRestored';
import Loading from './components/Loading';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      notes: getInitialData(),
      charsLeft: 50,
      currentPage: '', // '' | note
      toasters: [],
      showing: 'notes', // notes | archives
      isLoading: false,
    }

    // others
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
    this.getNoteById = this.getNoteById.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.addToaster = this.addToaster.bind(this);

    // page navigation
    this.navigateTo = this.navigateTo.bind(this);
    this.renderLoading = this.renderLoading.bind(this);
    this.getCurrentPage = this.getCurrentPage.bind(this);
    this.setCurrentPage = this.setCurrentPage.bind(this);
    this.handlePopState = this.handlePopState.bind(this);

    // home component
    this.homeNavigateTo = this.homeNavigateTo.bind(this);
  }

  renderLoading(func, ms) {
    this.setState({ isLoading: true });
    setTimeout(() => {
      this.setState({ isLoading: false });

      if (func) {
        func();
      }
    }, ms ? ms : 750);
  }

  addToaster(type) {
    const id = crypto.randomUUID();
    let toaster = null;

    if (type === 'add') {
      toaster = <ToasterAdded id={id} />;
    } else if (type === 'edit') {
      toaster = <ToasterEdited id={id} />;
    } else if (type === 'archive') {
      toaster = <ToasterArchived id={id} />;
    } else if (type === 'restore') {
      toaster = <ToasterRestored id={id} />;
    } else if (type === 'delete') {
      toaster = <ToasterDeleted id={id} />;
    } else {
      //
    }

    const data = {
      id: id,
      element: toaster
    }

    this.setState((prevStates) => {
      return {
        toasters: [
          ...prevStates.toasters,
          data,
        ]
      };
    });

    setTimeout(() => {
      const copy = this.state.toasters;
      const filtered = copy.filter((toaster) => toaster.id !== id);

      this.setState({
        toasters: filtered,
      });
    }, 2000);
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

    this.addToaster('add');
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

    this.addToaster('edit');
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

    this.addToaster('delete');

    console.log(`Note with id of ${id} deleted`)
  }

  homeNavigateTo(page) {
    this.setState({
      showing: page,
    });
  }

  render() {
    return (
      <>
        {this.state.isLoading && (
          <div>
            <Loading />
          </div>
        )}
        <Toasters toasters={this.state.toasters} />
        {this.state.currentPage === '' && (
          <Home
            notes={this.state.notes}
            showing={this.state.showing}
            onDelete={this.handleDelete}
            addToaster={this.addToaster}
            navigateTo={this.navigateTo}
            renderLoading={this.renderLoading}
            homeNavigateTo={this.homeNavigateTo}
          />
        )}
        {this.state.currentPage === 'note' && (
          <Note
            note={this.state.viewingNote}
            navigateTo={this.navigateTo}
            getNoteById={this.getNoteById}
            handleSubmit={this.handleSubmit}
            handleUpdate={this.handleUpdate}
            renderLoading={this.renderLoading}
            homeNavigateTo={this.homeNavigateTo}
          />
        )}
        {!['', 'note'].includes(this.state.currentPage) && (
          <>404 Page not Found</>
        )}
      </>
    )
  };
}

export default App;