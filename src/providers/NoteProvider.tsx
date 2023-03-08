import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useMemo,
  useReducer,
  useEffect,
} from 'react'
import { v4 as uuidv4 } from 'uuid'
import { LOCAL_STORAGE_NOTES_KEY, LOCAL_STORAGE_TAGS_KEY } from '../consts/note'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { ActionMap } from '../types/ActionMap'

export type Tag = {
  id: string
  label: string
}

// Using Object instead map to make it localStorage friendly
export type TagMap = {
  [id: string]: string
}

export type RawNoteData = {
  title: string
  markdown: string
  tagIds: string[]
}

export type RawNote = RawNoteData & {
  id: string
}

type NoteState = {
  notes: RawNote[]
  tags: TagMap
}

export enum NoteActionType {
  CREATE_NOTE = 'CREATE_NOTE',
  CREATE_TAG = 'CREATE_TAG',
  SET_TAGS = 'SET_TAGS',
  SET_NOTES = 'SET_NOTES',
  SET_NOTES_WITH_TAGS = 'SET_NOTES_WITH_TAGS',
  UPDATE_NOTE = 'UPDATE_NOTE',
  DELETE_NOTE = 'DELETE_NOTE',
  UPDATE_TAG = 'UPDATE_TAG',
  DELETE_TAG = 'DELETE_TAG',
}

export type NoteActionPayload = {
  [NoteActionType.CREATE_NOTE]: {
    note: RawNoteData
  }
  [NoteActionType.CREATE_TAG]: {
    tag: Tag
  }
  [NoteActionType.SET_TAGS]: {
    tags: TagMap
  }
  [NoteActionType.SET_NOTES]: {
    notes: RawNote[]
  }
  [NoteActionType.UPDATE_NOTE]: {
    id: string
    note: RawNoteData
  }
  [NoteActionType.DELETE_NOTE]: {
    id: string
  }
  [NoteActionType.UPDATE_TAG]: {
    id: string
    label: string
  }
  [NoteActionType.DELETE_TAG]: {
    id: string
  }
}

type NoteAction =
  ActionMap<NoteActionPayload>[keyof ActionMap<NoteActionPayload>]

const initialState: NoteState = {
  notes: [],
  tags: {},
}

const noteReducer = (state: NoteState, action: NoteAction): NoteState => {
  switch (action.type) {
    case NoteActionType.CREATE_NOTE:
      const { note } = action.payload
      const newRowNote = {
        ...note,
        id: uuidv4(),
      }
      return {
        ...state,
        notes: [...state.notes, newRowNote],
      }
    case NoteActionType.CREATE_TAG:
      const { tag } = action.payload
      return {
        ...state,
        tags: { ...state.tags, [tag.id]: tag.label },
      }
    case NoteActionType.SET_TAGS:
      const { tags } = action.payload
      return {
        ...state,
        tags,
      }
    case NoteActionType.SET_NOTES:
      const { notes } = action.payload
      return {
        ...state,
        notes,
      }
    case NoteActionType.UPDATE_NOTE: {
      const { id, note } = action.payload
      return {
        ...state,
        notes: state.notes.map((oldNote) => {
          if (oldNote.id === id) {
            return { ...note, id }
          }
          return oldNote
        }),
      }
    }
    case NoteActionType.DELETE_NOTE:
      const { id } = action.payload
      return {
        ...state,
        notes: state.notes.filter((note) => note.id !== id),
      }
    case NoteActionType.UPDATE_TAG: {
      const { id, label } = action.payload
      return {
        ...state,
        tags: {
          ...state.tags,
          [id]: label,
        },
      }
    }
    case NoteActionType.DELETE_TAG: {
      const { id } = action.payload
      const { [id]: remove, ...rest } = state.tags
      return {
        ...state,
        tags: rest,
      }
    }
    default:
      return state
  }
}

interface NoteContextProps {
  state: NoteState
  dispatch: Dispatch<NoteAction>
}

const NoteContext = createContext<NoteContextProps>({
  state: initialState,
  dispatch: () => null,
})

const NoteProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(noteReducer, initialState)
  const contextValue = useMemo(() => ({ state, dispatch }), [state, dispatch])

  const [notes, setNotes] = useLocalStorage<RawNote[]>(
    LOCAL_STORAGE_NOTES_KEY,
    [],
  )
  const [tags, setTags] = useLocalStorage<TagMap>(LOCAL_STORAGE_TAGS_KEY, {})

  // init notes and tags on initial load
  useEffect(() => {
    dispatch({
      type: NoteActionType.SET_TAGS,
      payload: { tags },
    })
    dispatch({
      type: NoteActionType.SET_NOTES,
      payload: { notes },
    })
  }, [])

  // Update tags in localStorage
  useEffect(() => {
    setTags(state.tags)
  }, [state.tags])

  // Update notes in localStorage
  useEffect(() => {
    setNotes(state.notes)
  }, [state.notes])

  return (
    <NoteContext.Provider value={contextValue}>{children}</NoteContext.Provider>
  )
}

export default NoteProvider

export const useNoteContext = () => useContext(NoteContext)
