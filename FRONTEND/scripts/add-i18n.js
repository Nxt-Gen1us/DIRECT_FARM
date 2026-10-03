import fs from 'fs';
import path from 'path';

const enPath = path.resolve('src/i18n/locales/en.ts');
const hiPath = path.resolve('src/i18n/locales/hi.ts');
const guPath = path.resolve('src/i18n/locales/gu.ts');

const newFarmerKeysEn = `
  farmerNav: {
    home: "Home",
    products: "My Products",
    orders: "My Orders",
    earnings: "My Earnings",
    farm: "My Farm",
    more: "More Features",
    ai: "AI Tools",
    weather: "Weather",
    passport: "Crop Passport",
    messages: "Messages",
    settings: "Settings"
  },
  farmerHome: {
    greeting: "Namaste, {{name}}",
    whatNext: "What would you like to do today?",
    quickAddProduct: "Add Product",
    quickAddProductSub: "Put up for sale",
    quickOrders: "My Orders",
    quickOrdersSub: "{{count}} new orders",
    quickEarnings: "My Earnings",
    quickCrops: "My Crops",
    quickCropsSub: "{{count}} products",
    todaysOrders: "Today's Orders",
    viewOrder: "View Order",
    salesToday: "Today's Sales",
    ordersToday: "Today's Orders",
    productsForSale: "Products for Sale",
    customer: "Customer",
    away: "away",
    statusPending: "Pending Preparation"
  },
  farmerProductWizard: {
    step1Title: "PRODUCT PHOTO",
    step1Question: "Add a photo of your crop",
    step1Select: "Select Photo",
    step2Title: "PRODUCT",
    step2Question: "What do you want to sell?",
    step3Title: "QUANTITY",
    step3Question: "How much stock do you have?",
    step4Title: "PRICE",
    step4Question: "Price",
    aiSuggestion: "AI Suggestion",
    step5Title: "HARVEST",
    step5Question: "When was the crop harvested?",
    step6Title: "DELIVERY",
    step6Question: "Delivery method",
    deliverySelf: "I will deliver",
    deliveryPickup: "Customer will pickup",
    deliveryService: "Delivery Service",
    step7Title: "Preview",
    putForSale: "Put for sale",
    next: "Next",
    back: "Back",
    cancel: "Cancel",
  },
  farmerProducts: {
    title: "My Products",
    searchPlaceholder: "Search crops...",
    available: "Available",
    price: "Price",
    status: "Status",
    action: "Action",
    edit: "Edit",
    stopSale: "Stop Sale",
    statusAvailable: "Available for sale"
  },
  farmerOrders: {
    tabNew: "New Orders",
    tabPrepare: "To Prepare",
    tabTransit: "On the way",
    tabCompleted: "Completed",
    progressReceived: "Order Received",
    progressPreparing: "Preparing",
    progressTransit: "On the way",
    progressDelivered: "Delivered",
  },
  farmerEarnings: {
    title: "My Earnings",
    thisMonth: "This Month",
    totalSales: "Total Sales",
    completedOrders: "Completed Orders",
    graphTitle: "Monthly Earnings"
  },
  farmerProfile: {
    title: "My Farm",
    verifiedBadge: "Verified Farmer",
    verifiedDesc: "Your identity and farm details have been verified."
  },
  farmerPassport: {
    title: "Crop Passport",
    farmer: "Farmer",
    farm: "Farm",
    sown: "Sown",
    harvest: "Harvested",
    quality: "Quality",
    viewQR: "View QR Code"
  },
  farmerWeather: {
    title: "Today's Weather",
    rainChance: "Rain chance",
    wind: "Wind",
    advice: "Consider the rain chance before watering today."
  },
  farmerAI: {
    priceTipTitle: "AI Price Suggestion",
    priceTipPrefix: "Suggested price for this crop:"
  },
  farmerHeader: {
    searchPlaceholder: "What are you looking for?"
  },
  farmerNotifications: {
    newOrderTitle: "New Order Received",
    newOrderDesc: "You received a new order for {{qty}} {{unit}} of {{product}}.",
    view: "View"
  },
`;

