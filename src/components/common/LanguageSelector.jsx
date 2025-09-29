import React, { useEffect, useState } from 'react';
import { Select } from 'antd';
import { GlobalOutlined } from '@ant-design/icons';

const LanguageSelector = () => {
  const [currentLang, setCurrentLang] = useState('en');
  const [isTranslateReady, setIsTranslateReady] = useState(false);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिंदी' },
    { code: 'bn', name: 'বাংলা' },
    { code: 'te', name: 'తెలుగు' },
    { code: 'mr', name: 'मराठी' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'gu', name: 'ગુજરાતી' }
  ];

  useEffect(() => {
    // Check if Google Translate is ready
    const checkTranslateReady = () => {
      const combo = document.querySelector('.goog-te-combo');
      if (combo) {
        setIsTranslateReady(true);
      } else {
        setTimeout(checkTranslateReady, 500);
      }
    };
    
    setTimeout(checkTranslateReady, 1000);
  }, []);

  const resetToEnglish = () => {
    const combo = document.querySelector('.goog-te-combo');
    if (combo) {
      combo.value = 'en';
      combo.dispatchEvent(new Event('change'));
    }
  };

  const translateToLanguage = (langCode) => {
    let attempts = 0;
    const maxAttempts = 10;

    const attemptTranslation = () => {
      attempts++;
      
      // Try method 1: Direct combo selection
      const combo = document.querySelector('.goog-te-combo');
      if (combo) {
        combo.value = langCode;
        combo.dispatchEvent(new Event('change'));
        
        // Verify translation started
        setTimeout(() => {
          const isTranslated = document.querySelector('html[lang="' + langCode + '"]') || 
                              document.querySelector('.goog-te-spinner') ||
                              combo.value === langCode;
          
          if (!isTranslated && attempts < maxAttempts) {
            setTimeout(attemptTranslation, 200);
          }
        }, 300);
        return;
      }

      // Try method 2: Click on menu item
      const menuFrame = document.querySelector('.goog-te-menu-frame');
      if (menuFrame) {
        try {
          const frameDoc = menuFrame.contentDocument || menuFrame.contentWindow.document;
          const langLink = frameDoc.querySelector(`a[onclick*="'${langCode}'"]`);
          if (langLink) {
            langLink.click();
            return;
          }
        } catch (e) {
          console.log('Cross-origin frame access blocked');
        }
      }

      // Retry if not successful and attempts remaining
      if (attempts < maxAttempts) {
        setTimeout(attemptTranslation, 300);
      }
    };

    attemptTranslation();
  };

  const handleLanguageChange = (langCode) => {
    setCurrentLang(langCode);
    
    if (!isTranslateReady) {
      setTimeout(() => handleLanguageChange(langCode), 500);
      return;
    }

    if (langCode === 'en') {
      resetToEnglish();
    } else {
      translateToLanguage(langCode);
    }
  };

  return (
    <div className="notranslate" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <GlobalOutlined style={{ color: '#701a1a', fontSize: '16px' }} />
      <Select
        value={currentLang}
        onChange={handleLanguageChange}
        style={{ width: 100 }}
        size="small"
        variant="borderless"
        className="notranslate"
        disabled={!isTranslateReady}
        options={languages.map(lang => ({
          value: lang.code,
          label: lang.name
        }))}
      />
    </div>
  );
};

export default LanguageSelector;