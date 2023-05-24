import { handleRequest } from 'my-framework';
import staticFiles from '@static-manifest';

export const handler = async (request, { next }) => {
  // Handle static files

  const { pathname } = new URL(request.url);

  // If your framework generates client assets in a subdirectory, you can add these too
  if (staticFiles.includes(pathname) || pathname.startsWith('assets/')) {
    return;
  }

  // "handleRequest" is defined by your framework
  try {
    return await handleRequest(request);
  } catch (err) {
    return new Response(err.message || 'Internal Server Error', {
      status: err.status || 500,
    });
  }
};
