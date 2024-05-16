import React, { useState, useRef, useEffect } from 'react';

const CreateComponent = ({ props }) => {
  const [name, setName] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleOkClick = () => {
    props.onNew(name);
    props.setIsVisible(false);
    setName('');
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleOkClick();
    }
  };

  const placeholder = () => {
    return `Insert new ${props.tabName} name`;
  };

  return (
    <div className='card-side-div'>
      <input
        ref={inputRef}
        className='modern-dropdown'
        type='text'
        placeholder={placeholder()}
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button className='modern-button' onClick={handleOkClick}>Ok</button>
    </div>
  );
};

export default CreateComponent;
