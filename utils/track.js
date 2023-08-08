import generateToken from './generateToken.js';

export async function trackEvent({scid, svid, svtid, ...params}) {
  const apiBase = Netlify.env.get('API_BASE_URL');

  const body = {
    visit_token: svid,
    visitor_token: svtid,
    id: generateToken(),
    scid,
    ...params
  }
  const url = `${apiBase}/ahoy/events}`

  const request = await fetch(
    url,
    {
      method: 'POST',
      body: JSON.stringify({
        events: body
      }),
      headers: {
        'Content-Type': 'application/json',
        'Ahoy-Visit': svid,
        'Ahoy-Visitor': svtid,
      },
    }
  )

  if(request.status === 200) {
    return await request.json();
  } else {
    return await request.text()
  }
}

export async function trackVisit({scid, svid, svtid, ...params}) {
    const apiBase = Netlify.env.get('API_BASE_URL');

    const body = {
      visit_token: svid,
      visitor_token: svtid,
      id: generateToken(),
      scid,
      ...params,
    };

    const url = `${apiBase}/ahoy/visits`;

    const request = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
        'Ahoy-Visit': svid,
        'Ahoy-Visitor': svtid
      },
    });

    if (request.status === 200) {
      return await request.json();
    } else {
      return await request.text();
    }
}
