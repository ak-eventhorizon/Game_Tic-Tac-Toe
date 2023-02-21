'use strict';

let FIELD_SIZE = 3; // размер игрового поля по умолчанию
let isTurnX = true; // по умолчанию первым ходит X
let scoreX = 0; // счет побед Х
let scoreO = 0; // счет побед О
let gameMatrix = []; // матрица игры - двумерный массив - перегенерация и анализ матрицы на победную комбинацию происходит после каждого хода


resetUIforNewGame();
// обработка изменения выбора размера поля - перегенерация поля при изменении
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
            elem.id = `${j}-${i}`; // id - координаты X-Y
            elem.onclick = playerTurn; // навешивание на ячейку обработчика клика
            field.appendChild(elem);
        }
    }
}

function resetUIforNewGame() {
    // сброс хода на X
    isTurnX = true;
    // установка указателя ходов в интерфейсе на крестики
    document.querySelector('.turn').classList.value = 'turn turn_x';
    // FIELD_SIZE меняется на value того option, который выбран
    let option = document.querySelector('.size_select').getElementsByTagName('option');
    for (let i = 0; i < option.length; i++) {
        if (option[i].selected === true) {
            FIELD_SIZE = +option[i].value;
        }
    }
    // перегенерация игрового поля начисто
    generateField(FIELD_SIZE);
    // заполнение полей со статистикой побед
    document.querySelector('.score_x').innerHTML = +scoreX;
    document.querySelector('.score_o').innerHTML = +scoreO;
    
    // заполнение поля info данными о правилах раунда
    if (FIELD_SIZE <= 4) {
        document.querySelector('.info').innerHTML = '3-TO-WIN';
    } else {
        document.querySelector('.info').innerHTML = '5-TO-WIN';
    }
    
}

