import React, { useEffect } from 'react';

const LanguageSwitcher = () => {
    useEffect(() => {
        const loadGoogleTranslate = () => {
            if (window.google && window.google.translate) {
                new window.google.translate.TranslateElement(
                    {
                        pageLanguage: 'en',
                        includedLanguages: 'am,en',
                        layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                    },
                    'google_translate_element'
                );
            }
        };

        if (!document.querySelector('#google-translate-script')) {
            window.googleTranslateElementInit = loadGoogleTranslate;
            const script = document.createElement('script');
            script.id = 'google-translate-script';
            script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
            script.async = true;
            document.body.appendChild(script);
        } else {
            // Clear if navigating back to this component
            const container = document.getElementById('google_translate_element');
            if (container) {
                container.innerHTML = '';
            }
            loadGoogleTranslate();
        }
    }, []);

    return (
        <div className="relative group flex items-center">
            <div
                id="google_translate_element"
                className="overflow-hidden rounded-md border border-gray-300 shadow-sm bg-white"
                aria-label="Select a language to translate the page"
                role="button"
            ></div>
            <style>{`
                /* Hide the Google Translate branding and top bar to prevent layout lag/shift */
                .skiptranslate iframe {
                    display: none !important;
                }
                body {
                    top: 0 !important;
                }
                .goog-te-gadget {
                    color: transparent !important;
                    font-size: 0px;
                }
                .goog-te-gadget .goog-te-combo {
                    color: #374151;
                    padding: 0.25rem 0.5rem;
                    border-radius: 0.375rem;
                    border: none;
                    outline: none;
                    font-size: 14px;
                    margin: 0;
                }
            `}</style>
        </div>
    );
};

export default LanguageSwitcher;