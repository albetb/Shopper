import { useDispatch, useSelector } from 'react-redux';
import { isMobile, trimLine } from '../../lib/utils';
import { addCardByLink } from '../../store/slices/appSlice';
import Spellbook from '../../lib/spellbook';
import '../../style/shop_inventory.css';
import { onCollapseSpellTable } from '../../store/thunks/spellbookThunks';

export default function SpellbookTable() {
  const dispatch = useDispatch();
  const spellbook = useSelector(s => s.spellbook.spellbook);
  const isInEditing = useSelector(s => s.spellbook.isEditingSpellbook);
  const isSpellTableCollapsed = useSelector(s => s.spellbook.isSpellTableCollapsed);

  const inst = new Spellbook().load(spellbook);
  const all_spells = inst.getAllSpells();
  const learned = inst.getLearnedSpells();
  const spells = isInEditing ? all_spells : learned;
  const spells_per_day = inst.getSpellsPerDay();

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

  if (!levels.length) return null;

  return (
    <>
      <div className="header-container">
        <h4>
          Spellbook of {trimLine(spellbook.Name, isMobile() ? 20 : 30)}
        </h4>
      </div>

      {levels.map(lvl => {
        const isCollapsed = isSpellTableCollapsed?.[lvl] ?? false;
        return (
          <div key={lvl} className={`card card-width-spellbook ${isCollapsed ? 'collapsed' : ''}`}>
            <div className="card-side-div card-expand-div">
              <h3 className="card-title">Level {lvl} (Max {spells_per_day[lvl]})</h3>
              <button
                className="collapse-button"
                onClick={() => dispatch(onCollapseSpellTable(lvl))}
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
