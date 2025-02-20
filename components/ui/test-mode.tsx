"use client"

import { Settings } from "lucide-react"
import { Button } from "@/components/ui/button"

export function TestMode() {
  return (
    <Button variant="outline" className="w-full justify-center gap-2">
      <Settings className="h-4 w-4" />
      Test mode
    </Button>
  )
}

