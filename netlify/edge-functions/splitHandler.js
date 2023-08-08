import { determineSplit } from '../../determineSplit.js';

export default async function(request, context) {
  try {
    return await determineSplit(request, context);
  } catch (err) {
    return new Response(err.message || 'Internal Server Error', {
      status: err.status || 500,
    });
  }
};
