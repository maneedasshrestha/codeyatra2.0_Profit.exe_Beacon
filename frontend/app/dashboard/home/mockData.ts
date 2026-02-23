export const FILTERS = [
  { label: "Pulchowk" },
  { label: "BCT" },
  { label: "Sem 1" },
  { label: "2080 Batch" },
];

export interface Post {
  id: number;
  userId?: string;
  community: string;
  author: string;
  authorInitials: string;
  avatarUrl?: string;
  isSenior: boolean;
  timeAgo: string;
  title: string;
  body: string;
  upvotes: number;
  comments: number;
  userVote: "up" | "down" | null;
  tags: string[];
  saved?: boolean;
}

export const POSTS_DATA: Post[] = [
  {
    id: 1,
    community: "c/2080-BCT",
    author: "Rajesh Shrestha",
    authorInitials: "RS",
    isSenior: true,
    timeAgo: "2 hrs ago",
    title: "How to survive Applied Mechanics + Past Papers",
    body: "Mechanics is tough but scoring is easy if you focus on the last 5 years' questions. I've attached my personal summary notes and the 2079 past paper. The key insight is that 60% of marks come from just 3 topic areas.",
    upvotes: 142,
    comments: 24,
    userVote: null,
    tags: ["Applied Mechanics", "Past Papers", "Tips"],
    saved: false,
  },
  {
    id: 2,
    community: "c/2080-BCT",
    author: "Anita Maharjan",
    authorInitials: "AM",
    isSenior: true,
    timeAgo: "5 hrs ago",
    title: "C Programming Lab 3 — Common Errors & How to Fix Them",
    body: "Make sure you free your pointers! 90% of the class lost marks on the memory leak question. Here is a quick strategy to debug and avoid this in future labs. Also covers dangling pointer pitfalls.",
    upvotes: 89,
    comments: 12,
    userVote: null,
    tags: ["C Programming", "Lab", "Debugging"],
    saved: false,
  },
];
