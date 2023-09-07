import './App.css';
import { useEffect, useState } from 'react';
import {POKEMON_IMAGES, ITEM_IMAGES, TRAINER_IMAGES, TYPE_IMAGES} from './assets';
import axios from 'axios';


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

  let trainer = {
    "name": "Carly",
    "trainerClass": "Hex Maniac",
    "imageName": "hexmaniac",
    "pokemon": []
  }

  const [searchInput, setSearchInput] = useState("");
  const [pokemonList, setPokemonList] = useState([]);
  const [pokemonRenderList, setPokemonRenderList] = useState([]);
  const [trainerList, setTrainerList] = useState([]);
  const [trainerRenderList, setTrainerRenderList] = useState([]);
  const [searchPokemon, setSearchPokemon] = useState(false);
  const [trainerSelected, setTrainerSelected] = useState({});

  useEffect( () => {
    let data;
    axios({
      method: 'get',
      url: 'http://localhost:8000/pokemon/',
    }).then(response => {
      data = response.data;
      setPokemonList(data);
      setPokemonRenderList(data);
    }).catch(err => {})

    axios({
      method: 'get',
      url: 'http://localhost:8000/trainer/'
    }).then(response => {
      data = response.data
      setTrainerList(data)
      setTrainerRenderList(data)
    }).catch(err => {})
  }, []);


  let searchBarProps = {
    input : searchInput,
    setInput : setSearchInput,
    renderList : pokemonRenderList,
    setRenderList : setPokemonRenderList,
    pokemonList : pokemonList,
    searchPokemon: searchPokemon,
    trainerList: trainerList,
    setTrainerRenderList: setTrainerRenderList,
    setTrainerSelected: setTrainerSelected
  }

  let resetButtonProps = {
    renderList : pokemonRenderList,
    setRenderList : setPokemonRenderList,
    pokemonList : pokemonList,
    trainerList: trainerList,
    trainerRenderList: trainerRenderList,
    setTrainerRenderList : setTrainerRenderList,
    searchPokemon : searchPokemon,
    setTrainerSelected: setTrainerSelected
  }

  let radioButtonProps = {
    searchPokemon: searchPokemon,
    setSearchPokemon: setSearchPokemon
  }

  let trainerProps = {
    trainerSelected: trainerSelected,
    setTrainerSelected: setTrainerSelected
  }

  return (
    <div>
      <h1 style={{textAlign: "center"}}>Emerald Battle Frontier Pokemon</h1>
      <div className="searchBarContainer">
        <SearchBar searchBarProps = {searchBarProps} />
      </div>
      
      <div className="buttonContainer">
        <ResetButton resetButtonProps = {resetButtonProps}/>
        <RadioButton radioButtonProps = {radioButtonProps}/>
      </div>
      {Object.keys(trainerSelected).length != 0 && 
      (
        <div>
          <Trainer data={trainerSelected} trainerProps={trainerProps} />
          <div className="pokemonContainer">
            {trainerSelected.pokemon.map((pokemonObject) => <Pokemon data={pokemonObject} />)}
          </div>
        </div>
      )
      }

      {Object.keys(trainerSelected).length == 0 &&
      (
        <div className="pokemonContainer">  
          {searchPokemon ? (
            Array.isArray(pokemonRenderList) ? pokemonRenderList.map((pokemon) => <Pokemon data={pokemon} />) : 
            Object.values(pokemonRenderList).map((pokemonName) => (pokemonName).map((pokemon) => <Pokemon data={pokemon}/>))
          ) : (
            Array.isArray(trainerRenderList) ? trainerRenderList.map((trainer) => <Trainer data={trainer} trainerProps={trainerProps} />) : 
            Object.values(trainerRenderList).map((trainerName) => (trainerName).map((trainer) =>
             <Trainer data={trainer} trainerProps={trainerProps} />))
          )
          }
        </div>
      )
      }
    </div>
    
  );
}

function SearchBar(props){
  function handleSearch(event){
    if(event.key === 'Enter'){
      let query = event.target.value.toLowerCase();
      props.searchBarProps.setInput(query);
      event.target.value = "";

      if(props.searchBarProps.searchPokemon){
        let pokemonDict = props.searchBarProps.pokemonList;
        if(query in pokemonDict){
          props.searchBarProps.setRenderList(pokemonDict[query]);
        }
      }

      else{
        query = query.split(" ");
        query = query[query.length - 1];
        let trainerDict = props.searchBarProps.trainerList;
        if(query in trainerDict){
          if(trainerDict[query].length == 1){
            console.log(props.searchBarProps);
            props.searchBarProps.setTrainerSelected(trainerDict[query][0]);
          }
          else{
            props.searchBarProps.setTrainerSelected({});
            props.searchBarProps.setTrainerRenderList(trainerDict[query]);
          }
        }
      }



      // let renderList = props.searchBarProps.pokemonList.filter(
      //   (pokemon) => {return pokemon.name.toLowerCase() === query})
      
      // if(renderList.length > 0){
      //   props.searchBarProps.setRenderList(renderList);
      // }
    }
  }

  return (
    <div className="searchBarContainer">
      <input type="search" className="searchBar" placeholder="Enter a Pokemon name" onKeyDown={handleSearch} label="Search"/>
    </div>

  )
}

