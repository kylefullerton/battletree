import './App.css';
import { useEffect, useState, useRef } from 'react';
import {POKEMON_IMAGES, ITEM_IMAGES, TRAINER_IMAGES, TYPE_IMAGES, SITE_IMAGES} from './assets';
import axios from 'axios';


function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [pokemonRenderList, setPokemonRenderList] = useState([]);
  const [trainerList, setTrainerList] = useState([]);
  const [trainerRenderList, setTrainerRenderList] = useState([]);
  const [searchPokemon, setSearchPokemon] = useState(false);
  const [trainerSelected, setTrainerSelected] = useState({});
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect( () => {
    let data;
    axios({
      method: 'get',
      url: process.env.REACT_APP_POKEMON_URL,
    }).then(response => {
      data = response.data;
      setPokemonList(data);
      setPokemonRenderList(data);
    }).catch(err => {})

    axios({
      method: 'get',
      url: process.env.REACT_APP_TRAINER_URL
    }).then(response => {
      data = response.data
      setTrainerList(data)
      setTrainerRenderList(data)
    }).catch(err => {})
  }, []);


  let searchBarProps = {
    renderList : pokemonRenderList,
    setRenderList : setPokemonRenderList,
    pokemonList : pokemonList,
    searchPokemon: searchPokemon,
    trainerList: trainerList,
    setTrainerRenderList: setTrainerRenderList,
    setTrainerSelected: setTrainerSelected,
    suggestions: suggestions, 
    setSuggestions: setSuggestions,
    showSuggestions: showSuggestions,
    setShowSuggestions: setShowSuggestions
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

  let dropDownProps = {
    setPokemonRenderList: setPokemonRenderList,
    setPokemonList: setPokemonList,
    setTrainerList: setTrainerList,
    setTrainerRenderList: setTrainerRenderList,
    setTrainerSelected: setTrainerSelected
  }

  let radioButtonProps = {
    searchPokemon: searchPokemon,
    setSearchPokemon: setSearchPokemon,
    trainerSelected: trainerSelected,
    setSuggestions: setSuggestions
  }

  let trainerProps = {
    trainerSelected: trainerSelected,
    setTrainerSelected: setTrainerSelected
  }


  return (
    <div>
      <h1 style={{"textAlign": "center", "marginLeft": ".5rem", "marginRight": ".5rem"}}>
        Battle Facility Pokemon & Trainers
      </h1>
      <div className="searchBarContainer">
        <SearchBar searchBarProps = {searchBarProps} />
      </div>
      
      <div className="buttonContainer">
        <ResetButton resetButtonProps = {resetButtonProps}/>
        <Dropdown dropDownProps = {dropDownProps}/>
        <RadioButton radioButtonProps = {radioButtonProps}/>
      </div>
      <ScrollButton />
      {Object.keys(trainerSelected).length != 0 && 
      (
        <div>
          <Trainer data={trainerSelected} trainerProps={trainerProps} id="trainerSelected"/>
          <div className="pokemonContainer">
            {trainerSelected.pokemon.map((pokemonObject) => <Pokemon key={pokemonObject["name"]} data={pokemonObject} />)}
          </div>
        </div>
      )
      }

      {Object.keys(trainerSelected).length == 0 &&
      (
        <div className="pokemonContainer">  
          {searchPokemon ? (
            Array.isArray(pokemonRenderList) ? pokemonRenderList.map((pokemon) => <Pokemon key={pokemon["name"]} data={pokemon} />) : 
            Object.values(pokemonRenderList).map((pokemonName) => (pokemonName).map((pokemon) => <Pokemon key={pokemon["name"]} data={pokemon}/>))
          ) : (
            Array.isArray(trainerRenderList) ? trainerRenderList.map((trainer) => 
            <Trainer  key={trainer["trainerClass"] + " " + trainer["name"]} data={trainer} trainerProps={trainerProps} />) : 
            Object.values(trainerRenderList).map((trainerName) => (trainerName).map((trainer) =>
             <Trainer key={trainer["trainerClass"] + " " + trainer["name"]} data={trainer} trainerProps={trainerProps} />))
          )
          }
        </div>
      )
      }
    </div>
    
  );
}

