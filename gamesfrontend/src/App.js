import './App.css';
import { useEffect, useState } from 'react';
import {POKEMON_IMAGES, ITEM_IMAGES, TYPE_IMAGES} from './assets';
import axios from 'axios';

// import { FixedSizeList } from "react-window";


function App() {
  let pokemon = {
   "charmander" : 
   [
      {
        name: "Charmander",
        type1: "FIGHTING",
        type2: "",
        attacks: ["Flamethrower", "Dragon Pulse", "Solarbeam", "Overheat"],
        ability: "Blaze",
        nature: "Modest",
        holdItem: "Choice Specs",
        evs: ["Special Attack", "Speed"]
      },
      {
        name: "Charmander",
        type1: "BUG",
        type2: "",
        attacks: ["Flamethrower", "Air Slash", "Solarbeam", "Sunny Day"],
        ability: "Solar Power",
        nature: "Modest",
        holdItem: "Life Orb",
        evs: ["Special Attack", "Speed"]
      }
    ],

  "squirtle" : 
    [
      {
        name: "Squirtle",
        type1: "WATER",
        type2: "",
        attacks: ["Surf", "Ice Beam", "Dark Pulse", "Aura Sphere"],
        ability: "Torrent",
        nature: "Quiet",
        holdItem: "Choice Specs",
        evs: ["Special Attack", "HP", "Defense"]
      },
      {
        name: "Squirtle",
        type1: "ICE",
        type2: "",
        attacks: ["Surf", "Ice Beam", "Dark Pulse", "Rain Dance"],
        ability: "Torrent",
        nature: "Bold",
        holdItem: "Leftovers",
        evs: ["Special Defense", "HP", "Defense"]
      },
    ],
  "bulbasaur" :
    [
      {
        name: "Bulbasaur",
        type1: "ROCK",
        type2: "",
        attacks: ["Sludge Bomb", "Earthquake", "Weather Ball", "Petal Dance"],
        ability: "Overgrow",
        nature: "Quirky",
        holdItem: "Life Orb",
        evs: ["Special Attack", "Special Defense"]
      },
      {
        name: "Bulbasaur",
        type1: "GROUND",
        type2: "",
        attacks: ["Leaf Storm", "Sludge Bomb", "Hidden Power", "Rock Slide"],
        ability: "Overgrow",
        nature: "Timid",
        holdItem: "Leftovers",
        evs: ["Special Attack", "Speed"]
      }
    ]
  }

  let testList = [
      {
        "id": 1,
        "name": "Charmander",
        "type1": "FIRE",
        "type2": "",
        "item": "",
        "attack1": "Flamethrower",
        "attack2": "Dragon Pulse",
        "attack3": "Solar Beam",
        "attack4": "Overheat",
        "nature": "Modest",
        "ev1": "Sp Atk",
        "ev2": "Speed",
        "ev3": ""
    },
    {
        "id": 2,
        "name": "Squirtle",
        "type1": "WATER",
        "type2": "",
        "item": "Life Orb",
        "attack1": "Surf",
        "attack2": "Ice Beam",
        "attack3": "Aura Sphere",
        "attack4": "Dark Pulse",
        "nature": "Modest",
        "ev1": "Sp Atk",
        "ev2": "HP",
        "ev3": "Sp Def"
    },
    {
        "id": 3,
        "name": "Bulbasaur",
        "type1": "GRASS",
        "type2": "POISON",
        "item": "Leftovers",
        "attack1": "Leaf Storm",
        "attack2": "Toxic",
        "attack3": "Protect",
        "attack4": "Sludge Bomb",
        "nature": "Timid",
        "ev1": "Sp Atk",
        "ev2": "HP",
        "ev3": ""
    }
  ]

  const [searchInput, setSearchInput] = useState("");
  const [pokemonList, setPokemonList] = useState([]);
  const [pokemonRenderList, setPokemonRenderList] = useState([]);

  useEffect( () => {
    let data;
    axios({
      method: 'get',
      url: 'http://localhost:8000/pokemon',
    }).then(response => {
      data = response.data;
      setPokemonList(data);
    }).catch(err => {})
  }, []);


  let searchBarProps = {
    input : searchInput,
    setInput : setSearchInput,
    renderList : pokemonRenderList,
    setRenderList : setPokemonRenderList,
    pokemonList : pokemonList
  }

  let resetButtonProps = {
    renderList : pokemonRenderList,
    setRenderList : setPokemonRenderList,
    pokemonList : pokemonList
  }

  console.log(pokemonList);

  return (
    <div>
      <div className="searchContainer">
        <SearchBar searchBarProps = {searchBarProps} />
        <ResetButton resetButtonProps = {resetButtonProps}/>
      </div>
      <div className="pokemonContainer">
        {
          pokemonRenderList.length == 0 ? testList.length != 0 && pokemonList.map((pokemon) => <Pokemon data={pokemon} />):
          pokemonRenderList.map((pokemon) => <Pokemon data={pokemon} />)
        }
      </div>


      {/* <div className="pokemonContainer">  
        {
          Array.isArray(pokemonRenderList) ? pokemonRenderList.map((pokemon) => <Pokemon data={pokemon} />) : 
          Object.values(pokemonRenderList).map((pokemonName) => (pokemonName).map((pokemon) => <Pokemon data={pokemon} />))
        }
      </div> */}
    </div>
    
  );
}

