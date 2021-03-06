const API_REQ = 'https://api.taboola.com/1.2/json/apitestaccount/recommendations.get?app.type=web&app.apikey=7be65fc78e52c11727793f68b06d782cff9ede3c&source.id=%2Fdigiday-publishing-summit%2F&source.url=https%3A%2F%2Fblog.taboola.com%2Fdigiday-publishing-summit%2F&source.type=text&placement.organic-type=mix&placement.visible=true&placement.available=true&placement.rec-count=6&placement.name=Below%20Article%20Thumbnails&placement.thumbnail.width=640&placement.thumbnail.height=480&user.session=init'

async function getRecommendations() {
  try {
    let response = await fetch(API_REQ);
    let data = await response.json();
    return data;
  } catch (error) {
    console.log(error)
  }
}

// Creates Disclosure 
function disclosureElement() {
  var disclosure = document.createElement('span');
  disclosure.className = 'disclosure'
  var disclosureText = document.createTextNode("Sponsored Links by Taboola");
  disclosure.appendChild(disclosureText);
  return disclosure;
}

// Creates the 'You May Like' header
function headerElement() {
  var header = document.createElement('span');
  header.className = 'header';
  var headerText = document.createTextNode("You May Like");
  header.appendChild(headerText);
  return header;
}

// Generates the 'You May Like' and Sponsered by Taboola on the top
function createTop() {
  var top = document.createElement('div');
  header = headerElement();
  disclosure = disclosureElement();
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

//  The cards elements
function cardElement(element) {
  var cardDiv = document.createElement('a');
  cardDiv.className = 'card';
  cardDiv.href = element.url;

  // Gether the image, name, and brandding to a card
  img = retrievesImageElement(element);
  cardDiv.appendChild(img);
  spanName = retrievesNameElement(element);
  cardDiv.appendChild(spanName);
  spanBrandding = brandElement(element);
  cardDiv.appendChild(spanBrandding);
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