function playerTurn() {
    // действия по клику производятся над ячейкой, только если она пустая
    if (this.classList[1] === 'empty') {
        // изменение класса ячейки при клике на нее с пустой на не пустую
        this.classList.toggle('empty');
        this.classList.toggle('not_empty');

        // установка в ячейку символа ходящего игрока
        isTurnX ? this.classList.add('cell_x') : this.classList.add('cell_o');

        // перегенерация матрицы игры после каждого хода
        gameMatrixGenerate();

        // проверка состояния партии
        let clickedCellXY = this.id.split('-');
        let emptyCells = document.getElementsByClassName('cell empty');
        // победа достигнута
        if (isWinAchieved(clickedCellXY)) {
            finishTheGameWin();
        } else 
        // ничья - пустых клеток больше нет, но победа не достигнута
        if (emptyCells[0] === undefined) {
            document.querySelector('.info').innerHTML = 'DRAW';
        }
        // продолжение партии
        else {
            // смена значка следующего хода
            isTurnX ? 
            document.querySelector('.turn').classList.value = 'turn turn_o' : 
            document.querySelector('.turn').classList.value = 'turn turn_x';
                
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

function isWinAchieved(xy) {
    // проверка результата игры на выигрыш - данная функция проверяет все возможные победные комбинации относительно текущей ячейки
    // на вход XY кликнутой ячейки - на выход true/false
    
    let x = +xy[0]; // координата X из id
    let y = +xy[1]; // координата Y из id
    let checkingCell = gameMatrix[y][x]; // проверяемая ячейка

    // проверка на три в ряд с добавлением класса выигрывшим ячейкам
    if (FIELD_SIZE <= 4) {

        if (checkingCell === gameMatrix[y - 1][x] && checkingCell === gameMatrix[y + 1][x]) {
            document.getElementById(x+'-'+y).classList.toggle('cell_win');
            document.getElementById(x+'-'+(y-1)).classList.toggle('cell_win');
            document.getElementById(x+'-'+(y+1)).classList.toggle('cell_win');
            return true;
        } else if (checkingCell === gameMatrix[y][x - 1] && checkingCell === gameMatrix[y][x + 1]) {
            document.getElementById(x+'-'+y).classList.toggle('cell_win');
            document.getElementById((x-1)+'-'+y).classList.toggle('cell_win');
            document.getElementById((x+1)+'-'+y).classList.toggle('cell_win');
            return true;
        } else if (checkingCell === gameMatrix[y + 1][x - 1] && checkingCell === gameMatrix[y - 1][x + 1]) {
            document.getElementById(x+'-'+y).classList.toggle('cell_win');
            document.getElementById((x-1)+'-'+(y+1)).classList.toggle('cell_win');
            document.getElementById((x+1)+'-'+(y-1)).classList.toggle('cell_win');
            return true;
        } else if (checkingCell === gameMatrix[y - 1][x - 1] && checkingCell === gameMatrix[y + 1][x + 1]) {
            document.getElementById(x+'-'+y).classList.toggle('cell_win');
            document.getElementById((x-1)+'-'+(y-1)).classList.toggle('cell_win');
            document.getElementById((x+1)+'-'+(y+1)).classList.toggle('cell_win');
            return true;
        } else if (checkingCell === gameMatrix[y - 1][x] && checkingCell === gameMatrix[y - 2][x]) {
            document.getElementById(x+'-'+y).classList.toggle('cell_win');
            document.getElementById(x+'-'+(y-1)).classList.toggle('cell_win');
            document.getElementById(x+'-'+(y-2)).classList.toggle('cell_win');
            return true;
        } else if (checkingCell === gameMatrix[y - 1][x + 1] && checkingCell === gameMatrix[y - 2][x + 2]) {
            document.getElementById(x+'-'+y).classList.toggle('cell_win');
            document.getElementById((x+1)+'-'+(y-1)).classList.toggle('cell_win');
            document.getElementById((x+2)+'-'+(y-2)).classList.toggle('cell_win');
            return true;
        } else if (checkingCell === gameMatrix[y][x + 1] && checkingCell === gameMatrix[y][x + 2]) {
            document.getElementById(x+'-'+y).classList.toggle('cell_win');
            document.getElementById((x+1)+'-'+y).classList.toggle('cell_win');
            document.getElementById((x+2)+'-'+y).classList.toggle('cell_win');
            return true;
        } else if (checkingCell === gameMatrix[y + 1][x + 1] && checkingCell === gameMatrix[y + 2][x + 2]) {
            document.getElementById(x+'-'+y).classList.toggle('cell_win');
            document.getElementById((x+1)+'-'+(y+1)).classList.toggle('cell_win');
            document.getElementById((x+2)+'-'+(y+2)).classList.toggle('cell_win');
            return true;
        } else if (checkingCell === gameMatrix[y + 1][x] && checkingCell === gameMatrix[y + 2][x]) {
            document.getElementById(x+'-'+y).classList.toggle('cell_win');
            document.getElementById(x+'-'+(y+1)).classList.toggle('cell_win');
            document.getElementById(x+'-'+(y+2)).classList.toggle('cell_win');
            return true;
        } else if (checkingCell === gameMatrix[y + 1][x - 1] && checkingCell === gameMatrix[y + 2][x - 2]) {
            document.getElementById(x+'-'+y).classList.toggle('cell_win');
            document.getElementById((x-1)+'-'+(y+1)).classList.toggle('cell_win');
            document.getElementById((x-2)+'-'+(y+2)).classList.toggle('cell_win');
            return true;
        } else if (checkingCell === gameMatrix[y][x - 1] && checkingCell === gameMatrix[y][x - 2]) {
            document.getElementById(x+'-'+y).classList.toggle('cell_win');
            document.getElementById((x-1)+'-'+y).classList.toggle('cell_win');
            document.getElementById((x-2)+'-'+y).classList.toggle('cell_win');
            return true;
        } else if (checkingCell === gameMatrix[y - 1][x - 1] && checkingCell === gameMatrix[y - 2][x - 2]) {
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

        if(checkingCell === gameMatrix[y - 1][x] && 
            checkingCell === gameMatrix[y - 2][x] && 
            checkingCell === gameMatrix[y - 3][x] && 
            checkingCell === gameMatrix[y - 4][x])
        {
            document.getElementById(x+'-'+y).classList.toggle('cell_win');
            document.getElementById(x+'-'+(y-1)).classList.toggle('cell_win');
            document.getElementById(x+'-'+(y-2)).classList.toggle('cell_win');
            document.getElementById(x+'-'+(y-3)).classList.toggle('cell_win');
            document.getElementById(x+'-'+(y-4)).classList.toggle('cell_win');
            return true;  
        } else if(checkingCell === gameMatrix[y + 1][x] && 
            checkingCell === gameMatrix[y - 1][x] && 
            checkingCell === gameMatrix[y - 2][x] && 
            checkingCell === gameMatrix[y - 3][x])
        {
            document.getElementById(x+'-'+y).classList.toggle('cell_win');
            document.getElementById(x+'-'+(y+1)).classList.toggle('cell_win');
            document.getElementById(x+'-'+(y-1)).classList.toggle('cell_win');
            document.getElementById(x+'-'+(y-2)).classList.toggle('cell_win');
            document.getElementById(x+'-'+(y-3)).classList.toggle('cell_win');
            return true;
        } else if(checkingCell === gameMatrix[y + 1][x] && 
            checkingCell === gameMatrix[y + 2][x] && 
            checkingCell === gameMatrix[y - 1][x] && 
            checkingCell === gameMatrix[y - 2][x])
        {
            document.getElementById(x+'-'+y).classList.toggle('cell_win');
            document.getElementById(x+'-'+(y+1)).classList.toggle('cell_win');
            document.getElementById(x+'-'+(y+2)).classList.toggle('cell_win');
            document.getElementById(x+'-'+(y-1)).classList.toggle('cell_win');
            document.getElementById(x+'-'+(y-2)).classList.toggle('cell_win');
            return true;
        } else if(checkingCell === gameMatrix[y + 1][x] && 
            checkingCell === gameMatrix[y + 2][x] && 
            checkingCell === gameMatrix[y + 3][x] && 
            checkingCell === gameMatrix[y - 1][x])
        {
            document.getElementById(x+'-'+y).classList.toggle('cell_win');
            document.getElementById(x+'-'+(y+1)).classList.toggle('cell_win');
            document.getElementById(x+'-'+(y+2)).classList.toggle('cell_win');
            document.getElementById(x+'-'+(y+3)).classList.toggle('cell_win');
            document.getElementById(x+'-'+(y-1)).classList.toggle('cell_win');
            return true;
        } else if(checkingCell === gameMatrix[y + 1][x] && 
            checkingCell === gameMatrix[y + 2][x] && 
            checkingCell === gameMatrix[y + 3][x] && 
            checkingCell === gameMatrix[y + 4][x])
        {
            document.getElementById(x+'-'+y).classList.toggle('cell_win');
            document.getElementById(x+'-'+(y+1)).classList.toggle('cell_win');
            document.getElementById(x+'-'+(y+2)).classList.toggle('cell_win');
            document.getElementById(x+'-'+(y+3)).classList.toggle('cell_win');
            document.getElementById(x+'-'+(y+4)).classList.toggle('cell_win');
            return true;
        } else if(checkingCell === gameMatrix[y][x - 1] && 
            checkingCell === gameMatrix[y][x - 2] && 
            checkingCell === gameMatrix[y][x - 3] && 
            checkingCell === gameMatrix[y][x - 4])
        {
            document.getElementById(x+'-'+y).classList.toggle('cell_win');
            document.getElementById((x-1)+'-'+y).classList.toggle('cell_win');
            document.getElementById((x-2)+'-'+y).classList.toggle('cell_win');
            document.getElementById((x-3)+'-'+y).classList.toggle('cell_win');
            document.getElementById((x-4)+'-'+y).classList.toggle('cell_win');
            return true;
        } else if(checkingCell === gameMatrix[y][x + 1] && 
            checkingCell === gameMatrix[y][x - 1] && 
            checkingCell === gameMatrix[y][x - 2] && 
            checkingCell === gameMatrix[y][x - 3])
        {
            document.getElementById(x+'-'+y).classList.toggle('cell_win');
            document.getElementById((x+1)+'-'+y).classList.toggle('cell_win');
            document.getElementById((x-1)+'-'+y).classList.toggle('cell_win');
            document.getElementById((x-2)+'-'+y).classList.toggle('cell_win');
            document.getElementById((x-3)+'-'+y).classList.toggle('cell_win');
            return true;
        } else if(checkingCell === gameMatrix[y][x + 1] && 
            checkingCell === gameMatrix[y][x + 2] && 
            checkingCell === gameMatrix[y][x - 1] && 
            checkingCell === gameMatrix[y][x - 2])
        {
            document.getElementById(x+'-'+y).classList.toggle('cell_win');
            document.getElementById((x+1)+'-'+y).classList.toggle('cell_win');
            document.getElementById((x+2)+'-'+y).classList.toggle('cell_win');
            document.getElementById((x-1)+'-'+y).classList.toggle('cell_win');
            document.getElementById((x-2)+'-'+y).classList.toggle('cell_win');
            return true;
        } else if(checkingCell === gameMatrix[y][x + 1] && 
            checkingCell === gameMatrix[y][x + 2] && 
            checkingCell === gameMatrix[y][x + 3] && 
            checkingCell === gameMatrix[y][x - 1])
        {
            document.getElementById(x+'-'+y).classList.toggle('cell_win');
            document.getElementById((x+1)+'-'+y).classList.toggle('cell_win');
            document.getElementById((x+2)+'-'+y).classList.toggle('cell_win');
            document.getElementById((x+3)+'-'+y).classList.toggle('cell_win');
            document.getElementById((x-1)+'-'+y).classList.toggle('cell_win');
            return true;
        } else if(checkingCell === gameMatrix[y][x + 1] && 
            checkingCell === gameMatrix[y][x + 2] && 
            checkingCell === gameMatrix[y][x + 3] && 
            checkingCell === gameMatrix[y][x + 4])
        {
            document.getElementById(x+'-'+y).classList.toggle('cell_win');
            document.getElementById((x+1)+'-'+y).classList.toggle('cell_win');
            document.getElementById((x+2)+'-'+y).classList.toggle('cell_win');
            document.getElementById((x+3)+'-'+y).classList.toggle('cell_win');
            document.getElementById((x+4)+'-'+y).classList.toggle('cell_win');
            return true;
        } else if(checkingCell === gameMatrix[y - 1][x + 1] && 
            checkingCell === gameMatrix[y - 2][x + 2] && 
            checkingCell === gameMatrix[y - 3][x + 3] && 
            checkingCell === gameMatrix[y - 4][x + 4])
        {
            document.getElementById(x+'-'+y).classList.toggle('cell_win');
            document.getElementById((x+1)+'-'+(y-1)).classList.toggle('cell_win');
            document.getElementById((x+2)+'-'+(y-2)).classList.toggle('cell_win');
            document.getElementById((x+3)+'-'+(y-3)).classList.toggle('cell_win');
            document.getElementById((x+4)+'-'+(y-4)).classList.toggle('cell_win');
            return true;
        } else if(checkingCell === gameMatrix[y + 1][x - 1] && 
            checkingCell === gameMatrix[y - 1][x + 1] && 
            checkingCell === gameMatrix[y - 2][x + 2] && 
            checkingCell === gameMatrix[y - 3][x + 3])
        {
            document.getElementById(x+'-'+y).classList.toggle('cell_win');
            document.getElementById((x-1)+'-'+(y+1)).classList.toggle('cell_win');
            document.getElementById((x+1)+'-'+(y-1)).classList.toggle('cell_win');
            document.getElementById((x+2)+'-'+(y-2)).classList.toggle('cell_win');
            document.getElementById((x+3)+'-'+(y-3)).classList.toggle('cell_win');
            return true;
        } else if(checkingCell === gameMatrix[y + 1][x - 1] && 
            checkingCell === gameMatrix[y + 2][x - 2] && 
            checkingCell === gameMatrix[y - 1][x + 1] && 
            checkingCell === gameMatrix[y - 2][x + 2])
        {
            document.getElementById(x+'-'+y).classList.toggle('cell_win');
            document.getElementById((x-1)+'-'+(y+1)).classList.toggle('cell_win');
            document.getElementById((x-2)+'-'+(y+2)).classList.toggle('cell_win');
            document.getElementById((x+1)+'-'+(y-1)).classList.toggle('cell_win');
            document.getElementById((x+2)+'-'+(y-2)).classList.toggle('cell_win');
            return true;
        } else if(checkingCell === gameMatrix[y + 1][x - 1] && 
            checkingCell === gameMatrix[y + 2][x - 2] && 
            checkingCell === gameMatrix[y + 3][x - 3] && 
            checkingCell === gameMatrix[y - 1][x + 1])
        {
            document.getElementById(x+'-'+y).classList.toggle('cell_win');
            document.getElementById((x-1)+'-'+(y+1)).classList.toggle('cell_win');
            document.getElementById((x-2)+'-'+(y+2)).classList.toggle('cell_win');
            document.getElementById((x-3)+'-'+(y+3)).classList.toggle('cell_win');
            document.getElementById((x+1)+'-'+(y-1)).classList.toggle('cell_win');
            return true;
        } else if(checkingCell === gameMatrix[y + 1][x - 1] && 
            checkingCell === gameMatrix[y + 2][x - 2] && 
            checkingCell === gameMatrix[y + 3][x - 3] && 
            checkingCell === gameMatrix[y + 4][x - 4])
        {
            document.getElementById(x+'-'+y).classList.toggle('cell_win');
            document.getElementById((x-1)+'-'+(y+1)).classList.toggle('cell_win');
            document.getElementById((x-2)+'-'+(y+2)).classList.toggle('cell_win');
            document.getElementById((x-3)+'-'+(y+3)).classList.toggle('cell_win');
            document.getElementById((x-4)+'-'+(y+4)).classList.toggle('cell_win');
            return true;
        } else if(checkingCell === gameMatrix[y + 1][x + 1] && 
            checkingCell === gameMatrix[y + 2][x + 2] && 
            checkingCell === gameMatrix[y + 3][x + 3] && 
            checkingCell === gameMatrix[y + 4][x + 4])
        {
            document.getElementById(x+'-'+y).classList.toggle('cell_win');
            document.getElementById((x+1)+'-'+(y+1)).classList.toggle('cell_win');
            document.getElementById((x+2)+'-'+(y+2)).classList.toggle('cell_win');
            document.getElementById((x+3)+'-'+(y+3)).classList.toggle('cell_win');
            document.getElementById((x+4)+'-'+(y+4)).classList.toggle('cell_win');
            return true;
        } else if(checkingCell === gameMatrix[y + 1][x + 1] && 
            checkingCell === gameMatrix[y + 2][x + 2] && 
            checkingCell === gameMatrix[y + 3][x + 3] && 
            checkingCell === gameMatrix[y - 1][x - 1])
        {
            document.getElementById(x+'-'+y).classList.toggle('cell_win');
            document.getElementById((x+1)+'-'+(y+1)).classList.toggle('cell_win');
            document.getElementById((x+2)+'-'+(y+2)).classList.toggle('cell_win');
            document.getElementById((x+3)+'-'+(y+3)).classList.toggle('cell_win');
            document.getElementById((x-1)+'-'+(y-1)).classList.toggle('cell_win');
            return true;
        } else if(checkingCell === gameMatrix[y + 1][x + 1] && 
            checkingCell === gameMatrix[y + 2][x + 2] && 
            checkingCell === gameMatrix[y - 1][x - 1] && 
            checkingCell === gameMatrix[y - 2][x - 2])
        {
            document.getElementById(x+'-'+y).classList.toggle('cell_win');
            document.getElementById((x+1)+'-'+(y+1)).classList.toggle('cell_win');
            document.getElementById((x+2)+'-'+(y+2)).classList.toggle('cell_win');
            document.getElementById((x-1)+'-'+(y-1)).classList.toggle('cell_win');
            document.getElementById((x-2)+'-'+(y-2)).classList.toggle('cell_win');
            return true;
        } else if(checkingCell === gameMatrix[y + 1][x + 1] && 
            checkingCell === gameMatrix[y - 1][x - 1] && 
            checkingCell === gameMatrix[y - 2][x - 2] && 
            checkingCell === gameMatrix[y - 3][x - 3])
        {
            document.getElementById(x+'-'+y).classList.toggle('cell_win');
            document.getElementById((x+1)+'-'+(y+1)).classList.toggle('cell_win');
            document.getElementById((x-1)+'-'+(y-1)).classList.toggle('cell_win');
            document.getElementById((x-2)+'-'+(y-2)).classList.toggle('cell_win');
            document.getElementById((x-3)+'-'+(y-3)).classList.toggle('cell_win');
            return true;
        } else if(checkingCell === gameMatrix[y - 1][x - 1] && 
            checkingCell === gameMatrix[y - 2][x - 2] && 
            checkingCell === gameMatrix[y - 3][x - 3] && 
            checkingCell === gameMatrix[y - 4][x - 4])
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

    // смена класса всем ячейкам на not_empty для некликабельности
    let emptyCells = document.getElementsByClassName('cell empty');
    // проверка, что есть хоть один блок not_empty
    if (emptyCells[0] !== undefined) { 
        do {
            emptyCells[0].classList.toggle('not_empty');
            emptyCells[0].classList.toggle('empty');
        }
        while (emptyCells.length > 0);
    }

    // изменение статистики побед в интерфейсе
    if (isTurnX) {
        ++scoreX;
        document.querySelector('.score_x').innerHTML = +scoreX;
    } else  {
        ++scoreO;
        document.querySelector('.score_o').innerHTML = +scoreO;
    }    
}
