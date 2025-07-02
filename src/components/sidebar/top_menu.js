import { downloadLocalStorage, handleFileUpload } from '../../lib/storage';
import logo from '../../data/logo-shopperino.png';
import '../../style/sidebar.css';

export default function TopMenu() {
    const handleUploadClick = () => document.getElementById('upload').click();

    return (
        <div className={`top-menu`}>

            <img
                src={logo}
                alt="Shopperino"
                className="top-logo"
            />

            <div className={`top-menu-button-container`}>

                <button className="modern-dropdown small" onClick={downloadLocalStorage} title="Export save file">
                    <span className="material-symbols-outlined">download</span>
                </button>

                <input
                    type="file"
                    id="upload"
                    style={{ display: 'none' }}
                    accept="application/json"
                    onChange={handleFileUpload}
                />
                <button
                    className="modern-dropdown small saving-button-margin"
                    onClick={handleUploadClick}
                    title="Import save file"
                >
                    <span className="material-symbols-outlined">drive_folder_upload</span>
                </button>
            </div>
        </div>
    );
}
