// Config
// Algolia client. Mandatory to instantiate the Helper.
var client  = algoliasearch('AI25093SE7', '56b53a13bd28f8cb3e324db8a226cb17');
// Algolia Helper
var helper = algoliasearchHelper(client, 'Restaurant_Index', {
  facets: ['payment_options', 'stars_count', 'food_type'],
  hitsPerPage: 15,
  maxValuesPerFacet: 5,
  getRankingInfo: true
});

// Bind the result event to a function that will update the results
helper.on("result", searchCallback);

// The different parts of the UI that we want to use in this example
var $inputfield = $("#search-box");
var $hits = $('#hits');

// When there is a new character input:
// - update the query
// - trigger the search
$inputfield.keyup(function (e) {
  helper.setQuery($inputfield.val()).search();
});

// Trigger a first search, so that we have a page with results
// from the start.
helper.search();

// Result event callback
function searchCallback(content) {
  if (content.hits.length === 0) {
    // If there is no result we display a friendly message
    // instead of an empty page.
    $hits.empty().html("No results :(");
    return;
  }

  // Hits/results rendering
  renderHits($hits, content);
  //renderPaymentFacet($facets, results);
  //renderFacets($facets, results);
}

function renderHits($hits, results) {
  // Scan all hits and display them
  var hits = results.hits.map(function renderHit(hit) {
    // We rely on the highlighted attributes to know which attribute to display
    // This way our end-user will know where the results come from
    // This is configured in our index settings
    // var highlighted = hit;
    // var attributes = $.map(highlighted, function renderAttributes(attribute, name) {
    return (
      '<div class="card">' +
      '<img src=' + hit.image_url + ' class="card-img-top" />' +
      '<div class="card-body">' +
      '<h5 class="card-title">' + hit.name + '</h5>' +
      '<p class="card-text">Stars:' + hit.stars_count + '(' + hit.reviews_count + ' reviews)</p>' +
      '<p class="card-text">' + hit.food_type + ' |' + hit.city + ' |' + hit.neighborhood + ' |' + hit.price_range + '<p>' +
      '</div>' +
      '</div>')
  });
  $hits.html(hits);
}

function renderFacets($facets, results) {
  var facets = results.facets.map(function (facet) {
    var name = facet.name;
    var header = '<h4>' + upper(name) + '</h4>';
    var facetValues = results.getFacetValues(name);
    var facetsValuesList = $.map(facetValues, function (facetValue) {
      var facetValueClass = facetValue.isRefined ? 'refined' : '';
      var valueAndCount = '<a data-attribute="' + name + '" data-value="' + facetValue.name + '" href="#">' + facetValue.name + ' (' + facetValue.count + ')' + '</a>';
      return '<li class="' + facetValueClass + '">' + valueAndCount + '</li>';
    })
    return header + '<ul>' + facetsValuesList.join('') + '</ul>';
  });

  $facets.html(facets.join(''));
}
