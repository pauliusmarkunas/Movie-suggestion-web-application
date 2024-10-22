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

    let submitData = {};
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
    <div class='iframe-container'>
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
      </div>
    <div class="about">
    ${m.description}
    </div>
    <ion-icon class=favourite-icon name="${
      m.isFavorite === true ? "heart" : "heart-outline"
    }"></ion-icon>
      </div>`;
      sectionTrailersEl.insertAdjacentHTML("beforeend", htmlMovieContainer);
    }

    // TEST DATA (htmlMovieContainer)
    /* <div class="movie-container">
    <div class="movie-info">
    <div class="name">${m.title}</div>
      <div class="year">${m.year}</div>
    </div>
    <div class='iframe-container'>
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
      </div>
    <div class="about">
    ${m.description}
    </div>
    <ion-icon class=favourite-icon name="${
      m.isFavorite === true ? "heart" : "heart-outline"
    }"></ion-icon>
      </div> */
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

    // event object -  e, targetSelector - event targer,  destSelector - selector, where content will be placed, htmlFileName...
    function uploadHTML(destSelector, htmlFileName) {
      // Fetch the HTML file using the Fetch API
      fetch(htmlFileName)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.text();
        })
        .then((htmlContent) => {
          const destEl = document.querySelector(destSelector);
          destEl.innerHTML = htmlContent;
        })
        .catch((error) => {
          console.error("There was a problem with the fetch operation:", error);
        });
    }

    function submitPreview() {
      // submitData = {
      //   title: document.getElementById("movie-name").value,
      //   url: document.getElementById("embedded-url").value,
      //   year: parseInt(document.getElementById("movie-year").value), // Convert year to a number
      //   genres: Array.from(
      //     document.querySelectorAll("input[name='form-genres']:checked")
      //   ).map((genre) => genre.nextElementSibling.innerText), // Get selected genres
      //   description: document.getElementById("short-description").value,
      //   isFavorite: document.getElementById("set-favorite").checked, // true if checkbox is checked, otherwise false
      // };

      const submitYear = parseInt(document.getElementById("movie-year").value);
      const submitArr = Array.from(
        document.querySelectorAll("input[name='form-genres']:checked")
      ).map((genre) => genre.nextElementSibling.innerText);
      submitData.title = document.getElementById("movie-name").value ??= "";
      submitData.url = document.getElementById("embedded-url").value ??= "";
      submitData.year = submitYear ??= 2001;
      submitData.genres = submitArr ??= [];
      submitData.description = document.getElementById(
        "short-description"
      ).value ??= "";
      submitData.isFavorite = document.getElementById(
        "set-favorite"
      ).checked ??= false;

      while (sectionTrailersEl.firstChild) {
        sectionTrailersEl.removeChild(sectionTrailersEl.firstChild);
      }
      console.log(submitData.genres);
      loadContent(submitData);

      const HtmlFinalSubmit = `<div class="final-submit-container">
        <button type="cancel-submit">Go back</button>
        <button type="final-submit">Submit</button>
      </div>`;

      sectionTrailersEl.insertAdjacentHTML("beforeend", HtmlFinalSubmit);
    }

    function cancelSubmit() {
      while (sectionTrailersEl.firstChild) {
        sectionTrailersEl.removeChild(sectionTrailersEl.firstChild);
      }
      uploadHTML(".section-trailers", "trailerForm.html");
      setTimeout(() => {
        document.getElementById("movie-name").value = submitData.title ?? "";
        document.getElementById("embedded-url").value = submitData.url ?? "";
        document.getElementById("movie-year").value = submitData.year ?? 2001;
        const genreCheckboxes = document.querySelectorAll(
          "input[name='form-genres']"
        );
        genreCheckboxes.forEach((checkbox) => {
          const genreLabel = checkbox.nextElementSibling.innerText;
          checkbox.checked = submitData.genres.includes(genreLabel);
        });
        document.getElementById("short-description").value =
          submitData.description ?? "";
        document.getElementById("set-favorite").checked =
          submitData.isFavorite ?? false;
      }, 100);
    }

    // const currentJSON = JSON.parse(data);
    function finalSubmit() {
      const currentData = [...data];
      const newTrailer = { ...submitData };
      currentData.push(newTrailer);
      fetch("http://localhost:3000/trailers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentData),
      })
        .then((response) => response.text())
        .then((data) => console.log(data))
        .catch((error) => {
          console.error("Error:", error);
        });
    }

    // EVENT LISTENERS
    sidebarEl.addEventListener("click", (e) => {
      openSubcategory(e);
      filterMovies(e);
    });

    // (maybe for later)
    // sectionTrailersEl.addEventListener("cilck", (e) => {
    //   toggleCheckbox("custom-select li");
    // });

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

    document.addEventListener("click", function (e) {
      const submitButton = document.querySelector(
        `.form-container button[type="submit"]`
      );
      const cancelButton = document.querySelector(
        `.final-submit-container button[type='cancel-submit']`
      );
      const finalSubmitButton = document.querySelector(
        `.final-submit-container button[type='final-submit']`
      );
      const sidebarAddTrailer = document.querySelector(".upload-trailer li");

      switch (e.target) {
        case submitButton:
          submitPreview();
          break;

        case cancelButton:
          cancelSubmit();
          break;

        case finalSubmitButton:
          finalSubmit();
          break;

        case sidebarAddTrailer:
          uploadHTML(".section-trailers", "trailerForm.html");

        default:
          return;
      }
      // Any other logic that should run if a button was clicked can go here
    });
    // server data access end here
  })
  .catch((error) => {
    console.error("Error fetching trailers:", error);
  });
// Backlog:
// functions:
// Implement functionallity to check validity of embed url and also other inputs format (use coalesing asignment operators for that chage to prompt error instead of empty string...)
// Implement favorite functionality (write to JSON if saved)
// complete mobile nav

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
// trailer upload page (form) (category selection should solve current inconvenience)
// add preview function which opens trailer after pressing 'Submit'

// NOTES:
// For Favourite to work I would need to create external JSON
