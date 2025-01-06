const initState ={
    numberOfRows: 0,
    numberOfColumns: 0,
    numberOfMines: 0,
    usedMines :0,
    openedSquare :0,
    arrValue:Array(0).fill(0).map(row => new Array(0).fill(0)),
    arrState:Array(0).fill(0).map(row => new Array(0).fill(0)), // 0 closed , 1 open , 2 flag
    gameState :0, // 0 not start yet , 1 start , 2 lose ,3 win
    usingHint :0,
    usedHint :0,
    openedZero: 0,
}

let goi=[0,-1,-1,-1,0,1,1,1];
let goj=[-1,-1,0,1,1,1,0,-1];

const reducer = (state = initState , action)=>{
    if(action.type ==="changeTheInitValues"){
        console.log(action.numberOfRows)
        return {
            ...state,
            numberOfRows : action.numberOfRows,
            numberOfColumns : action.numberOfColumns,
            numberOfMines : action.numberOfMines
        }
    }
    if(action.type === "handleReset")
        return{...initState}
    if(action.type ==="makeTheGame"){
        console.log(state.numberOfRows);
        let newArrValue=Array(state.numberOfRows).fill(0).map(row => new Array(state.numberOfColumns).fill(0));
        let newArrState=Array(state.numberOfRows).fill(0).map(row => new Array(state.numberOfColumns).fill(0));
        let arr=Array(state.numberOfRows*state.numberOfColumns).fill(0);
        for (let index = 0; index < arr.length; index++) {
            arr[index]=index;
        }
        arr=shuffle(arr);

        for (let index = 0; index < state.numberOfMines; index++) {
            let i=parseInt(arr[index]/state.numberOfColumns);
            let j=arr[index]%state.numberOfColumns;
            newArrValue[i][j]=-1;
        }
        newArrValue=correctTheValues(newArrValue);
        return {
            ...state,
            usedMines: 0,
            openedSquare: 0,
            arrValue: newArrValue,
            arrState: newArrState,
            gameState: 0,
            usingHint: 0,
            usedHint: 0,
            openedZero: 0,
        }
    }
    if(action.type ==="handleLeftClick"){
        let newArrState= state.arrState.slice();
        if (state.gameState===2 || state.gameState===3) {
            return{
                ...state
            }
        }
        let i=action.i;
        let j=action.j;
        if(state.arrState[i][j]===2 || (state.arrState[i][j]===1 && state.arrValue[i][j]===0)){
            return {
                ...state
            }
        }
        if(state.arrState[i][j]===0 && state.arrValue[i][j]===-1){
            if(state.usingHint===0){
                newArrState[i][j]=1;
                return{
                    ...state,
                    arrState: newArrState,
                    gameState: 2,
                }
            }else{
                newArrState[i][j]=2;
                return{
                    ...state,
                    usedMines: state.usedMines+1,
                    arrState: newArrState,
                    usingHint: 0,
                    usedHint: state.usedHint+1,

                }
            }
        }
        let count=0;
        for (let k = 0; k < 8; k++) {
            let ni=i+goi[k];
            let nj=j+goj[k];
            if(isIn(ni,nj,state.numberOfRows,state.numberOfColumns) && state.arrState[ni][nj]===2)
                count++;
        }
        let newOpenedZero=0;
        let newOpenedSquare=state.openedSquare;
        let f=0;
        if(state.arrState[i][j]===1 && count===state.arrValue[i][j])
            f=1;
        if(state.arrState[i][j]===1 && count!==state.arrValue[i][j])
            return {...state};

        let q=[[i,j]];
        let newGameState=1;
        while (q.length) {
            i=q[0][0];
            j=q[0][1];
            if(newArrState[i][j]===0)
                newOpenedSquare++;
            if(newArrState[i][j]=== 0 && state.arrValue[i][j]===0)
                newOpenedZero=1;
            newArrState[i][j]=1;
            q.shift();
            if(state.arrValue[i][j]!==0 && f===0)
                continue;
            f=0;
            for (let k = 0; k < 8; k++) {
                let ni=i+goi[k];
                let nj=j+goj[k];
                if(isIn(ni,nj,state.numberOfRows,state.numberOfColumns) && newArrState[ni][nj]===0){
                    if(newArrState[ni][nj]===0)
                        newOpenedSquare++;
                    
                    if(newArrState[ni][nj]=== 0 && state.arrValue[ni][nj]===0)
                        newOpenedZero=1; 
                    newArrState[ni][nj]=1;

                    if(state.arrValue[ni][nj]===0)
                       q.push([ni,nj]);
                }
                if(isIn(ni,nj,state.numberOfRows,state.numberOfColumns) && state.arrValue[ni][nj]===-1 && state.arrState[ni][nj]===1)
                    newGameState=2;
            }
        }
        if (newGameState!==2 && newOpenedSquare===state.numberOfRows*state.numberOfColumns-state.numberOfMines && newGameState!==2) {
            newGameState=3;
        }

        return {
            ...state,
            openedSquare: newOpenedSquare,
            arrState: newArrState,
            gameState: newGameState,
            usingHint: 0,
            usedHint: state.usedHint+state.usingHint,
            openedZero : state.openedZero+newOpenedZero,
        }
    }
    if(action.type ==="handleRightClick"){
        if (state.gameState===2 || state.gameState===3) {
            return{
                ...state
            }
        }
        if(state.usingHint===1){
            alert("You are using Hint")
            return{
                ...state,
            }
        }
        let i=action.i;
        let j=action.j;
        if(state.arrState[i][j]===1){
            if(state.arrValue[i][j]===0)
                return{...state};
            let count=0;
            for (let k = 0; k < 8; k++) {
                let ni=i+goi[k];
                let nj=j+goj[k];
                if(isIn(ni,nj,state.numberOfRows,state.numberOfColumns) && state.arrState[ni][nj] !==1 )
                    count++;
            }
            if(count===state.arrValue[i][j]){
                let newArrState=state.arrState.slice();
                for (let k = 0; k < 8; k++) {
                    let ni=i+goi[k];
                    let nj=j+goj[k];
                    if(isIn(ni,nj,state.numberOfRows,state.numberOfColumns) && state.arrState[ni][nj] ===0 ){
                        newArrState[ni][nj]=2;
                    }
                }
                return{
                    ...state,
                    arrState: newArrState
                }
            }

            return {...state};
        }
        let newArrState =state.arrState.slice();
        let f=0;
        if(newArrState[i][j]===0){
            newArrState[i][j]=2;
            f=1;
        }
        else{
            newArrState[i][j]=0;
            f=-1;
        }
        return {
            ...state,
            gameState: 1,
            arrState : newArrState,
            usedMines : state.usedMines+f,
        }
    }
    if(action.type==="handleUseHint"){
        if (state.gameState===2 || state.gameState===3) {
            return{
                ...state
            }
        }
        if(state.usingHint===1){
            return {
                ...state,
                gameState: 1,
                usingHint: 0,
            }
        }
        else{
            return{
                ...state,
                gameState: 1,
                usingHint: 1,
            }
        }
    }
    
    return state;
}

function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}
function correctTheValues(array) {
    for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array[i].length; j++) {
            if(array[i][j]===-1)
                continue;
            for (let k = 0; k < 8; k++) {
                let ni=i+goi[k];
                let nj=j+goj[k];
                if(isIn(ni,nj,array.length,array[i].length) && array[ni][nj]===-1)
                    array[i][j]++;
            }
        }
    }
    return array;
}
function isIn(i,j,r,c) {
    if(i<0 || j<0 || i>=r || j>=c)
        return 0;
    return 1;
    
}

export default reducer ;