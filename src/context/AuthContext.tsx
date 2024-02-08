// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from 'src/configs/auth'

// ** Types
import {
  AuthValuesType,
  LoginParams,
  ErrCallbackType,
  UserDataType,
  newUserRegisters,
  getUsers,
  SignUpParams,
  ResetPasswordParams,
  verifyOtpParams
} from './types'

// ** Defaults
const defaultProvider: AuthValuesType = {
  baseURL:"",
  user: null,
  loading: false,
  setUser: () => null,
  setLoading: () => Boolean,
  clientId: '',
  setClientId: () => String,
  login: () => Promise.resolve(),
  handleSignUp: () => Promise.resolve(),
  resetPassword: () => Promise.resolve(),
  verifyOtp: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  getNewRegisteredUsers: () => Promise.resolve(),
  getUsers: () => Promise.resolve(),
  getActiveUsers: () => Promise.resolve(),
  getRegisteredOrVerifiedCount: () => Promise.resolve(),
  getGroupedDataOfCharts: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  const [clientId, setClientId] = useState<string>('5180b8cc-57d7-4472-9916-21ab42e67108')
  const baseURL = 'https://staging.tria.so'

  // const [clientId, setClientId] = useState<string>('b48d8230-57f9-43fb-a952-722668bb3520')
  // const baseURL = 'https://prod.tria.so'
  // const baseURL = 'http://localhost:8000'

  // ** Hooks
  const router = useRouter()

  // useEffect(() => {
  // const initAuth = async (): Promise<void> => {
  // const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)!
  // if (storedToken) {
  // setLoading(true)
  // await axios
  // .get(authConfig.meEndpoint, {
  // headers: {
  // Authorization: storedToken
  // }
  //         })
  // .then(async response => {
  // setLoading(false)
  // console.log('response.data.userData', response.data.userData)
  // setUser({ ...response.data.userData })
  // })
  // .catch(() => {
  // localStorage.removeItem('userData')
  // localStorage.removeItem('refreshToken')
  // localStorage.removeItem('accessToken')
  // setUser(null)
  // setLoading(false)
  // if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
  // // router.replace('/login')
  // }
  //         })
  // } else {
  // setLoading(false)
  // }
  //     // setUser({
  // //   id: 1,
  // //   role: "",
  // //   email: "",
  // //   fullName: "",
  // //   username: "",
  // //   password: "",
  // // });
  // // setLoading(false)
  // // router.replace('/dashboard/home')
  // }

  // initAuth()
  // // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [])

  useEffect(() => {
    const initAuth = async (): Promise<void> => {
      const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)
      console.log('storedToken', storedToken)
      if (storedToken) {
        // setLoading(true)
        // await axios
        // .get(authConfig.meEndpoint, {
        // headers: {
        // Authorization: storedToken
        // }
        //         })
        // .then(async response => {
        // setLoading(false)
        const userData = localStorage.getItem('userData') || ''
        const parsedUser = JSON.parse(userData)
        console.log('response.data.userData', parsedUser)
        setUser(parsedUser)
        // })
        // .catch(() => {
        // localStorage.removeItem('userData')
        // localStorage.removeItem('refreshToken')
        // localStorage.removeItem('accessToken')
        // setUser(null)
        // setLoading(false)
        // if (authConfig.onTokenExpiration === 'logout' && !router.pathname.includes('login')) {
        // router.replace('/login')
        // }
        // })
      } else {
        setLoading(false)
      }
      // setUser({
      //   id: 1,
      //   role: "",
      //   email: "",
      //   fullName: "",
      //   username: "",
      //   password: "",
      // });
      // setLoading(false)
      // router.replace('/dashboard/home')
    }

    initAuth()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSignUp = async (params: SignUpParams) => {
    try {
      const apiUrl = `${baseURL}/api/v2/auth/admin/initiate`

      // Making the POST request using Axios
      const response = await axios.post(apiUrl, params)

      // Handling the response data
      console.log('Response Data:', response.data)

      // You can return the response data or perform other actions based on your requirements
      return response.data
    } catch (err) {
      console.log('error', err)
      throw err
    }
  }

  const handleLogin = async (params: LoginParams) => {
    try {
      const apiUrl = `${baseURL}/api/v2/auth/admin/sign-in`

      // Making the POST request using Axios
      const response = await axios.post(apiUrl, params)
      console.log('verified', response.data)
      const { email, token, username, verified } = response.data
      if (!verified) {
        return response.data
      }

      params.rememberMe ? window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.token) : null

      setUser({
        id: 1,
        role: 'admin',
        email: email,
        fullName: '',
        username: '',
        password: ''
      })
      params.rememberMe
        ? window.localStorage.setItem(
            'userData',
            JSON.stringify({
              id: 1,
              role: 'admin',
              fullName: '',
              username: username,
              email: email
            })
          )
        : null
      router.replace('/dashboards/analytics')
      // Handling the response data
      console.log('Response Data:', response.data)

      // You can return the response data or perform other actions based on your requirements
      return response.data
    } catch (err) {
      console.log('error', err)
      throw err
    }
  }
  const resetPassword = async (params: ResetPasswordParams) => {
    try {
      const apiUrl = `${baseURL}/api/v2/auth/admin/reset-password`

      // Making the POST request using Axios
      const response = await axios.post(apiUrl, params)

      // Handling the response data
      console.log('Response Data:', response)

      // You can return the response data or perform other actions based on your requirements
      return response.data
    } catch (err) {
      console.log('error', err)
      throw err
    }
  }

  const verifyOtp = async (params: verifyOtpParams) => {
    try {
      const apiUrl = `${baseURL}/api/v2/auth/admin/verify-otp`

      // Making the POST request using Axios
      const response = await axios.post(apiUrl, params)
      const { email, token, username } = response.data
      // Handling the response data
      console.log('Response Data:', response)

      if (token) {
        window.localStorage.setItem(authConfig.storageTokenKeyName, token)
        setUser({
          id: 1,
          role: 'admin',
          email: email,
          fullName: '',
          username: '',
          password: ''
        })

        window.localStorage.setItem(
          'userData',
          JSON.stringify({
            id: 1,
            role: 'admin',
            fullName: '',
            username: username,
            email: email
          })
        )
        router.replace('/dashboards/analytics')
      }
      // You can return the response data or perform other actions based on your requirements
      return response.data
    } catch (err) {
      console.log('error', err)
      throw err
    }
  }
  // axios
  //   .post(authConfig.loginEndpoint, params)
  //   .then(async response => {
  //     params.rememberMe
  //       ? window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.accessToken)
  //       : null
  //     const returnUrl = router.query.returnUrl

  //     setUser({ ...response.data.userData })
  //     params.rememberMe
  //       ? window.localStorage.setItem(
  //           'userData',
  //           JSON.stringify({
  //             id: 1,
  //             role: 'admin',
  //             fullName: 'John Doe',
  //             username: 'johndoe',
  //             email: 'admin@vuexy.com'
  //           })
  //         )
  //       : null

  //     const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'

  //     router.replace(redirectURL as string)
  //   })

  //   .catch(err => {
  //     if (errorCallback) errorCallback(err)
  //   })

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem('userData')
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/login')
  }

  const getNewRegisteredUsers = async (params: newUserRegisters) => {
    try {
      // Replace 'API_URL' with your actual API endpoint
      const apiUrl = `${baseURL}/api/v2/analtyics/getUserCountsInAPeriodController`

      // Making the POST request using Axios
      const response = await axios.post(apiUrl, params)

      // Handling the response data
      console.log('Response Data:', response.data)

      // You can return the response data or perform other actions based on your requirements
      return response.data
    } catch (error) {
      // Handling errors
      console.error('Error making POST request:', error)

      // You can throw the error or handle it in another way based on your requirements
      // throw error;
    }
  }

  const getUsers = async (params: getUsers) => {
    try {
      // Replace 'API_URL' with your actual API endpoint
      const apiUrl = `${baseURL}/api/v2/analtyics/getUsers`

      // Making the POST request using Axios
      const response = await axios.post(apiUrl, params)

      // Handling the response data
      console.log('Response Data:', response.data)

      // You can return the response data or perform other actions based on your requirements
      return response.data
    } catch (error) {
      // Handling errors
      console.error('Error making POST request:', error)

      // You can throw the error or handle it in another way based on your requirements
      throw error
    }
  }

  const getActiveUsers = async (params: getUsers) => {
    try {
      // Replace 'API_URL' with your actual API endpoint
      const apiUrl = `${baseURL}/api/v2/analtyics/getActiveUsersCount`

      // Making the POST request using Axios
      const response = await axios.post(apiUrl, params)

      // Handling the response data
      console.log('Response Data:', response.data)

      // You can return the response data or perform other actions based on your requirements
      return response.data
    } catch (error) {
      // Handling errors
      console.error('Error making POST request:', error)

      // You can throw the error or handle it in another way based on your requirements
      throw error
    }
  }

  const getRegisteredOrVerifiedCount = async (params: getUsers) => {
    try {
      // Replace 'API_URL' with your actual API endpoint
      const apiUrl = `${baseURL}/api/v2/analtyics/getRegisteredOrVerifiedCount`

      // Making the POST request using Axios
      const response = await axios.post(apiUrl, params)

      // Handling the response data
      console.log('Response Data:', response.data)

      // You can return the response data or perform other actions based on your requirements
      return response.data.data
    } catch (error) {
      // Handling errors
      console.error('Error making POST request:', error)

      // You can throw the error or handle it in another way based on your requirements
      throw error
    }
  }

  const getGroupedDataOfCharts = async (params: getUsers) => {
    try {
      // Replace 'API_URL' with your actual API endpoint
      const apiUrl = `${baseURL}/api/v2/analtyics/groupUsersByPlatform`

      // Making the POST request using Axios
      const response = await axios.post(apiUrl, params)

      // Handling the response data
      console.log('Response Data:', response.data)

      // You can return the response data or perform other actions based on your requirements
      return response.data.data
    } catch (error) {
      // Handling errors
      console.error('Error making POST request:', error)

      // You can throw the error or handle it in another way based on your requirements
      throw error
    }
  }

  const values = {
    baseURL,
    user,
    loading,
    setUser,
    setLoading,
    clientId,
    setClientId,
    login: handleLogin,
    handleSignUp,
    resetPassword,
    verifyOtp,
    logout: handleLogout,
    getNewRegisteredUsers,
    getUsers,
    getActiveUsers,
    getRegisteredOrVerifiedCount,
    getGroupedDataOfCharts
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
