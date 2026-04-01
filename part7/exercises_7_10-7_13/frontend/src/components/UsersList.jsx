import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'

export default function UsersList() {
  const users = useSelector((state) => state.users)
  const usersWithBlogs = users.filter((user) => user.blogs.length > 0)

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Users</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            <TableHead>blogs created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {usersWithBlogs.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <Link className="underline" to={`/users/${user.id}`}>
                  {user.name}
                </Link>
              </TableCell>
              <TableCell>{user.blogs.length}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
