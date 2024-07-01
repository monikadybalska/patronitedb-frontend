import { createFileRoute } from "@tanstack/react-router";
import AuthorPage from "../../components/author-page";

export const Route = createFileRoute("/authors/$authorId")({
  component: AuthorComponent,
});

function AuthorComponent() {
  const { authorId } = Route.useParams();
  return <AuthorPage id={authorId} />;
}
