import React from 'react'

/**
 * Custom Logo component for Payload CMS Admin panel.
 * Displayed on Login/Auth pages and at the top of the opened navigation sidebar.
 * Uses logo-white.png (rectangular aspect ratio) with constrained height.
 */
export const AdminLogo = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', padding: '4px 0' }}>
      <img
        src="/assets/logo-white.png"
        alt="Snava Creative Admin"
        style={{
          maxHeight: '96px',
          width: 'auto',
          objectFit: 'contain',
        }}
      />
    </div>
  )
}

export default AdminLogo
