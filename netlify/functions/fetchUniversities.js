// netlify/functions/fetchUniversities.js

const fetch = require("node-fetch");

exports.handler = async (event, context) => {
  const query = event.queryStringParameters.name;

  try {
    const response = await fetch(
      `http://universities.hipolabs.com/search?name=${query}`
    );
    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: "Network response was not ok" }),
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
      body: JSON.stringify({ error: "Error fetching data" }),
    };
  }
};
