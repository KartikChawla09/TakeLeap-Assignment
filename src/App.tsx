import { useEffect, useState, ChangeEvent, useCallback } from "react";
import { TextField, Autocomplete, CircularProgress } from "@mui/material";
import debounce from "lodash/debounce";
import "./App.css";

interface University {
  alpha_two_code: string;
  web_pages: string[];
  name: string;
  domains: string[];
  country: string;
  state_province: string | null;
}

function App() {
  const [data, setData] = useState<University[] | null>(null);
  const [universityNames, setUniversityNames] = useState<string[]>([]);
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [URL, setURL] = useState<string>("");
  const [error, setError] = useState<string | null>(null); // State for storing error message
  const [collegeName, setCollegeName] = useState<string>("Choose a College!");

  // using useEffect to fetch data from the HipoLabs API whenever the query changes
  useEffect(() => {
    if (query.length > 0) {
      setLoading(true);
      fetch(`http://universities.hipolabs.com/search?name=${query}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data: University[]) => {
          setData(data);
          setUniversityNames(data.map((university) => university.name));
          setLoading(false);
          setError(null);
        })
        .catch((_error) => {
          setError("Error fetching data. Please try again later.");
          setLoading(false);
        });
    } else {
      setUniversityNames([]);
    }
  }, [query]);

  // Implemented useCallback for memoization and lodash for debouncing to prevent unnecessary API calls
  const handleChange = useCallback(
    debounce((event: ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
    }, 300),
    []
  );

  return (
    <div className="App">
      <div className="lines">
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>
      <h1>University Search</h1>
      {error && <p className="Error">Error: {error}</p>}{" "}
      {/* Display error message if error state is not null */}
      <div className="Search">
        <Autocomplete
          className="AutoBox"
          disablePortal
          id="combo-box-demo"
          options={universityNames.map((name, index) => ({ name, id: index }))}
          getOptionLabel={(option) => option.name}
          sx={{
            width: 300,
          }}
          onChange={(_event, value) => {
            // Extract the chosen college from the dropdown list
            console.log(value);
            setCollegeName(value?.name || "Choose a College!");
            var query;
            // Find the web page of the chosen college from the data fetched
            if (value)
              query = data?.find((university) => university.name === value.name)
                ?.web_pages[0];
            // set URL to the web page of the chosen college
            console.log(query);
            if (query) setURL("https://logo.clearbit.com/" + query);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="University Name"
              // Call the function handleChange when the input changes
              onChange={handleChange}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
        />
      </div>
      <h1 className="CollegeTag">{collegeName}</h1>
      <div className="CollegeLogo">
        {URL && (
          <img className="Logo" src={URL} alt="College logo not available" />
        )}
      </div>
    </div>
  );
}

export default App;
