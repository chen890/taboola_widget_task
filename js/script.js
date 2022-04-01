// var URL_params = {
//     "publisherID":"apitestaccount",
//     "app.type":"web",
//     "app.apikey":"7be65fc78e52c11727793f68b06d782cff9ede3c",
//     "rec.count":"6",
//     "rec.type":"mix",
//     "user.session":"init",
//     "source.type":"home",
//     "source.id":"/Fdigiday-publishing-summit/",
//     "source.url":"https://blog.taboola.com/Fdigiday-publishing-summit/",
//     "source.placement":"Editorial%20Trending",
//     "placements.organicType":"mix"
//   };

//   const url="http://api.taboola.com/1.0/json/"+URL_params["publisherID"]+"/recommendations.get?app.type="+URL_params["app.type"]+"&app.apikey="+URL_params["app.apikey"]+"&rec.count="+URL_params["rec.count"]+"&rec.type="+URL_params["rec.type"]+"&user.session="+URL_params["user.session"]+"&source.type="+URL_params["source.type"]+"&source.id="+URL_params["source.id"]+"&source.url="+URL_params["source.url"]+"&source.placement="+URL_params["source.placement"]+"&placements.organicType="+URL_params["placements.organicType"];

  const RECOMMENDATIONS_API = 'https://api.taboola.com/1.2/json/apitestaccount/recommendations.get?app.type=web&app.apikey=7be65fc78e52c11727793f68b06d782cff9ede3c&source.id=%2Fdigiday-publishing-summit%2F&source.url=https%3A%2F%2Fblog.taboola.com%2Fdigiday-publishing-summit%2F&source.type=text&placement.organic-type=mix&placement.visible=true&placement.available=true&placement.rec-count=6&placement.name=Below%20Article%20Thumbnails&placement.thumbnail.width=640&placement.thumbnail.height=480&user.session=init'

async function getRecommendations() {
  try {
    let response = await fetch(RECOMMENDATIONS_API);
    let data = await response.json();
    return data;
  } catch (error) {
    console.log(error)
  }
}

// Creates the 'You May Like' header
function createHeaderElement() {
  var header = document.createElement('span');
  header.className = 'header';
  var headerText = document.createTextNode("You May Like");
  header.appendChild(headerText);
  return header;
}

// Creates Disclosure 
function createDisclosureElement() {
  var disclosure = document.createElement('span');
  disclosure.className = 'disclosure'
  var disclosureText = document.createTextNode("Sponsored Links by Taboola");
  disclosure.appendChild(disclosureText);
  return disclosure;
}

// Generates the 'You May Like' and Sponsered by Taboola on the top
function createTop() {
  var top = document.createElement('div');
  header = createHeaderElement();
  disclosure = createDisclosureElement();
  top.className = 'top';
  top.appendChild(header);
  top.appendChild(disclosure);
  document.getElementById('main').appendChild(top);
}

// Rows of recommendations
function RecommendationElements() {
  // First row of recommendations
  var firstRowRecommendations = document.createElement('div');
  firstRowRecommendations.className = 'recommendations';
  firstRowRecommendations.id = 'firstRowRecommendations';
  document.getElementById('main').appendChild(firstRowRecommendations);

  // Second row of recommendations
  var secondRowRecommendations = document.createElement('div');
  secondRowRecommendations.className = 'recommendations'
  secondRowRecommendations.id = 'secondRowRecommendations';
  document.getElementById('main').appendChild(secondRowRecommendations);
}

// Retrieves the image from API response
function retrievesImageElement(element) {
  var img = document.createElement('img');
  img.className = 'img';
    //in the JSON response , the thumbnail url is 0
  img.setAttribute('src', element.thumbnail[0].url);
  return img;
}

// Retrieves the 'name' from  API response
function retrievesNameElement(element) {
  var spanName = document.createElement('span');
  spanName.className = 'name';
    //in the JSON response we will disaply the 'name' value
  var name = document.createTextNode(element.name);
  spanName.appendChild(name);
  return spanName;
}

// Creates the Brand tag under the title
function brandElement(element) {
  var spanBrandding = document.createElement('span');
  spanBrandding.className = 'brand';
  var branding_text = element.categories ?
    element.branding + ' | ' + 
    element.categories[0].charAt(0).toUpperCase() + 
    element.categories[0].slice(1) : element.branding;
  var branding = document.createTextNode(branding_text);
  spanBrandding.appendChild(branding);
  return spanBrandding;
}

//  The cards elements
function cardElement(element) {
  var cardDiv = document.createElement('a');
  cardDiv.className = 'card';
  cardDiv.href = element.url;

  // Add image, name, and brandding + category to card
  img = retrievesImageElement(element);
  cardDiv.appendChild(img);
  spanBrandding = brandElement(element);
  cardDiv.appendChild(spanBrandding);
  spanName = retrievesNameElement(element);
  cardDiv.appendChild(spanName);
  return cardDiv;
}

// Merging all together
function mergeAllRecommendations()
{
  getRecommendations().then(data =>
    {
    if (data.list.length != 6)
    {
      // Did not get 6 recommendations
      mergeAllRecommendations();
    } 
    else 
    {
      // Add header and disclosure to 'main' div
      createTop();
      // Add recommendtions rows to 'main' div
      RecommendationElements();
      count_row_elements = 0;
      data.list.forEach(element => 
        {
        cardDiv = cardElement(element);
        if (count_row_elements < 3) 
        {
          // Add elements to the first row
          document.getElementById('firstRowRecommendations').appendChild(cardDiv);
          count_row_elements++;
        } 
        else 
        {
          // Add elements to the second row
          document.getElementById('secondRowRecommendations').appendChild(cardDiv);
        }
      });
    }
  });
}

document.body.onload = mergeAllRecommendations;
