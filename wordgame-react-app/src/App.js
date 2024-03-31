import { useState, 
  // useEffect
 } from "react";
import './App.css';

function App() {

  const [tries, setTries] = useState(4)
  const [theme, setTheme] = useState("Real or fake?")
  if (false) setTheme();

  const [words, setWords] = useState([
    {order: "1", start: "manti", end: "core", correct: 10},
    {order: "2", start: "mino", end: "taur", correct: 10},
    {order: "3", start: "basi", end: "lisk", correct: 10},
    {order: "4", start: "cerbe", end: "erus", correct: 10},
    {order: "5", start: "chim", end: "era", correct: 10},
  ])

  const [currentGuess, setCurrentGuess] = useState(1)
  const [guessWord, setGuessWord] = useState({start: "", end: ""})


  function placeWordOne(piece) {
    setGuessWord(curr => {return {start: piece.piece, end:curr.end}})
  }

  function placeWordTwo(piece) {
    setGuessWord( curr => {return {start: curr.start, end: piece.piece}})
  }


  function removeWordOne() {
    setGuessWord( curr => {return {start: "", end: curr.end}})
  }

  function removeWordTwo() {
    setGuessWord( curr => {return {start: curr.start, end: ""}})
  }




  function guess() {
    if (guessWord.start === "" || guessWord.end === "") return;


    const correctGuess = words.map(word => {
      if (guessWord.start === word.start && guessWord.end === word.end) {

        setWords(curr => 
          curr.map(word2 => {
            return word2 === word ? {...word2, correct: currentGuess} : word2
          })
          )
        setCurrentGuess(curr => {
          if (curr === 5) winFunc()
          return curr + 1
        });
              // correct guess logic
        removeWordOne();
        removeWordTwo();

        return 1;

    } else {
      // incorrect guess logic
      removeWordOne();
      removeWordTwo();

      return 0;
      
    }

    })


    if (!correctGuess.includes(1)) {

      if (tries === 1) {
        loseFunc()
      } else {

      setTries(curr => curr-1);
      setWordBoxOptions(curr => curr.map(p => {
        if (p.piece === guessWord.start) {
          return {piece: guessWord.start, guessed: false}
        } else if (p.piece === guessWord.end) {
          return {piece: guessWord.end, guessed: false}
        } else {
          return p;
        }

      }))

    }
    }
  }



  // Function to shuffle array elements
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
    return array;
  };

  // Prepare and shuffle the data
  const shuffledWords = () => {
    const combinedWords = words.flatMap(({ start, end }) => [{piece: start, guessed: false}, {piece: end, guessed: false}]);
    return shuffleArray([...combinedWords]); // Clone and shuffle
  };

  // Use useEffect to shuffle words only once when the component mounts
  // This is to prevent re-shuffling on every re-render
  // const [shuffled, setShuffled] = useState([]);
  
  // useEffect(() => {
  //   setShuffled(shuffledWords());
  // }, []); // Empty dependency array ensures this runs once on mount


  const [wordBoxOptions, setWordBoxOptions] = useState(shuffledWords());


  const [win, setWin] = useState(false)
  const [lose, setLose] = useState(false)
  const [animatedIndexes, setAnimatedIndexes] = useState([]);
  if (false) setAnimatedIndexes();


  function winFunc() {
    setWin(true);
    // const startAnimation = () => {
    //   setAnimatedIndexes([]); // Reset animation indexes
    //   words.forEach((_, index) => {
    //     setTimeout(() => {
    //       setAnimatedIndexes(current => [...current, index]);
    //     }, index * 100); // Delay increases with each item
    //   });
    // };
    // startAnimation();
  }






  function loseFunc() {

    setLose(true)

    // words.filter(word => word.correct === 10).map(word => {
    //     wordBoxOptions.map(guess => {
    //       if (guess.piece ===  word.start) {
    //         placeWordOne(guess);
    //       } else if (guess.piece === word.end) {
    //         placeWordTwo(guess);
    //       }
    //       return guess;
    //     })
        
    //     guess()

    //     console.log('guessing')
    //     return null;
    // })

  }


  const Circle = () => (
    <div style={{
      height: '10px',
      width: '10px',
      backgroundColor: '#3498db',
      borderRadius: '50%',
      margin: '5px',
      display: 'inline-block',
    }}></div>
  );


  return (
    <div className="App">
        <div className="result-overlay" style={{display: win || lose ? "" : "none"}}>
          {<h1>{win ? "You win!" : "You lose!"}</h1>}
          <button className="play-again" onClick={()=>{window.location.reload()}}>
            Play Again!
          </button>
        </div>
      <div className="home-body">


      <div className="body-header">
      <h4 style={{width: "fit-content", padding: "10px"}}>
          {new Date().toLocaleDateString('en-US',{ year: 'numeric', month: 'long', day: 'numeric' })}
        </h4>
      </div>
      <div className="theme-header">
      <h1 style={{width: "fit-content", padding: "10px"}}>
          {theme}
        </h1>
      </div>
      <div className="tries-remaining">
        <div>
          ATTEMPTS REMAINING {tries}
        </div>
        <div style={{display: "flex", alignItems: "center"}}>
        {
            Array.from({ length: tries }, (_, index) => <Circle key={index} />)
        }
        </div>
    </div>
      <div className="guess-option-container">
        {
          words.sort((a,b) => {
            return a.correct - b.correct
          }).map((word, index) => {

            return (
              <div className="guess-option rectangle" 
                style={{
                    animationDelay: `${animatedIndexes.includes(index) ? index * 0.1 : 0}s`,
                  border: currentGuess === index + 1 ? "2px solid rgba(0,0,0,0.1)" : "",
                  background : currentGuess === index + 1 ? "white" : word.correct > 5 ? "rgb(229,229,229)" : "#3FE664"
                }}
                key={index}>
                {currentGuess !== index + 1 ?
                  <h3>{word.correct < 6 ? `${word.start}${word.end}` : `Word ${index + 1}`}</h3>
                  :
                  <div style={{display: "flex", gap: "40px"}}>
                    <div className="puzzle-piece" style={{opacity: guessWord.start ? "1" : "0"}}
                                      onClick={()=>{

                                        if (guessWord.start) {
                                         
                                          removeWordOne()
                    
                                          setWordBoxOptions(curr => curr.map(p => {
                                            return p.piece === guessWord.start ? {piece: guessWord.start, guessed: false} : p
                                          }))

                                        }
                    
                    
                                      }}>
                      {guessWord.start}
                    </div>
                    <div className="puzzle-piece" style={{opacity: guessWord.end ? "1" : "0"}}
                                      onClick={()=>{

                                        if (guessWord.end) {
                                         
                                          removeWordTwo()
                    
                                          setWordBoxOptions(curr => curr.map(p => {
                                            return p.piece === guessWord.end ? {piece: guessWord.end, guessed: false} : p
                                          }))

                                        }
                    
                    
                                      }}>
                    {guessWord.end}
                    </div>
                  </div>
                }
              </div>
            )
          })
        }
      </div>
      <div className="guess-button-container">
        <div className="guess-button"
        onClick={()=>{guess()}}>
          GUESS
        </div>
      </div>
      <div className="word-box-container">
        <div className="word-box">

          {wordBoxOptions.map((piece, index) => (
                  <div className="puzzle-piece-container"
                  style={{opacity: piece.piece === guessWord.start || piece.piece === guessWord.end ? "0" : "1"}}
                  key={index}
                  onClick={()=>{


                    if (!piece.guessed) {
                    if (guessWord.start) {
                        placeWordTwo(piece)
                    } else {
                        placeWordOne(piece)
                    }

                    setWordBoxOptions(curr => curr.map(p => {
                      return p === piece ? {...piece, guessed: true} : p
                    }))
                  }


                  }}>
                  
                    <div key={index} style={{opacity: piece.guessed ? "0" : "1"}} className="puzzle-piece">{piece.piece} {piece.guessed}</div>
                  </div>
             ))}
        </div>
      </div>

      </div>
    </div>
  );
}

export default App;
