function weightedRandom(options) {
  var i;
  var weights = [options[0].weight];

  for (i = 1; i < options.length; i++) {
    weights[i] = options[i].weight + weights[i - 1];
  }

  var random = Math.random() * weights[weights.length - 1];

  for (i = 0; i < weights.length; i++) if (weights[i] > random) break;

  return options[i];
}

async function fetchSplitTest(path) {
  const apiBase = Netlify.env.get('API_BASE_URL');
  const apiToken = Netlify.env.get('EDGE_AUTH_TOKEN');
  const accountSecret = Netlify.env.get('ACCOUNT_SECRET_TOKEN');
  
  const splitTestReq = await fetch(
    `${apiBase}/api/v0/split_tests?path=${path}`,
    {
      headers: {
        'API-Token': apiToken,
        'Account-Secret': accountSecret,
      },
    }
  );
  const splitTest = await splitTestReq.json();
  console.log(splitTest)
  return splitTest
}

export async function determineSplit(request, context) {
  const url = new URL(request.url);
  const path = url.pathname;
  const testPath = path.replace(/^\/+/g, '');

  // Look for existing cookie
  const bucketName = `splitly-test_${testPath}`;
  const bucket = context.cookies.get(bucketName);

  // return here if we find a cookie
  if (bucket) {
    // const bucketUrl = new URL(bucket);
    // const bucketPath = bucketUrl.pathname;
    // console.log('BUCKET PATH: ', bucketPath);
    // console.log('REQUEST HOST: ', url.hostname);
    // console.log('REQUEST PATH: ', path);
    // let content;
    // if (path === `/${testName}`) {
    //   content = await fetch(bucket);
    // } else {
    //   content = await fetch(`https://${bucketUrl.hostname}${path}`);
    // }

    return Response.redirect(bucket);
    // return new Response(content.body, content);
  }

  const splitTest = await fetchSplitTest(testPath);

  if (splitTest.id) {
    const testUrls = splitTest.candidates.map((candidate) => {
      return {
        item: candidate.url,
        weight: candidate.weight / 100,
      };
    });

    console.log(testUrls)

    // If no cookie is found, assign the user to a bucket
    const option = weightedRandom(testUrls);
    const urlToFetch = option.item;

    // const content = await fetch(urlToFetch);

    // Set the new cookie
    context.cookies.set({
      name: bucketName,
      value: urlToFetch,
    });

    return Response.redirect(urlToFetch);
    // return new Response(content.body, content);
  } else {
    return new Response('Nothing to see here.')
  }
}
