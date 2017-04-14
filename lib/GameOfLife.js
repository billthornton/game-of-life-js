function GameOfLife(seed = []) {
    this.world = seed;
}

const flatten = arrays => Array.prototype.concat(...arrays);

const matchingCell = (cellA) => (cellB) => cellA.x == cellB.x && cellA.y == cellB.y;
const hasCell = (acc, cell) => acc.find(matchingCell(cell));
const removeDuplicates = (acc, cell) => hasCell(acc, cell) ? acc : [...acc, cell];

const surrounding = (cellX) => [cellX - 1, cellX, cellX + 1];
const neighbouringCells = cell => {
    const xs = surrounding(cell.x);
    const ys = surrounding(cell.y);
    return flatten(xs.map(x => ys.map(y => ({ y, x }))));
};

GameOfLife.prototype.candidates = function () {
    return flatten(this.world.map(neighbouringCells))
        .reduce(removeDuplicates, []);
};

GameOfLife.prototype.neighbours = function (cell) {
    return this.world.filter(neighbour =>
        !(neighbour.x == cell.x && neighbour.y == cell.y) &&
        Math.abs(neighbour.x - cell.x) <= 1 &&
        Math.abs(neighbour.y - cell.y) <= 1)
};

GameOfLife.prototype.iterate = function () {
    this.world = this.candidates().filter(candidate => {
        const neighbours = this.neighbours(candidate);
        const livingCell = this.world.some(matchingCell(candidate));
        return (livingCell && neighbours.length == 2) || neighbours.length == 3;
    });

    return this.world;
};

module.exports = GameOfLife;