function SearchBar(props){
  function handleSearch(event){
    if(event.key === 'Enter'){
      let query = event.target.value.toLowerCase()
      props.searchBarProps.setInput(query);
      event.target.value = "";

      let renderList = props.searchBarProps.pokemonList.filter(
        (pokemon) => {return pokemon.name.toLowerCase() === query})
      
      if(renderList.length > 0){
        props.searchBarProps.setRenderList(renderList);
      }
    }
  }

  return (
    <div className="searchBarContainer">
      <input type="search" className="searchBar" placeholder="Enter a Pokemon name" onKeyDown={handleSearch} label="Search"/>
    </div>

  )
}

function ResetButton(props){

  function handleClick(event){
    props.resetButtonProps.setRenderList([])
  }

  return (
    <div className="resetButtonContainer">
      <button className="resetButton" onClick={handleClick}>Show All Pokemon</button>
    </div>
  )
}


function Pokemon(props){
  //name, type1, type2, item, attacks, ability, nature, evs, image
  let pokemonImageName = props.data.name.toLowerCase();
  let itemImageName = props.data.item.split(" ").join("").toLowerCase();
  let backgroundColor1 = getBackgroundColor(props.data.type1.toUpperCase());
  let backgroundColor2 = props.data.type2 != "" ? getBackgroundColor(props.data.type2.toUpperCase()) : backgroundColor1;

  let backgroundStyle = {
    background: `linear-gradient(180deg, ${backgroundColor1} 50%, ${backgroundColor2} 50%)`,
  }


  function getBackgroundColor(type){
    let color = ""

    switch(type){
      case "FIRE":
        color = "#EE8130";
        break;
      case "WATER":
        color = "#6390F0";
        break;
      case "GRASS":
        color = "#7AC74C";
        break;
      case "NORMAL":
        color = "#A8A77A";
        break;
      case "GROUND":
        color = "#E2BF65";
        break;
      case "ROCK":
        color = "#B6A136";
        break;
      case "FLYING":
        color = "#A98FF3";
        break;
      case "STEEL":
        color = "#B7B7CE";
        break;
      case "DARK":
        color = "#705746";
        break;
      case "PSYCHIC":
        color = "#F95587";
        break;
      case "FAIRY":
        color = "#D685AD";
        break;
      case "BUG":
        color = "#A6B91A";
        break;
      case "ELECTRIC":
        color = "#F7D02C";
        break;
      case "POISON":
        color = "#A33EA1";
        break;
      case "FIGHTING":
        color = "#C22E28";
        break;
      case "GHOST":
        color = "#735797";
        break;
      case "DRAGON":
        color = "#6F35FC";
        break;
      default :
        color = "#96D9D6";
    }

    return color;
  }

  return (
    <div className="pokemonCard" style={backgroundStyle}>
      <div className="pokemonBackground spanColumns">
        <img src={POKEMON_IMAGES[pokemonImageName]} className="pokemonImage"/>
        <h2>{props.data.name}</h2>

      </div>

      <div className="attacks">
        <div className="typeImageContainer">
          <img src={TYPE_IMAGES[props.data.type1.toLowerCase()]} className="typeImage"/>
          {props.data.type2 != "" && <img src={TYPE_IMAGES[props.data.type2.toLowerCase()]} className="typeImage"/>}
        </div>

        <div className="itemImageContainer">
        {props.data.item != "" && <img src={ITEM_IMAGES[itemImageName]} className="itemImage"/>}
        </div>

        <h3 className="spanColumns">Attacks</h3>
        <p>{props.data.attack1}</p>
        <p>{props.data.attack2}</p>
        <p>{props.data.attack3}</p>
        <p>{props.data.attack4}</p>
        {/* {props.data.attacks.map((attack) => <p>{attack}</p>)} */}
      </div>

      <div className="pokemonInfo spanColumns">
        {/* <div>
            <h3>Ability</h3>
            <p>{props.data.ability}</p>
        </div> */}
        <div>
            <h3>Nature</h3>
            <p>{props.data.nature}</p>
        </div>
        {/* <div>
            <h3>Hold Item</h3>
            {props.data.item != "" && <img src={ITEM_IMAGES[itemImageName]} className="itemImage"/>}
        </div> */}
        <div>
            <h3>EVs</h3>
            <p>{props.data.ev1}</p>
            <p>{props.data.ev2}</p>
            <p>{props.data.ev3}</p>
            {/* {props.data.evs.map((ev) => <p>{ev}</p>)} */}
        </div>
      </div>
    </div>
  );
}

export default App;
