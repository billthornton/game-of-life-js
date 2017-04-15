const flatten = arrays => Array.prototype.concat(...arrays);
const surrounding = (cellX) => [cellX - 1, cellX, cellX + 1];

const neighbouringCells = cell => {
    const xs = surrounding(cell.x);
    const ys = surrounding(cell.y);
    return flatten(xs.map(x => ys.map(y => ({ y, x }))));
};

const isMatchingCell = (cellA) => (cellB) => cellA.x == cellB.x && cellA.y == cellB.y;
const containsCell = (acc, cell) => acc.find(isMatchingCell(cell));
const withoutDuplicates = (cells, cell) => containsCell(cells, cell) ? cells : [...cells, cell];

const generateCandidates = (cells) =>
    flatten(cells.map(neighbouringCells))
        .reduce(withoutDuplicates, []);

const distanceFrom = (neighbourPos, cellPos) => Math.abs(neighbourPos - cellPos);
const isNextTo = (cell) => (possibleNeighbour) => {
    const distanceX = distanceFrom(possibleNeighbour.x, cell.x);
    const distanceY = distanceFrom(possibleNeighbour.y, cell.y);
    const isSameCell = distanceX + distanceY === 0;
    const isAdjacent = (distanceX <= 1 && distanceY <= 1);
    return !isSameCell && isAdjacent;
};

const neighbours = (world) => (cell) =>
    world.filter(isNextTo(cell));

const iterate = (world) => {
    const candidates = generateCandidates(world);
    const neighboursForCell = neighbours(world);

    return candidates.filter(candidate => {
        const neighbours = neighboursForCell(candidate);
        const livingCell = world.some(isMatchingCell(candidate));
        return (livingCell && neighbours.length == 2) || neighbours.length == 3;
    });
};

function GameOfLife(seed = []) {
    this.world = seed;
}

GameOfLife.prototype.iterate = function () {
    this.world = iterate(this.world);
    return this.world;
};

module.exports = GameOfLife;
