import fetch from "node-fetch";
export async function handler(event, context) {
  const { name } = event.queryStringParameters;

  try {
    const response = await fetch(
      `http://universities.hipolabs.com/search?name=${name}`
    );
    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({
          error: "Error fetching data from universities API",
        }),
      };
    }

    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal Server Error" }),
    };
  }
}
