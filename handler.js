import { determineSplit } from './determineSplit.js';

export const handler = async (request, context) => {
  // Handle static files

  const { pathname } = new URL(request.url);

  // "handleRequest" is defined by your framework
  try {
    return await determineSplit(request, context);
  } catch (err) {
    return new Response(err.message || 'Internal Server Error', {
      status: err.status || 500,
    });
  }
};
