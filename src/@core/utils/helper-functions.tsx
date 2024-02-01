function getCurrentTime(date: Date): string {
  const currentDate = date

  const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: 'numeric', hour12: true }

  const formattedTime: string = currentDate.toLocaleTimeString('en-US', timeOptions)

  return formattedTime
}

export { getCurrentTime }
