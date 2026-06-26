export const apiFetch = async (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  // Safe wrapper around native fetch
  try {
    const response = await fetch(input, init);
    // You can also add global error handling, auth headers, etc. here
    return response;
  } catch (error) {
    console.error('API Fetch Error:', error);
    throw error;
  }
};
