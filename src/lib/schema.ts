export type Character = {
  id: number;
  name: string;
  image: string;
  episode: string[];
};

export const characters: Character[] = [
  {
    id: 1,
    name: "Rick Sanchez",
    image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
    episode: [
      "https://rickandmortyapi.com/api/episode/1",
      "https://rickandmortyapi.com/api/episode/2",
      "https://rickandmortyapi.com/api/episode/3",
    ],
  },
  // {
  //   id: 8,
  //   name: "Adjudicator Rick",
  //   image: "https://rickandmortyapi.com/api/character/avatar/8.jpeg",
  //   episode: ["https://rickandmortyapi.com/api/episode/28"],
  // },
  {
    id: 22,
    name: "Aqua Rick",
    image: "https://rickandmortyapi.com/api/character/avatar/22.jpeg",
    episode: [
      "https://rickandmortyapi.com/api/episode/22",
      "https://rickandmortyapi.com/api/episode/28",
    ],
  },
];
