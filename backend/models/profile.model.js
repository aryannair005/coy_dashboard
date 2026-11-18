/**
 * @fileoverview Fictional profiles for the single-user Discover demo.
 */

const names = [
    "Aanya", "Rohan", "Meera", "Kabir", "Ishita", "Arjun",
    "Tara", "Dev", "Naina", "Vihaan", "Riya", "Aarav",
    "Diya", "Neil", "Kavya", "Aditya", "Mira", "Ishan",
    "Anika", "Dhruv", "Sana", "Yash", "Avni", "Rishi",
    "Nisha", "Karan", "Myra", "Jay", "Siya", "Vikram",
];

const cities = ["Mumbai", "Pune", "Bengaluru", "Delhi", "Kochi", "Jaipur"];
const details = [
    ["I plan weekends around good coffee and a long walk.", "Coffee", "Photography", "Walks"],
    ["Always happy to swap playlists and find a new place to eat.", "Music", "Street food", "Travel"],
    ["Happiest with a book, a window seat, and nowhere to be.", "Reading", "Film", "Trains"],
    ["I take board games seriously and my cooking less seriously.", "Board games", "Cooking", "Cycling"],
    ["Usually looking for a hill to climb or a gallery to get lost in.", "Hiking", "Art", "Design"],
    ["Currently learning to make a very good dosa.", "Cooking", "Running", "Podcasts"],
];

const profiles = names.map((name, index) => {
    const [bio, ...interests] = details[index % details.length];

    return {
        id: index + 1,
        name,
        age: 22 + index % 9,
        city: cities[(index + Math.floor(index / 6)) % cities.length],
        bio,
        interests,
        photo: `/portraits/${index + 1}.png`,
    };
});

const incomingLikes = new Set([1, 4, 7, 11, 16, 22, 28]);

module.exports = { profiles, incomingLikes };


