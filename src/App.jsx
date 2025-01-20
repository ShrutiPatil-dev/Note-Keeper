import React, { useState, useEffect } from 'react';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaRegNoteSticky } from "react-icons/fa6";
import { FaEdit } from "react-icons/fa";
import { MdOutlineDeleteForever } from "react-icons/md";

function App() {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [newContent, setNewContent] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');
  const [editingContent, setEditingContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');


  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem('notes'));
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, []);

 
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem('notes', JSON.stringify(notes));
    }
  }, [notes]);

  const AddNote = (e) => {
    e.preventDefault();

    if (newNote === '' || newContent === '') {
      toast.error('Both title and content are required!');
      setNewNote('');
      setNewContent('');
      return;
    }

    const newObj = {
      title: newNote,
      content: newContent,
      createdTime: new Date().toLocaleString(),
      color: getRandomColor(),
    };

    setNotes([...notes, newObj]);
    setNewNote('');
    setNewContent('');
    toast.success('Note added successfully');
  };

  const DeleteNote = (index) => {
    const deleteItem = [...notes];
    deleteItem.splice(index, 1);
    setNotes(deleteItem);
    toast.error('Note Deleted');
  };

  const EditNote = (index) => {
    setEditingIndex(index);
    setEditingTitle(notes[index].title);
    setEditingContent(notes[index].content);
  };

  const SavedNotes = (e) => {
    e.preventDefault();

    if (editingTitle === '' || editingContent === '') {
      toast.error('Both title and content are required to save!');
      return;
    }

    const updatedNotes = [...notes];
    updatedNotes[editingIndex] = {
      title: editingTitle,
      content: editingContent,
      createdTime: updatedNotes[editingIndex].createdTime,
      color: updatedNotes[editingIndex].color,
    };

    setNotes(updatedNotes);
    setEditingIndex(null);
    setEditingTitle('');
    setEditingContent('');
    toast.success('Note updated successfully');
  };

  const getRandomColor = () => {
    const colors = ['#8db5e1', '#ffb6c1', '#f2e593', '#b7e2b2'];
    const randomIndex = Math.floor(Math.random() * colors.length);
    return colors[randomIndex];
  };

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='App'>
      <h1>Note Keeper <FaRegNoteSticky /></h1>

      <form className='note-input' onSubmit={editingIndex !== null ? SavedNotes : AddNote}>
        <input
          type='text'
          placeholder={editingIndex !== null ? 'Edit Title...' : 'Title...'}
          value={editingIndex !== null ? editingTitle : newNote}
          onChange={(e) => editingIndex !== null ? setEditingTitle(e.target.value) : setNewNote(e.target.value)}
        />
        <textarea
          placeholder={editingIndex !== null ? 'Edit Content...' : 'Content...'}
          value={editingIndex !== null ? editingContent : newContent}
          onChange={(e) =>
            editingIndex !== null
              ? setEditingContent(e.target.value)
              : setNewContent(e.target.value)
          }
        />
        <button type="submit">{editingIndex !== null ? 'Save Changes' : 'Add Note'}</button>
      </form>

      <input
        type="text"
        placeholder="Search Notes..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />
      
      <div className="container">
        {filteredNotes.map((note, index) => (
          <div key={index} className="note-list" style={{ backgroundColor: note.color }}>
            <h3>{note.title}</h3>
            <p>{note.content}</p>
            <p className="created-time">
              <b>Created at:</b> {note.createdTime}
            </p>
            <button onClick={() => EditNote(index)} className="button edit-button">
              Edit <FaEdit className="icon" />
            </button>
            <button  onClick={() => DeleteNote(index)} className="button cancel-button">
              Delete <MdOutlineDeleteForever className="icon" />
            </button>
          </div>
        ))}
      </div>

      <ToastContainer />
    </div>
  );
}

export default App;
