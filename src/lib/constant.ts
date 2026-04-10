const categoriesConstants = [
    { id: 1, name: "Fiction", href: "/categories/fiction" },
    { id: 2, name: "Non-Fiction", href: "/categories/non-fiction" },
    { id: 3, name: "Children & Young Adult", href: "/categories/children" },
    { id: 4, name: "Science & Technology", href: "/categories/science" },
    { id: 5, name: "Art & Literature", href: "/categories/art" },
];


export const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3000";