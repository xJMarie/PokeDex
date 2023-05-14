let apiURL = 'https://pokeapi.co/api/v2/';
let pokemons = [];   // List of fetched Pokemons
let showCardDetails = false;

/* Type chart of Pokemon 
   Source:  https://www.eurogamer.net/pokemon-go-type-chart-effectiveness-weaknesses */
const typeChart = {
   "normal": ["rock", "ghost", "steel"],
   "fighting": ["flying", "poison", "psychic", "bug", "ghost", "fairy"],
   "flying": ["rock", "steel", "electric"],
   "poison": ["poison", "ground", "rock", "ghost", "steel"],
   "ground": ["flying", "bug", "grass"],
   "rock": ["fighting", "ground", "steel"],
   "bug": ["fighting", "flying", "poison", "ghost", "steel", "fire", "fairy"],
   "ghost": ["normal", "dark"],
   "steel": ["steel", "fire", "water", "electric"],
   "fire": ["rock", "fire", "water", "dragon"],
   "water": ["water", "grass", "dragon"],
   "grass": ["flying", "poison", "bug", "steel", "fire", "grass", "dragon"],
   "electric": ["ground", "grass", "electric", "dragon"],
   "psychic": ["steel", "psychic", "dark"],
   "ice": ["steel", "fire", "water", "ice"],
   "dragon": ["steel", "fairy"],
   "fairy": ["poison", "steel", "fire"],
   "dark": ["fighting", "dark", "fairy"]
};

// Search list of Pokemons
$('#searchbar').on('submit', function (event) {
   event.preventDefault(); // prevent default form submission behavior
   let query = $('#search').val().toLowerCase();
   $('#card_list > div').each(function () {
      let id = $(this).find('p').text().toLowerCase();
      let name = $(this).find('h1').text().toLowerCase();
      let cardTitle = `${id} ${name}`;
      $(this).toggle(cardTitle.includes(query));
   });
   $('#load_more').toggle(!query);
});

$('#search').on('input', function () {
   let query = $(this).val().toLowerCase();
   $('#card_list > div').each(function () {
      let id = $(this).find('p').text().toLowerCase();
      let name = $(this).find('h1').text().toLowerCase();
      let cardTitle = `${id} ${name}`;
      $(this).toggle(cardTitle.includes(query));
   });
   $('#load_more').toggle(!query);
});

// Function to sort the Pokemons
function sort() {
   let selectedOption = $('#sortby').val();
   let [type, order] = selectedOption.split('_');

   switch (type) {
      case 'id-no':
         if (order === 'ascending') {
            $('#card_list').children().sort((a, b) => {
               let aId = parseInt($(a).find('p').text().slice(1));
               let bId = parseInt($(b).find('p').text().slice(1));
               return aId - bId;
            }).appendTo('#card_list');
         } else if (order === 'descending') {
            $('#card_list').children().sort((a, b) => {
               let aId = parseInt($(a).find('p').text().slice(1));
               let bId = parseInt($(b).find('p').text().slice(1));
               return bId - aId;
            }).appendTo('#card_list');
         }
         break;
      case 'name':
         if (order === 'ascending') {
            $('#card_list').children().sort((a, b) => {
               let aName = $(a).find('h1').text().toLowerCase();
               let bName = $(b).find('h1').text().toLowerCase();
               return aName.localeCompare(bName);
            }).appendTo('#card_list');
         } else if (order === 'descending') {
            $('#card_list').children().sort((a, b) => {
               let aName = $(a).find('h1').text().toLowerCase();
               let bName = $(b).find('h1').text().toLowerCase();
               return bName.localeCompare(aName);
            }).appendTo('#card_list');
         }
         break;
      default:
         break;
   }
}

// Add event listener for select element
$('#sortby').change(function () {
   sort();
});

// Show the Pokemons
function showCards() {
   const cardDetail = $('#details');

   if (showCardDetails) {
      if (cardDetail.hasClass('hidden')) {
         cardDetail.removeClass('hidden');
      }
      $('#details').addClass('hidden');
      $('#searchbar').removeClass('hidden');
      $('#sortby').removeClass('hidden');

      $('#cards').show();
   } else {
      // The card list is already showing, so don't do anything
      return;
   }

   showCardDetails = false;
}

// Show card details
function showDetails(id) {
   // Hide all card lists and show the card detail
   $('#cards').hide();
   $('#details').removeClass('hidden');
   $('#searchbar').addClass('hidden');
   $('#sortby').addClass('hidden');
   showCardDetails = true;

   getInformation(id);
}

// Function to go to the previous Pokemon
function prevPokemon() {
   let idToFind = parseInt($('#pokemon-id').text().substring(1));
   let index = -1;

   for (let i = 0; i < pokemons.length; i++) {
      if (pokemons[i].id === idToFind) {
         index = i;
         break;
      }
   }

   if (index > 0) {
      index--;
      showDetails(pokemons[index].id);
   }
}

// Function to go to the next Pokemon
function nextPokemon() {
   let idToFind = parseInt($('#pokemon-id').text().substring(1));
   let index = -1;

   for (let i = 0; i < pokemons.length; i++) {
      if (pokemons[i].id === idToFind) {
         index = i;
         break;
      }
   }

   index++;

   // Check if the index is still within the bounds of the pokemons array
   if (index < pokemons.length) {
      showDetails(pokemons[index].id);
   }
}

