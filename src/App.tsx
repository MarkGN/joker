
import { useState } from 'react';
import {Joke, JokeComponent, type JokeApi} from './Joke';
import './App.css'

var gettingJoke: boolean = false;

const App = () => {
    const [jokes, setJokes] = useState<Joke[]>([]);

    async function expandOrGetJoke() {
      // Prevent multiple clicks from triggering multiple fetches
      if (gettingJoke) {
        console.log("Already getting a joke, ignoring click.");
        return;
      } else {
        gettingJoke = true;
      }
      if (jokes.length===0 || (jokes[jokes.length - 1].isFullyExpanded())) {
      console.log("Fetching a joke...");
        // TODO type checking of incoming JSON
        // TODO make this accept two-part jokes
        const url = "https://v2.jokeapi.dev/joke/Any?type=single";
        try {
            const response = await fetch(url);
            if (!response.ok) {
              throw new Error(`Response status: ${response.status}`);
            }
        
            const result = (await response.json()) as JokeApi;
            const newJoke = new Joke(result);
            setJokes(prevJokes => [...prevJokes, newJoke]);
            console.log(result.joke, jokes)
          } catch (error) {
            // TODO ugh
            console.log(4)
            console.error((error as Error).message);
          }
        } else {
          console.log("Expanding joke...");
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
        <div>{jokes.map((joke, index) => <JokeComponent key={joke.id} alignment={index%2} {...joke.propsify()}/>)}</div>
        <div id="bottom" />
        </div>
    );
    }

export default App;