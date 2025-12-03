interface Params {
  id: Promise<string>;
}

export default async function Page({ params }: { params: Params }) {
  const { id } = await params;
  return <div>Project: {id}</div>;
}