// Function to get the Pokemon information
async function getInformation(id) {
   let imageUrl = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${id}.png`;
   $('#pokemon-image').attr('src', imageUrl);

   $.get(`${apiURL}pokemon/${id}`, function (pokemonData) {
      $('#pokemon-id').text(`#${pokemonData.id}`);
      $('#pokemon-name').text(`${pokemonData.name}`);
      $('#base_experience').text(pokemonData.base_experience);
      $('#height').text(pokemonData.height);
      $('#is_default').text(pokemonData.is_default);
      $('#order').text(pokemonData.order);
      $('#weight').text(pokemonData.weight);
      $('#abilities').text(pokemonData.abilities.map((ability) => ability.ability.name).join(", "));
      $('#forms').text(pokemonData.forms.map((form) => form.name).join(", "));
      $('#game_indices').text(pokemonData.game_indices.map((version) => version.version.name).join(", "));
      $('#held_items').text(pokemonData.held_items.map((item) => item.item.name).join(", "));
      $('#location_area_encounters').text(pokemonData.location_area_encounters);
      $('#moves').text(pokemonData.moves.map((move) => move.move.name).join(", "));
      $('#past_types').text(pokemonData.past_types.map((generation) => generation.generation.name).join(", "));

      sprites = pokemonData.sprites;
      let spriteKeys = ["back_default", "back_shiny", "front_default", "front_shiny"]; // desired sprite keys
      $('#sprites').empty(); // remove existing sprites

      for (let i = 0; i < spriteKeys.length; i++) {
         let spriteKey = spriteKeys[i];
         let spriteUrl = sprites[spriteKey];
         if (spriteUrl) {
            let img = document.createElement('img');
            img.setAttribute('src', spriteUrl);
            img.classList.add('w-32', 'h-32');
            $('#sprites').append(img);
         }
      }

      $('#species').text(pokemonData.species.name);
      $('#stats').text(pokemonData.stats.map((stat) => stat.stat.name).join(", "));

      let typesList = [];
      for (let i = 0; i < pokemonData.types.length; i++) {
         typesList.push(pokemonData.types[i].type.name.toLowerCase());
      }

      $('#types').text(typesList.join(", "));

      $('#weaknesses').empty();
      let weaknessesList = document.getElementById('weaknesses');

      typesList.forEach(typeName => {
         let typeWeaknesses = typeChart[typeName];
         if (typeWeaknesses) {
            let typeItem = document.createElement('li');
            typeItem.textContent = `${typeName} :: ${typeWeaknesses.join(", ")}`;
            weaknessesList.appendChild(typeItem);
         }
      });
   });
}

// Fetch pokemon
async function fetchPokemon(id) {
   let response = await fetch(`${apiURL + 'pokemon'}/${id}`);
   let pokemonData = await response.json();
   return {
      id: pokemonData.id,
      name: pokemonData.name,
      types: pokemonData.types
   };
}

// Generate card for a single pokemon card
function generateCard(pokemon) {
   let id = pokemon.id;
   let name = pokemon.name;
   let imageUrl = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${id}.png`;
   let types = pokemon.types.map((type) => type.type.name).join(", ");

   return `
   <div class="flex flex-col items-center w-60 bg-gray-100 border border-gray-200 rounded-lg shadow" onclick="showDetails(${id})">
      <img class="rounded-t-lg w-32 h-32 p-3" src="${imageUrl}" alt="${name}" />
      
      <div class="p-3 flex flex-col items-center">
      <p class="text-gray-400">#${id}</p>
      <h1
         class="mb-2 text-xl font-bold tracking-tight text-gray-500 capitalize"
      >
         ${name}
      </h1>

      <h2
         class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-yellow-700 rounded-lg"
      >
         ${types}
      </h2>
      </div>
   </div>
   `;
}

// Generate HTML for a list of pokemon cards
function generateCardList(pokemons) {
   let cardListElement = document.querySelector("#card_list");

   pokemons.forEach((pokemon) => {
      let cardHTML = generateCard(pokemon);
      cardListElement.innerHTML += cardHTML;
   });
}

// Generate an array of random pokemon IDs
function generateRandomPokemonIds(numberOfPokemon) {
   let maxId = 898; // the highest ID for a Pokemon in the PokeAPI
   let pokemonIds = new Set();

   while (pokemonIds.size < numberOfPokemon) {
      let id = Math.floor(Math.random() * maxId) + 1;
      pokemonIds.add(id);
   }

   return [...pokemonIds].sort((a, b) => a - b);
}

// check if the pokemon is unique
async function isValid(newPokemon) {
   let pokemonName = newPokemon.name;

   // Check if the newPokemon already exists in the pokemon list
   if (!pokemonName || pokemons.some(p => p.name.toLowerCase() === pokemonName.toLowerCase())) {
      return false;
   } else {
      return true;
   }
}

// Function to generate new Pokemons
async function generatePokemon() {
   let counter = 0
   let nPokemons = 10;
   while (counter < nPokemons) {
      let pokemonIds = generateRandomPokemonIds(nPokemons);
      let newPokemons = []

      for (let id of pokemonIds) {
         let pokemon = await fetchPokemon(id);

         if (isValid(pokemon)) {
            pokemons.push(pokemon);
            newPokemons.push(pokemon);
            counter++;
         }
      }
      generateCardList(newPokemons);
   }
}

// Call the main function to generate and display the pokemon
$(document).ready(function () {
   generatePokemon();
});