import { auditActions } from "_store"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"

export { Audit }

function Audit() {
  const dispatch = useDispatch()
  const users = useSelector((x) => x.audits.list)

  // Load data for the current page
  useEffect(() => {
    dispatch(auditActions.getAll())
  }, [dispatch])

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(5) // Adjust the number of items per page as needed

  // Calculate pagination range
  const indexOfLastItem = currentPage * itemsPerPage
  const indexOfFirstItem = indexOfLastItem - itemsPerPage
  const currentItems = users?.value?.slice(indexOfFirstItem, indexOfLastItem)

  // Total number of pages
  const totalPages =
    users?.value && itemsPerPage
      ? Math.ceil(users.value.length / itemsPerPage)
      : 0

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber)
  }
  return (
    <div>
      <h1>Audit</h1>
      <table className='table table-striped'>
        <thead>
          <tr>
            <th style={{ width: "30%" }}>Username</th>
            <th style={{ width: "30%" }}>Log In</th>
            <th style={{ width: "30%" }}>Log Out</th>
            <th style={{ width: "10%" }}>IP Address</th>
          </tr>
        </thead>
        <tbody>
          {currentItems?.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.loginTime}</td>
              <td>{user.LogOutTime}</td>
              <td>{user.clientIp}</td>
            </tr>
          ))}
          {users?.loading && (
            <tr>
              <td colSpan='4' className='text-center'>
                <span className='spinner-border spinner-border-lg align-center'></span>
              </td>
            </tr>
          )}
        </tbody>
      </table>
      <div className='pagination'>
        <ul className='pagination'>
          {[...Array(totalPages).keys()].map((number) => (
            <li
              key={number + 1}
              className={`page-item ${
                currentPage === number + 1 ? "active" : ""
              }`}
            >
              <button
                onClick={() => paginate(number + 1)}
                className='page-link'
              >
                {number + 1}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
