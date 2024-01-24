export type ErrCallbackType = (err: { [key: string]: string }) => void

export type LoginParams = {
  email: string
  password: string
  rememberMe?: boolean
}

export type UserDataType = {
  id: number
  role: string
  email: string
  fullName: string
  username: string
  password: string
  avatar?: string | null
}

export type newUserRegisters = {
  rangeType: string
  fromClientId: string
  from?: string
  to?: string
  resultCount?: number
  source?: string
}

export type getUsers = {
  fromClientId: string
  from?: string
  to?: string
  resultCount?: number
  source?: string
  verified?: boolean
  rangeType?: string
}

export type AuthValuesType = {
  loading: boolean
  logout: () => void
  user: UserDataType | null
  setLoading: (value: boolean) => void
  setUser: (value: UserDataType | null) => void
  login: (params: LoginParams, errorCallback?: ErrCallbackType) => void
  getNewRegisteredUsers: (params: newUserRegisters) => Promise<any>
  getUsers: (params: getUsers) => Promise<any>
  getActiveUsers: (params: getUsers) => Promise<any>
}
