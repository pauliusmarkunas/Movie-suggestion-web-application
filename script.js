"use strict";
// HTML code:
const htmlSubcategory = `<ul class="nested-list">
<li id='latest'>Latest</li>
<li id='favourite'>Favourite</li>
<li id='soon'>Coming soon</li>
</ul>`;

const genresArr = [
  "Action/adventure",
  "Animation",
  "Comedy",
  "Documentaries",
  "Drama",
  "Horror",
  "Sci-Fi/Fantasy",
  "List A-Z",
];

let htmlMovieContainer = "";

// Structure: 0 - name, 1 - embedLink, 2 - year, 3 - genres[], 4 - short description, 5 - favourite (saved)
const trailers = [
  [
    "Interstellar",
    "https://www.youtube.com/embed/zSWdZVtXT7E?si=tq5k_FYll_QIjIVT",
    "soon",
    ["Sci-Fi/Fantasy", "Action/adventure"],
    "With our time on Earth coming to an end, a team of explorers undertakes the most important mission in human history: traveling beyond this galaxy to discover whether mankind has a future among the stars.",
    false,
  ],
  [
    "Martian",
    "https://www.youtube.com/embed/ej3ioOneTy8?si=XBVVNbbZIlNMR4uO",
    2015,
    ["Sci-Fi/Fantasy", "Action/adventure"],
    "During a manned mission to Mars, Astronaut Mark Watney (Matt Damon) is presumed dead after a fierce storm and left behind by his crew. But Watney has survived and finds himself stranded and alone on the hostile planet. With only meager supplies, he must draw upon his ingenuity, wit and spirit to subsist and find a way to signal to Earth that he is alive. Millions of miles away, NASA and a team of international scientists work tirelessly to bring “the Martian” home, while his crewmates concurrently plot a daring, if not impossible rescue mission. As these stories of incredible bravery unfold, the world comes together to root for Watney’s safe return. ",
    true,
  ],
  [
    "Back To The Future",
    "https://www.youtube.com/embed/qvsgGtivCgs?si=9VF-YQKf3tEDZ61b",
    1985,
    ["Sci-Fi/Fantasy", "Action/adventure", "Comedy"],
    "A teenager is accidentally sent 30 years into the past in a time-traveling DeLorean invented by his friend, Dr. Emmett Brown, and must make sure his high-school-age parents unite in order to save his own existence.",
    true,
  ],
  [
    "Shrek",
    "https://www.youtube.com/embed/CwXOrWvPBPk?si=3msbDCL9ajZYWHHx",
    2001,
    ["Animation", "Action/adventure", "Comedy"],
    "After his swamp is filled with magical creatures, Shrek agrees to rescue Princess Fiona for a villainous lord in order to get his land back.",
    true,
  ],
  [
    "Top Gun: Maverick",
    "https://www.youtube.com/embed/giXco2jaZ_4?si=Aq_o1QiYQv1LxTMq",
    2022,
    ["Action/adventure", "Comedy"],
    `After more than thirty years of service as one of the Navy’s top aviators, Pete “Maverick” Mitchell (Tom Cruise) is where he belongs, pushing the envelope as a courageous test pilot and dodging the advancement in rank that would ground him. When he finds himself training a detachment of Top Gun graduates for a specialized mission the likes of which no living pilot has ever seen, Maverick encounters Lt. Bradley Bradshaw (Miles Teller), call sign: “Rooster,” the son of Maverick’s late friend and Radar Intercept Officer Lt. Nick Bradshaw, aka “Goose.” Facing an uncertain future and confronting the ghosts of his past, Maverick is drawn into a confrontation with his own deepest fears, culminating in a mission that demands the ultimate sacrifice from those who will be chosen to fly it.`,
    true,
  ],
];

// if (trailers[0][3].includes("Action/adveture")) console.log("taip");

// html elements
const sidebarEl = document.querySelector(".sidebar");
const sectionTrailersEl = document.querySelector(".section-trailers");
const headerEl = document.querySelector("header");
// const favouriteBtn = document.querySelector(".favourite-icon");
let subList = document.querySelector(".nested-list");
// other variables
let activeGenre = "";
let activeSubcategory = "";

