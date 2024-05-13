import React from 'react';
import '../../style/menu_cards.css';

const LevelComponent = ({ props }) => {

  const handleLevelIncrement = () => {
    const level = parseInt(props.level);
    props.onLevelChange(level + 1);
  };

  const handleLevelDecrement = () => {
    const level = parseInt(props.level);
    props.onLevelChange(level - 1);
  };

  return (
    <>
      <div className='card-side-div margin-top'>
        <label className='modern-label'>{props.levelName}:</label>
        <div className='levels-div'>
          <button className='levels-button' onClick={handleLevelDecrement}>-</button>
          <div className='level-frame'>
            <label className='level-text'>{props.level}</label>
          </div>
          <button className='levels-button' onClick={handleLevelIncrement}>+</button>
        </div>
      </div>
    </>
  );
}

export default LevelComponent;
