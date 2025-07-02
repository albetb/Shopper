import { useState, useEffect, useRef } from 'react';
import { isMobile } from '../../lib/utils';
import { downloadLocalStorage, handleFileUpload } from '../../lib/storage';
import logo from '../../data/logo-shopperino.png';
import '../../style/sidebar.css';

export default function TopMenu() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const handleUploadClick = () => document.getElementById('upload').click();
    const handleToggleMobileMenu = () => setMobileMenuOpen(prev => !prev);
    const menuButtonRef = useRef(null);
    const menuBoxRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (mobileMenuOpen && menuButtonRef.current && !menuButtonRef.current.contains(event.target) && !menuBoxRef.current.contains(event.target)) {
                handleToggleMobileMenu();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [menuButtonRef, menuBoxRef, handleToggleMobileMenu]);

    const buttons = <>
        <button
            className="modern-dropdown small"
            onClick={downloadLocalStorage}
            title="Export save file"
        >
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
            className="modern-dropdown small"
            onClick={handleUploadClick}
            title="Import save file"
        >
            <span className="material-symbols-outlined">drive_folder_upload</span>
        </button>
    </>;

    const mobileButtons = <>
        <div className="menu-side-by-side">

            <p style={{ fontSize: "medium", textShadow: "1px 1px #12121366" }}>Export save</p>
            <button
                className="modern-dropdown small"
                onClick={downloadLocalStorage}
                title="Export save file"
            >
                <span className="material-symbols-outlined">download</span>
            </button>
        </div>

        <hr style={{ width: "90%" }}></hr>

        <div className="menu-side-by-side">
            <p style={{ fontSize: "medium", textShadow: "1px 1px #12121366" }}>Import save</p>
            <input
                type="file"
                id="upload"
                style={{ display: 'none' }}
                accept="application/json"
                onChange={handleFileUpload}
            />
            <button
                className="modern-dropdown small"
                onClick={handleUploadClick}
                title="Import save file"
            >
                <span className="material-symbols-outlined">drive_folder_upload</span>
            </button>
        </div>
    </>;

    // Render mobile view
    if (isMobile()) {
        return (
            <div className="top-menu">
                <img src={logo} alt="Shopperino" className="top-logo" />
                <button
                    className="mobile-menu-button modern-dropdown small"
                    onClick={handleToggleMobileMenu}
                    title="Open menu"
                    ref={menuButtonRef}
                >
                    <span className="material-symbols-outlined">menu</span>
                </button>
                {mobileMenuOpen && (
                    <div className="mobile-dropdown" ref={menuBoxRef}>
                        {mobileButtons}
                    </div>
                )}
            </div>
        );
    }

    // Render desktop view
    return (
        <div className="top-menu">
            <img src={logo} alt="Shopperino" className="top-logo" />
            <div className="top-menu-button-container">
                {buttons}
            </div>
        </div>
    );
}
