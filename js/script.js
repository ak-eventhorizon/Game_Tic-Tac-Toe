'use strict';

let FIELD_SIZE = 3; //размер игрового поля по умолчанию
let isTurnX = true; // по умолчанию первым ходит X
let scoreX = 0; // счет побед Х
let scoreO = 0; // счет побед О
let gameMatrix = []; //матрица игры - двумерный массив


resetUIforNewGame();
// обработка изменения селекта по выбору размера поля - перегенерить поле
document.querySelector('.size_select').addEventListener('change', resetUIforNewGame);
// обработка нажатия кнопки
document.querySelector('.ng_btn').addEventListener('click', resetUIforNewGame);

function generateField(size) {    

    let field = document.querySelector('.field');
    // очистка существующего поля
    field.innerHTML = '';
    // изменение грида под размер поля
    field.style.gridTemplate = `repeat(${size}, 1fr) / repeat(${size}, 1fr)`;

    // создание и добавление всех клеток поля
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            let elem = document.createElement('div');
            elem.className = 'cell empty';
            elem.id = `${j}-${i}`; //id - координаты X-Y
            field.appendChild(elem);
        }
    }
}

function resetUIforNewGame() {
    //сброс хода на X
    isTurnX = true;
    //установка указателя ходов в интерфейсе на крестики
    document.querySelector('.turn').classList.value = 'turn turn_x';
    //FIELD_SIZE меняется на value того option, который выбран
    let option = document.querySelector('.size_select').getElementsByTagName('option');
    for (let i = 0; i < option.length; i++) {
        if (option[i].selected === true) {
            FIELD_SIZE = +option[i].value;
        }
    }
    //перегенерация игрового поля начисто
    generateField(FIELD_SIZE);
    //заполнение полей со статистикой побед
    document.querySelector('.score_x').innerHTML = +scoreX;
    document.querySelector('.score_o').innerHTML = +scoreO;
    //запуск ожидания клика по ячейкам
    addEventListenerOnCellsClick();
}

function addEventListenerOnCellsClick() {
    let cells = document.getElementsByClassName('cell');
    for (let i = 0; i < cells.length; i++) {
        cells[i].onclick = playerTurn;
    }
}

function playerTurn() {
    //действия по клику производятся над ячейкой, только если она пустая
    if (this.classList[1] === 'empty') {
        //изменение класса ячейки при клике на нее
        this.classList.toggle('empty');
        this.classList.toggle('not_empty');

        //установка в ячейку символа ходящего и смена индикатора следующего хода
        if (isTurnX){
           this.classList.add('cell_x');
           document.querySelector('.turn').classList.value = 'turn turn_o';
        } else {
           this.classList.add('cell_o');
           document.querySelector('.turn').classList.value = 'turn turn_x';
        }

        //перегенерация матрицы игры после каждого хода
        gameMatrixGenerate();

        //проверка состояния партии
        let clickedCellCoordXY = this.id.split('-');
        // победа достигнута
        if (checkResult(clickedCellCoordXY)) {
            finishTheGameWin();
        }
        // продолжение партии
        else {
            // переход хода к противнику
            isTurnX = !isTurnX;
        }    
    }
}

function gameMatrixGenerate() {
    for (let y = 0; y < FIELD_SIZE; y++) {
        gameMatrix[y] = [];
        for (let x = 0; x < FIELD_SIZE; x++) {
            let currentCell = document.getElementById(x+'-'+y);

            if (currentCell.classList.contains('cell_x')) {
                gameMatrix[y][x] = 'X';
            } else 
            if (currentCell.classList.contains('cell_o')) {
                gameMatrix[y][x] = 'O';
            } else {
                gameMatrix[y][x] = null;
            }
        }
    }

    // по четыре пустых элемента сверху и снизу индекса массива введены для чтобы 
    // не было ошибки при рассчетах в функции checkResult
    gameMatrix[-1] = [];
    gameMatrix[-2] = [];
    gameMatrix[-3] = [];
    gameMatrix[-4] = [];
    gameMatrix[FIELD_SIZE] = [];
    gameMatrix[FIELD_SIZE + 1] = [];
    gameMatrix[FIELD_SIZE + 2] = [];
    gameMatrix[FIELD_SIZE + 3] = [];
}

