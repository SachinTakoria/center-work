import React from 'react'
import ExecutiveHeader from '../../Executive/components/ExecutiveHeader'
import CreateInvoice from '../../Executive/components/CreateInvoice'
import ReviewInvoices from '../../Executive/components/ReviewInvoices'

const ExecutiveInvoices = () => {
  return (
    <div>
      <ExecutiveHeader/>
      <CreateInvoice/>
      {/* <ReviewInvoices/> */}
    </div>
  )
}

export default ExecutiveInvoices
