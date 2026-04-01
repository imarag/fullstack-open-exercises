import { Input } from '@/components/ui/input'
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field'
import { Button } from '@/components/ui/button'

export default function CreateBlogForm({ handleAddNewBlog }) {
  return (
    <div>
      <form
        className="flex flex-col items-stretch gap-2"
        onSubmit={handleAddNewBlog}
      >
        <Field>
          <FieldLabel htmlFor="title">Title</FieldLabel>
          <Input
            id="title"
            type="text"
            name="title"
            placeholder="Enter a title"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="author">Author</FieldLabel>
          <Input
            id="author"
            type="text"
            name="author"
            placeholder="Enter an author"
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="url">URL</FieldLabel>
          <Input id="url" type="text" name="url" placeholder="Enter an url" />
        </Field>
        <div className="my-4">
          <Button variant="outline">Create</Button>
        </div>
      </form>
    </div>
  )
}
