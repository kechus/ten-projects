const $list = document.getElementById('list')

const getSeasonal = async () => {
  const query = `{
        Page(page: 1, perPage: 10) {
          media(season: WINTER, seasonYear: 2022, sort: POPULARITY_DESC) {
            id
            title{
              english
            }
            coverImage {
              large
            }
          }
        }
      }
      `;
  const URL = "https://graphql.anilist.co";
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      query: query,
    }),
  };

  if(null !== localStorage.getItem('animays')){
    return
  }
  // Make the HTTP Api request
  fetch(URL, options).then(handleResponse).then(handleData).catch(handleError);
};

function handleResponse(response) {
  return response.json().then(function (json) {
    return response.ok ? json : Promise.reject(json);
  });
}

function handleData(data) {
  localStorage.setItem('animays',JSON.stringify(data))
  console.log(data);
  addToDOM(data.data.Page.media);
}

function addToDOM(mediaList){
  const $li = document.createElement('li');

  const $card = document.createElement('div')
  $card.classList.add('card')
  

  $li.append($card)
  $list.append($li)
}

function handleError(error) {
  alert("Error, check console");
  console.error(error);
}

(async () => {
  // getSeasonal();
  const animaysJSON = localStorage.getItem('animays')
  const animays = JSON.parse(animaysJSON);
  handleData(animays)
})();