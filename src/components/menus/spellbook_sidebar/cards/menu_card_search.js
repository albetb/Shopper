import { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import '../../../../style/menu_cards.css';
import { setSearchSpellName, setSearchSpellSchool } from '../../../../store/slices/spellbookSlice';
import { MAGICSCHOOLS } from '../../../../lib/spellbook';

export default function MenuCardSearch() {
  const dispatch = useDispatch();
  const inputRef = useRef(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const searchSpellName = useSelector(s => s.spellbook.searchSpellName);
  const searchSpellSchool = useSelector(state => state.spellbook.searchSpellSchool);
  const handleNameChange = name => dispatch(setSearchSpellName(name));
  const handleSchoolChange = cls => dispatch(setSearchSpellSchool(cls));

  return (
    <>
      <div className="card-side-div">
        <label className="modern-label">Name</label>
        <input
          ref={inputRef}
          className='modern-dropdown small-longer padding-left'
          type='text'
          placeholder={"Search spells name"}
          value={searchSpellName}
          onChange={(e) => handleNameChange(e.target.value)}
        />
      </div>

      <div className="card-side-div margin-top">
        <label className="modern-label">School</label>
        <select
          className="modern-dropdown small-long"
          value={searchSpellSchool}
          onChange={e => handleSchoolChange(e.target.value)}
        >
          <option value="">-</option>
          {MAGICSCHOOLS.map(cls => (
            <option key={cls} value={cls}>
              {cls}
            </option>
          ))}
        </select>
      </div>
    </>
  );
}
