// API Routes for Smart Parsing Settings
import { NextRequest, NextResponse } from 'next/server';
import { getData, addItem, updateItem } from '@/lib/db/database';

// Store smart parsing settings in localStorage with a special key
const SMART_PARSING_KEY = 'smart_parsing_settings';

// Enhanced type definitions for smart parsing rules
export interface QuantityRule {
  id: string;
  pattern: string;        // e.g., "1dr", "2dr", "1/2oz", "1oz", "2oz", "100ml"
  value: string;         // e.g., "1", "2", "0.5", "1", "2", "100"
  unit: string;          // e.g., "dr", "oz", "ml"
  display: string;       // e.g., "1 dr", "1/2 oz", "100 ml"
  isActive: number;
}

export interface DoseFormRule {
  id: string;
  pattern: string;        // e.g., "pills", "tab", "liq", "drops", "sachet", "powder", "ointment"
  display: string;        // e.g., "Pills", "Tablet", "Liquid", "Drops", "Sachet", "Powder", "Ointment"
  isActive: number;
}

export interface DosePatternRule {
  id: string;
  pattern: string;        // e.g., "OD", "BD", "TDS", "QID", "SOS", "HS", "1-0-1"
  display: string;        // e.g., "Once a day", "Twice a day", "Thrice a day", "Four times", "As needed", "At bedtime"
  timesPerDay: number;    // e.g., 1, 2, 3, 4, 0 (for SOS)
  defaultDosage: string;  // e.g., "1-0-0", "0-1-0", "1-1-1", "2-2-2" for numeric patterns
  isActive: number;
}

export interface SmartParsingSettings {
  quantities: QuantityRule[];
  doseForms: DoseFormRule[];
  dosePatterns: DosePatternRule[];
}

function getSmartParsingSettings(): SmartParsingSettings {
  if (typeof window === 'undefined') {
    return getDefaultSettings();
  }
  const data = localStorage.getItem(SMART_PARSING_KEY);
  if (data) {
    return JSON.parse(data);
  }
  const defaultSettings = getDefaultSettings();
  localStorage.setItem(SMART_PARSING_KEY, JSON.stringify(defaultSettings));
  return defaultSettings;
}

