//this code imports the package that allows the user input to be stored 
const prompt = require("prompt-sync") (); 
const ROWS = 3; 
const COLS = 3; 

//this is the value for each symbol 
const SYMBOLS_COUNT = {
    "A" : 2, 
    "B" : 4, 
    "C" : 6, 
    "D" : 8
}

//this is the multiplier of each symbol 
const SYMBOL_VALUES = {
    "A" : 5, 
    "B" : 4, 
    "C" : 3, 
    "D" : 2, 
}

//function thats purpose is to find how much money the user is depositing 
const deposit = ()  => {
    var repetition = true; 
      
    do {   
        const depositAmount = prompt("How much money do you want to deposit: ");
        const numberDepositAmount = parseFloat(depositAmount); 
        
        if (isNaN(numberDepositAmount) || numberDepositAmount <= 0) {
            console.log("Invalid deposit amount, try again"); 
            repetition = false; 
        } else {
            return numberDepositAmount; 
        }
    } while (!repetition);  
}; 

//function thats purpose is to ask the user how many lines to bet 
const getNumberOfLines = () => {
    var repetition = true; 

    do {
        const linesBet = prompt("How many lines do you want to bet: "); 
        const numberOfLines = parseInt(linesBet); 

        if (isNaN(linesBet) || numberOfLines <= 0 || numberOfLines > 3) {
            console.log("Invalid choice, try again"); 
            repetition = false; 
        } else { 
            return numberOfLines; 
        }
    } while (!repetition)  
}; 

//this code validates a users total bet amount
const getBet = (balance, numberOfLines) => {
    var repetition = true; 

    do { 
        const bet = prompt("Enter the bet per line: "); 
        const totalBet = parseFloat(bet); 

        if(isNaN(totalBet) || totalBet <= 0 || totalBet > (balance / numberOfLines)) {
            console.log("Invalid choice, please try again");
            repetition = false; 
        } else {
            return totalBet; 
        }
    } while (!repetition)
}


const spin = () => {
    const symbols = []; //this is constant because we are just adding elements inside the array 
    for(const [symbol, count] of Object.entries(SYMBOLS_COUNT)) { 
        for(let i = 0; i < count; ++i) {
            symbols.push(symbol); 
        }
    }

    const reels = [];
    for (let i = 0; i < COLS; i++) {
        reels.push([]); 
        const reelSymbols = [...symbols]; //creates a new copy of the symbols array to use in each iteration. 
        
        //in each row of the reels array a random index is created to be pushed into the reels array, then the index value gets deleted. 
        for(let j = 0; j < ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length); 
            const selectedSymbol = reelSymbols[randomIndex]; 
            reels[i].push(selectedSymbol); 
            reelSymbols.splice(randomIndex, 1); 
        }
    } 

    return reels; 
}

const transpose = (reels) => {
    const numRows = reels.length; 
    const numCols = reels[0].length;  
    const newArr = []; 

    //loop switches [[1, 2, 3], [4, 5, 6]] -->>> [[1,4], [2,5], [3,6]] -->> also known as a transposition 
    for(let i = 0; i < numCols; i++) {
        newArr[i] = []; 
        for(let j = 0; j < numRows; j++) {
            newArr[i][j] = reels[j][i]; 
        }
    }

    return newArr; 
}


//function prints the rows of the slot machine
const printRows = (transposeArray) => {
    
    //we are accessing an index and its symbol with each iteration
    for (const arr of transposeArray) {
        let rowString = ""; 
        for (const[i, symbol] of arr.entries()) { //arr.entries() allows someone to access both the index and the value of an array
            rowString += symbol; 
            if(i != arr.length - 1) {
                rowString += " | "; 
            }
        }
        console.log(rowString); 
    }
}


//this function returns the winnings earned by each spin
const getWinnings = (numberOfLines, bet, transposeArray) => {
    let winnings = 0; 

    //for loop creates a temp copy of the nested array in transposeArray and checks to see if all elements have the same value
    for(let i = 0; i < numberOfLines; i++) {
        var winorlose = true; 
        const tempArray = transposeArray[i]; 
        for(let j = 0; j < tempArray.length; j++) {

            if(tempArray[0] != tempArray[j]) {
                winorlose = false; 
                break; 
            }
        } 
        if (winorlose == true) {
            winnings += SYMBOL_VALUES[tempArray[0]] * bet; 
        }
    }
    return winnings; 
}


let balance = deposit(); 

while (true) {
    let round = 1; 
    const numberOfLines = getNumberOfLines(); 
    const bet = getBet(balance, numberOfLines);  
    
    const reels = spin(); 
    const transposeArray = transpose(reels); 
    
    printRows(transposeArray); 
    const winning = getWinnings(numberOfLines, bet, transposeArray); 
    balance += winning; 
    
    //even though the user is not winning the code is still counting it as a win -- PROBLEM 
    if(winning > 0) { 
        console.log("Hey you won " + winning + " your balance now is "  + balance + "!"); 
    } else { 
        console.log("You won nothing"); 
        balance -= bet * numberOfLines; 
        console.log("Your balance is " + balance + " don't hit 0 or you will be broke:("); 
    }
    if(balance <= 0) {
        console.log("You are broke and the game is done"); 
        console.log("The program will now end"); 
        break; 
    } else {
        round++; 
        console.log("Let round " + round + " begin"); 
    }
}