const newFarmerKeysGu = `
  farmerNav: {
    home: "હોમ",
    products: "મારા ઉત્પાદનો",
    orders: "મારા ઓર્ડર",
    earnings: "મારી કમાણી",
    farm: "મારું ખેતર",
    more: "વધુ સુવિધાઓ",
    ai: "AI સુવિધાઓ",
    weather: "હવામાન",
    passport: "પાક પાસપોર્ટ",
    messages: "સંદેશાઓ",
    settings: "સેટિંગ્સ"
  },
  farmerHome: {
    greeting: "નમસ્તે, {{name}}",
    whatNext: "આજે શું કરવું છે?",
    quickAddProduct: "ઉત્પાદન ઉમેરો",
    quickAddProductSub: "વેચાણ માટે મૂકશો",
    quickOrders: "મારા ઓર્ડર",
    quickOrdersSub: "{{count}} નવા ઓર્ડર",
    quickEarnings: "મારી કમાણી",
    quickCrops: "મારા પાક",
    quickCropsSub: "{{count}} ઉત્પાદનો",
    todaysOrders: "આજના ઓર્ડર",
    viewOrder: "ઓર્ડર જુઓ",
    salesToday: "આજનું વેચાણ",
    ordersToday: "આજના ઓર્ડર",
    productsForSale: "વેચાણ માટેના ઉત્પાદનો",
    customer: "ગ્રાહક",
    away: "દૂર",
    statusPending: "તૈયાર કરવાનું બાકી"
  },
  farmerProductWizard: {
    step1Title: "ફોટો ઉમેરો",
    step1Question: "તમારા પાકનો ફોટો ઉમેરો",
    step1Select: "ફોટો પસંદ કરો",
    step2Title: "ઉત્પાદન",
    step2Question: "શું વેચવું છે?",
    step3Title: "જથ્થો",
    step3Question: "તમારી પાસે કેટલો માલ છે?",
    step4Title: "કિંમત",
    step4Question: "કિંમત",
    aiSuggestion: "AI સૂચન",
    step5Title: "કાપણી",
    step5Question: "પાક ક્યારે તૈયાર થયો?",
    step6Title: "ડિલિવરી",
    step6Question: "ડિલિવરી કેવી રીતે કરશો?",
    deliverySelf: "હું પહોંચાડીશ",
    deliveryPickup: "ગ્રાહક લઈ જશે",
    deliveryService: "ડિલિવરી સેવા",
    step7Title: "પ્રીવ્યૂ",
    putForSale: "વેચાણ માટે મૂકો",
    next: "આગળ",
    back: "પાછળ",
    cancel: "રદ કરો",
  },
  farmerProducts: {
    title: "મારા ઉત્પાદનો",
    searchPlaceholder: "પાક શોધો...",
    available: "ઉપલબ્ધ",
    price: "કિંમત",
    status: "સ્થિતિ",
    action: "કાર્ય",
    edit: "બદલો",
    stopSale: "વેચાણ બંધ કરો",
    statusAvailable: "વેચાણ માટે ઉપલબ્ધ"
  },
  farmerOrders: {
    tabNew: "નવા ઓર્ડર",
    tabPrepare: "તૈયાર કરવાના",
    tabTransit: "રસ્તામાં",
    tabCompleted: "પૂર્ણ",
    progressReceived: "ઓર્ડર મળ્યો",
    progressPreparing: "તૈયાર કરી રહ્યા છીએ",
    progressTransit: "રસ્તામાં",
    progressDelivered: "પહોંચાડી દીધો",
  },
  farmerEarnings: {
    title: "મારી કમાણી",
    thisMonth: "આ મહિને",
    totalSales: "કુલ વેચાણ",
    completedOrders: "પૂર્ણ થયેલા ઓર્ડર",
    graphTitle: "માસિક કમાણી"
  },
  farmerProfile: {
    title: "મારું ખેતર",
    verifiedBadge: "ચકાસાયેલ ખેડૂત",
    verifiedDesc: "તમારી ઓળખ અને ખેતરની માહિતી ચકાસવામાં આવી છે."
  },
  farmerPassport: {
    title: "પાક પાસપોર્ટ",
    farmer: "ખેડૂત",
    farm: "ખેતર",
    sown: "વાવણી",
    harvest: "કાપણી",
    quality: "ગુણવત્તા",
    viewQR: "QR કોડ જુઓ"
  },
  farmerWeather: {
    title: "આજનું હવામાન",
    rainChance: "વરસાદની શક્યતા",
    wind: "પવન",
    advice: "આજે પાણી આપતા પહેલા વરસાદની શક્યતા ધ્યાનમાં લો."
  },
  farmerAI: {
    priceTipTitle: "AI ભાવ સૂચન",
    priceTipPrefix: "આ પાક માટે સૂચિત કિંમત:"
  },
  farmerHeader: {
    searchPlaceholder: "શું શોધવું છે?"
  },
  farmerNotifications: {
    newOrderTitle: "નવો ઓર્ડર મળ્યો",
    newOrderDesc: "તમારા {{product}}ના {{qty}} {{unit}}નો નવો ઓર્ડર મળ્યો.",
    view: "જુઓ"
  },
`;

