import { daily_prime } from "./daily_prime.js";
import { primes } from "./prime_list.js";

const NUMBER_OF_GUESSES = 6;
let guessesRemaining = NUMBER_OF_GUESSES;
let currentGuess = [];
let nextNumber = 0;
let rightGuessString = String(daily_prime)
console.log(rightGuessString)

function initBoard() {
    let board = document.getElementById("game-board");

    for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
        let row = document.createElement("div")
        row.className = "number-row"
        
        for (let j = 0; j < 5; j++) {
            let box = document.createElement("div")
            box.className = "number-box"
            row.appendChild(box)
        }

        board.appendChild(row)
    }
}

initBoard()

document.addEventListener("keyup", (e) => {

    if (guessesRemaining === 0) {
        return
    }

    let pressedKey = String(e.key)
    if (pressedKey === "Backspace" && nextNumber !== 0) {
        deleteNumber()
        return
    }

    if (pressedKey === "Enter") {
        checkGuess()
        return
    }

    let found = pressedKey.match(/[\d]/)
    if (!found || found.length > 1) {
        return
    } else {
        insertNumber(pressedKey)
    }
})

function insertNumber (pressedKey) {
    if (nextLetter === 5) {
        return
    }
    pressedKey = pressedKey.toLowerCase()

    let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
    let box = row.children[nextLetter]
    animateCSS(box, "pulse")
    box.textContent = pressedKey
    box.classList.add("filled-box")
    currentGuess.push(pressedKey)
    nextLetter += 1
}

function deleteNumber () {
    let row = document.getElementsByClassName("number-row")[6 - guessesRemaining]
    let box = row.children[nextNumber - 1]
    box.textContent = ""
    box.classList.remove("filled-box")
    currentGuess.pop()
    nextNumber -= 1
}


function shadeKeyBoard(number, color) {
    for (const elem of document.getElementsByClassName("keyboard-button")) {
        if (elem.textContent === number) {
            let oldColor = elem.style.backgroundColor
            if (oldColor === 'green') {
                return
            } 

            if (oldColor === 'yellow' && color !== 'green') {
                return
            }

            elem.style.backgroundColor = color
            break
        }
    }
}


function checkGuess () {
    let row = document.getElementsByClassName("number-row")[6 - guessesRemaining]
    let guessString = ''
    let rightGuess = Array.from(rightGuessString)

    for (const val of currentGuess) {
        guessString += val
    }

    if (guessString.length != 5) {
        alert("Not enough numbers!")
        return
    }

    if (!primes.includes(parseInt(guessString))) {
        alert("Not a 5 digit prime!")
        return
    }

    
    for (let i = 0; i < 5; i++) {
        let numberColor = ''
        let box = row.children[i]
        let number = currentGuess[i]
        
        let numberPosition = rightGuess.indexOf(currentGuess[i])

        if (numberPosition === -1) {
            numberColor = 'grey' // number not in word
        } else {
            // now, number is definitely in word
            // if number index and right guess index are the same
            // number is in the right position 
            if (currentGuess[i] === rightGuess[i]) {
                // shade green 
                numberColor = 'green'
            } else {
                // shade box yellow
                numberColor = 'yellow'
            }

            rightGuess[numberPosition] = "#"
        }

        let delay = 250 * i
        setTimeout(()=> {
            //flip box
            animateCSS(box, 'flipInX')
            //shade box
            box.style.backgroundColor = numberColor
            shadeKeyBoard(number, numberColor)
        }, delay)
    }

    if (guessString === rightGuessString) {
        alert("You guessed right! Game over!")
        guessesRemaining = 0
        return
    } else {
        guessesRemaining -= 1;
        currentGuess = [];
        nextNumber = 0;

        if (guessesRemaining === 0) {
            alert("You've run out of guesses! Game over!")
            alert(`The right word was: "${rightGuessString}"`)
        }
    }
}


document.getElementById("keyboard-cont").addEventListener("click", (e) => {
    const target = e.target
    
    if (!target.classList.contains("keyboard-button")) {
        return
    }
    let key = target.textContent

    if (key === "Del") {
        key = "Backspace"
    } 

    document.dispatchEvent(new KeyboardEvent("keyup", {'key': key}))
})

const animateCSS = (element, animation, prefix = 'animate__') =>
  // We create a Promise and return it
  new Promise((resolve, reject) => {
    const animationName = `${prefix}${animation}`;
    // const node = document.querySelector(element);
    const node = element
    node.style.setProperty('--animate-duration', '0.3s');
    
    node.classList.add(`${prefix}animated`, animationName);

    // When the animation ends, we clean the classes and resolve the Promise
    function handleAnimationEnd(event) {
      event.stopPropagation();
      node.classList.remove(`${prefix}animated`, animationName);
      resolve('Animation ended');
    }

    node.addEventListener('animationend', handleAnimationEnd, {once: true});
});