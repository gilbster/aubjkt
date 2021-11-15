let result;

const main = document.getElementById("section");
const placeholder = document.getElementById("placeholder");
const form = document.getElementById("form");
const search = document.getElementById("search");
let address = "";

function removeText() {
  placeholder.style.display = "none";
}

function preload() {
  doFetch(result)
    .then((result) => showArt(result))
    .then(() => {
      dataFinishedLoading = true;
    });
}

const query = `
  query creatorGallery($address: String!) {
    hic_et_nunc_token(where: {creator: {address: {_eq: $address}}, supply: {_gt: 0}}, order_by: {id: desc}) {
      id
      artifact_uri
      display_uri
      thumbnail_uri
      timestamp
      mime
      title
      description
      supply
      token_tags {
        tag {
          tag
        }
      }
      swaps(where: {status: {_eq: "0"}}, order_by: {price: asc}) {
        amount
        amount_left
        creator_id
        price
      }
    }
  }
`;

async function fetchGraphQL(operationsDoc, operationName, variables) {
  const result = await fetch("https://api.hicdex.com/v1/graphql", {
    method: "POST",
    body: JSON.stringify({
      query: operationsDoc,
      variables: variables,
      operationName: operationName,
    }),
  });

  return await result.json();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  address = search.value;
  if (address && address !== "") {
    showArt();

    search.value = "";
  } else {
    window.location.reload();
  }
  console.log(address);
  preload();
  removeText();
});

async function doFetch() {
  const { errors, data } = await fetchGraphQL(query, "creatorGallery", {
    address: address,
  });
  if (errors) {
    console.error(errors);
  }
  result = data.hic_et_nunc_token;
  console.log({ result });
  return result;
}
preload();

function showArt() {
  main.innerHTML = "";
  for (i = 0; i < result.length; i++) {
    console.log(result[i]);
    const artEl = document.createElement("div");
    artEl.classList.add("nft");
    artEl.innerHTML = `
<div class="showcase">
        <div class="artist">
          <h2>
            <a href="https://www.hicetnunc.art/objkt/${result[i].id}">OBJKT#${result[i].id}</a>
          </h2>
        </div>
        <div class="art">
<img src="/aub.gif" alt="${result.title}">
        </div>
        <div class="OBJKT">
          <h2>${result[i].title}</h2>
          <a href="https://www.hicetnunc.art/objkt/${result[i].id}">Buy on HEN</a>
        </div>
        <div class="edition">
          ${result[i].supply} Editions  -  ${result[i].mime}
        </div>
        <div class="description">
          ${result[i].description}
        </div>
      </div>
      `;
    main.appendChild(artEl);
  }
}
