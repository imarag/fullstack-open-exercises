import { useState } from 'react'
import { Button } from '@/components/ui/button'

export default function Toggable({ buttonLabel = 'show', children }) {
  const [showContent, setShowContent] = useState(false)
  return (
    <div>
      {showContent ? (
        <>
          <div>{children}</div>
          <Button onClick={() => setShowContent(false)} variant="destructive">
            Cancel
          </Button>
        </>
      ) : (
        <Button onClick={() => setShowContent(true)} variant="outline">
          {buttonLabel}
        </Button>
      )}
    </div>
  )
}
