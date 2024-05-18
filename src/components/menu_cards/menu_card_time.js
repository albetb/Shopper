import React, { useState } from 'react';
import useLongPress from '../hooks/useLongPress';
import '../../style/menu_cards.css';

const MenuCardTime = ({ props }) => {
  const [buttonTextCustom, setButtonTextCustom] = useState(<span className='material-symbols-outlined'>fast_forward</span>);
  const [buttonText1w, setButtonText1w] = useState(<span>7d <span className='material-symbols-outlined'>fast_forward</span></span>);
  const [buttonText1d, setButtonText1d] = useState(<span>1d <span className='material-symbols-outlined'>fast_forward</span></span>);
  const [isTransitioningCustom, setIsTransitioningCustom] = useState(false);
  const [isTransitioning1w, setIsTransitioning1w] = useState(false);
  const [isTransitioning1d, setIsTransitioning1d] = useState(false);
  const [hours, setHours] = useState('');
  const [days, setDays] = useState('');

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

  const handleCustomWait = () => {
    if (hours || days) {
      setIsTransitioningCustom(true);
      setTimeout(() => {
        setButtonTextCustom(<span className='material-symbols-outlined'>check</span>);
        setIsTransitioningCustom(false);
        setTimeout(() => setButtonTextCustom(<span className='material-symbols-outlined'>fast_forward</span>), 1000);
      }, 300);
      const hoursValue = hours ? parseInt(hours, 10) : 0;
      const daysValue = days ? parseInt(days, 10) : 0;
      props.onWaitTime(hoursValue, daysValue);
    }
  };

  const longPressEvent1w = useLongPress(handleWait1w, () => { }, { delay: 500 });
  const longPressEvent1d = useLongPress(handleWait1d, () => { }, { delay: 500 });
  const longPressEventCustom = useLongPress(handleCustomWait, () => { }, { delay: 500 });

  return (
    <div className='card-vert'>
      <div className='card-side-div'>
        <input
          type='number'
          placeholder='hours'
          value={hours}
          onChange={(e) => setHours(e.target.value)}
          className='modern-dropdown small'
        />
        <input
          type='number'
          placeholder='days'
          value={days}
          onChange={(e) => setDays(e.target.value)}
          className='modern-dropdown small'
        />
        <button
          className={`levels-button ${isTransitioningCustom ? 'transition' : ''}`}
          {...longPressEventCustom}
        >
          {buttonTextCustom}
        </button>
      </div>

      <div className='card-side-div margin-top-small'>
        <button
          className={`modern-button ${isTransitioning1d ? 'transition' : ''}`}
          {...longPressEvent1d}
        >
          {buttonText1d}
        </button>

        <button
          className={`modern-button ${isTransitioning1w ? 'transition' : ''}`}
          {...longPressEvent1w}
        >
          {buttonText1w}
        </button>
      </div>

    </div>
  );
};

export default MenuCardTime;
