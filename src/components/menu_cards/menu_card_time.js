import React, { useState } from 'react';
import useLongPress from '../hooks/use_long_press';
import '../../style/menu_cards.css';

const MenuCardTime = ({ props }) => {
  const [buttonText1w, setButtonText1w] = useState(<span>7d <span className='material-symbols-outlined'>fast_forward</span></span>);
  const [buttonText1d, setButtonText1d] = useState(<span>1d <span className='material-symbols-outlined'>fast_forward</span></span>);
  const [isTransitioning1w, setIsTransitioning1w] = useState(false);
  const [isTransitioning1d, setIsTransitioning1d] = useState(false);

  const handleWait1w = () => {
    setIsTransitioning1w(true);
    setTimeout(() => {
      setButtonText1w(<span className='material-symbols-outlined'>check</span>);
      setIsTransitioning1w(false);
      setTimeout(() => setButtonText1w(<span>7d <span className='material-symbols-outlined'>fast_forward</span></span>), 1000);
    }, 300);
    props.onWaitTime(0, 7);
  };

  const handleWait1d = () => {
    setIsTransitioning1d(true);
    setTimeout(() => {
      setButtonText1d(<span className='material-symbols-outlined'>check</span>);
      setIsTransitioning1d(false);
      setTimeout(() => setButtonText1d(<span>1d <span className='material-symbols-outlined'>fast_forward</span></span>), 1000);
    }, 300);
    props.onWaitTime(0, 1);
  };

  const longPressEvent1w = useLongPress(handleWait1w, () => { }, { delay: 500 });
  const longPressEvent1d = useLongPress(handleWait1d, () => { }, { delay: 500 });

  return (
      <div className='card-side-div'>
        <button
          className={`modern-button thick-border ${isTransitioning1d ? 'transition' : ''}`}
          {...longPressEvent1d}
        >
          {buttonText1d}
        </button>

        <button
          className={`modern-button thick-border ${isTransitioning1w ? 'transition' : ''}`}
          {...longPressEvent1w}
        >
          {buttonText1w}
        </button>
      </div>
  );
};

export default MenuCardTime;
