// GLOBAL VARIABLES
let deckId
const cardValues = ["2","3","4","5","6","7","8","9","10","JACK","QUEEN","KING","ACE"]
let myScore = 0;
let computerScore = 0;

// DOM elements declarations
const newDeckBtn = document.getElementById("new-deck-btn")
const drawCardsBtn = document.getElementById("draw-cards-btn")
const remaining = document.getElementById("remaining")
const cards = document.getElementById("cards")
const result = document.getElementById("result")

const threeCardsComp = document.getElementById("three-cards-comp")
const threeCardsMine = document.getElementById("three-cards-mine")

const scoreMine = document.getElementById("my-score")
const scoreComputer = document.getElementById("computer-score")


newDeckBtn.addEventListener("click", fetchNewDeck)

drawCardsBtn.disabled = true;

async function fetchNewDeck(){
    myScore = 0;
    computerScore = 0;
    cards.children[1].innerHTML = ""
    cards.children[2].innerHTML = ""
    
    drawCardsBtn.disabled = false
    
    scoreComputer.textContent = `Computer Score: ${computerScore}`
    scoreMine.textContent = `My Score: ${myScore}`
    reset()
    const response = await fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
    const data = await response.json()
    deckId = data.deck_id
    remaining.textContent = `Remaining Cards: ${data.remaining}`  
}

drawCardsBtn.addEventListener("click", drawTwoCards)

async function drawTwoCards(){
    //Initialization by emptying and removing the 3 cards slots. 
    reset()
    
    //Draw 2 cards first
    
    let response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=2`)
    let data = await response.json()
    cards.children[1].innerHTML = `<img src=${data.cards[0].image} class="card">`
    cards.children[2].innerHTML = `<img src=${data.cards[1].image} class="card">` 
    result.textContent = score(data.cards[0], data.cards[1])
    
    //If it's war, each player draws 4 cards and recompare the 2 leading ones, the winner takes it all
    if(result.textContent === "It's War" && data.remaining >= 8){
        response = await fetch(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=8`)
        data = await response.json()
        drawCardsBtn.disabled = true
        setTimeout(()=>{
            threeCardsComp.classList.add("three-cards")
            threeCardsMine.classList.add("three-cards")
            cards.children[1].innerHTML = `<img src=${data.cards[0].image} class="card">`
            cards.children[2].innerHTML = `<img src=${data.cards[1].image} class="card">`
            threeCardsComp.children[0].innerHTML = `<img src=${data.cards[2].image} class="card">`
            threeCardsComp.children[1].innerHTML = `<img src=${data.cards[3].image} class="card">`
            threeCardsComp.children[2].innerHTML = `<img src=${data.cards[4].image} class="card">`
            
            threeCardsMine.children[0].innerHTML = `<img src=${data.cards[5].image} class="card">`
            threeCardsMine.children[1].innerHTML = `<img src=${data.cards[6].image} class="card">`
            threeCardsMine.children[2].innerHTML = `<img src=${data.cards[7].image} class="card">` 
            result.textContent = score(data.cards[0], data.cards[1]) 
            if(result.textContent === "The Computer Won"){
                computerScore += 3;
            }else if (result.textContent === "You Won"){
                myScore += 3;
            }
            drawCardsBtn.disabled = false
        },3000)
    }
    remaining.textContent = `Remaining Cards: ${data.remaining}`
    scoreComputer.textContent = `Computer Score: ${computerScore}`
    scoreMine.textContent = `My Score: ${myScore}`
    
    if(data.remaining === 0){
        drawCardsBtn.disabled = true
        if(myScore>computerScore){
            result.textContent = "Woohoo, You Won 🥳, What a Legend!!"
        }else{
            result,textContent = "Too bad, You Lost 😢 Try again !!"  
        }
        
    }
    
}

function score(cardC, cardM){
    if(cardValues.indexOf(cardC.value)>cardValues.indexOf(cardM.value)){
        computerScore++;
        return "The Computer Won"
    } else if(cardValues.indexOf(cardC.value) < cardValues.indexOf(cardM.value)){
        myScore++;
        return "You Won"
    } else {
        return "It's War"
    }  
}

function reset(){
    threeCardsComp.classList.remove("three-cards")
    threeCardsMine.classList.remove("three-cards")
    
    threeCardsComp.children[0].innerHTML = ""
    threeCardsComp.children[1].innerHTML = ""
    threeCardsComp.children[2].innerHTML = ""
            
    threeCardsMine.children[0].innerHTML = ""
    threeCardsMine.children[1].innerHTML = ""
    threeCardsMine.children[2].innerHTML = ""
}






