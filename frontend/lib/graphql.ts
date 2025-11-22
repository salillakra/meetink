export async function graphqlRequest(query: string, variables?: Record<string, unknown>) {
  const GRAPHQL_URL = process.env.GRAPHQL_URL || "http://localhost:8000/graphql";

  const res = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`GraphQL request failed: ${res.status} ${text}`);
  }

  const json = await res.json();
  if (json.errors) {
    throw new Error(json.errors.map((e: { message: string }) => e.message).join(" | "));
  }
  return json.data;
}
