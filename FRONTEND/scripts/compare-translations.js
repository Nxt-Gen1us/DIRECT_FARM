#!/usr/bin/env node
/**
 * Translation keys comparison script for DIRECT FARM
 * Compares EN/HI/GU translation dictionaries to find missing keys
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';

// Helper function to extract all keys from a nested object
function getAllKeys(obj, prefix = '') {
  const keys = [];
  
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      keys.push(...getAllKeys(value, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  
  return keys;
}

// Helper function to get value by dot notation path
function getByPath(obj, path) {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

// Load translation files
function loadTranslations() {
  try {
    // For modular EN structure
    const enFiles = [
      'src/i18n/locales/en/common.ts',
      'src/i18n/locales/en/nav.ts',
      'src/i18n/locales/en/auth.ts',
      'src/i18n/locales/en/landing.ts',
      'src/i18n/locales/en/marketplace.ts',
      'src/i18n/locales/en/flow.ts',
      'src/i18n/locales/en/profile.ts',
      'src/i18n/locales/en/manage.ts',
      'src/i18n/locales/en/desk.ts',
      'src/i18n/locales/en/aiDesk.ts',
      'src/i18n/locales/en/atlas.ts',
      'src/i18n/locales/en/earth.ts',
      'src/i18n/locales/en/detail.ts',
      'src/i18n/locales/en/passport.ts',
      'src/i18n/locales/en/foundation.ts',
      'src/i18n/locales/en/intel.ts',
      'src/i18n/locales/en/payments.ts',
      'src/i18n/locales/en/register.ts',
      'src/i18n/locales/en/weather.ts',
      'src/i18n/locales/en/placeholders.ts',
      'src/i18n/locales/en/rain.ts',
      'src/i18n/locales/en/shop.ts'
    ];
    
    let enTranslations = {};
    
    // Try to load modular EN files
    let foundModular = false;
    for (const file of enFiles) {
      try {
        const content = readFileSync(resolve(file), 'utf8');
        // Extract the export default object (simple regex parsing)
        const match = content.match(/const\s+\w+\s*=\s*({[\s\S]*?});?\s*export\s+default/);
        if (match) {
          // This is a simplified parser - in production, you'd want proper JS parsing
          const objStr = match[1];
          const obj = eval('(' + objStr + ')'); // Unsafe but works for this script
          enTranslations = { ...enTranslations, ...obj };
          foundModular = true;
        }
      } catch (e) {
        // File doesn't exist or can't be parsed
      }
    }
    
    // Fallback to monolithic EN file
    if (!foundModular) {
      const enContent = readFileSync(resolve('src/i18n/locales/en.ts'), 'utf8');
      const enMatch = enContent.match(/const\s+en\s*=\s*({[\s\S]*?});?\s*export\s+default/);
      if (enMatch) {
        enTranslations = eval('(' + enMatch[1] + ')');
      }
    }
    
    // Load monolithic HI and GU files
    const hiContent = readFileSync(resolve('src/i18n/locales/hi.ts'), 'utf8');
    const guContent = readFileSync(resolve('src/i18n/locales/gu.ts'), 'utf8');
    
    const hiMatch = hiContent.match(/const\s+hi\s*=\s*({[\s\S]*?});?\s*export\s+default/);
    const guMatch = guContent.match(/const\s+gu\s*=\s*({[\s\S]*?});?\s*export\s+default/);
    
    const hiTranslations = hiMatch ? eval('(' + hiMatch[1] + ')') : {};
    const guTranslations = guMatch ? eval('(' + guMatch[1] + ')') : {};
    
    return { en: enTranslations, hi: hiTranslations, gu: guTranslations };
  } catch (error) {
    console.error('Error loading translation files:', error);
    return { en: {}, hi: {}, gu: {} };
  }
}

function compareTranslations() {
  console.log('🔍 Comparing translation dictionaries...\n');
  
  const translations = loadTranslations();
  
  // Get all keys from each language
  const enKeys = new Set(getAllKeys(translations.en));
  const hiKeys = new Set(getAllKeys(translations.hi));
  const guKeys = new Set(getAllKeys(translations.gu));
  
  console.log('📊 Translation Statistics:');
  console.log(`   English keys: ${enKeys.size}`);
  console.log(`   Hindi keys: ${hiKeys.size}`);  
  console.log(`   Gujarati keys: ${guKeys.size}`);
  console.log('');
  
  // Find missing keys
  const missingInHi = [...enKeys].filter(key => !hiKeys.has(key));
  const missingInGu = [...enKeys].filter(key => !guKeys.has(key));
  const extraInHi = [...hiKeys].filter(key => !enKeys.has(key));
  const extraInGu = [...guKeys].filter(key => !enKeys.has(key));
  
  // Find empty translations
  const emptyInEn = [...enKeys].filter(key => {
    const value = getByPath(translations.en, key);
    return !value || (typeof value === 'string' && value.trim() === '');
  });
  
  const emptyInHi = [...hiKeys].filter(key => {
    const value = getByPath(translations.hi, key);
    return !value || (typeof value === 'string' && value.trim() === '');
  });
  
  const emptyInGu = [...guKeys].filter(key => {
    const value = getByPath(translations.gu, key);
    return !value || (typeof value === 'string' && value.trim() === '');
  });
  
  console.log('❌ Missing Translation Keys:');
  console.log('');
  
  if (missingInHi.length > 0) {
    console.log(`   Missing in Hindi (${missingInHi.length} keys):`);
    missingInHi.slice(0, 20).forEach(key => {
      console.log(`     - ${key}`);
    });
    if (missingInHi.length > 20) {
      console.log(`     ... and ${missingInHi.length - 20} more`);
    }
    console.log('');
  } else {
    console.log('   ✅ No missing Hindi keys');
  }
  
  if (missingInGu.length > 0) {
    console.log(`   Missing in Gujarati (${missingInGu.length} keys):`);
    missingInGu.slice(0, 20).forEach(key => {
      console.log(`     - ${key}`);
    });
    if (missingInGu.length > 20) {
      console.log(`     ... and ${missingInGu.length - 20} more`);
    }
    console.log('');
  } else {
    console.log('   ✅ No missing Gujarati keys');
  }
  
  console.log('⚠️  Extra Keys (not in English):');
  console.log('');
  
  if (extraInHi.length > 0) {
    console.log(`   Extra in Hindi (${extraInHi.length} keys):`);
    extraInHi.forEach(key => console.log(`     - ${key}`));
    console.log('');
  }
  
  if (extraInGu.length > 0) {
    console.log(`   Extra in Gujarati (${extraInGu.length} keys):`);
    extraInGu.forEach(key => console.log(`     - ${key}`));
    console.log('');
  }
  
  console.log('🔤 Empty/Invalid Translations:');
  console.log('');
  
  if (emptyInEn.length > 0) {
    console.log(`   Empty in English (${emptyInEn.length} keys):`);
    emptyInEn.forEach(key => console.log(`     - ${key}`));
    console.log('');
  }
  
  if (emptyInHi.length > 0) {
    console.log(`   Empty in Hindi (${emptyInHi.length} keys):`);
    emptyInHi.forEach(key => console.log(`     - ${key}`));
    console.log('');
  }
  
  if (emptyInGu.length > 0) {
    console.log(`   Empty in Gujarati (${emptyInGu.length} keys):`);
    emptyInGu.forEach(key => console.log(`     - ${key}`));
    console.log('');
  }
  
  console.log('=' * 80);
  console.log('SUMMARY');
  console.log('=' * 80);
  console.log(`Total issues found: ${missingInHi.length + missingInGu.length + extraInHi.length + extraInGu.length + emptyInEn.length + emptyInHi.length + emptyInGu.length}`);
  console.log(`Keys missing from Hindi: ${missingInHi.length}`);
  console.log(`Keys missing from Gujarati: ${missingInGu.length}`);
  console.log(`Extra keys in Hindi: ${extraInHi.length}`);
  console.log(`Extra keys in Gujarati: ${extraInGu.length}`);
  console.log(`Empty translations: EN=${emptyInEn.length}, HI=${emptyInHi.length}, GU=${emptyInGu.length}`);
  
  return {
    stats: { enKeys: enKeys.size, hiKeys: hiKeys.size, guKeys: guKeys.size },
    missing: { hi: missingInHi, gu: missingInGu },
    extra: { hi: extraInHi, gu: extraInGu },
    empty: { en: emptyInEn, hi: emptyInHi, gu: emptyInGu }
  };
}

// Run the comparison
compareTranslations();