// functions:
function openSubcategory(e) {
  subList = document.querySelector(".nested-list");
  if (
    e.target.tagName === "LI" &&
    e.target.parentElement.classList.contains("categories") &&
    e.target.children.length === 0
  ) {
    if (subList) subList.remove();
    e.target.insertAdjacentHTML("beforeend", htmlSubcategory);
    activeGenre = e.target.firstChild.textContent;
    // console.log(activeGenre);
  } else if (
    e.target.tagName === "LI" &&
    e.target.parentElement.classList.contains("categories") &&
    e.target.children.length > 0
  ) {
    if (subList) subList.remove();
  }
}

function loadContent(m) {
  htmlMovieContainer = `<div class="movie-container">
    <div class="movie-info">
      <div class="name">${m[0]}</div>
      <div class="year">${m[2]}</div>
    </div>
    <iframe
      width="560"
      height="315"
      src="${m[1]}"
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerpolicy="strict-origin-when-cross-origin"
      allowfullscreen
    ></iframe>
    <div class="about">
      ${m[4]}
    </div>
    <ion-icon class=favourite-icon name="${
      m[5] === true ? "heart" : "heart-outline"
    }"></ion-icon>
  </div>`;
  sectionTrailersEl.insertAdjacentHTML("beforeend", htmlMovieContainer);
}

function uploadBreadcrumbs() {
  headerEl
    .querySelector(".genre")
    .querySelector("b").textContent = `${activeGenre}>`;
  headerEl.querySelector(".sub-category").textContent = activeSubcategory;
}

function noMoviesMessage(e, m) {
  if (!m) {
    sectionTrailersEl.insertAdjacentHTML(
      "afterbegin",
      `<h1>There are no movies found in this category</h1>`
    );
    console.log("no movies");
  }
}

function filterContent(e) {
  let movieInCategory = false;
  if (e.target.id === "latest") {
    activeSubcategory = "latest";
    uploadBreadcrumbs();
    while (sectionTrailersEl.firstChild) {
      sectionTrailersEl.removeChild(sectionTrailersEl.firstChild);
    }
    trailers.forEach((movie) => {
      if (
        movie[2] >= 2020 &&
        movie[3].includes(
          e.target.parentNode.parentNode.firstChild.textContent.trim()
        )
      ) {
        loadContent(movie);
        movieInCategory = true;
      }
    });
    noMoviesMessage(e, movieInCategory);
  } else if (e.target.id === "favourite") {
    activeSubcategory = "Favourite";
    uploadBreadcrumbs();
    while (sectionTrailersEl.firstChild) {
      sectionTrailersEl.removeChild(sectionTrailersEl.firstChild);
    }
    trailers.forEach((movie) => {
      if (
        movie[5] === true &&
        movie[3].includes(
          e.target.parentNode.parentNode.firstChild.textContent.trim()
        )
      ) {
        loadContent(movie);
        movieInCategory = true;
      }
    });
    noMoviesMessage(e, movieInCategory);
  } else if (e.target.id === "soon") {
    activeSubcategory = "Coming soon";
    uploadBreadcrumbs();
    while (sectionTrailersEl.firstChild) {
      sectionTrailersEl.removeChild(sectionTrailersEl.firstChild);
    }
    trailers.forEach((movie) => {
      if (
        movie[2] === "soon" &&
        movie[3].includes(
          e.target.parentNode.parentNode.firstChild.textContent.trim()
        )
      ) {
        loadContent(movie);
        movieInCategory = true;
      }
    });
    noMoviesMessage(e, movieInCategory);
  }
}

// event listeners
sidebarEl.addEventListener("click", (e) => {
  openSubcategory(e);
  filterContent(e);
});

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("favourite-icon")) {
    trailers.forEach((movie) => {
      if (
        e.target.parentElement.querySelector(".name").textContent === movie[0]
      ) {
        if (!movie[5]) {
          e.target.setAttribute("name", "heart");
          movie[5] = true;
        } else {
          e.target.setAttribute("name", "heart-outline");
          movie[5] = false;
        }
      }
    });
  }
});

// TEST
fetch("http://localhost:3000/trailers")
  .then((response) => response.json())
  .then((data) => {
    console.log(data[0]);
  })
  .catch((error) => {
    console.error("Error fetching trailers:", error);
  });

// Backlog:
// functions:
// change Data structure, from JS object to JSON

// Next sprints:
// trailer upload page (form) (category selection should solve current inconvenience)
// optimize filterContent function (using array for categories and other filters)
// move 'trailers' object to JSON
// implement function based on binary search for that object

// SOLVED
// issues: Keep loading movies even page is already loaded
// breadcrumbs
// There are no movies found in this category
// add save option (favourites)
// Upload more trailers

// NOTES:
// For Favourite to work I would need to create external JSON
