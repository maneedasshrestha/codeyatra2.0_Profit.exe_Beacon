// Resource interfaces and mock data for ResourcesPage

export interface Resource {
  id: number;
  title: string;
  subject: string;
  type: string;
  author: string;
  semester: string;
  size: string;
  course: string;
  fileUrl?: string;
}

export const COURSES = ["All", "Engineering", "BIT", "BCA", "MCA", "Physics"];
export const SEMESTERS = [
  "All",
  "1st",
  "2nd",
  "3rd",
  "4th",
  "5th",
  "6th",
  "7th",
  "8th",
];
export const TYPES = ["All", "Notes", "Past Papers", "Lab Report", "Cheatsheet"];

export const SEED: Resource[] = [
  {
    id: 1,
    title: "Data Structures & Algorithms",
    subject: "DSA",
    type: "Notes",
    author: "Aman Joshi",
    semester: "3rd",
    size: "2.4 MB",
    course: "Engineering",
  },
  {
    id: 2,
    title: "Engineering Mathematics II",
    subject: "Math",
    type: "Past Papers",
    author: "Priya Thapa",
    semester: "2nd",
    size: "1.1 MB",
    course: "Engineering",
  },
  {
    id: 3,
    title: "Digital Logic Lab Manual",
    subject: "DLC",
    type: "Lab Report",
    author: "Rohan KC",
    semester: "2nd",
    size: "800 KB",
    course: "Engineering",
  },
  {
    id: 4,
    title: "Computer Architecture Notes",
    subject: "CA",
    type: "Notes",
    author: "Sita Rai",
    semester: "4th",
    size: "3.2 MB",
    course: "BIT",
  },
  {
    id: 5,
    title: "C Programming Cheatsheet",
    subject: "C",
    type: "Cheatsheet",
    author: "Dev Sharma",
    semester: "1st",
    size: "420 KB",
    course: "BCA",
  },
  {
    id: 6,
    title: "Operating Systems Slides",
    subject: "OS",
    type: "Notes",
    author: "Nisha Lama",
    semester: "5th",
    size: "5.1 MB",
    course: "BIT",
  },
  {
    id: 7,
    title: "Microprocessor Past Papers",
    subject: "MP",
    type: "Past Papers",
    author: "Bikash Pun",
    semester: "4th",
    size: "980 KB",
    course: "Engineering",
  },
];
