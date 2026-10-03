#!/usr/bin/env node
/**
 * Comprehensive i18n audit script for DIRECT FARM
 * Finds all hardcoded user-visible strings that should be translated
 */

import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { extname, join, relative, resolve } from 'node:path';

const SRC_DIR = resolve('src');
const PATTERNS_TO_FIND = [
  // JSX text content
  />\s*([A-Z][^<>{}\n]*[a-z][^<>{}\n]*)\s*</g,
  
  // String literals in attributes
  /(?:placeholder|title|aria-label|alt)=["']([^"']+)["']/g,
  
  // Button and link text
  /<[Bb]utton[^>]*>([^<]*[A-Z][^<]*)<\/[Bb]utton>/g,
  
  // Option text
  /<option[^>]*>([^<]*[A-Z][^<]*)<\/option>/g,
  
  // Label text in Field components
  /label=["']([^{][^"']+)["']/g,
  
  // Common hardcoded strings
  /["'](Loading|Error|Success|Failed|Pending|Delivered|Cancel|Save|Delete|Edit|Add|Remove|Update|Create|Submit|Continue|Back|Next|Previous|Home|Shop|Products|Cart|Profile|Dashboard|Orders|Settings|Login|Register|Logout|Search|Add to Cart|Buy Now|View Details|Show more|Show less|See all|Learn more|Get started|Sign up|Log in|Log out|Welcome|Hello|Thank you|Please|Sorry|Warning|Info|Confirm|OK|Close|Open|Filter|Sort|All|None|Select|Choose|Upload|Download|Send|Receive|Buy|Sell|Order|Checkout|Payment|Total|Subtotal|Delivery|Address|Name|Email|Phone|Message|Description|Title|Category|Price|Quantity|Stock|Available|Out of stock|In stock|Sold out|Free|Premium|Basic|Advanced|Popular|Featured|New arrival|Sale|Discount|Offer|Deal|Terms|Privacy|About|Contact|Help|Support|FAQ|Account|Preferences|Notifications|Messages|Inbox|Sent|Draft|Favorites|History|Recent|Today|Yesterday|This week|This month|kg|g|lb|oz|L|ml|m|cm|ft|in)["']/gi,
  
  // Status values that should be translated
  /["'](pending|confirmed|packed|shipped|delivered|cancelled|paid|failed|refunded|active|inactive|approved|rejected|verified|unverified)["']/g,
  
  // Month/day names
  /["'](January|February|March|April|May|June|July|August|September|October|November|December|Jan|Feb|Mar|Apr|Jun|Jul|Aug|Sep|Oct|Nov|Dec|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|Mon|Tue|Wed|Thu|Fri|Sat|Sun|AM|PM)["']/g,
];

const IGNORE_PATTERNS = [
  // Translation function calls
  /t\(/,
  // Import statements
  /^import/,
  // Type definitions
  /^type\s/,
  /^interface\s/,
  // Comments
  /^\s*\/\//,
  /^\s*\/\*/,
  // CSS classes
  /className/,
  // Technical strings (URLs, API endpoints, etc.)
  /^https?:\/\//,
  /^\/api\//,
  // Test strings
  /test-/,
  // File paths
  /\.\w+$/,
  // Color codes
  /#[0-9a-f]{3,6}/i,
  // Version numbers
  /\d+\.\d+/,
];

function shouldIgnoreLine(line) {
  return IGNORE_PATTERNS.some(pattern => pattern.test(line.trim()));
}

function findHardcodedStrings(filePath) {
  if (!existsSync(filePath)) return [];
  
  const content = readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const found = [];
  
  lines.forEach((line, lineNum) => {
    if (shouldIgnoreLine(line)) return;
    
    PATTERNS_TO_FIND.forEach((pattern, patternIndex) => {
      let match;
      const regex = new RegExp(pattern.source, pattern.flags);
      
      while ((match = regex.exec(line)) !== null) {
        const text = match[1] || match[0];
        
        // Skip if it's just a variable name or technical string
        if (!text || text.length < 2) continue;
        if (/^[a-z_$][a-zA-Z0-9_$]*$/.test(text)) continue; // variable names
        if (/^\d+$/.test(text)) continue; // numbers only
        if (text.includes('t(')) continue; // already translated
        
        found.push({
          file: filePath,
          line: lineNum + 1,
          text: text.trim(),
          context: line.trim(),
          pattern: patternIndex
        });
      }
    });
  });
  
  return found;
}

async function scanAllFiles() {
  const files = [];
  const visit = (directory) => {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      const filePath = join(directory, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== 'node_modules' && entry.name !== 'test') visit(filePath);
      } else if (
        ['.ts', '.tsx', '.jsx', '.js'].includes(extname(entry.name)) &&
        !entry.name.endsWith('.d.ts') &&
        !entry.name.includes('.test.')
      ) {
        files.push(filePath);
      }
    }
  };
  visit(SRC_DIR);
  
  console.log(`Scanning ${files.length} files for hardcoded strings...\n`);
  
  const allFindings = [];
  const fileStats = {};
  
  for (const file of files) {
    const findings = findHardcodedStrings(file);
    if (findings.length > 0) {
      const relativePath = relative(process.cwd(), file).replaceAll('\\', '/');
      allFindings.push(...findings);
      fileStats[relativePath] = findings.length;
      
      console.log(`📄 ${relativePath} (${findings.length} issues)`);
      findings.forEach(f => {
        console.log(`   Line ${f.line}: "${f.text}"`);
        console.log(`   Context: ${f.context}`);
        console.log('');
      });
    }
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('HARDCODED STRINGS AUDIT SUMMARY');
  console.log('='.repeat(80));
  console.log(`Total files scanned: ${files.length}`);
  console.log(`Files with hardcoded strings: ${Object.keys(fileStats).length}`);
  console.log(`Total hardcoded strings found: ${allFindings.length}`);
  console.log('');
  
  if (Object.keys(fileStats).length > 0) {
    console.log('Files with most issues:');
    Object.entries(fileStats)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .forEach(([file, count]) => {
        console.log(`  ${count.toString().padStart(3)} issues - ${file}`);
      });
  }
  
  console.log('\nPattern distribution:');
  const patternCounts = {};
  allFindings.forEach(f => {
    const key = `Pattern ${f.pattern}`;
    patternCounts[key] = (patternCounts[key] || 0) + 1;
  });
  
  Object.entries(patternCounts).forEach(([pattern, count]) => {
    console.log(`  ${count.toString().padStart(3)} - ${pattern}`);
  });
  
  return allFindings;
}

// Run the scan
scanAllFiles().catch(console.error);