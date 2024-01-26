// // ** React Imports
// import { createContext, useEffect, useState, ReactNode } from 'react'

// // ** Next Import
// // import { useRouter } from 'next/router'

// // ** Axios
// import axios from 'axios'

// // ** Config
// import authConfig from 'src/configs/auth'

// // ** Types
// import { AuthValuesType, LoginParams, ErrCallbackType, UserDataType } from './types'

// // ** Defaults
// const defaultProvider: AuthValuesType = {
//   user: null,
//   loading: true,
//   setUser: () => null,
//   setLoading: () => Boolean,
//   login: () => Promise.resolve(),
//   logout: () => Promise.resolve()
// }

// const AuthContext = createContext(defaultProvider)

// type Props = {
//   children: ReactNode
// }

// const AnalyticsProvider = ({ children }: Props) => {
//   // ** States
//   const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
//   const [loading, setLoading] = useState<boolean>(defaultProvider.loading)



//   const values = {


//   return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
// }

// export { AuthContext, AnalyticsProvider }
