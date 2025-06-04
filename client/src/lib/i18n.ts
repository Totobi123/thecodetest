// Internationalization system for Nigerian languages
export type Language = 'en' | 'pid' | 'ha' | 'yo' | 'ig';

export interface TranslationStrings {
  // Navigation
  dashboard: string;
  calculator: string;
  history: string;
  settings: string;
  
  // Auth & Welcome
  welcome: string;
  getStarted: string;
  importWallet: string;
  createWallet: string;
  enterDeviceCode: string;
  authenticate: string;
  
  // Wallet Actions
  walletAddress: string;
  privateKey: string;
  balance: string;
  eligibleForGiveaway: string;
  claimGiveaway: string;
  injectBalance: string;
  copyAddress: string;
  
  // Amounts & Currency
  usdValue: string;
  nairaValue: string;
  bnbAmount: string;
  
  // Status Messages
  connected: string;
  processing: string;
  completed: string;
  failed: string;
  eligible: string;
  notEligible: string;
  
  // Referral System
  referralCode: string;
  shareReferral: string;
  referralBonus: string;
  friendsReferred: string;
  earnPerReferral: string;
  
  // Notifications
  injectionComplete: string;
  referralReward: string;
  newReferral: string;
  
  // Common
  continue: string;
  cancel: string;
  confirm: string;
  close: string;
  copy: string;
  share: string;
  language: string;
}