function SearchBar(props){
  let placeholderText;
  props.searchBarProps.searchPokemon ? placeholderText = "Enter a Pokemon name" : placeholderText = "Enter a trainer name";

  function handleSearch(event){
    if(event.key === 'Enter' || event.type === "click"){
      let query;
      props.searchBarProps.setSuggestions([])

      if(event.type === 'click'){
        query = event.target.innerText.toLowerCase();
        event.target.parentNode.parentNode.childNodes[0].value = "";
      }
      else{
        query = event.target.value.toLowerCase();
        event.target.value = "";
      }
      
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
            props.searchBarProps.setTrainerSelected(trainerDict[query][0]);
          }
          else{
            props.searchBarProps.setTrainerSelected({});
            props.searchBarProps.setTrainerRenderList(trainerDict[query]);
          }
        }
      }
    }
  }

  function handleSuggestions(event){
    let suggestionLength = 6
    if (event.target.value.length == 0){
      props.searchBarProps.setSuggestions([]);
      return;
    }

    let currentQuery = event.target.value.toLowerCase();
    let pokemonList = Object.keys(props.searchBarProps.pokemonList);
    let trainerList = Object.keys(props.searchBarProps.trainerList);
    let suggestionList;

    props.searchBarProps.searchPokemon ?
    suggestionList = pokemonList.filter((pokemonName) => pokemonName.startsWith(currentQuery)):
    suggestionList = trainerList.filter((trainerName => trainerName.startsWith(currentQuery)));

    suggestionList.length < suggestionLength ? props.searchBarProps.setSuggestions(suggestionList) : 
    props.searchBarProps.setSuggestions(suggestionList.slice(0,suggestionLength - 1));
  }


  function cleanImageName(name){
    const punctuation = /[-.:\']/g;
    let imageName = name.replace(punctuation, "").split(" ");
    imageName = imageName.join("").toLowerCase();
    return imageName;
  }

  function handleFocus(event){
    props.searchBarProps.setShowSuggestions(true);
  }

  function handleBlur(event){
    setTimeout(() => {
      props.searchBarProps.setShowSuggestions(false);
      props.searchBarProps.setSuggestions([]);
    }, 200)

  }

  

  return (
    <div className="searchBarContainer">
      <input type="search" className="searchBar" id="searchBar"
        placeholder={placeholderText} onKeyDown={handleSearch}
        onChange={handleSuggestions} onFocus={handleFocus} onBlur={handleBlur} label="Search"
      />
      {props.searchBarProps.showSuggestions &&
        <ul className="autoCompleteList">
          {props.searchBarProps.suggestions.map((suggestion) => 
            <li onClick={handleSearch} key={suggestion} id={suggestion}>
                {props.searchBarProps.searchPokemon &&
                  <img src={POKEMON_IMAGES[cleanImageName(suggestion)]}></img>
                }
                <span className='suggestionText'>{suggestion.charAt(0).toUpperCase() + suggestion.slice(1)}</span>
            </li>
            )}
        </ul>
      }

    </div>
  )
}

function RadioButton(props){
  let searchPokemonSource = props.radioButtonProps.searchPokemon ? SITE_IMAGES["pokeball"] : SITE_IMAGES["blankpokeball"];
  let searchTrainerSource = props.radioButtonProps.searchPokemon ? SITE_IMAGES["blankpokeball"] : SITE_IMAGES["pokeball"];

  function handleButtonPress(event, searchType){
    // props.radioButtonProps.setSuggestions([]);
    searchType === "trainer" ? 
      props.radioButtonProps.setSearchPokemon(false):
      props.radioButtonProps.setSearchPokemon(true)
  }

  return (
    <div className="radioButtonContainer">
      <div style={{"marginBottom": ".5rem"}}>
        <img className="radioButton" src={searchPokemonSource} alt="radioButtonPokeballIcon" onClick={(event) => handleButtonPress(event, "pokemon")}/>
        <label className="radioButtonLabel">Search Pokemon</label>
      </div>


      <div>
        <img className="radioButton" src={searchTrainerSource} alt="radioButtonPokeballIcon" onClick={(event) => handleButtonPress(event, "trainer")}/>
        <label className="radioButtonLabel">Search Trainers</label>
      </div>
    </div>
  )
}

