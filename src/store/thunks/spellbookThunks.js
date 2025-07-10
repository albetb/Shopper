import Spellbook from '../../lib/spellbook';
import * as db from '../../lib/storage';
import { cap } from '../../lib/utils';
import { setIsSpellTableCollapsed, setSelectedSpellbook, setSpellbook, setSpellbooks } from '../slices/spellbookSlice';

export const onNewSpellbook = nameRaw => (dispatch, getState) => {
  const name = cap(nameRaw);
  if (!name.trim()) return;
  const { spellbooks } = getState().spellbook;
  const exists = spellbooks.find(sb => sb.Name === name);
  if (exists) {
    const sb = db.getSpellbook(exists.Id);
    dispatch(setSpellbook(sb));
    dispatch(setSelectedSpellbook(exists));
  } else {
    const s = new Spellbook(name);
    const entry = { Id: s.Id, Name: s.Name };
    dispatch(setSpellbooks([...spellbooks, entry]));
    dispatch(setSpellbook(s));
    dispatch(setSelectedSpellbook(entry));
  }
};

export const onSelectSpellbook = name => (dispatch, getState) => {
  const { spellbooks } = getState().spellbook;
  const entry = spellbooks.find(sb => sb.Name === name);
  if (!entry) return;
  const s = db.getSpellbook(entry.Id);
  dispatch(setSpellbook(s));
  dispatch(setSelectedSpellbook(entry));
};

export const onPlayerLevelChange = level => (dispatch, getState) => {
  const { spellbook } = getState().spellbook;
  if (!spellbook) return;
  const s = new Spellbook().load(spellbook);
  s.setLevel(level);
  dispatch(setSpellbook(s));
};

export const onPlayerClassChange = _class => (dispatch, getState) => {
  const { spellbook } = getState().spellbook;
  if (!spellbook) return;
  const s = new Spellbook().load(spellbook);
  s.setClass(_class);
  dispatch(setSpellbook(s));
};

export const onPlayerCharacteristicChange = char => (dispatch, getState) => {
  const { spellbook } = getState().spellbook;
  if (!spellbook) return;
  const s = new Spellbook().load(spellbook);
  s.setCharacteristic(char);
  dispatch(setSpellbook(s));
};

export const onDeleteSpellbook = () => (dispatch, getState) => {
  const { spellbooks, selectedSpellbook } = getState().spellbook;
  if (!selectedSpellbook) return;
  db.deleteSpellbook(selectedSpellbook.Id);
  const updated = spellbooks.filter(sb => sb.Id !== selectedSpellbook.Id);
  const next = updated[0] || null;
  dispatch(setSpellbooks(updated));
  dispatch(setSelectedSpellbook(next));
  if (next) {
    const s = db.getSpellbook(next.Id);
    dispatch(setSpellbook(s));
  } else {
    dispatch(setSpellbook(null));
  }
};

export const onCollapseSpellTable = num => (dispatch, getState) => {
  const { isSpellTableCollapsed } = getState().spellbook;
  if (!isSpellTableCollapsed) return;
  const updated = isSpellTableCollapsed.map((x, i) => i === num ? !x : x);
  dispatch(setIsSpellTableCollapsed(updated));
};