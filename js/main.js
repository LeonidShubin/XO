const app = document.querySelector(".app");
const preloader = {
  on: () => {
    const container = document.createElement("div");
    container.classList.add("preloader");
    container.innerHTML = '<svg width="200px" height="200px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="lds-ripple" style="background: rgba(0, 0, 0, 0) none repeat scroll 0% 0%;"><circle cx="50" cy="50" r="0" fill="none" ng-attr-stroke="{{config.c1}}" ng-attr-stroke-width="{{config.width}}" stroke="#fa139e" stroke-width="2"><animate attributeName="r" calcMode="spline" values="0;40" keyTimes="0;1" dur="1" keySplines="0 0.2 0.8 1" begin="-0.5s" repeatCount="indefinite"/><animate attributeName="opacity" calcMode="spline" values="1;0" keyTimes="0;1" dur="1" keySplines="0.2 0 0.8 1" begin="-0.5s" repeatCount="indefinite"/></circle><circle cx="50" cy="50" r="0" fill="none" ng-attr-stroke="{{config.c2}}" ng-attr-stroke-width="{{config.width}}" stroke="#312798" stroke-width="2"><animate attributeName="r" calcMode="spline" values="0;40" keyTimes="0;1" dur="1" keySplines="0 0.2 0.8 1" begin="0s" repeatCount="indefinite"/><animate attributeName="opacity" calcMode="spline" values="1;0" keyTimes="0;1" dur="1" keySplines="0.2 0 0.8 1" begin="0s" repeatCount="indefinite"/></circle></svg>';
    app.appendChild(container);
  },
  off: () => {
    app.removeChild(document.querySelector(".preloader"));
  }
};
let whoTurn = "сross";

document.addEventListener("DOMContentLoaded", buildMenuPage);

