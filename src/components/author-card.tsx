import { Author } from "../../lib/types";

export default function AuthorCard({ author }: { author: Author }) {
  return (
    <div>
      <img src={author.image_url} alt="" />
    </div>
  );
}
