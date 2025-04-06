"use client"

import { useEffect, useRef, useState } from 'react'
import io, { Socket } from 'socket.io-client'

export function useSocket() {
  const [isConnected, setIsConnected] = useState(false)
  const socketRef = useRef<Socket | null>(null)

  useEffect(() => {
    // Create socket connection
    const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:4000')

    // Save socket in ref
    socketRef.current = socket

    // Connection event handlers
    socket.on('connect', () => {
      console.log('✅ Connected to Socket.IO server')
      setIsConnected(true)
    })

    socket.on('disconnect', () => {
      console.log('❌ Disconnected from Socket.IO server')
      setIsConnected(false)
    })

    // Cleanup on unmount
    return () => {
      socket.disconnect()
    }
  }, [])

  const emit = (eventName: string, data: any) => {
    if (socketRef.current) {
      socketRef.current.emit(eventName, data)
    }
  }

  const on = (eventName: string, callback: (data: any) => void) => {
    if (socketRef.current) {
      socketRef.current.on(eventName, callback)
    }
  }

  const off = (eventName: string) => {
    if (socketRef.current) {
      socketRef.current.off(eventName)
    }
  }

  return {
    isConnected,
    emit,
    on,
    off,
  }
} 