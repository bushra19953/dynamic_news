// 🔑 Your GNews API key
const API_KEY = "4369311ede5b64e351ecca964a9c42ce";
const url = `https://gnews.io/api/v4/top-headlines?token=${API_KEY}&lang=en&country=pk&q=`;

// Load default news on page load
window.addEventListener("load", () => fetchNews("Pakistan"));

// Reload function
function reload() {
  window.location.reload();
}

// Fetch news from GNews API
async function fetchNews(query) {
  try {
    // ✅ No &apiKey needed, only token
    const res = await fetch(`${url}${query}`);
    const data = await res.json();
    bindData(data.articles);
  } catch (error) {
    console.error("❌ Error fetching news:", error);
    document.getElementById("cards-container").innerHTML =
      "<p>⚠️ Failed to load news</p>";
  }
}

// Bind data to template
function bindData(articles) {
  const cardsContainer = document.getElementById("cards-container");
  const newsCardTemplate = document.getElementById("template-news-card");

  cardsContainer.innerHTML = "";

  articles.forEach((article) => {
    if (!article.image) return; // ✅ Use article.image for GNews

    const cardClone = newsCardTemplate.content.cloneNode(true);
    fillDataInCard(cardClone, article);
    cardsContainer.appendChild(cardClone);
  });
}

// Fill template with article data
function fillDataInCard(cardClone, article) {
  const newsImg = cardClone.querySelector("#news-img");
  const newsTitle = cardClone.querySelector("#news-title");
  const newsSource = cardClone.querySelector("#news-source");
  const newsDesc = cardClone.querySelector("#news-desc");

  newsImg.src = article.image; // ✅ GNews uses "image"
  newsTitle.innerHTML = article.title;
  newsDesc.innerHTML = article.description || "No description available.";

  const date = new Date(article.publishedAt).toLocaleString("en-US", {
    timeZone: "Asia/Jakarta",
  });

  newsSource.innerHTML = `${article.source.name} · ${date}`;

  // Click opens full article
  cardClone.firstElementChild.addEventListener("click", () => {
    window.open(article.url, "_blank");
  });
}

// Navigation (category buttons)
let curSelectedNav = null;

function onNavItemClick(id) {
  fetchNews(id);
  const navItem = document.getElementById(id);
  curSelectedNav?.classList.remove("active");
  curSelectedNav = navItem;
  curSelectedNav.classList.add("active");
}

// Search functionality
const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
  const query = searchText.value;
  if (!query) return;
  fetchNews(query);
  curSelectedNav?.classList.remove("active");
  curSelectedNav = null;
});
