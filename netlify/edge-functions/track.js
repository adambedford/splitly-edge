function paramsToObject(entries) {
  const result = {};
  for (const [key, value] of entries) {
    result[key] = value;
  }
  return result;
}

export default async function (request, content) {
  const apiBase = Netlify.env.get('API_BASE_URL') || 'http://localhost:3001';
  const apiToken = Netlify.env.get('EDGE_AUTH_TOKEN');
  const accountSecret = Netlify.env.get('ACCOUNT_SECRET_TOKEN');

  const requestUrl = new URL(request.url);
  const queryParams = paramsToObject(requestUrl.searchParams);
  const name = queryParams.name
  delete queryParams.name


  const body = {
    visit_token: queryParams.svid,
    visitor_token: queryParams.svtid,
    events: [
      {
        name,
        properties: queryParams,
      },
    ],
  };

  const response = await fetch(`${apiBase}/api/v0/events`, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
      'API-Token': apiToken,
      'Account-Secret': accountSecret,
    },
  });

  return new Response(request, {
    statusCode: 200,
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 's-maxage=86400',
    },
    body: 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==',
    isBase64Encoded: true,
  });
}
