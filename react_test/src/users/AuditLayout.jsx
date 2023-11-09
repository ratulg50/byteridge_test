import { Routes, Route } from "react-router-dom"

import { Audit } from "."

export { AuditLayout }

function AuditLayout() {
  return (
    <div className='p-4'>
      <div className='container'>
        <Routes>
          <Route index element={<Audit />} />
        </Routes>
      </div>
    </div>
  )
}
