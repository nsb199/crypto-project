const coinsWrapper = document.querySelector(".coins-wrapper");

window.addEventListener("load", async () => {
  const exchangeRate = await getDataFromAPI(
    "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=inr"
  );
  const response = await getDataFromAPI(
    "https://api.coingecko.com/api/v3/search/trending"
  );

  showTrendingCoins(response.coins, exchangeRate.bitcoin.inr);

 
  startScrolling();
});

function showTrendingCoins(data, exchangeRate) {
  data.forEach((coin, index) => {
    const coins = document.createElement("div");
    coins.classList.add("coins");

    const img = document.createElement("img");
    img.classList.add("coin-img");
    img.src = coin.item.thumb;

    const rightDiv = document.createElement("div");

    const name = document.createElement("h3");
    name.classList.add("coin-name");
    name.innerHTML = `<a href="details.html?id=${coin.item.id}" style="color: black;">${coin.item.name} (${coin.item.symbol})</a>`;

    const price = document.createElement("p");
    price.classList.add("coin-price");
    price.innerText =
      "₹ " + getCoinPriceInINR(coin.item.price_btc, exchangeRate);

    rightDiv.append(name, price);

    coins.append(img, rightDiv);

    coinsWrapper.append(coins);

    img.addEventListener("click", () => {
      window.location.href = `details.html?id=${coin.item.id}`;
    });
  });
}

function getCoinPriceInINR(price_btc, exchangeRate) {
  return Math.round(price_btc * exchangeRate * 10000) / 10000;
}

async function getDataFromAPI(url) {
  const response = await fetch(url);
  const result = await response.json();
  return result;
}

function startScrolling() {
  const wrapper = document.querySelector(".coins-wrapper");
  const scrollDistance = 300; 
  const scrollSpeed = 50; 
  const pauseTime = 3000; 

  let interval;

  function scroll() {
    let counter = 0;
    interval = setInterval(() => {
      wrapper.scrollLeft += 1;
      counter++;
      if (counter >= scrollDistance) {
        clearInterval(interval);
        setTimeout(startScrolling, pauseTime);
      }
    }, scrollSpeed);
  }

  scroll();
}
