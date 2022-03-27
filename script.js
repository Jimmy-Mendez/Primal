import { daily_prime } from "./daily_prime.js";
import { primes } from "./prime_list.js";

const NUMBER_OF_GUESSES = 6;
let guessesRemaining = NUMBER_OF_GUESSES;
let currentGuess = [];
let nextNumber = 0;
let rightGuessString = String(daily_prime)
console.log(rightGuessString)
getPrime()

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
        if (indexNumber !== -1 && numberColors[i] !== 'green'){
            numberColors[i] = 'yellow'
            rightGuess[indexNumber] = "#"
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

function getPrime(){
    const d = new Date()
    var seed_1 = d.getDate()
    var seed_2 = d.getFullYear()
    var seed = String(seed_1 * seed_2)
    var new_seed = xmur3(seed)
    var rand = sfc32(new_seed(), new_seed(), new_seed(), new_seed());
    console.log(rand)
}

function xmur3(str) {
    for(var i = 0, h = 1779033703 ^ str.length; i < str.length; i++) {
        h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
        h = h << 13 | h >>> 19;
    } return function() {
        h = Math.imul(h ^ (h >>> 16), 2246822507);
        h = Math.imul(h ^ (h >>> 13), 3266489909);
        return (h ^= h >>> 16) >>> 0;
    }
}

function sfc32(a, b, c, d) {
    return function() {
      a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0; 
      var t = (a + b) | 0;
      a = b ^ b >>> 9;
      b = c + (c << 3) | 0;
      c = (c << 21 | c >>> 11);
      d = d + 1 | 0;
      t = t + d | 0;
      c = c + t | 0;
      return (t >>> 0) / 4294967296;
    }
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