let result;

const main = document.getElementById("section");
const placeholder = document.getElementById("placeholder");
const form = document.getElementById("form");
const search = document.getElementById("search");
let address = "";


function preload() {
  doFetch(result)
    .then((result) => showArt(result))
    .then(() => {
      dataFinishedLoading = true;
    });
}

const query = `
query MyQry($tags: [String!]) {
  hic_et_nunc_tag: tag(where: {name: {_in: $tags}}) {
    tag_tokens(where: {token: {supply: {_gt: 0}}}) {
      token {
        id
        mime
        thumbnail_uri
        display_uri
        artifact_uri
        royalties
        title
        supply
        timestamp
        creator {
          name
          address
        }
      }
    }
  }
}
{"tags": ["aubergine", "aubjkt4aubjkt"]}

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
