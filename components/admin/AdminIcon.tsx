import React from 'react'

/**
 * Custom Icon component for Payload CMS Admin panel.
 * Displayed when the navigation sidebar is collapsed into compact mode.
 * Uses square brand icon so it stays legible in small dimensions.
 */
export const AdminIcon = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <img
        src="/apple-touch-icon.png"
        alt="Snava Creative"
        style={{
          height: '28px',
          width: '28px',
          objectFit: 'contain',
        }}
      />
    </div>
  )
}

export default AdminIcon
