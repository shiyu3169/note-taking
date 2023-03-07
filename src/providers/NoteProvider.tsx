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

export type NoteData = {
  title: string
  markdown: string
  tags: Tag[]
}

export type Note = NoteData & {
  id: string
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
  tags: Tag[]
}

export enum NoteActionType {
  CREATE_NOTE = 'CREATE_NOTE',
  CREATE_TAG = 'CREATE_TAG',
  SET_TAGS = 'SET_TAGS',
}

export type NoteActionPayload = {
  [NoteActionType.CREATE_NOTE]: {
    note: NoteData
  }
  [NoteActionType.CREATE_TAG]: {
    tag: Tag
  }
  [NoteActionType.SET_TAGS]: {
    tags: Tag[]
  }
}

type NoteAction =
  ActionMap<NoteActionPayload>[keyof ActionMap<NoteActionPayload>]

const initialState: NoteState = {
  notes: [],
  tags: [],
}

const noteReducer = (state: NoteState, action: NoteAction): NoteState => {
  switch (action.type) {
    case NoteActionType.CREATE_NOTE:
      const { note } = action.payload
      const newRowNote = {
        ...note,
        tagIds: note.tags.map((tag) => tag.id),
        tags: undefined,
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
        tags: [...state.tags, tag],
      }
    case NoteActionType.SET_TAGS:
      const { tags } = action.payload
      return {
        ...state,
        tags,
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

  const [, setNotes] = useLocalStorage<RawNote[]>(LOCAL_STORAGE_NOTES_KEY, [])
  const [tags, setTags] = useLocalStorage<Tag[]>(LOCAL_STORAGE_TAGS_KEY, [])

  // TODO: find a better way to connect state with localStorage
  useEffect(() => {
    if (state.tags.length) {
      setTags(state.tags)
    } else {
      dispatch({
        type: NoteActionType.SET_TAGS,
        payload: { tags },
      })
    }
  }, [state.tags])

  // TODO: find a better way to connect state with localStorage
  useEffect(() => {
    if (state.notes.length) {
      setNotes(state.notes)
    }
  }, [state.notes])

  return (
    <NoteContext.Provider value={contextValue}>{children}</NoteContext.Provider>
  )
}

export default NoteProvider

export const useNoteContext = () => useContext(NoteContext)
