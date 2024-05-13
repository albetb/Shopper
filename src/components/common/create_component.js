import React, { useState } from 'react';
import '../../style/menu_cards.css';

const CreateComponent = ({ props }) => {
  const [name, setName] = useState('');

  const handleOkClick = () => {
    props.onNew(name)
    props.setIsVisible(false);
    setName('');
  };

  const placeholder = () => {
    return `Insert new ${props.tabName} name`;
  };

  return (
    <>
      <div className='card-side-div'>
        <input className='modern-dropdown'
          type='text'
          placeholder={placeholder()}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className='modern-button' onClick={handleOkClick}>Ok</button>
      </div>
    </>
  );
}

export default CreateComponent;
