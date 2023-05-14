# Pokédex

<br/><p align="center"><img src="img/pokedex.png" width="250" height="250"></p><br/>

The goal of this project is to create a Pokédex, which is a simple catalogue webpage that allows users to view and filter information about different Pokémon.

# Contents:

- [index.html](index.html) - This file contains the main HTML structure of the web app.
- [app.js](app.js) - This file contains the JavaScript code that defines callback functions for handling HTTP requests.

# Page View:

- Home Page

  - Card view list of fetched Pokémons
  - Filtering and sorting of the list

- Card View List

  - Each card will be showing the ID No, Name, Photo, and Type.
  - Can be sorted by ID No or name.
  - Can be searched and filtered by ID No or Name.
  - Upon clicking the card, detailed info will be shown.
  - The initial load of the list will be 10 Pokémons then below is the “Load More” button. By clicking the "Load More" button it will display the next 10 Pokémonss, and so on.
  - **Note**: _The initial load of the Pokémons are randomly generated._

- Detailed Info View
  - Display more detailed information of specific Pokémons. (All necessary info from API like ID No, Name, Height, Types, Categories, Stats, etc..).
  - Source: https://www.eurogamer.net/pokemon-go-type-chart-effectiveness-weaknesses
