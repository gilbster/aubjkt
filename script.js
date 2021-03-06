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
query Objkt($id: bigint!) {
    hic_et_nunc_token_by_pk(id: $id) {
      artifact_uri
      creator {
        address
        name
      }
      description
      display_uri
      id
      level
      mime
      royalties
      supply
      thumbnail_uri
      metadata
      timestamp
      title
      token_tags(order_by: {id: asc}) {
        tag {
          tag
        }
      }
      swaps(order_by: {id: asc}) {
        price
        timestamp
        status
        amount
        amount_left
        creator {
          address
          name
        }
      }
      trades(order_by: {timestamp: asc}) {
        amount
        buyer {
          address
          name
        }
        seller {
          address
          name
        }
        swap {
          price
        }
        timestamp
      }
      token_holders(where: {quantity: {_gt: "0"}}, order_by: {id: asc}) {
        quantity
        holder {
          address
          name
        }
      }
      hdao_balance
      extra
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

async function doFetch() {
  const { errors, data } = await fetchGraphQL(query, "Objkt", {
    tags: ["aubergine", "aubjkt4aubjkt"],
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