function Dropdown(props){
  let gameOptions = [
    {
      "gameName": "Emerald",
      "value": "E",
    },
    {
      "gameName": "Diamond/Pearl",
      "value": "DP"
    },
    {
      "gameName": "Platinum/Heart Gold/Soul Silver",
      "value": "PHGSS"
    },
    {
      "gameName": "Black/White/Black 2/White 2",
      "value": "BWB2W2"
    },
    {
      "gameName": "X/Y/Omega Ruby/Alpha Saphire",
      "value": "XYORAS"
    },
    {
      "gameName": "Sun/Moon/Ultra Sun/Ultra Moon",
      "value": "SMUSUM"
    },

  ]

  function handleOptionSelected(event){
    let data;
    props.dropDownProps.setTrainerSelected({})
    axios({
      method: 'get',
      url: process.env.REACT_APP_POKEMON_URL + event.target.value
    }).then(response => {
      data = response.data;
      props.dropDownProps.setPokemonList(data);
      props.dropDownProps.setPokemonRenderList(data);
    }).catch(err => {})
  
    axios({
      method: 'get',
      url: process.env.REACT_APP_TRAINER_URL + event.target.value
    }).then(response => {
      data = response.data;
      props.dropDownProps.setTrainerList(data);
      props.dropDownProps.setTrainerRenderList(data);
    }).catch(err => {})
  }

  return (
    <div className="dropDownContainer">
      <label className="dropDownLabel">Select Pokemon Game(s): </label>
      <select onChange={handleOptionSelected} style={{"fontSize": "1.1rem"}}>
        {
          gameOptions.map((game) => 
          <option value={game["value"]} >
            {game["gameName"]}
          </option>)
        }
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
    <div className="resetButtonParent">
      <button className="resetButton" onClick={handleClick}>Reset</button>
    </div>
  )
}

