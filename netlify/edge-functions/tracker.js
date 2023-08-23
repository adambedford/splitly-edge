export default async function(request, context) {
  const content = await fetch(
    'https://unpkg.com/splitly-tracker/dist/sp-tr.umd.js'
  );

  return new Response(content.body, content);
}
