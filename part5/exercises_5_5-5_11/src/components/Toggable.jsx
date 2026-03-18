import { useState } from 'react'

export default function Toggable({ buttonLabel = 'show', children }) {
  const [showContent, setShowContent] = useState(false)
  return (
    <div>
      {
        showContent ? (
          <>
            <div>{children}</div>
            <button onClick={() => setShowContent(false)}>cancel</button>
          </>
        ) : (
          <button onClick={() => setShowContent(true)}>{buttonLabel}</button>
        )
      }
    </div>
  )
}