function getDefaultSettings(): SmartParsingSettings {
  return {
    quantities: [
      { id: '1', pattern: '1dr', value: '1', unit: 'dr', display: '1 dr', isActive: 1 },
      { id: '2', pattern: '2dr', value: '2', unit: 'dr', display: '2 dr', isActive: 1 },
      { id: '3', pattern: '3dr', value: '3', unit: 'dr', display: '3 dr', isActive: 1 },
      { id: '4', pattern: '4dr', value: '4', unit: 'dr', display: '4 dr', isActive: 1 },
      { id: '5', pattern: '1/2oz', value: '0.5', unit: 'oz', display: '1/2 oz', isActive: 1 },
      { id: '6', pattern: '1oz', value: '1', unit: 'oz', display: '1 oz', isActive: 1 },
      { id: '7', pattern: '2oz', value: '2', unit: 'oz', display: '2 oz', isActive: 1 },
      { id: '8', pattern: '30ml', value: '30', unit: 'ml', display: '30 ml', isActive: 1 },
      { id: '9', pattern: '50ml', value: '50', unit: 'ml', display: '50 ml', isActive: 1 },
      { id: '10', pattern: '100ml', value: '100', unit: 'ml', display: '100 ml', isActive: 1 },
      { id: '11', pattern: '1', value: '1', unit: '', display: '1', isActive: 1 },
      { id: '12', pattern: '2', value: '2', unit: '', display: '2', isActive: 1 },
      { id: '13', pattern: '3', value: '3', unit: '', display: '3', isActive: 1 },
      { id: '14', pattern: '4', value: '4', unit: '', display: '4', isActive: 1 },
      { id: '15', pattern: '5', value: '5', unit: '', display: '5', isActive: 1 },
      { id: '16', pattern: '10', value: '10', unit: '', display: '10', isActive: 1 },
      { id: '17', pattern: '15', value: '15', unit: '', display: '15', isActive: 1 },
      { id: '18', pattern: '20', value: '20', unit: '', display: '20', isActive: 1 },
      { id: '19', pattern: '30', value: '30', unit: '', display: '30', isActive: 1 },
      { id: '20', pattern: '50', value: '50', unit: '', display: '50', isActive: 1 },
      { id: '21', pattern: '100', value: '100', unit: '', display: '100', isActive: 1 },
    ],
    doseForms: [
      { id: '1', pattern: 'pills', display: 'Pills', isActive: 1 },
      { id: '2', pattern: 'tablet', display: 'Tablet', isActive: 1 },
      { id: '3', pattern: 'tab', display: 'Tablet', isActive: 1 },
      { id: '4', pattern: 'capsule', display: 'Capsule', isActive: 1 },
      { id: '5', pattern: 'cap', display: 'Capsule', isActive: 1 },
      { id: '6', pattern: 'liq', display: 'Liquid', isActive: 1 },
      { id: '7', pattern: 'liquid', display: 'Liquid', isActive: 1 },
      { id: '8', pattern: 'drops', display: 'Drops', isActive: 1 },
      { id: '9', pattern: 'drop', display: 'Drops', isActive: 1 },
      { id: '10', pattern: 'sachet', display: 'Sachet', isActive: 1 },
      { id: '11', pattern: 'powder', display: 'Powder', isActive: 1 },
      { id: '12', pattern: 'ointment', display: 'Ointment', isActive: 1 },
      { id: '13', pattern: 'cream', display: 'Cream', isActive: 1 },
      { id: '14', pattern: 'ml', display: 'ml', isActive: 1 },
      { id: '15', pattern: 'tsp', display: 'Teaspoon', isActive: 1 },
      { id: '16', pattern: 'tbsp', display: 'Tablespoon', isActive: 1 },
    ],
    dosePatterns: [
      { id: '1', pattern: 'od', display: 'Once a Day (OD)', timesPerDay: 1, defaultDosage: '1-0-0', isActive: 1 },
      { id: '2', pattern: 'bd', display: 'Twice a Day (BD)', timesPerDay: 2, defaultDosage: '1-1-0', isActive: 1 },
      { id: '3', pattern: 'tds', display: 'Thrice a Day (TDS)', timesPerDay: 3, defaultDosage: '1-1-1', isActive: 1 },
      { id: '4', pattern: 'qid', display: 'Four Times a Day (QID)', timesPerDay: 4, defaultDosage: '1-1-1-1', isActive: 1 },
      { id: '5', pattern: 'sos', display: 'As Needed (SOS)', timesPerDay: 0, defaultDosage: 'As needed', isActive: 1 },
      { id: '6', pattern: 'hs', display: 'At Bedtime (HS)', timesPerDay: 1, defaultDosage: '0-0-1', isActive: 1 },
      { id: '7', pattern: '1-0-0', display: 'Morning Only', timesPerDay: 1, defaultDosage: '1-0-0', isActive: 1 },
      { id: '8', pattern: '0-1-0', display: 'Afternoon Only', timesPerDay: 1, defaultDosage: '0-1-0', isActive: 1 },
      { id: '9', pattern: '0-0-1', display: 'Night Only', timesPerDay: 1, defaultDosage: '0-0-1', isActive: 1 },
      { id: '10', pattern: '1-0-1', display: 'Morning & Night', timesPerDay: 2, defaultDosage: '1-0-1', isActive: 1 },
      { id: '11', pattern: '1-1-0', display: 'Morning & Afternoon', timesPerDay: 2, defaultDosage: '1-1-0', isActive: 1 },
      { id: '12', pattern: '1-1-1', display: '3 Times a Day', timesPerDay: 3, defaultDosage: '1-1-1', isActive: 1 },
      { id: '13', pattern: '2-2-2', display: '2-2-2 Pattern', timesPerDay: 3, defaultDosage: '2-2-2', isActive: 1 },
      { id: '14', pattern: '2-0-2', display: 'Morning, Noon, Night', timesPerDay: 3, defaultDosage: '2-0-2', isActive: 1 },
      { id: '15', pattern: '1-1-1-1', display: '4 Times a Day', timesPerDay: 4, defaultDosage: '1-1-1-1', isActive: 1 },
    ]
  };
}

function saveSmartParsingSettings(settings: SmartParsingSettings) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SMART_PARSING_KEY, JSON.stringify(settings));
}

export async function GET(request: NextRequest) {
  const settings = getSmartParsingSettings();
  return NextResponse.json(settings);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    saveSmartParsingSettings(body);
    return NextResponse.json(body);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save smart parsing settings' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    saveSmartParsingSettings(body);
    return NextResponse.json(body);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update smart parsing settings' }, { status: 500 });
  }
}
