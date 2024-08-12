import { createFileRoute } from "@tanstack/react-router";
import AuthorPage from "../../components/author-page";
import { queryClient } from "../../main";
import { authorQueryOptions } from "../../../lib/api";
import { useSuspenseQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/authors/$authorId")({
  loader: async ({ params: { authorId } }) => {
    return queryClient.ensureQueryData(
      authorQueryOptions(`https://patronite.pl/${authorId}`)
    );
  },
  errorComponent: errorComponent,
  component: AuthorComponent,
});

function errorComponent() {
  return <div>Author not found</div>;
}

function AuthorComponent() {
  const { authorId } = Route.useParams();
  const { data } = useSuspenseQuery(
    authorQueryOptions(`https://patronite.pl/${authorId}`)
  );
  return <AuthorPage id={authorId} data={data} />;
}
