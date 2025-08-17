
import { useState } from 'react';
import {Joke, JokeComponent, type JokeApi} from './Joke';
import './App.css'

var gettingJoke: boolean = false;
const numJokes = 319; // We can get this from the API, but that introduces a delay on the first click.
var index = Math.floor(Math.random() * numJokes);

const App = () => {
    const [jokes, setJokes] = useState<Joke[]>([]);
    
    async function expandOrGetJoke() {
      // Prevent multiple clicks from triggering multiple fetches
      if (gettingJoke) {
        return;
      } else {
        gettingJoke = true;
      }
      if (jokes.length===0 || (jokes[jokes.length - 1].isFullyExpanded())) {
        // TODO type checking of incoming JSON
        // TODO make this accept two-part jokes
        const url = "https://v2.jokeapi.dev/joke/Any?&lang=en&idRange=" + String(index) + "-" + String(index);
        index = (index + 1) % numJokes; // Increment index for next joke
        console.log(url);
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
              throw new Error(`Response status: ${response.status}`);
            }
        
            const result = (await response.json()) as JokeApi;
            const newJoke = new Joke(result);
            setJokes(prevJokes => [...prevJokes, newJoke]);
          } catch (error) {
            console.error((error as Error).message);
          }
        } else {
          jokes[jokes.length - 1].expand();
          setJokes([...jokes]); // Trigger re-render
        }

        // scroll last joke into view
        const bottomElement = document.getElementById("bottom");
        if (bottomElement) {
          bottomElement.scrollIntoView({ behavior: 'smooth' });
        } else {
          console.error("Bottom element not found");
        }

        gettingJoke = false; // Reset the flag after processing
        
    }
          

    return (
        <div onClick={expandOrGetJoke}>
        <h1>Jokes</h1>
        <p>{jokes.length} of them.</p>
        <p>Click to expand the last joke or get a new one.</p>
        <div>{jokes.map((joke, index) => <JokeComponent key={joke.id} alignment={index%2} {...joke.propsify()}/>)}</div>
        <div id="bottom" />
        </div>
    );
    }

export default App;