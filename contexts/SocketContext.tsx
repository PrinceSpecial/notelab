"use client"

import { createContext, useContext, ReactNode } from 'react'
import { useSocket } from '@/hooks/useSocket'

type SocketContextType = {
  isConnected: boolean
  emit: (eventName: string, data: any) => void
  on: (eventName: string, callback: (data: any) => void) => void
  off: (eventName: string) => void
}

const SocketContext = createContext<SocketContextType | undefined>(undefined)

export function SocketProvider({ children }: { children: ReactNode }) {
  const socket = useSocket()

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}

export function useSocketContext() {
  const context = useContext(SocketContext)
  if (context === undefined) {
    throw new Error('useSocketContext must be used within a SocketProvider')
  }
  return context
} 