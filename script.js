"use strict";
// HTML code:
const htmlSubcategory = `<ul class="nested-list">
<li id='latest'>Latest</li>
<li id='favourite'>Favourite</li>
<li id='soon'>Coming soon</li>
</ul>`;

let htmlMovieContainer = "";

fetch("http://localhost:3000/trailers")
  .then((response) => response.json())
  .then((data) => {
    // html elements
    const sidebarEl = document.querySelector(".sidebar");
    const sectionTrailersEl = document.querySelector(".section-trailers");
    const headerEl = document.querySelector("header");
    let subList = document.querySelector(".nested-list");
    // other variables
    let activeGenre = "";
    let activeSubcategory = "";

    // functions:
    function openSubcategory(e) {
      const target = e.target;
      const parentIsCategory =
        target.parentElement.classList.contains("categories");
      const existingSubList = document.querySelector(".nested-list");

      // target should be LI and parent should hae 'categories' class
      if (target.tagName !== "LI" || !parentIsCategory) return;
      if (existingSubList) existingSubList.remove();
      if (target.children.length === 0) {
        target.insertAdjacentHTML("beforeend", htmlSubcategory);
        activeGenre = target.firstChild.textContent.trim();
      }
    }

    function loadContent(m) {
      htmlMovieContainer = `<div class="movie-container">
    <div class="movie-info">
    <div class="name">${m.title}</div>
      <div class="year">${m.year}</div>
    </div>
    <iframe
      width="560"
      height="315"
      src="${m.url}"
      title="YouTube video player"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerpolicy="strict-origin-when-cross-origin"
      allowfullscreen
      ></iframe>
    <div class="about">
    ${m.description}
    </div>
    <ion-icon class=favourite-icon name="${
      m.isFavorite === true ? "heart" : "heart-outline"
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

    function filterMovies(e) {
      let movieInCategory = false;

      const clearContentAndSetSubcategory = (subcategory) => {
        activeSubcategory = subcategory;
        uploadBreadcrumbs();
        while (sectionTrailersEl.firstChild) {
          sectionTrailersEl.removeChild(sectionTrailersEl.firstChild);
        }
      };

      const matchesGenre = (movie, target) => {
        const genre =
          target.parentNode.parentNode.firstChild.textContent.trim();
        return movie.genres.includes(genre);
      };

      const showNoMoviesMessage = (movieInCategory) => {
        if (!movieInCategory) {
          sectionTrailersEl.insertAdjacentHTML(
            "afterbegin",
            `<h1>There are no movies found in this category</h1>`
          );
        }
      };

      let filterCondition;
      switch (e.target.id) {
        case "latest":
          clearContentAndSetSubcategory("latest");
          filterCondition = (movie) => movie.year >= 2020;
          break;
        case "favourite":
          clearContentAndSetSubcategory("Favourite");
          filterCondition = (movie) => movie.isFavorite === true;
          break;
        case "soon":
          clearContentAndSetSubcategory("Coming soon");
          filterCondition = (movie) => movie.year === "soon";
          break;
        default:
          return;
      }

      data.forEach((movie) => {
        if (filterCondition(movie) && matchesGenre(movie, e.target)) {
          loadContent(movie);
          movieInCategory = true;
        }
      });

      showNoMoviesMessage(movieInCategory);
    }

    // EVENT LISTENERS
    sidebarEl.addEventListener("click", (e) => {
      openSubcategory(e);
      filterMovies(e);
    });

    document.addEventListener("click", function (e) {
      if (e.target.classList.contains("favourite-icon")) {
        data.forEach((movie) => {
          if (
            e.target.parentElement.querySelector(".name").textContent ===
            movie.title
          ) {
            if (!movie.isFavorite) {
              e.target.setAttribute("name", "heart");
              movie.isFavorite = true;
            } else {
              e.target.setAttribute("name", "heart-outline");
              movie.isFavorite = false;
            }
          }
        });
      }
    });
  })
  .catch((error) => {
    console.error("Error fetching trailers:", error);
  });
// Backlog:
// functions:
// trailer upload page (form) (category selection should solve current inconvenience)
// Implement favorite functionality (write to JSON if saved)

// Next sprints:
// implement function based on binary search for that object (sort by movie name)
// Create login functionality (store user's data to separate JSON, also sername, password separatelly, make it safe)

// SOLVED
// issues: Keep loading movies even page is already loaded
// breadcrumbs
// There are no movies found in this category
// add save option (favourites)
// Upload more trailers
// change Data structure, from JS object to JSON
// optimize filterContent function (using array for categories and other filters)

// NOTES:
// For Favourite to work I would need to create external JSON
