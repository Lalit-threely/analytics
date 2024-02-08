// ** React Imports
import { ReactNode, useState } from 'react'

// ** Next Import
import Link from 'next/link'

// ** MUI Components
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme } from '@mui/material/styles'
import OtpInput from 'react-otp-input'

// ** Custom Component Import
import CustomTextField from 'src/@core/components/mui/text-field'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

// ** Layout Import
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Demo Imports
import FooterIllustrationsV2 from 'src/views/pages/auth/FooterIllustrationsV2'
import toast from 'react-hot-toast'
import { useRouter } from 'next/router'

// ** Third Party Imports
import * as yup from 'yup'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { IconButton, InputAdornment } from '@mui/material'

// Styled Components
const ForgotPasswordIllustration = styled('img')(({ theme }) => ({
  zIndex: 2,
  maxHeight: 650,
  marginTop: theme.spacing(12),
  marginBottom: theme.spacing(12),
  [theme.breakpoints.down(1540)]: {
    maxHeight: 550
  },
  [theme.breakpoints.down('lg')]: {
    maxHeight: 500
  }
}))

const RightWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  width: '100%',
  [theme.breakpoints.up('md')]: {
    maxWidth: 450
  },
  [theme.breakpoints.up('lg')]: {
    maxWidth: 600
  },
  [theme.breakpoints.up('xl')]: {
    maxWidth: 750
  }
}))

const LinkStyled = styled(Link)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  justifyContent: 'center',
  color: theme.palette.primary.main,
  fontSize: theme.typography.body1.fontSize
}))

const ForgotPassword = () => {
  // ** Hooks
  const theme = useTheme()
  const auth = useAuth()
  const router = useRouter()

  const [otp, setOtp] = useState('')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)

  // ** Vars
  const hidden = useMediaQuery(theme.breakpoints.down('md'))
  const { email, from } = router.query

  console.log('email----------', email)

  const handleOtpChange = (otpValue: string) => {
    if (/^\d*$/.test(otpValue)) {
      setOtp(otpValue)
      // setError("");
      // setMessage("");
      // if (otpValue.length === 6 && (phone || email)) {
      //   verifyOtp(otpValue);
      // }
    }
  }
  const schema = yup.object().shape({
    confirmPassword: yup.string().email().required(),
    password: yup.string().min(5).required()
  })

  const {
    control,
    setError,
    // handleSubmit,
    getValues,
    formState: { errors }
  } = useForm({
    mode: 'onBlur',
    resolver: yupResolver(schema)
  })

  const handleSubmit = async () => {
    try {
      const { password, confirmPassword } = getValues()
      console.log('passs', password, confirmPassword)
      if (password !== confirmPassword) {
        toast.error('Passwords Not Matching!')
        return
      }
      if (otp.length < 6) {
        toast.error('Please Enter Valid OTP')
        return
      }
      const res = await auth.verifyOtp({ email, code: otp, password })
      toast.success(res?.message)
      //   router.push(`/verification?email=${email}`)
      // setShowOtp(true)
    } catch (err: any) {
      console.log('errrr', err)
      toast.error(err?.response?.data?.message || err?.response?.data?.error)
    }
  }

  return (
    <Box className='content-right' sx={{ backgroundColor: 'background.paper' }}>
      {!hidden ? (
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            position: 'relative',
            alignItems: 'center',
            borderRadius: '20px',
            justifyContent: 'center',
            backgroundColor: 'customColors.bodyBg',
            margin: theme => theme.spacing(8, 0, 8, 8)
          }}
        >
          <ForgotPasswordIllustration
            alt='forgot-password-illustration'
            src={`/images/pages/auth-v2-forgot-password-illustration-${theme.palette.mode}.png`}
          />
          <FooterIllustrationsV2 />
        </Box>
      ) : null}
      <RightWrapper>
        <Box
          sx={{
            p: [6, 12],
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Typography
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              '& svg': { mr: 1 }
            }}
          >
            <Typography sx={{ mb: 1.5, fontWeight: 500, fontSize: '1.625rem', lineHeight: 3.385 }}>
              Enter OTP 🔒
            </Typography>
            <OtpInput
              value={otp}
              onChange={handleOtpChange}
              numInputs={6}
              renderSeparator={<span> </span>}
              renderInput={props => <input {...props} />}
              // shouldAutoFocus={true}
              inputStyle={{
                // border: "none",
                borderRadius: '6px',
                margin: '8px',
                width: '27px',
                height: '27px',
                fontSize: '15px',
                color: 'white',
                fontWeight: '500',
                backgroundColor: 'transparent'
              }}
            />
            {from === 'resetPassword' && (
              <>
                <Box sx={{ mb: 4, mt: 6 }}>
                  <Controller
                    name='password'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                      //@ts-ignore
                      <CustomTextField
                        fullWidth
                        value={value}
                        onBlur={onBlur}
                        label='New Password'
                        onChange={onChange}
                        id='auth-login-v4-password'
                        error={Boolean(errors.password)}
                        {...(errors.password && { helperText: errors.password.message })}
                        type={showPassword ? 'text' : 'password'}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton
                                edge='end'
                                onMouseDown={e => e.preventDefault()}
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                <Icon fontSize='1.25rem' icon={showPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    )}
                  />
                </Box>
                <Box sx={{ mb: 1.5 }}>
                  <Controller
                    name='confirmPassword'
                    control={control}
                    rules={{ required: true }}
                    render={({ field: { value, onChange, onBlur } }) => (
                       //@ts-ignore
                      <CustomTextField
                        fullWidth
                        value={value}
                        onBlur={onBlur}
                        label='Confirm New Password'
                        onChange={onChange}
                        id='auth-login-v-password'
                        error={Boolean(errors.password)}
                        {...(errors.password && { helperText: errors.password.message })}
                        type={showConfirmPassword ? 'text' : 'password'}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position='end'>
                              <IconButton
                                edge='end'
                                onMouseDown={e => e.preventDefault()}
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              >
                                <Icon fontSize='1.25rem' icon={showConfirmPassword ? 'tabler:eye' : 'tabler:eye-off'} />
                              </IconButton>
                            </InputAdornment>
                          )
                        }}
                      />
                    )}
                  />
                </Box>
              </>
            )}
            <Button fullWidth type='submit' variant='contained' sx={{ mt: 6, mb: 4 }} onClick={handleSubmit}>
              Submit
            </Button>
            <Typography sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', '& svg': { mr: 1 } }}>
              <LinkStyled href='/login'>
                <Icon fontSize='1.25rem' icon='tabler:chevron-left' />
                <span>Back to login</span>
              </LinkStyled>
            </Typography>
          </Typography>
        </Box>
      </RightWrapper>
    </Box>
  )
}

ForgotPassword.getLayout = (page: ReactNode) => <BlankLayout>{page}</BlankLayout>

ForgotPassword.guestGuard = true

export default ForgotPassword