function buildMenuPage() {
  preloader.on();

  whoTurn = "сross";

  const menuPage = document.createElement("div");
  const headTitle = document.createElement("div");
  const menu = document.createElement("div");
  const inp = document.createElement("input");
  const message = document.createElement("div");
  const span = document.createElement("span");
  const startGameButton = document.createElement("div");

  menuPage.classList.add("menuPage");
  headTitle.classList.add("headTitle");
  menu.classList.add("menu");
  message.classList.add("message");
  startGameButton.classList.add("startGameButton");

  inp.setAttribute("type", "range");
  inp.setAttribute("min", "5");
  inp.setAttribute("max", "50");
  inp.setAttribute("step", "1");
  inp.setAttribute("value", "5");

  headTitle.innerHTML = "TIC TAC TOE";
  message.innerHTML = "choose field size";
  span.innerHTML = "5 X 5";
  startGameButton.innerHTML = "START";

  if (document.querySelector(".gamePage")) {
    app.removeChild(document.querySelector(".gamePage"));
  }
  if (document.querySelector(".endOfGamePage")) {
    app.removeChild(document.querySelector(".endOfGamePage"));
  }

  menu.appendChild(inp);
  menu.appendChild(message);
  menu.appendChild(span);
  menu.appendChild(startGameButton);
  menuPage.appendChild(headTitle);
  menuPage.appendChild(menu);
  app.appendChild(menuPage);

  inp.oninput = () => {
    span.innerHTML = inp.value + " X " + inp.value;
  };
  startGameButton.onclick = () => buildGamePage(inp.value);

  preloader.off();
}
function buildGamePage(n) {
  preloader.on();

  const gamePage = document.createElement("div");
  const startNewGameButton = document.createElement("div");

  gamePage.classList.add("gamePage");
  startNewGameButton.classList.add("startNewGameButton");

  gamePage.innerHTML = '<div class="field"></div>';
  startNewGameButton.innerHTML = "NEW GAME";

  app.removeChild(document.querySelector(".menuPage"));
  
  gamePage.appendChild(startNewGameButton);
  app.appendChild(gamePage);

  startNewGameButton.onclick = () => buildMenuPage();

  appendCells(n);

  preloader.off();
}
function appendCells(n) {
  
  const field = document.querySelector(".field");
  
  for (i = 0; i < n; i++) {
    for (j = 0; j < n; j++) {
      
      const cell = document.createElement("canvas");
      cell.classList.add("cell");
      cell.classList.add(`row-${i}`);
      cell.classList.add(`column-${j}`);
      cell.setAttribute("height", 100);
      cell.setAttribute("width", 100);

      cell.style.width = `calc(100% / ${n})`;
      cell.style.height = `calc(100% / ${n})`;

      field.appendChild(cell);
      addEventToCell(cell);
    }
  }
}
function addEventToCell(target) {
  target.addEventListener(
    "click",
    e => {
      if (whoTurn === "сross") {
        drawСross(e.target);
        whoTurn = "сircle";
      } else {
        drawCircle(e.target);
        whoTurn = "сross";
      }
      
      /*
      После каждого хода функция передаёт целевую ячейку
      в функцию проверки результата (checkResult)
      */
      const comboWiners = checkResult(target);
      //если вернётся массив элементов к ним применяются стили
      if (comboWiners) {
        comboWiners.forEach(item => {
          item.style.background = "#ffffff25";
        });
        //после чего формируется окно окончания игры
        const inner = `${comboWiners[0].classList[3].toUpperCase()} WIN!`;
        endOfGame(inner);
      }
    },
    //options for event listener
    { once: true }
  );
}
function drawCircle(target) {
  const ctx = target.getContext("2d");

  ctx.lineWidth = 10;
  ctx.strokeStyle = "#c94552";

  ctx.beginPath();
  ctx.arc(50, 50, 30, 0, Math.PI * 2);
  ctx.stroke();

  target.classList.add("circle");
}
function drawСross(target) {
  const ctx = target.getContext("2d");

  ctx.lineWidth = 10;
  ctx.lineCap = "round";
  ctx.strokeStyle = "#39d5d2";

  ctx.beginPath();
  ctx.moveTo(20, 20);
  ctx.lineTo(80, 80);
  ctx.moveTo(80, 20);
  ctx.lineTo(20, 80);
  ctx.stroke();

  target.classList.add("cross");
}
function checkResult(target) {
  //получаем координаты целевой ячейки и её значение
  const row = target.classList[1].substr(4, 2);
  const column = target.classList[2].substr(7, 2);
  const val = target.classList[3];
  
  /*
  Принцип работы проверки результата заключается
  в переборе ячеек которые могут создать "победную"
  комбинацию с целевой ячейкой.
  В объекте test хранится четыре массива которые
  хранят функции определяющие измененение координат
  для получения следующего "соседа" по вектору проверки 
  с каждой итерацией цикла.
  Векторы направлены обратно друг от друга
  в четырёх областях: ряд, колонна и две диагонали.
  */
  const test = {
    checkRow: [
      ratio => { return document.querySelector( `.row-${row}.column-${Number(column) + ratio}` ); },
      ratio => { return document.querySelector( `.row-${row}.column-${Number(column) - ratio}` ); }
    ],
    checkColumn: [
      ratio => { return document.querySelector( `.row-${Number(row) + ratio}.column-${column}` ); },
      ratio => { return document.querySelector( `.row-${Number(row) - ratio}.column-${column}` ); }
    ],
    checkDiagonal1: [
      ratio => { return document.querySelector( `.row-${Number(row) + ratio}.column-${Number(column) + ratio}` ); },
      ratio => { return document.querySelector( `.row-${Number(row) - ratio}.column-${Number(column) - ratio}` ); }
    ],
    checkDiagonal2: [
      ratio => { return document.querySelector( `.row-${Number(row) + ratio}.column-${Number(column) - ratio}` ); },
      ratio => { return document.querySelector( `.row-${Number(row) - ratio}.column-${Number(column) + ratio}` ); }
    ]
  };

  for (let key in test) {
    let combo = [];
    
    test[key].forEach(item => {
      /*
      цикл ниже проверяет 5 элементов от целевого
      по каждому из векторов проверки.
      если проверяемы элемент не подходит условиям
      следующие элементы вектора не проверяются.
      В итоге если после проверки области в обе стороны
      в массив combo собрано более 3 элементов
      в массив добавляется текущий элемент
      и сам массив возвращается функцией для дальнейшей обработки
      */
      for (i = 1; i < 5; i++) {
        let checkingCell = item(i);

        if (
          !checkingCell ||
          !checkingCell.classList[3] ||
          checkingCell.classList[3] !== val
        )
          break;

        combo.push(checkingCell);
      }
    });

    if (combo.length > 3) {
      combo.push(target);
      return combo;
    }
  }
  return false;
}
function endOfGame(winner) {
  const endOfGamePage = document.createElement("div");
  const note = document.createElement("div");
  const message = document.createElement("div");
  const startNewGameButton = document.createElement("div");

  endOfGamePage.classList.add("endOfGamePage");
  note.classList.add("note");
  message.classList.add("message");
  startNewGameButton.classList.add("startNewGameButton");

  startNewGameButton.innerHTML = "NEW GAME";
  message.innerHTML = winner;

  note.appendChild(message);
  note.appendChild(startNewGameButton);
  endOfGamePage.appendChild(note);
  app.appendChild(endOfGamePage);

  startNewGameButton.onclick = () => buildMenuPage();
}
