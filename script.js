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

function deleteNumber () {
    let row = document.getElementsByClassName("number-row")[6 - guessesRemaining]
    let box = row.children[nextNumber - 1]
    box.textContent = ""
    box.classList.remove("filled-box")
    currentGuess.pop()
    nextNumber -= 1
}

function checkGuess () {
    let row = document.getElementsByClassName("number-row")[6 - guessesRemaining]
    let guessString = ''
    let rightGuess = Array.from(rightGuessString)

    for (const val of currentGuess) {
        guessString += val
    }

    if (guessString.length != 5) {
        toastr.error("Not enough numbers!")
        return
    }

    if (!primes.includes(parseInt(guessString))) {
        toastr.error("Not a 5 digit prime!")
        return
    }

    let numbers = []
    let numberColors = []
    let boxes = []

    for (let i = 0; i < 5; i++) {
        numbers.push(currentGuess[i])
        boxes.push(row.children[i])

        if (currentGuess[i] === rightGuess[i]){
            numberColors[i] = 'green'
            rightGuess[i] = "#"
        }
        else{
            numberColors[i] = 'grey'
        }
    }

    for (let i = 0; i < 5; i++) {
        let indexNumber = rightGuess.indexOf(currentGuess[i])
        if (indexNumber !== -1){
            numberColors[i] = 'yellow'
            rightGuess[i] = "#"
        }
    }

    for (let i = 0; i < 5; i++) {
        let delay = 250 * i
        setTimeout(()=> {
            //flip box
            animateCSS(boxes[i], 'flipInX')
            //shade box
            boxes[i].style.backgroundColor = numberColors[i]
            shadeKeyBoard(numbers[i], numberColors[i])
        }, delay)
    }




    if (guessString === rightGuessString) {
        toastr.success("You guessed right! Game over!")
        guessesRemaining = 0
        return
    } else {
        guessesRemaining -= 1;
        currentGuess = [];
        nextNumber = 0;

        if (guessesRemaining === 0) {
            toastr.error("You've run out of guesses! Game over!")
            toastr.error(`The right word was: "${rightGuessString}"`)
        }
    }
}

function insertNumber (pressedKey) {
    if (nextNumber === 5) {
        return
    }
    pressedKey = pressedKey.toLowerCase()

    let row = document.getElementsByClassName("number-row")[6 - guessesRemaining]
    let box = row.children[nextNumber]
    animateCSS(box, "pulse")
    box.textContent = pressedKey
    box.classList.add("filled-box")
    currentGuess.push(pressedKey)
    nextNumber += 1
}

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

initBoard();