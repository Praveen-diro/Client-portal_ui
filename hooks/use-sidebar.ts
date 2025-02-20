"use client"

import { useState, useCallback, useEffect } from "react"

export const useSidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const expand = useCallback(() => {
    setIsExpanded(true)
    setIsTransitioning(true)
  }, [])

  const collapse = useCallback(() => {
    setIsExpanded(false)
    setIsTransitioning(true)
  }, [])

  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => setIsTransitioning(false), 300) // Match this with your transition duration
      return () => clearTimeout(timer)
    }
  }, [isTransitioning])

  return { isExpanded, isTransitioning, expand, collapse }
}