const newFarmerKeysHi = `
  farmerNav: {
    home: "होम",
    products: "मेरे उत्पाद",
    orders: "मेरे ऑर्डर",
    earnings: "मेरी कमाई",
    farm: "मेरा खेत",
    more: "अधिक सुविधाएँ",
    ai: "AI सुविधाएँ",
    weather: "मौसम",
    passport: "फसल पासपोर्ट",
    messages: "संदेश",
    settings: "सेटिंग्स"
  },
  farmerHome: {
    greeting: "नमस्ते, {{name}}",
    whatNext: "आज आप क्या करना चाहेंगे?",
    quickAddProduct: "उत्पाद जोड़ें",
    quickAddProductSub: "बिक्री के लिए रखें",
    quickOrders: "मेरे ऑर्डर",
    quickOrdersSub: "{{count}} नए ऑर्डर",
    quickEarnings: "मेरी कमाई",
    quickCrops: "मेरी फसलें",
    quickCropsSub: "{{count}} उत्पाद",
    todaysOrders: "आज के ऑर्डर",
    viewOrder: "ऑर्डर देखें",
    salesToday: "आज की बिक्री",
    ordersToday: "आज के ऑर्डर",
    productsForSale: "बिक्री के लिए उत्पाद",
    customer: "ग्राहक",
    away: "दूर",
    statusPending: "तैयार करना बाकी"
  },
  farmerProductWizard: {
    step1Title: "फोटो जोड़ें",
    step1Question: "अपनी फसल का फोटो जोड़ें",
    step1Select: "फोटो चुनें",
    step2Title: "उत्पाद",
    step2Question: "आप क्या बेचना चाहते हैं?",
    step3Title: "मात्रा",
    step3Question: "आपके पास कितना माल है?",
    step4Title: "कीमत",
    step4Question: "कीमत",
    aiSuggestion: "AI सुझाव",
    step5Title: "कटाई",
    step5Question: "फसल कब तैयार हुई?",
    step6Title: "डिलीवरी",
    step6Question: "डिलीवरी कैसे करेंगे?",
    deliverySelf: "मैं खुद पहुँचाऊँगा",
    deliveryPickup: "ग्राहक खुद ले जाएगा",
    deliveryService: "डिलीवरी सेवा",
    step7Title: "पूर्वावलोकन",
    putForSale: "बिक्री के लिए रखें",
    next: "आगे",
    back: "पीछे",
    cancel: "रद्द करें",
  },
  farmerProducts: {
    title: "मेरे उत्पाद",
    searchPlaceholder: "फसल खोजें...",
    available: "उपलब्ध",
    price: "कीमत",
    status: "स्थिति",
    action: "कार्रवाई",
    edit: "संपादित करें",
    stopSale: "बिक्री बंद करें",
    statusAvailable: "बिक्री के लिए उपलब्ध"
  },
  farmerOrders: {
    tabNew: "नए ऑर्डर",
    tabPrepare: "तैयार करने हैं",
    tabTransit: "रास्ते में",
    tabCompleted: "पूरे हुए",
    progressReceived: "ऑर्डर मिला",
    progressPreparing: "तैयार हो रहा है",
    progressTransit: "रास्ते में",
    progressDelivered: "डिलीवर हो गया",
  },
  farmerEarnings: {
    title: "मेरी कमाई",
    thisMonth: "इस महीने",
    totalSales: "कुल बिक्री",
    completedOrders: "पूरे हुए ऑर्डर",
    graphTitle: "मासिक कमाई"
  },
  farmerProfile: {
    title: "मेरा खेत",
    verifiedBadge: "सत्यापित किसान",
    verifiedDesc: "आपकी पहचान और खेत का विवरण सत्यापित कर लिया गया है।"
  },
  farmerPassport: {
    title: "फसल पासपोर्ट",
    farmer: "किसान",
    farm: "खेत",
    sown: "बुवाई",
    harvest: "कटाई",
    quality: "गुणवत्ता",
    viewQR: "QR कोड देखें"
  },
  farmerWeather: {
    title: "आज का मौसम",
    rainChance: "बारिश की संभावना",
    wind: "हवा",
    advice: "आज पानी देने से पहले बारिश की संभावना पर विचार करें।"
  },
  farmerAI: {
    priceTipTitle: "AI कीमत सुझाव",
    priceTipPrefix: "इस फसल के लिए सुझाई गई कीमत:"
  },
  farmerHeader: {
    searchPlaceholder: "आप क्या खोज रहे हैं?"
  },
  farmerNotifications: {
    newOrderTitle: "नया ऑर्डर मिला",
    newOrderDesc: "आपको {{product}} के {{qty}} {{unit}} का नया ऑर्डर मिला है।",
    view: "देखें"
  },
`;

function updateFile(filePath, newKeys) {
  const content = fs.readFileSync(filePath, 'utf8');
  // insert before the last };
  const lastIndex = content.lastIndexOf('};');
  if (lastIndex !== -1) {
    const updated = content.slice(0, lastIndex) + newKeys + content.slice(lastIndex);
    fs.writeFileSync(filePath, updated);
    console.log('Updated ' + filePath);
  }
}

updateFile(enPath, newFarmerKeysEn);
updateFile(hiPath, newFarmerKeysHi);
updateFile(guPath, newFarmerKeysGu);
