function GameOfLife(seed = []) {
    this.world = seed;
}

const flatten = arrays => Array.prototype.concat(...arrays);

const isMatchingCell = (cellA) => (cellB) => cellA.x == cellB.x && cellA.y == cellB.y;
const hasCell = (acc, cell) => acc.find(isMatchingCell(cell));
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

// Not entirely figured out the purpose of this just yet!
const differenceBelowEqualOne = (x1, x2) => Math.abs(x1 - x2) <= 1;

GameOfLife.prototype.neighbours = function (cell) {
    return this.world.filter(neighbour =>
        !isMatchingCell(cell)(neighbour) &&
        differenceBelowEqualOne(neighbour.x, cell.x) &&
        differenceBelowEqualOne(neighbour.y, cell.y)
    )
};

GameOfLife.prototype.iterate = function () {
    this.world = this.candidates().filter(candidate => {
        const neighbours = this.neighbours(candidate);
        const livingCell = this.world.some(isMatchingCell(candidate));
        return (livingCell && neighbours.length == 2) || neighbours.length == 3;
    });

    return this.world;
};

module.exports = GameOfLife;
