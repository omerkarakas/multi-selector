import { useEffect, useRef, useState } from "react";
import { Character } from "../types/schema";
import useDebounce from "../assets/hooks/useDebounce";
import Highlighter from "react-highlight-words";

function Char<T extends Character>({
  char,
  removeCharacter,
}: {
  char: T;
  removeCharacter: () => void;
}) {
  return (
    <div className="flex flex-nowrap gap-1 bg-slate-200 rounded-xl px-2 py-1 items-center">
      <span>{char.name}</span>
      <i
        className="fa-solid fa-xmark text-sm text-white bg-slate-400 rounded-md px-2 py-1 h-7 w-7 ml-2"
        onClick={removeCharacter}
      />
    </div>
  );
}

function CharWithImage<T extends Character>({
  char,
  selected,
  toggleCharacter,
  searchTerm,
}: {
  char: T;
  selected: boolean;
  toggleCharacter: () => void;
  searchTerm?: string;
}) {
  return (
    <div
      className="flex flex-nowrap text-base gap-3 border-b last:border-b-0 border-slate-400 p-2 items-center "
      onClick={toggleCharacter}
    >
      <input type="checkbox" checked={selected} className="w-4 h-4" />
      <img
        src={char.image}
        alt={char.name}
        width={40}
        height={40}
        className="rounded-xl"
      />
      <div className="flex flex-col justify-start items-start">
        <Highlighter
          highlightClassName="highlighted"
          searchWords={[searchTerm || ""]}
          autoEscape={true}
          textToHighlight={char.name}
        />
        <span className="text-sm">{char.episode.length + " Episodes"} </span>
      </div>
    </div>
  );
}

function MultiSelect<T extends Character>() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [showResults, setShowResults] = useState(false);

  const [characters, setCharacters] = useState<T[]>([]);
  const [filteredCharacters, setFilteredCharacters] = useState<T[]>([]);

  const [selectedCharacters, setSelectedCharacters] = useState<T[]>([]);

  useEffect(() => {
    async function getData() {
      const list = [];
      let data;
      let nextUrl = "https://rickandmortyapi.com/api/character";
      do {
        // console.log("API call : " + nextUrl);
        const response = await fetch(nextUrl);
        data = await response.json();
        list.push(...data.results);
        nextUrl = data.info.next;
      } while (nextUrl);
      setCharacters(list);
      // console.log("chars:", list);
    }

    getData();
  }, []);

  useEffect(() => {
    setFilteredCharacters(
      characters.filter((char) =>
        char.name.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]);

  useDebounce(
    () => {
      setShowResults(!!searchTerm);
    },
    200,
    [searchTerm]
  );

  return (
    <div className="flex flex-col items-stretch ">
      <div
        onClick={() => inputRef?.current?.focus()}
        className="flex flex-row justify-between items-start  rounded-xl border border-slate-600 text-slate-800 p-2 my-2 shadow-md"
      >
        <div className="flex flex-wrap gap-2 ">
          {selectedCharacters.map((d, i) => (
            <Char
              char={d}
              key={i}
              removeCharacter={() => {
                setSelectedCharacters(
                  selectedCharacters.filter((char) => char !== d)
                );
              }}
            />
          ))}
          <input
            type="text"
            className="border-none focus:outline-none w-20 h-10"
            ref={inputRef}
            onChange={(e) => {
              console.log("e:", e.target.value);
              setSearchTerm(e.target.value);

              // setShowResults(!!e.target.value);
            }}
          />
        </div>
        <div className="h-10 w-10 flex items-center justify-center">
          <i
            className="fa-solid fa-caret-down"
            onClick={() => setShowResults((r) => !r)}
          ></i>
        </div>
      </div>

      {showResults && filteredCharacters.length > 0 && (
        <div className="relative">
          <div className="border-2 border-slate-400 rounded-xl absolute z-10 top-2 max-h-96 overflow-y-scroll w-full">
            {filteredCharacters.map((filteredCharacter, index) => {
              return (
                <CharWithImage
                  char={filteredCharacter}
                  key={index}
                  toggleCharacter={() => {
                    if (selectedCharacters.includes(filteredCharacter)) {
                      setSelectedCharacters(
                        selectedCharacters.filter(
                          (char) => char !== filteredCharacter
                        )
                      );
                    } else {
                      setSelectedCharacters([
                        ...selectedCharacters,
                        filteredCharacter,
                      ]);
                    }
                  }}
                  selected={selectedCharacters.includes(filteredCharacter)}
                  searchTerm={searchTerm}
                />
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default MultiSelect;
