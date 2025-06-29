import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import '../../style/menu_cards.css';

/**
 * InfoMenuCards component
 * Renders a list of cards styled identically to the main sidebar's MenuCards.
 * Each card displays key/value pairs from its data object, with collapse/expand controls.
 */
export default function InfoMenuCards({ cardsData }) {
  // track collapse state per card
  const [cardStates, setCardStates] = useState(
    cardsData.map((_, idx) => ({ id: idx, collapsed: false }))
  );

  // reset state when data array changes
  useEffect(() => {
    setCardStates(cardsData.map((_, idx) => ({ id: idx, collapsed: false })));
  }, [cardsData]);

  const toggleCard = (id) => {
    setCardStates(states =>
      states.map(s =>
        s.id === id ? { ...s, collapsed: !s.collapsed } : s
      )
    );
  };

  return (
    <div className="cards">
      {cardsData.map((data, idx) => {
        const state = cardStates.find(s => s.id === idx) || { collapsed: false };
        const title = data.Name || `Card ${idx + 1}`;
        return (
          <div key={idx} className={`card ${state.collapsed ? 'collapsed' : ''}`}>
            <div className="card-side-div card-expand-div">
              <h3 className="card-title">{title}</h3>
              <button
                className="collapse-button"
                onClick={() => toggleCard(idx)}
              >
                <span className="material-symbols-outlined">
                  {state.collapsed ? 'expand_more' : 'expand_less'}
                </span>
              </button>
            </div>
            {!state.collapsed && (
              <div className="card-content">
                {Object.entries(data).map(([key, value]) => (
                  <div key={key} className="info-card-row">
                    {key === 'Link' || key === 'Description' || key === 'Name' ? <></> : (
                    <span className="info-key info-card">{key}: </span>
                    )}
                    {key === 'Description' ? (
                      <span
                        className="info-value info-card"
                        dangerouslySetInnerHTML={{ __html: value }}
                      />
                    ) : key === 'Link' || key === 'Name' ? <></>
                      : (
                        <span className="info-value info-card">{value}</span>
                      )}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

InfoMenuCards.propTypes = {
  cardsData: PropTypes.arrayOf(PropTypes.object)
};

InfoMenuCards.defaultProps = {
  cardsData: []
};
