import React from 'react'
import ExecutiveHeader from '../../Executive/components/ExecutiveHeader'
import ExecutiveTransactionListComponent from '../../Executive/components/ExecutiveAddTransactionListComponent'

const ExecutiveTransactionList = () => {
  return (
    <div>
      <ExecutiveHeader/>
      <ExecutiveTransactionListComponent/>
    </div>
  )
}

export default ExecutiveTransactionList