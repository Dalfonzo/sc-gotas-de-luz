import { ReactNode, createContext, useContext, useState } from 'react'

const DonateContext = createContext<DonateContextType | null>(null)

interface ReducerState {
  formToggle: boolean
  method?: MethodI
}

interface MethodI {
  name: string
  id: number
}

interface DonateContextType {
  state: ReducerState
  updateFormToggle: (action: DonateReducerActionKind) => void
  updateMethod: (method?: MethodI) => void
}

export enum DonateReducerActionKind {
  TOGGLE = 'toggle',
  OPEN = 'open',
  CLOSE = 'close',
}

interface ReducerAction {
  type: DonateReducerActionKind
}

export function DonateProvider({ children }: { children: ReactNode }) {
  const [donateState, setDonateState] = useState<ReducerState>(initialState)
  const updateFormToggle = (action: DonateReducerActionKind) =>
    setDonateState((prev) => donateReducer(prev, { type: action }))
  const updateMethod = (method?: MethodI) => {
    setDonateState((prev) => ({ ...prev, method: method }))
  }
  return (
    <DonateContext.Provider
      value={{ state: donateState, updateFormToggle: updateFormToggle, updateMethod: updateMethod }}
    >
      {children}
    </DonateContext.Provider>
  )
}

export function useDonate() {
  return useContext(DonateContext) as DonateContextType
}

function donateReducer(state: ReducerState, action: ReducerAction): ReducerState {
  switch (action.type) {
    case DonateReducerActionKind.TOGGLE:
      return {
        ...state,
        formToggle: !state.formToggle,
      }
    case DonateReducerActionKind.CLOSE:
      return {
        ...state,
        formToggle: false,
      }
    case DonateReducerActionKind.OPEN:
      return {
        ...state,
        formToggle: true,
      }
    default:
      throw new Error('Unsupported action')
  }
}

const initialState: ReducerState = {
  formToggle: false,
}
