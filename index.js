'use strict'

const apiKey = 'IqB7n0Lfd5pKWbexq2fQQ0PzPbd3MyRi3lZLlTWc';
const searchUrl = 'https://developer.nps.gov/api/v1/parks';

function formatQueryParameters(params) {
    const queryItems = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function getParks(query, limit, fields) {
    const params = {
        stateCode: query,
        fields: "addresses",
        api_key: apiKey,
        limit
    }

    const queryString = formatQueryParameters(params);
    const url = searchUrl + '?' + queryString;

    console.log(url);

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson))
        .catch(error => {
            $("#js-error-message").text(`Something went wrong: ${error.message}`);
        });
}

function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        const searchTerm = $('#js-search-term').val();
        const limit = ($('#js-max-results').val() - 1);
        const fields = "addresses";
        getParks(searchTerm, limit, fields);
    });
}

function displayResults(responseJson) {
    console.log(responseJson)
    $("#results-list").empty();

    for (let i = 0; i < responseJson.data.length; i++) {
        $("#results-list").append(`<li><h3>${responseJson.data[i].fullName}</h3>
    <p>${responseJson.data[i].description}</p>
    <a href="${responseJson.data[i].url}">${responseJson.data[i].url}</a></li>
    <p><b>Address: </b>${responseJson.data[i].addresses[0].line1} 
                       ${responseJson.data[i].addresses[0].line2}<br>
                       ${responseJson.data[i].addresses[0].city}, ${responseJson.data[i].addresses[0].stateCode} ${responseJson.data[i].addresses[0].postalCode}`)
    };
    $("#results").removeClass("hidden");
}

$(watchForm);