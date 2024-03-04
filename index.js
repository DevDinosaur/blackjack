function l(str=String) {
    console.log(str);
}

function getCard() { // returns card file name
    console.log("getCard started");
    var usedCard = true;
    var count = 1;
    while (usedCard && count<52) {
        var suitNum = Math.ceil(Math.random()*4);
        var cardNum = Math.ceil(Math.random()*13);
        if (cardNum===1) {
            cardNum += 1;
        }
        
        var suit = suits[suitNum-1];
        card = cards[cardNum-1];
        var randCard = card + "_of_" + suit;
        
        checkNum = suitNum.toString() + cardNum.toString();
        if (!usedCards.includes(checkNum)) {
            usedCard = false;
            console.log("new card found");
            usedCards.push(checkNum);
        } else {
            console.log("card used already");
        }
        count++;
    }
    
    return randCard;
}

function getPoints(card) { // returns points for current card
    console.log("getPoints started");
    if (card.toString().length<3) {
        var val = card % 10;
    } else {
        var val = card % 100;
    }
    
    if (val<=9) {
        var points = val+1;
    } else if (val===10) {
        var points = 11;
    } else {
        var points = 10
    }
    return points;
}

function checkForBlackjack() {
    console.log("checkForBlackjack started");
    if (playerScore.includes(21)) {
        stand();
    }
}

function dealCards() { // deals intial cards and sets starting scores
    console.log("dealCards started");
    var playerOpeningCard = getCard();
    document.querySelector("#p1").src = "images/" + playerOpeningCard + ".png";
    updateScore("player");
    
    var dealerOpeningCard = getCard();
    document.querySelector("#d1").src = "images/" + dealerOpeningCard + ".png";
    updateScore("dealer");

    playerOpeningCard = getCard();
    document.querySelector("#p2").src = "images/" + playerOpeningCard + ".png";
    updateScore("player");

    checkForBlackjack();
}

function checkAce(player) {
    console.log("checkAce started");
    if (card==="ace") {
        return 1;
    } else {
        return getPoints(checkNum);
    }
}

function updateScore(player) { // adds new card pts to score
    if (player==="dealer") {
        l("updating score for dealer");
        dealerScore[0] += getPoints(checkNum);
        l("dealer primary score: " + dealerScore[0].toString());
        dealerScore[1] += checkAce("dealer");
        l("dealer secondary score: " + dealerScore[1].toString());
        if (!(dealerScore[0]===dealerScore[1]) && !(dealerScore[0]>21)) {
            l("scores not equal & primary !> 21");
            dealerScoreSelector.innerHTML = dealerScore[0].toString() + "/" + dealerScore[1].toString();
        } else {
            l("scores equal OR primary > 21");
            dealerScoreSelector.innerHTML = Math.min.apply(null, dealerScore).toString();
        }
    } else {
        l("updating score for player");
        playerScore[0] += getPoints(checkNum);
        l("player primary score: " + playerScore[0].toString());
        playerScore[1] += checkAce("player");
        l("player secondary score: " + playerScore[1].toString());
        if (!(playerScore[0]===playerScore[1]) && !(playerScore[0]>21)) {
            l("scores not equal & primary !> 21");
            playerScoreSelector.innerHTML = playerScore[0].toString() + "/" + playerScore[1].toString();
        } else {
            l("scores equal OR primary > 21");
            playerScoreSelector.innerHTML = Math.min.apply(null, playerScore).toString();
        }

        checkForBlackjack();
    }
}

function checkBust(score) { // checks if new score causes bust
    console.log("checkBust started");
    return score > 21;
}

async function hitMe() {
    console.log("hitMe started");
    if (playerCardCount>6) {
        alert("too many cards requested");
    } else {
        var nextCard = getCard();
        document.querySelector("#p"+playerCardCount.toString()).src = "images/" + nextCard + ".png";
        document.querySelector("#p"+playerCardCount.toString()).classList.remove("hide");
        
        updateScore("player");
        playerCardCount++;

        if (checkBust(Math.min.apply(null, playerScore))) { 
            disableHitStand();
            await delay(300);
            document.querySelector("#d2").src = "images/" + nextCard + ".png";
            document.querySelector("#d2").classList.remove("hide");
            updateScore("dealer");
            displayPlayerWinLose("lose");
        }
    }
}

async function stand() {
    console.log("stand started");
    disableHitStand();

    for (let index = 2; index < 7; index++) {
        var nextCard = getCard();
        document.querySelector("#d"+index.toString()).src = "images/" + nextCard + ".png";
        document.querySelector("#d"+index.toString()).classList.remove("hide");
        updateScore("dealer");
        if (checkBust(Math.min.apply(null, dealerScore))) {
            await delay(500);
            displayPlayerWinLose("win")
            break;
        } else {
            var dealerBestScore = findBestScore(dealerScore);
            var playerBestScore = findBestScore(playerScore);
        }
        
        if ((dealerBestScore === 21) && (dealerBestScore === playerBestScore)) {
            l("dealer & player both got 21");
            await delay(500);
            displayPlayerWinLose("tie")
            break;
        } else if (dealerBestScore > playerBestScore) {
            l("dealer score higher than player");
            await delay(500);
            displayPlayerWinLose("lose")
            break;
        } else {
            l("no decision yet");
        }
        await delay(1000);
    }
    await delay(2000);
    location.reload();
}

function disableHitStand() {
    console.log("disableHitStand started");
    hitButton.removeEventListener("click", hitMe);
    standButton.removeEventListener("click", stand);
}

function findBestScore(scores, limit=21) {
    l("finding best score");
    var best = 0;
    for (let index = 0; index < scores.length; index++) {
        if ((scores[index] > best) && (scores[index] <= limit)) {
            best = scores[index];
        }
    }

    l("best score: " + best);
    return best;
}

function displayPlayerWinLose(result) {
    console.log("displayPlayerWinLose started");
    var winLoseImg = document.querySelector("#win-lose");
    if (result==="win") {
        winLoseImg.src = "images/trophy.png"
    } else if (result==="lose") {
        winLoseImg.src = "images/loser.png"
    } else {
        winLoseImg.src = "images/tie.png"
    }
    winLoseImg.classList.remove("hide")
}

function delay(ms) {
    console.log("delay started");
    return new Promise(resolve => setTimeout(resolve, ms));
}

console.log("setting variables");
var playerScore = [0,0];
var dealerScore = [0,0];
var playerCardCount = 3;
var dealerCardCount = 3;
var playerScoreSelector = document.querySelector("#player-score");
var dealerScoreSelector = document.querySelector("#dealer-score");
var playButton = document.querySelector("#playButton");
var hitButton = document.querySelector("#hit");
var standButton = document.querySelector("#stand");

console.log("setting listeners");
playButton.addEventListener("click", function() {
    var nameInput = document.querySelector("#nameInput").value;
    console.log("name input length is: " + nameInput.length);
    console.log("name input is: '" + nameInput + "'");
    if (nameInput.length===0) {
        var playerName = "Player";
    } else {
        playerName = nameInput.toUpperCase();
    }
    console.log("player name assigned '" + playerName + "'");
    document.querySelector(".name2").innerHTML = playerName
    document.querySelector("#start").classList.add("hide")
    document.querySelector("#game").classList.remove("hide")

    suits = ["hearts", "diamonds", "clubs", "spades"];
    cards = ["2", "3", "4", "5", "6", "7", "8", "9", "10", "ace", "jack", "queen", "king"];
    usedCards = [];
    dealCards();
});
hitButton.addEventListener("click", hitMe);
standButton.addEventListener("click", stand);
