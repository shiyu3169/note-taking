import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useMemo,
  useReducer,
} from 'react'
import { ActionMap } from '../types/ActionMap'

type Tag = {
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

type NoteState = {
  Notes: Note[]
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
  Notes: [],
}

const noteReducer = (state: NoteState, action: NoteAction): NoteState => {
  switch (action.type) {
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
