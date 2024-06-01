import { useRef, useState } from "react";
import { Character } from "../lib/schema";
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
      <button
        onClick={removeCharacter}
        className="px-2 py-1 h-7 w-7 rounded-md text-sm text-white bg-slate-400"
      >
        <i className="fa-solid fa-xmark  " />
      </button>
    </div>
  );
}

function CharWithImage<T extends Character>({
  char,
  selected,
  toggleCharacter,
  searchTerm,
  className,
}: {
  char: T;
  selected: boolean;
  toggleCharacter: () => void;
  searchTerm?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-nowrap text-base gap-3 border-b last:border-b-0 border-slate-400 p-2 items-center ${className}`}
      onClick={toggleCharacter}
    >
      <input type="checkbox" checked={selected} readOnly className="w-4 h-4" />
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

function MultiSelect<T extends Character>({ characters }: { characters: T[] }) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isFetching, setIsFetching] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [showResults, setShowResults] = useState(false);

  const [filteredCharacters, setFilteredCharacters] = useState<T[]>([]);

  const [selectedCharacters, setSelectedCharacters] = useState<T[]>([]);

  const [cursor, setCursor] = useState(0);

  useDebounce(
    () => {
      setIsFetching(true);
      setFilteredCharacters(
        characters.filter((char) =>
          char.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setIsFetching(false);
      setCursor(0);

      setShowResults(!!searchTerm);
    },
    100,
    [searchTerm]
  );

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    const { key } = e;
    console.log("cursor:", cursor);

    if (key === "ArrowUp" && cursor > 0) {
      setCursor((c) => c - 1);
    } else if (key === "ArrowDown") {
      setFilteredCharacters(
        characters.filter((char) =>
          char.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setShowResults(true);
      if (cursor < filteredCharacters.length - 1) setCursor((c) => c + 1);
    } else if (key === "Tab" || key === "Escape") {
      setShowResults(false);
      setSearchTerm("");
    } else if (
      key === "Enter" &&
      cursor <= filteredCharacters.length - 1 &&
      cursor >= 0
    ) {
      if (selectedCharacters.includes(filteredCharacters[cursor])) {
        setSelectedCharacters(
          selectedCharacters.filter(
            (char) => char !== filteredCharacters[cursor]
          )
        );
      } else {
        setSelectedCharacters([
          ...selectedCharacters,
          filteredCharacters[cursor],
        ]);
      }
    }
  }

  if (isFetching || characters.length === 0) {
    return (
      <div className="flex flex-col items-stretch ">
        <div className="flex flex-row justify-between items-start rounded-xl border border-slate-600 text-slate-800 p-2 my-2 shadow-md">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-stretch ">
      <div
        onClick={() => inputRef?.current?.focus()}
        className="flex flex-row justify-between items-start rounded-xl border border-slate-600 text-slate-800 p-2 my-2 shadow-md"
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
            onKeyDown={handleKeyDown}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
          />
        </div>
        <div className="h-10 w-10 flex items-center justify-center">
          <i
            className="fa-solid fa-caret-down"
            onClick={() => {
              setFilteredCharacters(
                characters.filter((char) =>
                  char.name.toLowerCase().includes(searchTerm.toLowerCase())
                )
              );
              setShowResults((r) => !r);
            }}
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
                  className={
                    cursor === index ? "active scroll-mt-4" : undefined
                  }
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
