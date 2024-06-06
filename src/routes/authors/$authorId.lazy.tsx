import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/authors/$authorId")({
  component: AuthorComponent,
});

function AuthorComponent() {
  const { authorId } = Route.useParams();
  return <div>Hello /authors/{authorId}!</div>;
}
