export type ErrCallbackType = (err: { [key: string]: string }) => void

export type LoginParams = {
  email: string
  password: string
  rememberMe?: boolean
}

export type SignUpParams = {
  email: string
  password: string
  username: string
  companyName: string
}

export type ResetPasswordParams = {
  email: string
}

export type AdminOauth = {
  code: string
  scope: string
}

export type verifyOtpParams = {
  email: string | string[] | undefined
  code: string
  password: string
}

export type UserDataType = {
  id: number
  role: string
  email?: string
  fullName?: string
  username: string
  password?: string
  avatar?: string | null
}

export type newUserRegisters = {
  rangeType: string
  fromClientId: string
  from?: string
  to?: string
  resultCount?: number
  source?: string
  verified?: boolean
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

export type projectDetails = {
  projectName?: string
}

export type AuthValuesType = {
  baseURL: string
  loading: boolean
  logout: () => void
  clientId: string
  setClientId: (clientId: string) => void
  user: UserDataType | null
  setLoading: (value: boolean) => void
  setUser: (value: UserDataType | null) => void
  login: (params: LoginParams) => Promise<any>
  handleSignUp: (params: SignUpParams) => Promise<any>
  resetPassword: (params: ResetPasswordParams) => Promise<any>
  verifyOtp: (params: verifyOtpParams) => Promise<any>
  AdminOauth: (params: AdminOauth) => Promise<any>
  getNewRegisteredUsers: (params: newUserRegisters) => Promise<any>
  getUsers: (params: getUsers) => Promise<any>
  getActiveUsers: (params: getUsers) => Promise<any>
  getRegisteredOrVerifiedCount: (params: getUsers) => Promise<any>
  getGroupedDataOfCharts: (params: getUsers) => Promise<any>
  saveProjectDetails: (params: projectDetails) => Promise<any>
  getProjectsData: (params: projectDetails) => Promise<any>
}
