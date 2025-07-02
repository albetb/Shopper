import { compressToUTF16, decompressFromUTF16 } from 'lz-string';
import World from './world';
import City from './city';
import Shop from './shop';

const CURRENT_STORAGE_VERSION = 250702; // last modified date as yymmdd

//#region get

export function getWorlds() {
    const value = localStorage.getItem('Worlds');
    return value ? JSON.parse(decompressFromUTF16(value)) : [];
}

export function getSelectedWorld() {
    const value = localStorage.getItem('SelectedWorld');
    return value ? JSON.parse(decompressFromUTF16(value)) : { Id: null, Name: null };
}

export function getWorld(id) {
    const value = localStorage.getItem(`World/${id}`);
    return value ? new World().load(JSON.parse(decompressFromUTF16(value))) : null;
}

export function getCity(id) {
    const value = localStorage.getItem(`City/${id}`);
    return value ? new City().load(JSON.parse(decompressFromUTF16(value))) : null;
}

export function getShop(id) {
    const value = localStorage.getItem(`Shop/${id}`);
    return value ? new Shop().load(JSON.parse(decompressFromUTF16(value))) : null;
}

export function getIsWorldCollapsed() {
    const value = localStorage.getItem('IsWorldCollapsed');
    return value ? JSON.parse(decompressFromUTF16(value)) : false;
}

export function getIsCityCollapsed() {
    const value = localStorage.getItem('IsCityCollapsed');
    return value ? JSON.parse(decompressFromUTF16(value)) : false;
}

export function getIsShopCollapsed() {
    const value = localStorage.getItem('IsShopCollapsed');
    return value ? JSON.parse(decompressFromUTF16(value)) : false;
}

//#endregion

//#region set

export function setWorlds(value) {
    localStorage.setItem('Worlds', compressToUTF16(JSON.stringify(value)));
}

export function setSelectedWorld(value) {
    localStorage.setItem('SelectedWorld', compressToUTF16(JSON.stringify(value)));
}

export function setWorld(value) {
    localStorage.setItem(`World/${value?.Id}`, compressToUTF16(JSON.stringify(value)));
}

export function setCity(value) {
    localStorage.setItem(`City/${value?.Id}`, compressToUTF16(JSON.stringify(value)));
}

export function setShop(value) {
    localStorage.setItem(`Shop/${value?.Id}`, compressToUTF16(JSON.stringify(value)));
}

export function setIsWorldCollapsed(value) {
    localStorage.setItem('IsWorldCollapsed', compressToUTF16(JSON.stringify(value)));
}

export function setIsCityCollapsed(value) {
    localStorage.setItem('IsCityCollapsed', compressToUTF16(JSON.stringify(value)));
}

export function setIsShopCollapsed(value) {
    localStorage.setItem('IsShopCollapsed', compressToUTF16(JSON.stringify(value)));
}

//#endregion

//#region delete

export function deleteWorld(value) {
    localStorage.removeItem(`World/${value}`);
}

export function deleteCity(value) {
    localStorage.removeItem(`City/${value}`);
}

export function deleteShop(value) {
    localStorage.removeItem(`Shop/${value}`);
}

export function validateDb() {
    try {
        const version = parseInt(JSON.parse(decompressFromUTF16(localStorage.getItem('Version')) ?? 0));
        if (!version || version < CURRENT_STORAGE_VERSION) {
            throw new Error();
        }
    }
    catch {
        localStorage.clear();
        localStorage.setItem('Version', compressToUTF16(JSON.stringify(CURRENT_STORAGE_VERSION)))
    }
}

//#endregion

//#region save storage

const getAllLocalStorageItems = () => {
    const items = {};
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const compressedValue = localStorage.getItem(key);
        if (compressedValue) {
            items[key] = decompressFromUTF16(compressedValue);
        }
    }
    return JSON.stringify(items, null, 2);
};

export const downloadLocalStorage = () => {
    const data = getAllLocalStorageItems();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'ShopperStorageData.json';
    a.click();
    URL.revokeObjectURL(url);
};

export const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
        try {
            const data = JSON.parse(e.target.result);
            localStorage.clear();
            for (const key in data) {
                localStorage.setItem(key, compressToUTF16(data[key]));
            }
            window.location.reload();
        } catch (error) { }
    };

    reader.readAsText(file);
};

//#endregion