const translations: Record<Language, TranslationStrings> = {
  // English
  en: {
    dashboard: 'Dashboard',
    calculator: 'Calculator', 
    history: 'History',
    settings: 'Settings',
    welcome: 'Welcome to Crypto Airdrop',
    getStarted: 'Get Started',
    importWallet: 'Import Wallet',
    createWallet: 'Create Wallet',
    enterDeviceCode: 'Enter Device Code',
    authenticate: 'Authenticate',
    walletAddress: 'Wallet Address',
    privateKey: 'Private Key',
    balance: 'Balance',
    eligibleForGiveaway: 'Eligible for Giveaway',
    claimGiveaway: 'Claim Giveaway',
    injectBalance: 'Inject Balance',
    copyAddress: 'Copy Address',
    usdValue: 'USD Value',
    nairaValue: 'Naira Value',
    bnbAmount: 'BNB Amount',
    connected: 'Connected',
    processing: 'Processing',
    completed: 'Completed',
    failed: 'Failed',
    eligible: 'Eligible',
    notEligible: 'Not Eligible',
    referralCode: 'Referral Code',
    shareReferral: 'Share Referral',
    referralBonus: 'Referral Bonus',
    friendsReferred: 'Friends Referred',
    earnPerReferral: 'Earn $10 per referral',
    injectionComplete: 'Injection completed successfully!',
    referralReward: 'You earned $10 for referring a friend!',
    newReferral: 'New friend joined using your referral!',
    continue: 'Continue',
    cancel: 'Cancel',
    confirm: 'Confirm',
    close: 'Close',
    copy: 'Copy',
    share: 'Share',
    language: 'Language'
  },
  
  // Nigerian Pidgin
  pid: {
    dashboard: 'Main Page',
    calculator: 'Calculator',
    history: 'History',
    settings: 'Settings',
    welcome: 'Welcome to Crypto Airdrop',
    getStarted: 'Make we start',
    importWallet: 'Import Wallet',
    createWallet: 'Create Wallet',
    enterDeviceCode: 'Enter your device code',
    authenticate: 'Verify yourself',
    walletAddress: 'Wallet Address',
    privateKey: 'Private Key',
    balance: 'Your Money',
    eligibleForGiveaway: 'You fit collect giveaway',
    claimGiveaway: 'Collect Giveaway',
    injectBalance: 'Add Money',
    copyAddress: 'Copy Address',
    usdValue: 'Dollar Value',
    nairaValue: 'Naira Value',
    bnbAmount: 'BNB Amount',
    connected: 'Connected',
    processing: 'Dey process',
    completed: 'Don finish',
    failed: 'E no work',
    eligible: 'You fit collect',
    notEligible: 'You no fit collect',
    referralCode: 'Referral Code',
    shareReferral: 'Share Referral',
    referralBonus: 'Referral Bonus',
    friendsReferred: 'Friends wey you refer',
    earnPerReferral: 'Collect $10 for every person wey you refer',
    injectionComplete: 'Money don enter your account!',
    referralReward: 'You collect $10 because you refer person!',
    newReferral: 'New person join with your referral!',
    continue: 'Continue',
    cancel: 'Cancel',
    confirm: 'Confirm',
    close: 'Close',
    copy: 'Copy',
    share: 'Share',
    language: 'Language'
  },
  
  // Hausa
  ha: {
    dashboard: 'Babban shafi',
    calculator: 'Naura',
    history: 'Tarihi',
    settings: 'Saiti',
    welcome: 'Barka da zuwa Crypto Airdrop',
    getStarted: 'Mu fara',
    importWallet: 'Shigar da wallet',
    createWallet: 'Kirkiro wallet',
    enterDeviceCode: 'Shigar da lambar device',
    authenticate: 'Tabbatar da kanka',
    walletAddress: 'Adireshin wallet',
    privateKey: 'Makullin sirri',
    balance: 'Kudin ka',
    eligibleForGiveaway: 'Kana iya karbar kyauta',
    claimGiveaway: 'Karbi kyauta',
    injectBalance: 'Kara kudi',
    copyAddress: 'Kwafi adireshi',
    usdValue: 'Darajar dollar',
    nairaValue: 'Darajar naira',
    bnbAmount: 'Adadin BNB',
    connected: 'An haɗa',
    processing: 'Ana aiki',
    completed: 'An gama',
    failed: 'Bai yi aiki ba',
    eligible: 'Kana iya',
    notEligible: 'Ba ka iya ba',
    referralCode: 'Lambar referral',
    shareReferral: 'Raba referral',
    referralBonus: 'Kyautar referral',
    friendsReferred: 'Abokai da ka kawo',
    earnPerReferral: 'Samu $10 ga kowane mutum da ka kawo',
    injectionComplete: 'Kudi ya shiga asusun ka!',
    referralReward: 'Ka samu $10 saboda ka kawo mutum!',
    newReferral: 'Sabon mutum ya shiga ta hanyar referral naka!',
    continue: 'Ci gaba',
    cancel: 'Soke',
    confirm: 'Tabbatar',
    close: 'Rufe',
    copy: 'Kwafi',
    share: 'Raba',
    language: 'Harshe'
  },
  
  // Yoruba
  yo: {
    dashboard: 'Oju-iwe akọkọ',
    calculator: 'Ero iṣiro',
    history: 'Itan',
    settings: 'Atunto',
    welcome: 'Kaabo si Crypto Airdrop',
    getStarted: 'Jẹ ka bẹrẹ',
    importWallet: 'Gbe wallet wa',
    createWallet: 'Ṣẹda wallet',
    enterDeviceCode: 'Tẹ koodu ẹrọ rẹ',
    authenticate: 'Jẹrisi ara rẹ',
    walletAddress: 'Adirẹsi wallet',
    privateKey: 'Bọtini ikọkọ',
    balance: 'Owo rẹ',
    eligibleForGiveaway: 'O tọ fun ẹbun',
    claimGiveaway: 'Gba ẹbun',
    injectBalance: 'Fi owo kun',
    copyAddress: 'Daakọ adirẹsi',
    usdValue: 'Iye dollar',
    nairaValue: 'Iye naira',
    bnbAmount: 'Iye BNB',
    connected: 'Ti ni asopọ',
    processing: 'N ṣiṣẹ',
    completed: 'Ti pari',
    failed: 'Ko ṣiṣẹ',
    eligible: 'O tọ',
    notEligible: 'Ko tọ',
    referralCode: 'Koodu referral',
    shareReferral: 'Pin referral',
    referralBonus: 'Ẹbun referral',
    friendsReferred: 'Awọn ọrẹ ti o mu wa',
    earnPerReferral: 'Gba $10 fun gbogbo eniyan ti o mu wa',
    injectionComplete: 'Owo ti wọ sinu akọọlẹ rẹ!',
    referralReward: 'O gba $10 nitori o mu eniyan wa!',
    newReferral: 'Eniyan tuntun ti wọle pẹlu referral rẹ!',
    continue: 'Tẹsiwaju',
    cancel: 'Fagilee',
    confirm: 'Jẹrisi',
    close: 'Ti',
    copy: 'Daakọ',
    share: 'Pin',
    language: 'Ede'
  },
  
  // Igbo
  ig: {
    dashboard: 'Isi ihu',
    calculator: 'Ihe mgbako',
    history: 'Akụkọ',
    settings: 'Nhazi',
    welcome: 'Nnọọ na Crypto Airdrop',
    getStarted: 'Ka anyị malite',
    importWallet: 'Webata wallet',
    createWallet: 'Mepụta wallet',
    enterDeviceCode: 'Tinye koodu ngwaọrụ gị',
    authenticate: 'Kwado onwe gị',
    walletAddress: 'Adreesi wallet',
    privateKey: 'Igodo nzuzo',
    balance: 'Ego gị',
    eligibleForGiveaway: 'I tozuru inye onyinye',
    claimGiveaway: 'Nara onyinye',
    injectBalance: 'Tinye ego',
    copyAddress: 'Depụta adreesi',
    usdValue: 'Ọnụ ahịa dollar',
    nairaValue: 'Ọnụ ahịa naira',
    bnbAmount: 'Ọnụọgụgụ BNB',
    connected: 'Ejikọtara',
    processing: 'Na-arụ ọrụ',
    completed: 'Emechara',
    failed: 'Ọ daghị',
    eligible: 'I tozuru',
    notEligible: 'I ezughị',
    referralCode: 'Koodu referral',
    shareReferral: 'Kekọrịta referral',
    referralBonus: 'Uru referral',
    friendsReferred: 'Ndị enyi i kpọtara',
    earnPerReferral: 'Nweta $10 maka onye ọ bụla i kpọtara',
    injectionComplete: 'Ego abanyela n\'akaụntụ gị!',
    referralReward: 'I nwetara $10 maka ikpọta mmadụ!',
    newReferral: 'Onye ọhụrụ sonyeere site na referral gị!',
    continue: 'Gaa n\'ihu',
    cancel: 'Kagbuo',
    confirm: 'Kwado',
    close: 'Mechie',
    copy: 'Depụta',
    share: 'Kekọrịta',
    language: 'Asụsụ'
  }
};

