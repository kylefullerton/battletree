import './App.css';
import { useEffect, useState } from 'react';
import {POKEMON_IMAGES, ITEM_IMAGES, TRAINER_IMAGES, TYPE_IMAGES} from './assets';
import axios from 'axios';


function App() {
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
    setSearchPokemon: setSearchPokemon,
    trainerSelected: trainerSelected
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
      <ScrollButton />
      {Object.keys(trainerSelected).length != 0 && 
      (
        <div>
          <Trainer data={trainerSelected} trainerProps={trainerProps} id="trainerSelected"/>
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
  let placeholderText;
  props.searchBarProps.searchPokemon ? placeholderText = "Enter a Pokemon name" : placeholderText = "Enter a trainer name";

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

  return (
    <div className="searchBarContainer">
      <input type="search" className="searchBar" placeholder={placeholderText} onKeyDown={handleSearch} label="Search"/>
    </div>

  )
}

function RadioButton(props){
  let isDisabled = Object.keys(props.radioButtonProps.trainerSelected).length != 0;
  function handleButtonPress(event){
    event.target.value === "trainer" ? 
      props.radioButtonProps.setSearchPokemon(false):
      props.radioButtonProps.setSearchPokemon(true)
  }
  return (
    <div>
      <div className="radioButton">
        <input type="radio" id="pokemon" value="pokemon" onChange={handleButtonPress} 
        checked={props.radioButtonProps.searchPokemon} disabled={isDisabled}/>
        <label className="radioButtonLabel">Search Pokemon</label>
      </div>

      <div className="radioButton">
        <input type="radio" id="trainer" value="trainer" onChange={handleButtonPress} 
        checked={!props.radioButtonProps.searchPokemon} disabled={isDisabled}/>
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

function ScrollButton(props){

  function goToTop(event){
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  return(
    <div>
      <button className="scrollButton" id="topButton" onClick={goToTop}>To Top</button>
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
    "aroma lady": "#7AC74C",
    "parasol lady": "#7AC74C",
    "picnicker": "#7AC74C",
    "battle girl": "#C22E28",
    "black belt": "#C22E28",
    "bird keeper": "#A98FF3",
    "pokemon ranger": "#A98FF3",
    "bug catcher": "#A6B91A",
    "bug maniac":"#A6B91A",
    "camper": "#E2BF65",
    "triathlete biker": "#E2BF65",
    "triathlete runner":"#E2BF65",
    "collector": "#F7D02C",
    "guitarist": "#F7D02C",
    "cool trainer": "#6F35FC",
    "dragon tamer": "#6F35FC",
    "expert": "#B7B7CE",
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
    "poke maniac": "#A33EA1",
    "kindler": "#EE8130",
    "ninja boy":"#705746",
    "pokemon breeder":"#D685AD",
    "psychic": "#F95587",
    "youngster": "#A8A77A",
    "lass": "#A8A77A",
    "school kid": "#A8A77A",
    "lady": "#A8A77A",
    "pokefan": "#A8A77A",
    "beauty": "#A8A77A",
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
