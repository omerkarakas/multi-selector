import { useEffect, useState } from "react";
import "./App.css";
import MultiSelect from "./components/MultiSelect";
import { Character } from "./lib/schema";

const API_URL = "https://rickandmortyapi.com/api/character";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFetching, setIsFetching] = useState(true);

  const [characters, setCharacters] = useState<Character[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading) return;
    async function getData() {
      const list: Character[] = [];
      let data;
      let nextUrl = API_URL;

      try {
        do {
          const response = await fetch(nextUrl);
          data = await response.json();
          list.push(...data.results);
          nextUrl = data.info.next;
        } while (nextUrl);
        setErrorMessage("");
      } catch (error: unknown) {
        if (error instanceof Error) {
          setErrorMessage(error.message);
        }
      }

      setCharacters(list);
    }
    setIsFetching(true);
    getData();
    setIsFetching(false);
  }, [isLoading]);

  if (isLoading || isFetching) return <div>Loading...</div>;

  return (
    <div className="flex flex-col gap-6 p-8 max-w-[600px]">
      <h1 className="text-3xl">Rick And Morthy, MultiSelect Component Demo</h1>
      {errorMessage ? (
        <div>{errorMessage}</div>
      ) : (
        <>
          {characters.length === 0 ? (
            <>
              <div>Loading...</div>
            </>
          ) : (
            <div className="flex flex-col gap-1">
              <MultiSelect characters={characters} />
              {errorMessage && <div>{errorMessage}</div>}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
