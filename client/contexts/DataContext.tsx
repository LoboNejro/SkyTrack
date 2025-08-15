import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";

export interface Class {
  id: string;
  ownerUID: string;
  name: string;
  color: string;
  createdAt: Date;
}

export interface Task {
  id: string;
  ownerUID: string;
  classID: string;
  title: string;
  description: string;
  dueDate: Date;
  status: "pending" | "completed";
  createdAt: Date;
}

export interface Note {
  id: string;
  ownerUID: string;
  classID: string;
  title: string;
  content: string;
  attachments: string[];
  createdAt: Date;
}

export interface Contact {
  id: string;
  ownerUID: string;
  name: string;
  type: "friend" | "teacher" | "other";
  email: string;
  phone: string;
  createdAt: Date;
}

export interface Event {
  id: string;
  ownerUID: string;
  title: string;
  description: string;
  date: Date;
  createdAt: Date;
}

interface DataContextType {
  classes: Class[];
  tasks: Task[];
  notes: Note[];
  contacts: Contact[];
  events: Event[];
  addClass: (classData: Omit<Class, "id" | "ownerUID" | "createdAt">) => void;
  updateClass: (id: string, updates: Partial<Class>) => void;
  removeClass: (id: string) => void;
  addTask: (taskData: Omit<Task, "id" | "ownerUID" | "createdAt">) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  removeTask: (id: string) => void;
  addNote: (noteData: Omit<Note, "id" | "ownerUID" | "createdAt">) => void;
  updateNote: (id: string, updates: Partial<Note>) => void;
  removeNote: (id: string) => void;
  addContact: (
    contactData: Omit<Contact, "id" | "ownerUID" | "createdAt">,
  ) => void;
  updateContact: (id: string, updates: Partial<Contact>) => void;
  removeContact: (id: string) => void;
  addEvent: (eventData: Omit<Event, "id" | "ownerUID" | "createdAt">) => void;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  removeEvent: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error("useData must be used within a DataProvider");
  }
  return context;
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [classes, setClasses] = useState<Class[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  // Load user data when user changes
  useEffect(() => {
    if (user) {
      loadUserData(user.uid);
    } else {
      clearData();
    }
  }, [user]);

  const loadUserData = (uid: string) => {
    // Load data from localStorage for this user
    const userClasses = JSON.parse(
      localStorage.getItem(`skytrack_classes_${uid}`) || "[]",
    );
    const userTasks = JSON.parse(
      localStorage.getItem(`skytrack_tasks_${uid}`) || "[]",
    );
    const userNotes = JSON.parse(
      localStorage.getItem(`skytrack_notes_${uid}`) || "[]",
    );
    const userContacts = JSON.parse(
      localStorage.getItem(`skytrack_contacts_${uid}`) || "[]",
    );
    const userEvents = JSON.parse(
      localStorage.getItem(`skytrack_events_${uid}`) || "[]",
    );

    setClasses(
      userClasses.map((c: any) => ({
        ...c,
        createdAt: new Date(c.createdAt),
        dueDate: c.dueDate ? new Date(c.dueDate) : undefined,
      })),
    );
    setTasks(
      userTasks.map((t: any) => ({
        ...t,
        createdAt: new Date(t.createdAt),
        dueDate: new Date(t.dueDate),
      })),
    );
    setNotes(
      userNotes.map((n: any) => ({ ...n, createdAt: new Date(n.createdAt) })),
    );
    setContacts(
      userContacts.map((c: any) => ({
        ...c,
        createdAt: new Date(c.createdAt),
      })),
    );
    setEvents(
      userEvents.map((e: any) => ({
        ...e,
        createdAt: new Date(e.createdAt),
        date: new Date(e.date),
      })),
    );
  };

  const clearData = () => {
    setClasses([]);
    setTasks([]);
    setNotes([]);
    setContacts([]);
    setEvents([]);
  };

  const saveData = (type: string, data: any[]) => {
    if (user) {
      localStorage.setItem(
        `skytrack_${type}_${user.uid}`,
        JSON.stringify(data),
      );
    }
  };

  const addClass = (
    classData: Omit<Class, "id" | "ownerUID" | "createdAt">,
  ) => {
    if (!user) return;

    const newClass: Class = {
      ...classData,
      id: Math.random().toString(36).substr(2, 9),
      ownerUID: user.uid,
      createdAt: new Date(),
    };

    const updatedClasses = [...classes, newClass];
    setClasses(updatedClasses);
    saveData("classes", updatedClasses);
  };

  const updateClass = (id: string, updates: Partial<Class>) => {
    const updatedClasses = classes.map((c) =>
      c.id === id ? { ...c, ...updates } : c,
    );
    setClasses(updatedClasses);
    saveData("classes", updatedClasses);
  };

  const removeClass = (id: string) => {
    const updatedClasses = classes.filter((c) => c.id !== id);
    setClasses(updatedClasses);
    saveData("classes", updatedClasses);
  };

  const addTask = (taskData: Omit<Task, "id" | "ownerUID" | "createdAt">) => {
    if (!user) return;

    const newTask: Task = {
      ...taskData,
      id: Math.random().toString(36).substr(2, 9),
      ownerUID: user.uid,
      createdAt: new Date(),
    };

    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    saveData("tasks", updatedTasks);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    const updatedTasks = tasks.map((t) =>
      t.id === id ? { ...t, ...updates } : t,
    );
    setTasks(updatedTasks);
    saveData("tasks", updatedTasks);
  };

  const removeTask = (id: string) => {
    const updatedTasks = tasks.filter((t) => t.id !== id);
    setTasks(updatedTasks);
    saveData("tasks", updatedTasks);
  };

  // Similar functions for notes, contacts, and events
  const addNote = (noteData: Omit<Note, "id" | "ownerUID" | "createdAt">) => {
    if (!user) return;

    const newNote: Note = {
      ...noteData,
      id: Math.random().toString(36).substr(2, 9),
      ownerUID: user.uid,
      createdAt: new Date(),
    };

    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    saveData("notes", updatedNotes);
  };

  const updateNote = (id: string, updates: Partial<Note>) => {
    const updatedNotes = notes.map((n) =>
      n.id === id ? { ...n, ...updates } : n,
    );
    setNotes(updatedNotes);
    saveData("notes", updatedNotes);
  };

  const removeNote = (id: string) => {
    const updatedNotes = notes.filter((n) => n.id !== id);
    setNotes(updatedNotes);
    saveData("notes", updatedNotes);
  };

  const addContact = (
    contactData: Omit<Contact, "id" | "ownerUID" | "createdAt">,
  ) => {
    if (!user) return;

    const newContact: Contact = {
      ...contactData,
      id: Math.random().toString(36).substr(2, 9),
      ownerUID: user.uid,
      createdAt: new Date(),
    };

    const updatedContacts = [...contacts, newContact];
    setContacts(updatedContacts);
    saveData("contacts", updatedContacts);
  };

  const updateContact = (id: string, updates: Partial<Contact>) => {
    const updatedContacts = contacts.map((c) =>
      c.id === id ? { ...c, ...updates } : c,
    );
    setContacts(updatedContacts);
    saveData("contacts", updatedContacts);
  };

  const removeContact = (id: string) => {
    const updatedContacts = contacts.filter((c) => c.id !== id);
    setContacts(updatedContacts);
    saveData("contacts", updatedContacts);
  };

  const addEvent = (
    eventData: Omit<Event, "id" | "ownerUID" | "createdAt">,
  ) => {
    if (!user) return;

    const newEvent: Event = {
      ...eventData,
      id: Math.random().toString(36).substr(2, 9),
      ownerUID: user.uid,
      createdAt: new Date(),
    };

    const updatedEvents = [...events, newEvent];
    setEvents(updatedEvents);
    saveData("events", updatedEvents);
  };

  const updateEvent = (id: string, updates: Partial<Event>) => {
    const updatedEvents = events.map((e) =>
      e.id === id ? { ...e, ...updates } : e,
    );
    setEvents(updatedEvents);
    saveData("events", updatedEvents);
  };

  const removeEvent = (id: string) => {
    const updatedEvents = events.filter((e) => e.id !== id);
    setEvents(updatedEvents);
    saveData("events", updatedEvents);
  };

  const value = {
    classes,
    tasks,
    notes,
    contacts,
    events,
    addClass,
    updateClass,
    removeClass,
    addTask,
    updateTask,
    removeTask,
    addNote,
    updateNote,
    removeNote,
    addContact,
    updateContact,
    removeContact,
    addEvent,
    updateEvent,
    removeEvent,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}
