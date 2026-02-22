// Mock data for ThreadPage

export interface Comment {
  id: number;
  author: string;
  initials: string;
  gradient: string;
  isSenior: boolean;
  timeAgo: string;
  body: string;
  likes: number;
  liked: boolean;
}

export const COMMENTS_BY_POST: Record<number, Comment[]> = {
  1: [
    {
      id: 1,
      author: "Suman Karki",
      initials: "SK",
      gradient: "from-blue-400 to-cyan-500",
      isSenior: false,
      timeAgo: "1 hr ago",
      body: "This is gold! The 2079 past paper was exactly what I needed. Do you have the 2078 set as well?",
      likes: 18,
      liked: false,
    },
    {
      id: 2,
      author: "Priya Thapa",
      initials: "PT",
      gradient: "from-emerald-400 to-teal-500",
      isSenior: true,
      timeAgo: "45 min ago",
      body: "I'd also add — make sure to practice Free Body Diagrams daily. It's the foundation of everything in AM.",
      likes: 31,
      liked: false,
    },
    {
      id: 3,
      author: "Dev Adhikari",
      initials: "DA",
      gradient: "from-amber-400 to-orange-500",
      isSenior: false,
      timeAgo: "20 min ago",
      body: "Saved. Thanks Rajesh bhai! Will you be posting for Engineering Drawing too?",
      likes: 7,
      liked: false,
    },
  ],
  2: [
    {
      id: 1,
      author: "Bibek Rai",
      initials: "BR",
      gradient: "from-sky-400 to-blue-500",
      isSenior: false,
      timeAgo: "4 hrs ago",
      body: "The `free()` issue haunted me for an entire lab session. Wish I had seen this earlier!",
      likes: 22,
      liked: false,
    },
    {
      id: 2,
      author: "Sita Gurung",
      initials: "SG",
      gradient: "from-fuchsia-400 to-pink-500",
      isSenior: true,
      timeAgo: "3 hrs ago",
      body: "Also remember to check `valgrind` output — it'll tell you exactly where the leak is. Use `valgrind --leak-check=full ./your_program`.",
      likes: 44,
      liked: false,
    },
  ],
};
