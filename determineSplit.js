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

export async function determineSplit(request, context) {
  const testName = 'bar';
  const url = new URL(request.url);
  const path = url.pathname;

  const testUrls = [
    {
      item: 'https://breathesans.com',
      weight: 3 / 10,
    },
    {
      item: 'https://breathesans.com/products/sans-for-all-rooms',
      weight: 3 / 10,
    },
    {
      item: 'https://breathesans.com/pages/purifier',
      weight: 3 / 10,
    },
  ];

  // Look for existing cookie
  const bucketName = `splitly-test_${testName}`;
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
}
