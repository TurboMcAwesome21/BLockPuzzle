import React, { useState } from "react";
import { motion } from "framer-motion";
import "./styles.css";

const GRID_SIZE = 10;
const BLOCKS = [
  [[1, 1, 1], [0, 1, 0]],
  [[1, 1], [1, 1]],
  [[1, 1, 1]],
  [[1], [1], [1]],
  [[1, 1, 1, 1]],
];

const rotateBlock = (block) => {
  return block[0].map((_, i) => block.map(row => row[i])).reverse();
};

const BlockPuzzle = () => {
  const [grid, setGrid] = useState(
    Array.from({ length: GRID_SIZE }, () => Array(GRID_SIZE).fill(0))
  );
  const [selectedBlock, setSelectedBlock] = useState(null);
  const [rotatedBlock, setRotatedBlock] = useState(null);

  const canPlaceBlock = (x, y, block) => {
    for (let i = 0; i < block.length; i++) {
      for (let j = 0; j < block[i].length; j++) {
        if (block[i][j] === 1) {
          if (x + i >= GRID_SIZE || y + j >= GRID_SIZE || grid[x + i][y + j] === 1) {
            return false;
          }
        }
      }
    }
    return true;
  };

  const placeBlock = (x, y) => {
    if (selectedBlock === null) return;
    const block = rotatedBlock || BLOCKS[selectedBlock];
    if (!canPlaceBlock(x, y, block)) return;

    const newGrid = grid.map(row => [...row]);
    for (let i = 0; i < block.length; i++) {
      for (let j = 0; j < block[i].length; j++) {
        if (block[i][j] === 1) {
          newGrid[x + i][y + j] = 1;
        }
      }
    }
    setGrid(newGrid);
    setSelectedBlock(null);
    setRotatedBlock(null);
  };

  const handleRotate = () => {
    if (selectedBlock !== null) {
      setRotatedBlock(rotateBlock(rotatedBlock || BLOCKS[selectedBlock]));
    }
  };

  return (
    <div className="game-container">
      <div className="grid">
        {grid.map((row, i) => (
          <div key={i} className="row">
            {row.map((cell, j) => (
              <div
                key={j}
                className={`cell ${cell ? "filled" : "empty"}`}
                onClick={() => placeBlock(i, j)}
              ></div>
            ))}
          </div>
        ))}
      </div>
      <button className="rotate-button" onClick={handleRotate} disabled={selectedBlock === null}>
        Rotate Block
      </button>
      <div className="blocks">
        {BLOCKS.map((block, index) => (
          <motion.div
            key={index}
            className="block"
            onClick={() => {
              setSelectedBlock(index);
              setRotatedBlock(null);
            }}
            whileTap={{ scale: 1.1 }}
          >
            {(rotatedBlock && selectedBlock === index ? rotatedBlock : block).map((row, i) => (
              <div key={i} className="block-row">
                {row.map((cell, j) => (
                  <div key={j} className={`block-cell ${cell ? "filled" : "empty"}`}></div>
                ))}
              </div>
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BlockPuzzle;
