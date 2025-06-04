import { useState } from 'react';
import { Globe, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { i18n, Language } from '../lib/i18n';

interface LanguageSelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LanguageSelector({ isOpen, onClose }: LanguageSelectorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(i18n.getCurrentLanguage());
  const languages = i18n.getAvailableLanguages();

  const handleLanguageSelect = (language: Language) => {
    setSelectedLanguage(language);
    i18n.setLanguage(language);
    onClose();
    // Trigger a page refresh to update all text
    window.location.reload();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="bg-gray-900 border-yellow-500/20 rounded-2xl w-full max-w-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Globe className="text-yellow-500" size={20} />
              <h3 className="text-lg font-semibold text-white">{i18n.t('language')}</h3>
            </div>
            <Button 
              onClick={onClose}
              variant="ghost" 
              size="sm"
              className="text-gray-400 hover:text-white"
            >
              ×
            </Button>
          </div>

          <div className="space-y-3">
            {languages.map((lang) => (
              <Button
                key={lang.code}
                onClick={() => handleLanguageSelect(lang.code)}
                variant="ghost"
                className={`w-full justify-between p-4 h-auto ${
                  selectedLanguage === lang.code 
                    ? 'bg-yellow-500/20 border border-yellow-500/50' 
                    : 'hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{lang.flag}</span>
                  <span className="text-white font-medium">{lang.name}</span>
                </div>
                {selectedLanguage === lang.code && (
                  <Check className="text-yellow-500" size={16} />
                )}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}