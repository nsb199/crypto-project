const coinImage = document.querySelector(".single-crypto-details .left");
const coinDetails = document.querySelector(".single-crypto-details .right");
const priceContainer = document.querySelector(".single-crypto-details");

const currentURL = new URL(window.location.href);
const params = new URLSearchParams(currentURL.search);

if (!params.has("id")) {
  window.location.href = "search.html";
} else {
  getDataFromAPI(
    `https://api.coingecko.com/api/v3/coins/${params.get(
      "id"
    )}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false`
  ).then((response) => {
    console.log(response);
    showDetails(response);
  });

  // GET PRICE IN DIFFERENT CURRENCIES
  const currencies = ["usd", "eur", "btc", "eth"];
  currencies.forEach((currency) => {
    getDataFromAPI(
      `https://api.coingecko.com/api/v3/simple/price?ids=${params.get(
        "id"
      )}&vs_currencies=${currency}`
    ).then((response) => {
      console.log(response);
      showPrice(response, currency);
    });
  });

  // GET CHART DATA
  getDataFromAPI(
    `https://api.coingecko.com/api/v3/coins/${params.get(
      "id"
    )}/market_chart?vs_currency=inr&days=10`
  ).then((response) => {
    console.log(response);
    showChart(response.prices);
  });
}

function showDetails(obj) {
  const img = document.createElement("img");
  img.src = obj.image.large;
  coinImage.append(img);

  const name = document.createElement("h3");
  name.innerText = obj.name + " ( " + obj.symbol + " ) ";

  const desc = document.createElement("p");
  desc.innerHTML = obj.description.en;

  coinDetails.append(name, desc);
}

function showChart(data) {
  const timestamps = [];
  const prices = [];

  data.forEach((dt) => {
    const date_obj = new Date(dt[0]);
    let hours = date_obj.getHours();
    if (hours < 10) {
      hours = "0" + hours;
    }
    let minutes = date_obj.getMinutes();
    if (minutes < 10) {
      minutes = "0" + minutes;
    }

    timestamps.push(`${hours}:${minutes}`);
    prices.push(dt[1]);
  });

  const ctx = document.getElementById("cryptoChart").getContext("2d");
  const myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: timestamps,
      datasets: [
        {
          label: "Price (in INR)",
          data: prices,
          borderColor: "rgb(75, 192, 192)",
          tension: 0.4,
        },
      ],
    },
    options: {
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });
}

function showPrice(response, currency) {
  const price = document.createElement("p");
  price.innerText = `Price in ${currency.toUpperCase()}: ${response[params.get("id")][currency]}`;
  priceContainer.append(price);
}

async function getDataFromAPI(url) {
  const response = await fetch(url);
  const result = await response.json();
  return result;
}
