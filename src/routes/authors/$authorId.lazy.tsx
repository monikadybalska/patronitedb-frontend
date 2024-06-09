import { createFileRoute } from "@tanstack/react-router";
import Header from "../../components/header";

export const Route = createFileRoute("/authors/$authorId")({
  component: AuthorComponent,
});

function AuthorComponent() {
  const { authorId } = Route.useParams();
  return <Header title={authorId}></Header>;
}
