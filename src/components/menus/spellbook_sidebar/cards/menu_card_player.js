import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Spellbook, { CLASSES } from '../../../../lib/spellbook';
import { order } from '../../../../lib/utils';
import { setIsEditingSpellbook } from '../../../../store/slices/spellbookSlice';
import {
  onDeleteSpellbook,
  onNewSpellbook,
  onPlayerCharacteristicChange,
  onPlayerClassChange,
  onPlayerLevelChange,
  onSelectSpellbook
} from '../../../../store/thunks/spellbookThunks';
import CreateComponent from '../../../common/create_component';
import LevelComponent from '../../../common/level_component';
import SelectComponent from '../../../common/select_component';
import '../../../../style/menu_cards.css';

export default function MenuCardPlayer() {
  const dispatch = useDispatch();
  const [isNewVisible, setIsNewVisible] = useState(false);

  // Redux state
  const spellbook = useSelector(state => state.spellbook.spellbook);
  const spellbooks = useSelector(state => state.spellbook.spellbooks);
  const isInEditing = useSelector(state => state.spellbook.isEditingSpellbook);

  const selectedName = spellbook?.Name;
  const saved = order(spellbooks.map(w => w.Name), selectedName);
  const playerLevel = spellbook?.Level ?? 1;
  const playerClass = spellbook?.Class ?? "";
  const charLevel = spellbook?.Characteristic ?? 1;
  const spellbookInstance = spellbook ? new Spellbook().load(spellbook) : null;
  const charName = spellbookInstance?.getCharName() ?? "Characteristic";

  // Handlers
  const showCreate = () => setIsNewVisible(true);
  const hideCreate = () => setIsNewVisible(false);
  const handleNew = name => dispatch(onNewSpellbook(name));
  const handleSelect = name => dispatch(onSelectSpellbook(name));
  const handleDelete = () => dispatch(onDeleteSpellbook());
  const handleLevelChange = lvl => dispatch(onPlayerLevelChange(lvl));
  const handleClassChange = cls => dispatch(onPlayerClassChange(cls));
  const handleCharChange = char => dispatch(onPlayerCharacteristicChange(char));
  const handleEditingChange = val => dispatch(setIsEditingSpellbook(val));

  const classList = CLASSES;

  const levelProps = {
    level: playerLevel,
    levelName: 'Player Level',
    onLevelChange: lvl => handleLevelChange(lvl)
  };

  const charProps = {
    level: charLevel,
    levelName: charName,
    onLevelChange: lvl => handleCharChange(lvl)
  };

  if (isNewVisible) {
    return (
      <CreateComponent
        props={{
          saved,
          tabName: 'player',
          onNew: handleNew,
          setIsVisible: hideCreate
        }}
      />
    );
  }

  return (
    <>
      <SelectComponent
        props={{
          saved,
          tabName: 'player',
          setIsVisible: showCreate,
          onSelect: handleSelect,
          onDeleteItem: handleDelete
        }}
      />

      {saved.length > 0 && (
        <>
          <div className="card-side-div margin-top">
            <label className="modern-label">Class</label>
            <select
              className="modern-dropdown small-long"
              value={playerClass}
              onChange={e => handleClassChange(e.target.value)}
            >
              <option value="">Select a class</option>
              {classList.map(cls => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>

          <LevelComponent props={levelProps} />

          <LevelComponent props={charProps} />


        </>
      )}
    </>
  );
}
/*
          <div className="menu-side-by-side">

            <div className="card-side-div margin-top">
              <button
                className={`modern-button small-long ${isInEditing ? "opacity-50" : ""}`}
                onClick={e => handleEditingChange(true)}
                disabled={isInEditing}
              >
                <b>Prepare</b>
              </button>
            </div>

            <div className="card-side-div margin-top">
              <button
                className={`modern-button small-long ${!isInEditing ? "opacity-50" : ""}`}
                onClick={e => handleEditingChange(false)}
                disabled={!isInEditing}
              >
                <b>Spellbook</b>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
*/