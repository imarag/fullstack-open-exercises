import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoginForm({
  handleLogin,
  credentials,
  setCredentials,
}) {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Log in to application</h2>
      <form
        className="flex flex-col items-stretch gap-2 max-w-md"
        onSubmit={handleLogin}
      >
        <Field>
          <FieldLabel htmlFor="username">Username</FieldLabel>
          <Input
            id="username"
            type="text"
            name="username"
            placeholder="Enter a username"
            value={credentials.username}
            onChange={(e) =>
              setCredentials((prev) => ({
                ...prev,
                username: e.target.value,
              }))
            }
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <Input
            id="password"
            type="text"
            name="password"
            placeholder="Enter a password"
            value={credentials.password}
            onChange={(e) =>
              setCredentials((prev) => ({
                ...prev,
                password: e.target.value,
              }))
            }
          />
        </Field>
        <div>
          <Button variant="outline">Login</Button>
        </div>
      </form>
    </div>
  )
}
