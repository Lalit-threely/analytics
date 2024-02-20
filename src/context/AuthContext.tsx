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
  verifyOtpParams,
  AdminOauth,
  projectDetails
} from './types'

// ** Defaults
const defaultProvider: AuthValuesType = {
  baseURL: '',
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
  AdminOauth: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  getNewRegisteredUsers: () => Promise.resolve(),
  getUsers: () => Promise.resolve(),
  getActiveUsers: () => Promise.resolve(),
  getRegisteredOrVerifiedCount: () => Promise.resolve(),
  getGroupedDataOfCharts: () => Promise.resolve(),
  saveProjectDetails: () => Promise.resolve(),
  getProjectsData: () => Promise.resolve(),
  deleteProject: () => Promise.resolve(),
  getProjectById: () => Promise.resolve()
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
  // const baseURL = 'https://staging.tria.so'

  // const [clientId, setClientId] = useState<string>('b48d8230-57f9-43fb-a952-722668bb3520')
  // const baseURL = 'https://prod.tria.so'
  const baseURL = 'http://localhost:8000'

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
        let parsedUser

        try {
          parsedUser = JSON.parse(userData)
          setUser(parsedUser)
        } catch (error) {
          // Handle the error, such as setting parsedUser to an empty object
          console.error('Error parsing user data:', error)
        }

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

  const storeToken = async (response: any) => {
    window.localStorage.setItem(authConfig.storageTokenKeyName, response.data?.token)
    const { id, token, username, verified } = response.data
    setUser({
      role: 'admin',
      id: id,
      username: username,
      password: ''
    })
    window.localStorage.setItem(
      'userData',
      JSON.stringify({
        role: 'admin',
        id: id,
        username: username,
        password: ''
      })
    )
    // window.close();
    // if (window.opener) {
    //   // Perform any necessary actions in the parent window/tab
    //   window.opener.postMessage({ type: 'oauth_success', token }, '*');
    // }
    router.replace('/dashboards/analytics')
  }

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
      const { token } = response.data
      if (!token) {
        return response?.data
      } else {
        storeToken(response)
      }

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
        storeToken(response)
      }
      return response.data
    } catch (err) {
      console.log('error', err)
      throw err
    }
  }

  const AdminOauth = async (params: AdminOauth) => {
    try {
      const response = await axios.get(
        `${baseURL}/api/v2/auth/admin/google/callback?code=${params?.code}&scope=${params?.scope}`
      )

      const { id, username, token } = response.data

      if (token) {
        storeToken(response)
      }

      // Handling the response data
      console.log('Response Data:', response)

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

  const saveProjectDetails = async (projectDetails: projectDetails) => {
    try {
      const token = window.localStorage.getItem('accessToken')

      const response = await axios.post(`${baseURL}/api/v2/auth/create-project`, projectDetails, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      console.log('Project details saved:', response.data)
      return response.data
    } catch (error) {
      console.error('Error saving project details:', error)
      throw error
    }
  }

  const getProjectsData = async () => {
    try {
      const apiUrl = `${baseURL}/api/v2/auth/get-projects`
      const token = window.localStorage.getItem('accessToken')

      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      console.log('Response Data:', response.data)

      return response.data
    } catch (error) {
      console.error('Error getting the projects data:', error)
      throw error
    }
  }

  const deleteProject = async (projectId: string) => {
    try {
      const apiUrl = `${baseURL}/api/v2/auth/delete-project/${projectId}`
      const token = window.localStorage.getItem('accessToken')

      const response = await axios.delete(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      console.log('Response Data:', response.data)

      return response.data
    } catch (error) {
      console.error('Error deleting the project:', error)
      throw error
    }
  }

  const getProjectById = async (projectId: string) => {
    try {
      const apiUrl = `${baseURL}/api/v2/auth/get-project/${projectId}`
      const token = window.localStorage.getItem('accessToken')

      const response = await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      console.log('Response Data:', response.data)

      return response.data
    } catch (error) {
      console.error('Error getting the project details:', error)
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
    AdminOauth,
    logout: handleLogout,
    getNewRegisteredUsers,
    getUsers,
    getActiveUsers,
    getRegisteredOrVerifiedCount,
    getGroupedDataOfCharts,
    saveProjectDetails,
    getProjectsData,
    deleteProject,
    getProjectById
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
