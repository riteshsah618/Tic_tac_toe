let board=["","","","","","","","",""];
let history=[];
let current="X";
let gameOver=false;
let timer=10;
let interval;
let sound=true;

const boardEl=document.getElementById("board");
const statusEl=document.getElementById("status");
const timerEl=document.getElementById("timer");
const mode=document.getElementById("mode");

let score=JSON.parse(localStorage.getItem("score")) || {X:0,O:0,D:0};

drawBoard();
updateScore();
startTimer();

function drawBoard(){

boardEl.innerHTML="";

board.forEach((v,i)=>{

let cell=document.createElement("div");

cell.className="cell "+v;

cell.innerText=v;

cell.onclick=()=>makeMove(i);

boardEl.appendChild(cell);

});

}

function makeMove(i){

if(board[i] || gameOver) return;

if(sound) document.getElementById("click").play();

history.push([...board]);

board[i]=current;

drawBoard();

let winLine=checkWin(current);

if(winLine){

highlight(winLine);

statusEl.innerText=current+" Wins 🎉";

if(sound) document.getElementById("winSound").play();

score[current]++;

saveScore();

gameOver=true;

clearInterval(interval);

return;

}

if(board.every(v=>v)){

statusEl.innerText="Draw 😐";

score.D++;

saveScore();

gameOver=true;

clearInterval(interval);

return;

}

switchTurn();

if(mode.value==="ai" && current==="O"){

setTimeout(aiMove,400);

}

}

function aiMove(){

let empty=board.map((v,i)=>v==""?i:null).filter(v=>v!==null);

let move=empty[Math.floor(Math.random()*empty.length)];

makeMove(move);

}

function switchTurn(){

current=current==="X"?"O":"X";

statusEl.innerText="Player "+current+"'s Turn";

resetTimer();

}

function checkWin(p){

const wins=[

[0,1,2],[3,4,5],[6,7,8],

[0,3,6],[1,4,7],[2,5,8],

[0,4,8],[2,4,6]

];

for(let w of wins){

if(w.every(i=>board[i]===p)) return w;

}

return null;

}

function highlight(arr){

arr.forEach(i=>{

boardEl.children[i].classList.add("win");

});

}

function undo(){

if(history.length && !gameOver){

board=history.pop();

switchTurn();

drawBoard();

}

}

function resetGame(){

board=["","","","","","","","",""];

history=[];

current="X";

gameOver=false;

statusEl.innerText="Player X's Turn";

drawBoard();

resetTimer();

}

function startTimer(){

interval=setInterval(()=>{

timer--;

timerEl.innerText="⏱ Time: "+timer;

if(timer===0){

switchTurn();

}

},1000);

}

function resetTimer(){

clearInterval(interval);

timer=10;

timerEl.innerText="⏱ Time: 10";

startTimer();

}

function toggleSound(){

sound=!sound;

}

function saveScore(){

localStorage.setItem("score",JSON.stringify(score));

updateScore();

}

function updateScore(){

document.getElementById("xWins").innerText=score.X;

document.getElementById("oWins").innerText=score.O;

document.getElementById("draws").innerText=score.D;

}