import { useDispatch, useSelector } from 'react-redux';
import Spellbook from '../../lib/spellbook';
import { isMobile, trimLine } from '../../lib/utils';
import { addCardByLink } from '../../store/slices/appSlice';
import { setIsClassDescriptionCollapsed, setSearchSpellName, setSearchSpellSchool } from '../../store/slices/spellbookSlice';
import { onCollapseSpellTable } from '../../store/thunks/spellbookThunks';
import '../../style/shop_inventory.css';

export default function SpellbookTable() {
  const dispatch = useDispatch();
  const spellbook = useSelector(s => s.spellbook.spellbook);
  const isInEditing = useSelector(s => s.spellbook.isEditingSpellbook);
  const isSpellTableCollapsed = useSelector(s => s.spellbook.isSpellTableCollapsed);
  const isClassDescriptionCollapsed = useSelector(s => s.spellbook.isClassDescriptionCollapsed);
  const searchSpellName = useSelector(s => s.spellbook.searchSpellName);
  const searchSpellSchool = useSelector(s => s.spellbook.searchSpellSchool);

  if (!spellbook?.Class) return null;

  const inst = new Spellbook().load(spellbook);
  const all_spells = inst.getAllSpells({ name: searchSpellName, school: searchSpellSchool });
  const learned = inst.getLearnedSpells({ name: searchSpellName, school: searchSpellSchool });
  const spells = isInEditing ? all_spells : learned;
  const spells_per_day = inst.getSpellsPerDay();
  const char_bonus = inst.getCharBonus();
  const class_desc = inst.getClassDescription();

  const classKeyMap = {
    Sorcerer: 'Sor/Wiz',
    Wizard: 'Sor/Wiz',
    Cleric: 'Clr',
    Druid: 'Drd',
    Bard: 'Brd',
    Ranger: 'Rgr',
    Paladin: 'Pal'
  };
  const key = classKeyMap[spellbook.Class] || '';

  const byLevel = spells.reduce((acc, sp) => {
    const entry = sp.Level
      .split(',')
      .map(p => p.trim())
      .find(p => p.startsWith(key + ' '));
    const lvl = entry
      ? parseInt(entry.slice(key.length).trim(), 10)
      : null;
    if (lvl !== null && !isNaN(lvl)) {
      acc[lvl] = acc[lvl] || [];
      acc[lvl].push(sp);
    }
    return acc;
  }, {});

  const levels = Object.keys(byLevel)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <>
      <div className="header-container">
        <h4>
          Spellbook of {trimLine(spellbook.Name, isMobile() ? 20 : 30)}
        </h4>
      </div>

      {searchSpellName && (
        <div className="filter-box">
          <div className="card-side-div card-expand-div" style={{ width: "100%" }}>
            <p style={{ color: "var(--white)" }}>Filter by name: <b>{searchSpellName}</b></p>
            <button className="close-button no-margin-right" onClick={() => dispatch(setSearchSpellName(""))}>
              <span style={{ color: "var(--white)" }} className="material-symbols-outlined">close_small</span>
            </button>
          </div>
        </div>
      )}

      {searchSpellSchool && (
        <div className="filter-box">
          <div className="card-side-div card-expand-div" style={{ width: "100%" }}>
            <p style={{ color: "var(--white)" }}>Filter by school: <b>{searchSpellSchool}</b></p>
            <button className="close-button no-margin-right" onClick={() => dispatch(setSearchSpellSchool(""))}>
              <span style={{ color: "var(--white)" }} className="material-symbols-outlined">close_small</span>
            </button>
          </div>
        </div>
      )}

      <div className={`card card-width-spellbook ${isClassDescriptionCollapsed ? 'collapsed' : ''}`}>
        <div
          className="card-side-div card-expand-div"
          onClick={() => dispatch(setIsClassDescriptionCollapsed(!isClassDescriptionCollapsed))}
        >
          <h3 className="card-title">{spellbook.Class}</h3>
          <button
            className="collapse-button"
          >
            <span className="material-symbols-outlined">
              {isClassDescriptionCollapsed ? 'expand_more' : 'expand_less'}
            </span>
          </button>
        </div>
        {!isClassDescriptionCollapsed &&
          <div
            className="class-desc"
            dangerouslySetInnerHTML={{ __html: class_desc }}
          />}
      </div>

      {levels.map(lvl => {
        const isCollapsed = isSpellTableCollapsed?.[lvl] ?? false;
        return (
          <div key={lvl} className={`card card-width-spellbook ${isCollapsed ? 'collapsed' : ''}`}>
            <div
              className="card-side-div card-expand-div"
              onClick={() => dispatch(onCollapseSpellTable(lvl))}
            >
              <h3 className="card-title">Lv{lvl} ({spells_per_day[lvl]}/day) CD {10 + char_bonus + lvl}</h3>
              <button
                className="collapse-button"
              >
                <span className="material-symbols-outlined">
                  {isCollapsed ? 'expand_more' : 'expand_less'}
                </span>
              </button>
            </div>
            {!isCollapsed && (
              <table className="spellbook-table">
                <tbody>
                  {byLevel[lvl].map((item, i) =>
                    <tr key={i}>
                      <td style={{ width: 'var(--btn-width-sm)' }} className={i === 0 ? 'first' : ''}>
                        <button className="item-number-button small">
                          <span
                            className="material-symbols-outlined"
                            onClick={() =>
                              dispatch(
                                addCardByLink({ links: item.Link, bonus: 0 })
                              )
                            }
                          >
                            bookmark_add
                          </span>
                        </button>
                      </td>
                      <td style={{ width: 'auto' }} className={i === 0 ? 'first' : ''}>
                        <button
                          className="button-link"
                          style={{ color: 'var(--black)' }}
                          onClick={() =>
                            dispatch(
                              addCardByLink({ links: item.Link, bonus: 0 })
                            )
                          }
                        >
                          {item.Name}
                        </button>
                      </td>
                      <td style={{ width: '30%', fontSize: 'small' }} className={i === 0 ? 'first' : ''}>
                        {item.School.split(' ')[0]}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        )
      })}
    </>
  );
}