function ScrollButton(props){

  function goToTop(event){
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  return(
    <div>
      <button className="scrollButton" id="topButton" onClick={goToTop}>Up</button>
    </div>
  )
}


function Pokemon(props){
  const punctuation = /[-.:\']/g;
  let backgroundColorTypes = {
    "FIRE": "#EE8130",
    "WATER": "#6390F0",
    "GRASS": "#7AC74C",
    "NORMAL": "#A8A77A",
    "GROUND": "#E2BF65",
    "ROCK": "#B6A136",
    "FLYING": "#A98FF3",
    "STEEL": "#B7B7CE",
    "DARK": "#705746",
    "PSYCHIC": "#F95587",
    "FAIRY": "#D685AD",
    "BUG":" #A6B91A",
    "ELECTRIC": "#F7D02C",
    "POISON": "#A33EA1",
    "FIGHTING": "#C22E28",
    "GHOST": "#735797",
    "DRAGON": "#6F35FC",
    "ICE": "#96D9D6",
}

  let pokemonImageName = props.data.displayName.replace(punctuation, "").split(" ");
  pokemonImageName = pokemonImageName.join("").toLowerCase();
  
  let itemImageName = props.data.item.replace(punctuation,"").split(" ");
  itemImageName = itemImageName.join("").toLowerCase();

  let backgroundColor1 = backgroundColorTypes[props.data.type1.toUpperCase()];
  let backgroundColor2 = props.data.type2 != "" ? backgroundColorTypes[props.data.type2.toUpperCase()] : backgroundColor1;

  let backgroundStyle = {
    background: `linear-gradient(90deg, ${backgroundColor1} 50%, ${backgroundColor2} 50%)`,
  }

  return (
    <div className="pokemonCard" style={backgroundStyle}>
      <div className="pokemonBackground spanColumns">
        <h2>{props.data.displayName}</h2>
        <img src={POKEMON_IMAGES[pokemonImageName]} className="pokemonImage" alt={props.data.displayName}/>
      </div>

      <div className="imageContainer">
        <div className="typeImageContainer">
          <img src={TYPE_IMAGES[props.data.type1.toLowerCase()]} className="typeImage" alt={props.data.type1}/>
          {props.data.type2 != "" && <img src={TYPE_IMAGES[props.data.type2.toLowerCase()]} className="typeImage" alt={props.data.type2}/>}
        </div>
        <div className="itemImageContainer">
          <div className="tooltip">
            <span className="tooltipText">{props.data.item}</span>
            {props.data.item != "" && <img src={ITEM_IMAGES[itemImageName]} className="itemImage" alt={props.data.item}/>}
          </div>
          
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
  let backgroundColorTypes = {
    "ace trainer": "#6F35FC",
    "aether foundation": "#705746",
    "aroma lady": "#7AC74C",
    "parasol lady": "#7AC74C",
    "picnicker": "#7AC74C",
    "battle girl": "#C22E28",
    "backpacker": "#E2BF65",
    "bellhop": "#A8A77A",
    "cook": "#EE8130",
    "chef": "#EE8130",
    "dancer": "#E2BF65",
    "firefighter": "#EE8130",
    "golfer": "#7AC74C",
    "janitor": "#A8A77A",
    "madame": "#96D9D6",
    "office worker": "#A8A77A",
    "pokemon center lady": "#D685AD",
    "police officer": "#705746",
    "policeman": "#705746",
    "preschooler": "#A8A77A",
    "punk girl": "#A33EA1",
    "punk guy": "#A33EA1",
    "rising star": "#B7B7CE",
    "scientist": "#F7D02C",
    "sightseer": "#A98FF3",
    "tourist": "#A98FF3",
    "veteran": "#B7B7CE",
    "youth athlete": "#7AC74C",
    "artist": "#D685AD",
    "butler": "#F95587",
    "black belt": "#C22E28",
    "bird keeper": "#A98FF3",
    "furisode girl": "#735797",
    "garcon": "#F95587",
    "gardener": "#7AC74C",
    "maid": "#F95587",
    "monsieur": "#96D9D6",
    "owner": "#96D9D6",
    "waitress": "#6390F0",
    "pokemon ranger": "#A98FF3",
    "baker": "#EE8130",
    "biker": "#705746",
    "clerk": "#A8A77A",
    "cyclist": "#E2BF65",
    "depot agent": "#B7B7CE",
    "doctor": "#96D9D6",
    "harlequin": "#A6B91A",
    "nurse": "#D685AD",
    "nursery aide": "#A8A77A",
    "pilot": "#A98FF3",
    "roughneck": "#A33EA1",
    "socialite": "#96D9D6",
    "waiter": "#6390F0",
    "bug catcher": "#A6B91A",
    "bug maniac":"#A6B91A",
    "cameraman": "#F7D02C",
    "camper": "#E2BF65",
    "clown": "#A6B91A",
    "cowgirl": "#E2BF65",
    "idol": "#D685AD",
    "jogger": "#E2BF65",
    "pi": "#705746",
    "poke kid": "#A8A77A",
    "rancher": "#E2BF65",
    "reporter": "#A8A77A",
    "worker": "#C22E28",
    "triathlete cyclist": "#F7D02C",
    "triathlete runner":"#A98FF3",
    "collector": "#F7D02C",
    "guitarist": "#F7D02C",
    "cool trainer": "#6F35FC",
    "dragon tamer": "#6F35FC",
    "expert": "#B7B7CE",
    "fairy tale girl": "#D685AD",
    "fisherman": "#6390F0",
    "sailor": "#6390F0",
    "swimmer": "#6390F0",
    "triathlete swimmer": "#6390F0",
    "tuber": "#6390F0",
    "gentleman": "#96D9D6",
    "rich boy": "#96D9D6",
    "hex maniac": "#735797",
    "hiker": "#B6A136",
    "ruin maniac": "#B6A136",
    "interviewer": "#A33EA1",
    "pokemaniac": "#A33EA1",
    "kindler": "#EE8130",
    "ninja boy":"#705746",
    "pokemon breeder":"#D685AD",
    "psychic": "#F95587",
    "youngster": "#A8A77A",
    "lass": "#A8A77A",
    "school kid": "#A8A77A",
    "schoolboy": "#A8A77A",
    "schoolgirl": "#A8A77A",
    "lady": "#A8A77A",
    "pokefan": "#A8A77A",
    "poke fan": "#A8A77A",
    "beauty": "#A8A77A",
    "cooltrainer": "#6F35FC",
    "roller skater": "#E2BF65"
  }

  let trainerName = props.data.trainerClass + " " + props.data.name;
  let trainerImageName = props.data.trainerClass + props.data.subClass;
  trainerImageName = trainerImageName.split(" ").join("").toLowerCase();
  let backgroundColor = backgroundColorTypes[props.data.trainerClass.toLowerCase()];
  let backgroundStyle = {
    background: backgroundColor
  }

  function handleClick(event, trainer){
    props.trainerProps.setTrainerSelected(trainer);
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  return (
    <div className="trainerCard" style={backgroundStyle} onClick={() => handleClick(event, props.data)}>
      <h1 style={{"margin": ".75rem"}}>{trainerName}</h1>
      <img src={TRAINER_IMAGES[trainerImageName]} className="trainerImage" alt={trainerName}/>
    </div>
  )
}



export default App;