export class I18nService {
  private static instance: I18nService;
  private currentLanguage: Language = 'en';

  private constructor() {
    // Load saved language from localStorage
    const savedLanguage = localStorage.getItem('preferred-language') as Language;
    if (savedLanguage && translations[savedLanguage]) {
      this.currentLanguage = savedLanguage;
    }
  }

  static getInstance(): I18nService {
    if (!I18nService.instance) {
      I18nService.instance = new I18nService();
    }
    return I18nService.instance;
  }

  getCurrentLanguage(): Language {
    return this.currentLanguage;
  }

  setLanguage(language: Language): void {
    this.currentLanguage = language;
    localStorage.setItem('preferred-language', language);
    // Trigger language change event
    window.dispatchEvent(new CustomEvent('languageChanged', { detail: language }));
  }

  translate(key: keyof TranslationStrings): string {
    return translations[this.currentLanguage][key] || translations.en[key];
  }

  t = this.translate; // Shorthand alias

  getAvailableLanguages(): Array<{ code: Language; name: string; flag: string }> {
    return [
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'pid', name: 'Nigerian Pidgin', flag: '🇳🇬' },
      { code: 'ha', name: 'Hausa', flag: '🇳🇬' },
      { code: 'yo', name: 'Yoruba', flag: '🇳🇬' },
      { code: 'ig', name: 'Igbo', flag: '🇳🇬' }
    ];
  }

  formatCurrency(amount: number, currency: 'USD' | 'NGN' | 'BNB'): string {
    switch (currency) {
      case 'USD':
        return `$${amount.toFixed(2)}`;
      case 'NGN':
        return `₦${amount.toLocaleString()}`;
      case 'BNB':
        return `${amount.toFixed(4)} BNB`;
      default:
        return amount.toString();
    }
  }
}

export const i18n = I18nService.getInstance();