function RadioButton(props){
  function handleButtonPress(event){
    event.target.value === "trainer" ? 
      props.radioButtonProps.setSearchPokemon(false):
      props.radioButtonProps.setSearchPokemon(true)
  }
  return (
    <div>
      <div className="radioButton">
        <input type="radio" id="pokemon" value="pokemon" onChange={handleButtonPress} 
        checked={props.radioButtonProps.searchPokemon}/>
        <label className="radioButtonLabel">Search Pokemon</label>
      </div>

      <div className="radioButton">
        <input type="radio" id="trainer" value="trainer" onChange={handleButtonPress} 
        checked={!props.radioButtonProps.searchPokemon}/>
        <label className="radioButtonLabel">Search Trainers</label>
      </div>
    </div>
  )
}

function Dropdown(){

  return (
    <div className="dropdownContainer">
      <label>Select Pokemon Game: </label>
      <select>
        <option>Emerald</option>
        <option>Diamond/Pearl</option>
      </select>
    </div>
  )
}

function ResetButton(props){

  function handleClick(event){
    if(props.resetButtonProps.searchPokemon){
      props.resetButtonProps.setRenderList(props.resetButtonProps.pokemonList);
    }

    else{
      props.resetButtonProps.setTrainerSelected({});
      props.resetButtonProps.setTrainerRenderList(props.resetButtonProps.trainerList);
    }
    
  }

  return (
    <div className="resetButtonContainer">
      <button className="resetButton" onClick={handleClick}>Reset</button>
    </div>
  )
}


function Pokemon(props){
  //name, type1, type2, item, attacks, ability, nature, evs, image
  let pokemonImageName = props.data.displayName.toLowerCase();
  let itemImageName = props.data.item.split(" ").join("").toLowerCase();
  let backgroundColor1 = getBackgroundColor(props.data.type1.toUpperCase());
  let backgroundColor2 = props.data.type2 != "" ? getBackgroundColor(props.data.type2.toUpperCase()) : backgroundColor1;

  let backgroundStyle = {
    background: `linear-gradient(90deg, ${backgroundColor1} 50%, ${backgroundColor2} 50%)`,
  }


  function getBackgroundColor(type){
    let color = ""

    switch(type.toUpperCase()){
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
        <h2>{props.data.displayName}</h2>
        <img src={POKEMON_IMAGES[pokemonImageName]} className="pokemonImage"/>
        
      </div>

      <div className="imageContainer">
        <div className="typeImageContainer">
          <img src={TYPE_IMAGES[props.data.type1.toLowerCase()]} className="typeImage"/>
          {props.data.type2 != "" && <img src={TYPE_IMAGES[props.data.type2.toLowerCase()]} className="typeImage"/>}
        </div>
        <div className="itemImageContainer">
          {props.data.item != "" && <img src={ITEM_IMAGES[itemImageName]} className="itemImage"/>}
        </div>
      </div>

      <div className="attacks">
        <h3 className="spanColumns">Attacks</h3>
        <p>{props.data.attack1}</p>
        <p>{props.data.attack2}</p>
        <p>{props.data.attack3}</p>
        <p>{props.data.attack4}</p>
      </div>

      <div className="pokemonInfo spanColumns">
        <div>
            <h3>Nature</h3>
            <p>{props.data.nature}</p>
        </div>
        <div>
            <h3>EVs</h3>
            <p>{props.data.ev1}</p>
            <p>{props.data.ev2}</p>
            <p>{props.data.ev3}</p>
            <p>{props.data.ev4}</p>
            <p>{props.data.ev5}</p>
            <p>{props.data.ev6}</p>
        </div>
      </div>
    </div>
  );
}

function Trainer(props){
  let trainerName = props.data.trainerClass + " " + props.data.name;
  let backgroundColor = getBackgroundColor(props.data.trainerClass);
  let backgroundStyle = {
    background: backgroundColor
  }


  function getBackgroundColor(trainerClass){
    let color = "";
    trainerClass = trainerClass.toLowerCase()

    switch(trainerClass){
      case "aroma lady":
      case "parasol lady":
      case "picknicker":
        color = "#7AC74C";
        break;
      case "battle girl":
      case "black belt":
        color = "#C22E28";
        break;
      case "bird keeper":
      case "pokemon ranger":
        color = "#A98FF3";
        break;
      case "bug catcher":
      case "bug maniac":
        color = "#A6B91A";
        break;
      case "camper":
      case "triathlete biker":
      case "triathlete runner":
        color = "#E2BF65";
        break;
      case "collector":
      case "guitarist":
        color = "#F7D02C";
        break;
      case "cool trainer":
      case "dragon tamer":
        color = "#6F35FC";
        break;
      case "expert":
        color = "#B7B7CE";
        break;
      case "fisherman":
      case "sailor":
      case "swimmer":
      case "triathlete swimmer":
      case "tuber":
        color = "#6390F0";
        break;
      case "gentleman":
      case "rich boy":
        color = "#96D9D6";
        break;
      case "hex maniac":
        color = "#735797";
        break;
      case "hiker":
      case "ruin maniac":
        color = "#B6A136";
        break;
      case "interviewer":
      case "poke maniac":
        color = "#A33EA1";
        break;
      case "kindler":
        color = "#EE8130";
        break;
      case "ninja boy":
        color = "#705746";
        break;
      case "pokemon breeder":
        color = "#D685AD";
        break;
      case "psychic":
        color = "#F95587";
        break;
      default:
        color = "#A8A77A";
    }
    return color;

  }

  function handleClick(event, trainer){
    
    props.trainerProps.setTrainerSelected(trainer);
  }

  return (
    <a>
    <div className="trainerCard" style={backgroundStyle} onClick={() => handleClick(event, props.data)}>
      <h1 style={{"margin": ".75rem"}}>{trainerName}</h1>
      <img src={TRAINER_IMAGES[props.data.imageName]} className="trainerImage"/>

    </div>
    </a>
  )
}



export default App;