function checkResult(xy) {
    // проверка результата игры на выигрыш
    // на вход XY кликнутой ячейки - на выход true/false
    
    let x = +xy[0]; // координата X из id
    let y = +xy[1]; // координата Y из id
    let gm = gameMatrix[y][x];

    // проверка на три в ряд с добавлением класса выигрывшим ячейкам
    if (FIELD_SIZE <= 4) {

        if (gm === gameMatrix[y - 1][x] && gm === gameMatrix[y + 1][x]) {
            document.getElementById(x+'-'+y).classList.toggle('cell_win');
            document.getElementById(x+'-'+(y-1)).classList.toggle('cell_win');
            document.getElementById(x+'-'+(y+1)).classList.toggle('cell_win');
            return true;
        } else if (gm === gameMatrix[y][x - 1] && gm === gameMatrix[y][x + 1]) {
            document.getElementById(x+'-'+y).classList.toggle('cell_win');
            document.getElementById((x-1)+'-'+y).classList.toggle('cell_win');
            document.getElementById((x+1)+'-'+y).classList.toggle('cell_win');
            return true;
        } else if (gm === gameMatrix[y + 1][x - 1] && gm === gameMatrix[y - 1][x + 1]) {
            document.getElementById(x+'-'+y).classList.toggle('cell_win');
            document.getElementById((x-1)+'-'+(y+1)).classList.toggle('cell_win');
            document.getElementById((x+1)+'-'+(y-1)).classList.toggle('cell_win');
            return true;
        } else if (gm === gameMatrix[y - 1][x - 1] && gm === gameMatrix[y + 1][x + 1]) {
            document.getElementById(x+'-'+y).classList.toggle('cell_win');
            document.getElementById((x-1)+'-'+(y-1)).classList.toggle('cell_win');
            document.getElementById((x+1)+'-'+(y+1)).classList.toggle('cell_win');
            return true;
        } else if (gm === gameMatrix[y - 1][x] && gm === gameMatrix[y - 2][x]) {
            document.getElementById(x+'-'+y).classList.toggle('cell_win');
            document.getElementById(x+'-'+(y-1)).classList.toggle('cell_win');
            document.getElementById(x+'-'+(y-2)).classList.toggle('cell_win');
            return true;
        } else if (gm === gameMatrix[y - 1][x + 1] && gm === gameMatrix[y - 2][x + 2]) {
            document.getElementById(x+'-'+y).classList.toggle('cell_win');
            document.getElementById((x+1)+'-'+(y-1)).classList.toggle('cell_win');
            document.getElementById((x+2)+'-'+(y-2)).classList.toggle('cell_win');
            return true;
        } else if (gm === gameMatrix[y][x + 1] && gm === gameMatrix[y][x + 2]) {
            document.getElementById(x+'-'+y).classList.toggle('cell_win');
            document.getElementById((x+1)+'-'+y).classList.toggle('cell_win');
            document.getElementById((x+2)+'-'+y).classList.toggle('cell_win');
            return true;
        } else if (gm === gameMatrix[y + 1][x + 1] && gm === gameMatrix[y + 2][x + 2]) {
            document.getElementById(x+'-'+y).classList.toggle('cell_win');
            document.getElementById((x+1)+'-'+(y+1)).classList.toggle('cell_win');
            document.getElementById((x+2)+'-'+(y+2)).classList.toggle('cell_win');
            return true;
        } else if (gm === gameMatrix[y + 1][x] && gm === gameMatrix[y + 2][x]) {
            document.getElementById(x+'-'+y).classList.toggle('cell_win');
            document.getElementById(x+'-'+(y+1)).classList.toggle('cell_win');
            document.getElementById(x+'-'+(y+2)).classList.toggle('cell_win');
            return true;
        } else if (gm === gameMatrix[y + 1][x - 1] && gm === gameMatrix[y + 2][x - 2]) {
            document.getElementById(x+'-'+y).classList.toggle('cell_win');
            document.getElementById((x-1)+'-'+(y+1)).classList.toggle('cell_win');
            document.getElementById((x-2)+'-'+(y+2)).classList.toggle('cell_win');
            return true;
        } else if (gm === gameMatrix[y][x - 1] && gm === gameMatrix[y][x - 2]) {
            document.getElementById(x+'-'+y).classList.toggle('cell_win');
            document.getElementById((x-1)+'-'+y).classList.toggle('cell_win');
            document.getElementById((x-2)+'-'+y).classList.toggle('cell_win');
            return true;
        } else if (gm === gameMatrix[y - 1][x - 1] && gm === gameMatrix[y - 2][x - 2]) {
            document.getElementById(x+'-'+y).classList.toggle('cell_win');
            document.getElementById((x-1)+'-'+(y-1)).classList.toggle('cell_win');
            document.getElementById((x-2)+'-'+(y-2)).classList.toggle('cell_win');
            return true;
        } else {
            return false;
        }
    }

    // проверка на пять в ряд с добавлением класса выигрывшим ячейкам
    else if (FIELD_SIZE > 4) {

        if(gm === gameMatrix[y - 1][x] && 
            gm === gameMatrix[y - 2][x] && 
            gm === gameMatrix[y - 3][x] && 
            gm === gameMatrix[y - 4][x])
        {
            document.getElementById(x+'-'+y).classList.toggle('cell_win');
            document.getElementById(x+'-'+(y-1)).classList.toggle('cell_win');
            document.getElementById(x+'-'+(y-2)).classList.toggle('cell_win');
            document.getElementById(x+'-'+(y-3)).classList.toggle('cell_win');
            document.getElementById(x+'-'+(y-4)).classList.toggle('cell_win');
            return true;  
        } else if(gm === gameMatrix[y + 1][x] && 
            gm === gameMatrix[y - 1][x] && 
            gm === gameMatrix[y - 2][x] && 
            gm === gameMatrix[y - 3][x])
        {
            document.getElementById(x+'-'+y).classList.toggle('cell_win');
            document.getElementById(x+'-'+(y+1)).classList.toggle('cell_win');
            document.getElementById(x+'-'+(y-1)).classList.toggle('cell_win');
            document.getElementById(x+'-'+(y-2)).classList.toggle('cell_win');
            document.getElementById(x+'-'+(y-3)).classList.toggle('cell_win');
            return true;
        } else if(gm === gameMatrix[y + 1][x] && 
            gm === gameMatrix[y + 2][x] && 
            gm === gameMatrix[y - 1][x] && 
            gm === gameMatrix[y - 2][x])
        {
            document.getElementById(x+'-'+y).classList.toggle('cell_win');
            document.getElementById(x+'-'+(y+1)).classList.toggle('cell_win');
            document.getElementById(x+'-'+(y+2)).classList.toggle('cell_win');
            document.getElementById(x+'-'+(y-1)).classList.toggle('cell_win');
            document.getElementById(x+'-'+(y-2)).classList.toggle('cell_win');
            return true;
        } else if(gm === gameMatrix[y + 1][x] && 
            gm === gameMatrix[y + 2][x] && 
            gm === gameMatrix[y + 3][x] && 
            gm === gameMatrix[y - 1][x])
        {
            document.getElementById(x+'-'+y).classList.toggle('cell_win');
            document.getElementById(x+'-'+(y+1)).classList.toggle('cell_win');
            document.getElementById(x+'-'+(y+2)).classList.toggle('cell_win');
            document.getElementById(x+'-'+(y+3)).classList.toggle('cell_win');
            document.getElementById(x+'-'+(y-1)).classList.toggle('cell_win');
            return true;
        } else if(gm === gameMatrix[y + 1][x] && 
            gm === gameMatrix[y + 2][x] && 
            gm === gameMatrix[y + 3][x] && 
            gm === gameMatrix[y + 4][x])
        {
            document.getElementById(x+'-'+y).classList.toggle('cell_win');
            document.getElementById(x+'-'+(y+1)).classList.toggle('cell_win');
            document.getElementById(x+'-'+(y+2)).classList.toggle('cell_win');
            document.getElementById(x+'-'+(y+3)).classList.toggle('cell_win');
            document.getElementById(x+'-'+(y+4)).classList.toggle('cell_win');
            return true;
        } else if(gm === gameMatrix[y][x - 1] && 
            gm === gameMatrix[y][x - 2] && 
            gm === gameMatrix[y][x - 3] && 
            gm === gameMatrix[y][x - 4])
        {
            document.getElementById(x+'-'+y).classList.toggle('cell_win');
            document.getElementById((x-1)+'-'+y).classList.toggle('cell_win');
            document.getElementById((x-2)+'-'+y).classList.toggle('cell_win');
            document.getElementById((x-3)+'-'+y).classList.toggle('cell_win');
            document.getElementById((x-4)+'-'+y).classList.toggle('cell_win');
            return true;
        } else if(gm === gameMatrix[y][x + 1] && 
            gm === gameMatrix[y][x - 1] && 
            gm === gameMatrix[y][x - 2] && 
            gm === gameMatrix[y][x - 3])
        {
            document.getElementById(x+'-'+y).classList.toggle('cell_win');
            document.getElementById((x+1)+'-'+y).classList.toggle('cell_win');
            document.getElementById((x-1)+'-'+y).classList.toggle('cell_win');
            document.getElementById((x-2)+'-'+y).classList.toggle('cell_win');
            document.getElementById((x-3)+'-'+y).classList.toggle('cell_win');
            return true;
        } else if(gm === gameMatrix[y][x + 1] && 
            gm === gameMatrix[y][x + 2] && 
            gm === gameMatrix[y][x - 1] && 
            gm === gameMatrix[y][x - 2])
        {
            document.getElementById(x+'-'+y).classList.toggle('cell_win');
            document.getElementById((x+1)+'-'+y).classList.toggle('cell_win');
            document.getElementById((x+2)+'-'+y).classList.toggle('cell_win');
            document.getElementById((x-1)+'-'+y).classList.toggle('cell_win');
            document.getElementById((x-2)+'-'+y).classList.toggle('cell_win');
            return true;
        } else if(gm === gameMatrix[y][x + 1] && 
            gm === gameMatrix[y][x + 2] && 
            gm === gameMatrix[y][x + 3] && 
            gm === gameMatrix[y][x - 1])
        {
            document.getElementById(x+'-'+y).classList.toggle('cell_win');
            document.getElementById((x+1)+'-'+y).classList.toggle('cell_win');
            document.getElementById((x+2)+'-'+y).classList.toggle('cell_win');
            document.getElementById((x+3)+'-'+y).classList.toggle('cell_win');
            document.getElementById((x-1)+'-'+y).classList.toggle('cell_win');
            return true;
        } else if(gm === gameMatrix[y][x + 1] && 
            gm === gameMatrix[y][x + 2] && 
            gm === gameMatrix[y][x + 3] && 
            gm === gameMatrix[y][x + 4])
        {
            document.getElementById(x+'-'+y).classList.toggle('cell_win');
            document.getElementById((x+1)+'-'+y).classList.toggle('cell_win');
            document.getElementById((x+2)+'-'+y).classList.toggle('cell_win');
            document.getElementById((x+3)+'-'+y).classList.toggle('cell_win');
            document.getElementById((x+4)+'-'+y).classList.toggle('cell_win');
            return true;
        } else if(gm === gameMatrix[y - 1][x + 1] && 
            gm === gameMatrix[y - 2][x + 2] && 
            gm === gameMatrix[y - 3][x + 3] && 
            gm === gameMatrix[y - 4][x + 4])
        {
            document.getElementById(x+'-'+y).classList.toggle('cell_win');
            document.getElementById((x+1)+'-'+(y-1)).classList.toggle('cell_win');
            document.getElementById((x+2)+'-'+(y-2)).classList.toggle('cell_win');
            document.getElementById((x+3)+'-'+(y-3)).classList.toggle('cell_win');
            document.getElementById((x+4)+'-'+(y-4)).classList.toggle('cell_win');
            return true;
        } else if(gm === gameMatrix[y + 1][x - 1] && 
            gm === gameMatrix[y - 1][x + 1] && 
            gm === gameMatrix[y - 2][x + 2] && 
            gm === gameMatrix[y - 3][x + 3])
        {
            document.getElementById(x+'-'+y).classList.toggle('cell_win');
            document.getElementById((x-1)+'-'+(y+1)).classList.toggle('cell_win');
            document.getElementById((x+1)+'-'+(y-1)).classList.toggle('cell_win');
            document.getElementById((x+2)+'-'+(y-2)).classList.toggle('cell_win');
            document.getElementById((x+3)+'-'+(y-3)).classList.toggle('cell_win');
            return true;
        } else if(gm === gameMatrix[y + 1][x - 1] && 
            gm === gameMatrix[y + 2][x - 2] && 
            gm === gameMatrix[y - 1][x + 1] && 
            gm === gameMatrix[y - 2][x + 2])
        {
            document.getElementById(x+'-'+y).classList.toggle('cell_win');
            document.getElementById((x-1)+'-'+(y+1)).classList.toggle('cell_win');
            document.getElementById((x-2)+'-'+(y+2)).classList.toggle('cell_win');
            document.getElementById((x+1)+'-'+(y-1)).classList.toggle('cell_win');
            document.getElementById((x+2)+'-'+(y-2)).classList.toggle('cell_win');
            return true;
        } else if(gm === gameMatrix[y + 1][x - 1] && 
            gm === gameMatrix[y + 2][x - 2] && 
            gm === gameMatrix[y + 3][x - 3] && 
            gm === gameMatrix[y - 1][x + 1])
        {
            document.getElementById(x+'-'+y).classList.toggle('cell_win');
            document.getElementById((x-1)+'-'+(y+1)).classList.toggle('cell_win');
            document.getElementById((x-2)+'-'+(y+2)).classList.toggle('cell_win');
            document.getElementById((x-3)+'-'+(y+3)).classList.toggle('cell_win');
            document.getElementById((x+1)+'-'+(y-1)).classList.toggle('cell_win');
            return true;
        } else if(gm === gameMatrix[y + 1][x - 1] && 
            gm === gameMatrix[y + 2][x - 2] && 
            gm === gameMatrix[y + 3][x - 3] && 
            gm === gameMatrix[y + 4][x - 4])
        {
            document.getElementById(x+'-'+y).classList.toggle('cell_win');
            document.getElementById((x-1)+'-'+(y+1)).classList.toggle('cell_win');
            document.getElementById((x-2)+'-'+(y+2)).classList.toggle('cell_win');
            document.getElementById((x-3)+'-'+(y+3)).classList.toggle('cell_win');
            document.getElementById((x-4)+'-'+(y+4)).classList.toggle('cell_win');
            return true;
        } else if(gm === gameMatrix[y + 1][x + 1] && 
            gm === gameMatrix[y + 2][x + 2] && 
            gm === gameMatrix[y + 3][x + 3] && 
            gm === gameMatrix[y + 4][x + 4])
        {
            document.getElementById(x+'-'+y).classList.toggle('cell_win');
            document.getElementById((x+1)+'-'+(y+1)).classList.toggle('cell_win');
            document.getElementById((x+2)+'-'+(y+2)).classList.toggle('cell_win');
            document.getElementById((x+3)+'-'+(y+3)).classList.toggle('cell_win');
            document.getElementById((x+4)+'-'+(y+4)).classList.toggle('cell_win');
            return true;
        } else if(gm === gameMatrix[y + 1][x + 1] && 
            gm === gameMatrix[y + 2][x + 2] && 
            gm === gameMatrix[y + 3][x + 3] && 
            gm === gameMatrix[y - 1][x - 1])
        {
            document.getElementById(x+'-'+y).classList.toggle('cell_win');
            document.getElementById((x+1)+'-'+(y+1)).classList.toggle('cell_win');
            document.getElementById((x+2)+'-'+(y+2)).classList.toggle('cell_win');
            document.getElementById((x+3)+'-'+(y+3)).classList.toggle('cell_win');
            document.getElementById((x-1)+'-'+(y-1)).classList.toggle('cell_win');
            return true;
        } else if(gm === gameMatrix[y + 1][x + 1] && 
            gm === gameMatrix[y + 2][x + 2] && 
            gm === gameMatrix[y - 1][x - 1] && 
            gm === gameMatrix[y - 2][x - 2])
        {
            document.getElementById(x+'-'+y).classList.toggle('cell_win');
            document.getElementById((x+1)+'-'+(y+1)).classList.toggle('cell_win');
            document.getElementById((x+2)+'-'+(y+2)).classList.toggle('cell_win');
            document.getElementById((x-1)+'-'+(y-1)).classList.toggle('cell_win');
            document.getElementById((x-2)+'-'+(y-2)).classList.toggle('cell_win');
            return true;
        } else if(gm === gameMatrix[y + 1][x + 1] && 
            gm === gameMatrix[y - 1][x - 1] && 
            gm === gameMatrix[y - 2][x - 2] && 
            gm === gameMatrix[y - 3][x - 3])
        {
            document.getElementById(x+'-'+y).classList.toggle('cell_win');
            document.getElementById((x+1)+'-'+(y+1)).classList.toggle('cell_win');
            document.getElementById((x-1)+'-'+(y-1)).classList.toggle('cell_win');
            document.getElementById((x-2)+'-'+(y-2)).classList.toggle('cell_win');
            document.getElementById((x-3)+'-'+(y-3)).classList.toggle('cell_win');
            return true;
        } else if(gm === gameMatrix[y - 1][x - 1] && 
            gm === gameMatrix[y - 2][x - 2] && 
            gm === gameMatrix[y - 3][x - 3] && 
            gm === gameMatrix[y - 4][x - 4])
        {
            document.getElementById(x+'-'+y).classList.toggle('cell_win');
            document.getElementById((x-1)+'-'+(y-1)).classList.toggle('cell_win');
            document.getElementById((x-2)+'-'+(y-2)).classList.toggle('cell_win');
            document.getElementById((x-3)+'-'+(y-3)).classList.toggle('cell_win');
            document.getElementById((x-4)+'-'+(y-4)).classList.toggle('cell_win');
            return true;
        } else {
            return false;
        }
    }
}

function finishTheGameWin() {

    //смена класса всем ячейкам на not_empty для некликабельности
    let cells = document.getElementsByClassName('empty');

    // проверка, что есть хоть один блок not_empty
    if (cells[0] !== undefined) { 
        do {
            cells[0].classList.toggle('not_empty');
            cells[0].classList.toggle('empty');
        }
        while (cells.length > 0);
    }

    //изменение статистики побед в блоке stats
    let stat = document.querySelector('.stat');
    if (isTurnX) {
        ++scoreX;
        document.querySelector('.score_x').innerHTML = +scoreX;
    } else  {
        ++scoreO;
        document.querySelector('.score_o').innerHTML = +scoreO;
    }    
}
