import addArticle from "@/actions/addArticle";

export default function Home() {
  return (
    <div>
      <form action={addArticle}>
        <button type="submit">submit</button>
      </form>
    </div>
  );
}
