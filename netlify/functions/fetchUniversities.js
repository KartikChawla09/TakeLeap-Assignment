const fetch = require("node-fetch");

exports.handler = async (event, context) => {
  const query = event.queryStringParameters.name;

  if (!query) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Missing 'name' query parameter" }),
    };
  }

  const url = `http://universities.hipolabs.com/search?name=${query}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to fetch data" }),
    };
  }
};
