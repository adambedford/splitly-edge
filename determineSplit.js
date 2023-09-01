import generateToken from './utils/generateToken.js';
import paramsToObject from './utils/paramsToObject.js';
import {trackEvent, trackVisit} from './utils/track.js';
import weightedRandom from './utils/weightedRandom.js';
import psl from 'psl'

async function fetchSplitTest(path) {
  const apiBase = Netlify.env.get('API_BASE_URL') || 'http://localhost:3001';
  const apiToken = Netlify.env.get('EDGE_AUTH_TOKEN');
  const accountSecret = Netlify.env.get('ACCOUNT_SECRET_TOKEN');
  const siteUrl = Netlify.env.get('SITE_URL');
  
  const splitTestReq = await fetch(
    `${apiBase}/api/v0/split_tests?path=${path}&site_url=${siteUrl}`,
    {
      headers: {
        'API-Token': apiToken,
        'Account-Secret': accountSecret,
      },
    }
  );
  const splitTest = await splitTestReq.json();
  return splitTest
}

function cookieExpiry(days) {
    let date = new Date();
    const expiresDays = date.setDate(date.getDate() + days);
    return expiresDays * 1000;
}

function getOrSetCookie(context, name, value) {
  let existing = context.cookies.get(name)
  const siteUrl = Netlify.env.get('SITE_URL')
  const parsed = psl.parse(siteUrl)
  const domain = parsed.domain

  if(!existing) {
    existing = value
    const expires = cookieExpiry(365)

    context.cookies.set({
      name,
      value,
      expires,
      domain: `.${domain}`,
      sameSite: 'lax'
    }) 
  }
  return existing
}

export async function determineSplit(request, context) {
  const requestUrl = new URL(request.url);
  const path = requestUrl.pathname;
  const testPath = path.replace(/^\/+/g, '');

  // Look for existing cookie
  const bucketName = `splitly-test_${testPath}`;
  const bucket = context.cookies.get(bucketName);

  const queryParams = requestUrl.searchParams

  // return here if we find a cookie
  if (bucket) {
    // const bucketUrl = new URL(bucket);
    // const bucketPath = bucketUrl.pathname;
    // console.log('BUCKET PATH: ', bucketPath);
    // console.log('REQUEST HOST: ', requestUrl.hostname);
    // console.log('REQUEST PATH: ', path);
    // let content;
    // if (path === `/${testName}`) {
    //   content = await fetch(bucket);
    // } else {
    //   content = await fetch(`https://${bucketUrl.hostname}${path}`);
    // }

    // const scid = context.cookies.get('splitly-scid');
    // // const scid = (existingSuid || generateToken())
    // if(!scid) {
    //   context.cookies.set({
    //     name: 'splitly-scid',
    //     value: generateToken(),
    //   });
    // }

    const scid = getOrSetCookie(context, 'splitly-scid', generateToken())
    
    let targetUrl = new URL(bucket);
    targetUrl.searchParams.append('scid', scid);
    
    const svtid = getOrSetCookie(context, 'splitly-svtid', generateToken());
    targetUrl.searchParams.append('svtid', svtid); 
    
    const svid = generateToken()
    targetUrl.searchParams.append('svid', svid);

    await trackVisit({
      scid,
      svid,
      svtid,
      landing_page: requestUrl,
      ...paramsToObject(queryParams)
    });

    return Response.redirect(targetUrl);
    // return new Response(content.body, content);
  }

  const splitTest = await fetchSplitTest(testPath);

  if (splitTest.id) {
    const testUrls = splitTest.candidates.map((candidate) => {
      return {
        item: candidate,
        weight: candidate.weight / 100,
      };
    });

    // If no cookie is found, assign the user to a bucket
    const option = weightedRandom(testUrls);
    const urlToFetch = option.item.url;
    let targetUrl = new URL(urlToFetch);

    // const content = await fetch(urlToFetch);

    // Set the new cookie
    context.cookies.set({
      name: bucketName,
      value: urlToFetch,
      expires: cookieExpiry(30)
    });

    const scid = option.item.uuid;

    context.cookies.set({
      name: 'splitly-scid',
      value: scid,
      expires: cookieExpiry(30)
    })
    targetUrl.searchParams.append('scid', scid);
    
    const svtid = getOrSetCookie(context, 'splitly-svtid', generateToken());
    targetUrl.searchParams.append('svtid', svtid); 
  
    const svid = generateToken();
    targetUrl.searchParams.append('svid', svid);

    // scid = Candidate UUID
    // svid = Ahoy Visit Token
    // svtid = Ahoy Visitor Token
    await trackVisit({
      scid,
      svid,
      svtid,
      landing_page: requestUrl,
      ...paramsToObject(queryParams),
    });

    return Response.redirect(targetUrl);
    // return new Response(content.body, content);
  } else {
    return new Response('Nothing to see here.')
  }
}
