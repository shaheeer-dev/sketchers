import { useEffect, useState } from 'react'
import { socket } from '@/socket'

const DEFAULT_COUNTDOWN_LIMIT_IN_SECONDS = 30

const Countdown = (props: { isCountdownStarted: boolean, roomId: string, countDownLimit?: number, onTimeUp?: () => void, currentPlayerId: number }) => {
  const { countDownLimit = DEFAULT_COUNTDOWN_LIMIT_IN_SECONDS, isCountdownStarted, roomId, onTimeUp, currentPlayerId } = props
  const [timeLeft, setTimeLeft] = useState(countDownLimit)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isCountdownStarted) {
      interval = setInterval(() => {
        setTimeLeft((prevTimeLeft) => {
          const remainingLeft = Math.max(prevTimeLeft - 1, 0)
          if (remainingLeft === 0) {
            socket.emit('time-up', { roomId, currentPlayerId })
            onTimeUp && onTimeUp()
          }
          socket.emit('time-left', { roomId, timeLeft: remainingLeft })
          return remainingLeft
        })
      }, 1000)
    }
    socket.on('remaining-time', handleRemainingTime)
    return () => {
      socket.off('remaining-time', handleRemainingTime)
      interval && clearInterval(interval)
    }
  })
  const handleRemainingTime = (timeLeft: number) => {
    setTimeLeft(timeLeft)
  }
  return (
    `${timeLeft}s`
  )
}

export default Countdown
