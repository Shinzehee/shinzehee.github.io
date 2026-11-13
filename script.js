async function loadArenaChannel(channelSlug, targetId) {
  const target = document.getElementById(targetId);
  target.dataset.showingDetail = "false";

  try {
    const response = await fetch(`https://api.are.na/v2/channels/${channelSlug}/contents?per=100`);
    const data = await response.json();

  // 이미지 블록만 골라내기
  const imageBlocks = (data.contents || [])
  .filter(block => block.class === "Image")
  .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    target.innerHTML = "";

    imageBlocks.forEach(block => {
      const imgUrl = block.image?.display?.url || block.image?.original?.url;
      if (!imgUrl) return;

      // const link = document.createElement("a");
      // link.href = block.source?.url || imgUrl;
      // link.target = "_blank";

      const link = document.createElement("a");
link.href = "#";
link.addEventListener("click", (e) => {
  e.preventDefault();


  saveHistory();
  target.dataset.showingDetail = "true";

  target.innerHTML = `
    <img id="detail-image" src="${imgUrl}" alt="">
    <div id="detail-title">${block.title || ""}</div>
    <div id="detail-description">${block.description || ""}</div>
  `;
});

      const img = document.createElement("img");
      img.src = imgUrl;
      img.alt = block.title || "Are.na image";

      link.appendChild(img);

      // title 추가
      // if (block.title) {
      //   const title = document.createElement("div");
      //   title.textContent = block.title;
      //   title.style.textAlign = "center";
      //   title.style.whiteSpace = "pre-line";
      //   title.style.marginTop = "10px";
      //   link.appendChild(title);
      // }

      target.appendChild(link);
    });
  } catch (error) {
    console.error(`Failed to load channel ${channelSlug}:`, error);
    target.innerHTML = "<p>이미지를 불러오지 못했습니다.</p>";
  }
}


let historyStack = [];
let currentView = null;

function saveHistory() {
  if (currentView) {
    historyStack.push(currentView);
  }
  currentView = {
    categories: [...categories].map(category => category.open),
    arenaHTML: document.getElementById("arena-01").innerHTML,
    showingDetail: document.getElementById("arena-01").dataset.showingDetail
  };
}


 const categories = document.querySelectorAll("details");

categories.forEach((category) => {
  category.addEventListener("toggle", () => {
    saveHistory();
    if (category.open) {

        if (category.classList.contains("archive")) {
        window.scrollTo(0, 0);
      }
      
      categories.forEach((other) => {
        if (other !== category) {
          other.open = false;
        }
      });
    }
  });
});

const archiveSummary = document.querySelector(".archive summary");

archiveSummary.addEventListener("click", (e) => {
  const target = document.getElementById("arena-01");

  if (target.dataset.showingDetail === "true") {
    e.preventDefault();
    loadArenaChannel("i-love-bag", "arena-01");
  }
});


// 여기 slug만 각각 다르게 넣기
loadArenaChannel("i-love-bag","arena-01");



document.querySelector(".back").addEventListener("click", (e) => {
  e.preventDefault();

  if (historyStack.length === 0) return;

  const previous = historyStack.pop();
  const target = document.getElementById("arena-01");

  categories.forEach((category, i) => {
    category.open = previous.categories[i];
  });

  if (previous.categories[2] && previous.showingDetail === "false") {
    loadArenaChannel("i-love-bag", "arena-01");
  } else {
    target.innerHTML = previous.arenaHTML;
    target.dataset.showingDetail = previous.showingDetail;
  }
});




