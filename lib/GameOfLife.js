function GameOfLife(seed = []) {
    this.world = seed;
}

const flatten = arrays =>
    Array.prototype.concat(...arrays);

const surrounding = (cellX) =>
    [cellX - 1, cellX, cellX + 1];

const neighbouringCells = cell => {
    const xs = surrounding(cell.x);
    const ys = surrounding(cell.y);
    return flatten(xs.map(x => ys.map(y => ({ y, x }))));
};

const isMatchingCell = (cellA) => (cellB) =>
cellA.x == cellB.x && cellA.y == cellB.y;

const containsCell = (acc, cell) =>
    acc.find(isMatchingCell(cell));

const withoutDuplicates = (cells, cell) =>
    containsCell(cells, cell) ? cells : [...cells, cell];

const candidates = function (world) {
    return flatten(world.map(neighbouringCells))
        .reduce(withoutDuplicates, []);
};

// Not entirely figured out the purpose of this just yet!
const differenceBelowEqualOne = (x1, x2) => Math.abs(x1 - x2) <= 1;

const neighbours = (world) => (cell) =>
    world.filter(neighbour =>
        !isMatchingCell(cell)(neighbour) &&
        differenceBelowEqualOne(neighbour.x, cell.x) &&
        differenceBelowEqualOne(neighbour.y, cell.y)
    );

const iterate = (world) => {
    const theCandidates = candidates(world);
    const neighbourFn = neighbours(world);
    return theCandidates.filter(candidate => {
        const neighbours = neighbourFn(candidate);
        const livingCell = world.some(isMatchingCell(candidate));
        return (livingCell && neighbours.length == 2) || neighbours.length == 3;
    });
};

GameOfLife.prototype.iterate = function () {
    this.world = iterate(this.world);
    return this.world;
};

module.exports = GameOfLife;
