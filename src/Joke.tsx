
export interface JokeApi {
  joke: string;
  id: number;
}

export interface JokeProps {
  lines: string[];
  displayedLinesCount: number;
  id: number;
  alignment?: number;
}

var idCounter: number = 0;

export class Joke {
  public lines: string[];
  public displayedLinesCount: number;
  public id: number;

  constructor(joke: JokeApi) {
    this.lines = joke.joke.split(/(?<=[.?!])\s+/);
    this.displayedLinesCount = 1;
    this.id = idCounter++;
  }

  public isFullyExpanded(): boolean {
    return this.displayedLinesCount >= this.lines.length;
  }

  public expand(): void {
    if (!this.isFullyExpanded()) {
      this.displayedLinesCount++;
    }
  }

  public propsify(): JokeProps {  
    return {
      lines: this.lines,
      displayedLinesCount: this.displayedLinesCount,
      id: this.id
    };
  }
}

export function JokeComponent(props: JokeProps) {
  return (
    <div className={props.alignment ? "left-joke" : "right-joke"}>
      {props.lines.slice(0,props.displayedLinesCount).map((line, index) => <p key={index}>{line}</p>)}
      {props.displayedLinesCount < props.lines.length && <p className="blink">...</p>}
    </div>
  );
};