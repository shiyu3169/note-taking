import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useMemo,
  useReducer,
} from 'react'
import { v4 as uuidv4 } from 'uuid'
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
  tags: string[]
}

export enum NoteActionType {
  CREATE_NOTE = 'CREATE_NOTE',
}

export type NoteActionPayload = {
  [NoteActionType.CREATE_NOTE]: {
    note: NoteData
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
      const newNote = action.payload.note
      const newRowNote = {
        ...newNote,
        tagIds: newNote.tags.map((tag) => tag.id),
        tags: undefined,
        id: uuidv4(),
      }
      return {
        ...state,
        notes: [...state.notes, newRowNote],
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
  return (
    <NoteContext.Provider value={contextValue}>{children}</NoteContext.Provider>
  )
}

export default NoteProvider

export const useNoteContext = () => useContext(NoteContext)
