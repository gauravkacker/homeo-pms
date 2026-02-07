'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Types for smart parsing settings
interface QuantityRule {
  id: string;
  pattern: string;
  value: string;
  unit: string;
  display: string;
  isActive: number;
}

interface DoseFormRule {
  id: string;
  pattern: string;
  display: string;
  isActive: number;
}

interface DosePatternRule {
  id: string;
  pattern: string;
  display: string;
  timesPerDay: number;
  defaultDosage: string;
  isActive: number;
}

interface SmartParsingSettings {
  quantities: QuantityRule[];
  doseForms: DoseFormRule[];
  dosePatterns: DosePatternRule[];
}

export default function SmartParsingSettingsPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [settings, setSettings] = useState<SmartParsingSettings>({
    quantities: [],
    doseForms: [],
    dosePatterns: []
  });
  
  // New item form states
  const [newQuantity, setNewQuantity] = useState({ pattern: '', value: '', unit: '', display: '' });
  const [newDoseForm, setNewDoseForm] = useState({ pattern: '', display: '' });
  const [newDosePattern, setNewDosePattern] = useState({ pattern: '', display: '', timesPerDay: '1', defaultDosage: '' });
  
  const [activeTab, setActiveTab] = useState<'quantities' | 'doseForms' | 'dosePatterns'>('quantities');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const user = localStorage.getItem('currentUser');
    if (!user) {
      router.push('/login');
      return;
    }
    setCurrentUser(JSON.parse(user));
    loadSettings();
  }, [router]);

  const loadSettings = async () => {
    try {
      const res = await fetch('/api/smart-parsing');
      const data = await res.json();
      if (data.quantities && data.quantities.length > 0) {
        setSettings(data);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  };

  const saveSettings = async () => {
    setIsLoading(true);
    setMessage('');
    try {
      await fetch('/api/smart-parsing', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      setMessage('Settings saved successfully!');
    } catch (error) {
      setMessage('Error saving settings');
    } finally {
      setIsLoading(false);
    }
  };

  // Quantity functions
  const addQuantity = () => {
    if (newQuantity.pattern && newQuantity.value) {
      const id = Date.now().toString();
      setSettings(prev => ({
        ...prev,
        quantities: [...prev.quantities, {
          id,
          pattern: newQuantity.pattern,
          value: newQuantity.value,
          unit: newQuantity.unit,
          display: newQuantity.display || newQuantity.pattern,
          isActive: 1
        }]
      }));
      setNewQuantity({ pattern: '', value: '', unit: '', display: '' });
    }
  };

  const removeQuantity = (id: string) => {
    setSettings(prev => ({
      ...prev,
      quantities: prev.quantities.filter(q => q.id !== id)
    }));
  };

  const toggleQuantityActive = (id: string) => {
    setSettings(prev => ({
      ...prev,
      quantities: prev.quantities.map(q =>
        q.id === id ? { ...q, isActive: q.isActive ? 0 : 1 } : q
      )
    }));
  };

  // Dose Form functions
  const addDoseForm = () => {
    if (newDoseForm.pattern) {
      const id = Date.now().toString();
      setSettings(prev => ({
        ...prev,
        doseForms: [...prev.doseForms, {
          id,
          pattern: newDoseForm.pattern.toLowerCase(),
          display: newDoseForm.display || newDoseForm.pattern,
          isActive: 1
        }]
      }));
      setNewDoseForm({ pattern: '', display: '' });
    }
  };

  const removeDoseForm = (id: string) => {
    setSettings(prev => ({
      ...prev,
      doseForms: prev.doseForms.filter(f => f.id !== id)
    }));
  };

  const toggleDoseFormActive = (id: string) => {
    setSettings(prev => ({
      ...prev,
      doseForms: prev.doseForms.map(f =>
        f.id === id ? { ...f, isActive: f.isActive ? 0 : 1 } : f
      )
    }));
  };

  // Dose Pattern functions
  const addDosePattern = () => {
    if (newDosePattern.pattern) {
      const id = Date.now().toString();
      setSettings(prev => ({
        ...prev,
        dosePatterns: [...prev.dosePatterns, {
          id,
          pattern: newDosePattern.pattern.toLowerCase(),
          display: newDosePattern.display || newDosePattern.pattern,
          timesPerDay: parseInt(newDosePattern.timesPerDay) || 1,
          defaultDosage: newDosePattern.defaultDosage || newDosePattern.pattern,
          isActive: 1
        }]
      }));
      setNewDosePattern({ pattern: '', display: '', timesPerDay: '1', defaultDosage: '' });
    }
  };

  const removeDosePattern = (id: string) => {
    setSettings(prev => ({
      ...prev,
      dosePatterns: prev.dosePatterns.filter(p => p.id !== id)
    }));
  };

  const toggleDosePatternActive = (id: string) => {
    setSettings(prev => ({
      ...prev,
      dosePatterns: prev.dosePatterns.map(p =>
        p.id === id ? { ...p, isActive: p.isActive ? 0 : 1 } : p
      )
    }));
  };

  if (!currentUser) {
    return <div className="loading" style={{ minHeight: '100vh' }}><div className="spinner"></div></div>;
  }

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <Link href="/dashboard" className="sidebar-logo">🏥 Homeo PMS</Link>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-section-title">Settings</div>
            <Link href="/settings" className="nav-link">General</Link>
            <Link href="/settings/fees" className="nav-link">Consultation Fees</Link>
            <Link href="/settings/registration" className="nav-link">Registration</Link>
            <Link href="/settings/slots" className="nav-link">Time Slots</Link>
            <Link href="/settings/smart-parsing" className="nav-link active">Smart Parsing</Link>
          </div>
        </nav>
      </aside>

      <main className="main-content">
        <header className="page-header">
          <div>
            <h1 className="page-title">Smart Parsing Settings</h1>
            <p className="page-subtitle">Configure how prescriptions are automatically parsed</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button className="btn btn-primary" onClick={saveSettings} disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save Settings'}
            </button>
            <button className="btn btn-secondary" onClick={() => router.push('/doctor-panel')}>
              Back to Doctor Panel
            </button>
          </div>
        </header>

        {message && (
          <div style={{ 
            padding: '0.75rem', 
            marginBottom: '1rem', 
            borderRadius: '0.375rem',
            background: message.includes('Error') ? '#fef2f2' : '#f0fdf4',
            color: message.includes('Error') ? '#dc2626' : '#16a34a'
          }}>
            {message}
          </div>
        )}

        <div className="tabs" style={{ marginBottom: '1.5rem' }}>
          <button
            className={`tab ${activeTab === 'quantities' ? 'active' : ''}`}
            onClick={() => setActiveTab('quantities')}
          >
            Quantities ({settings.quantities.length})
          </button>
          <button
            className={`tab ${activeTab === 'doseForms' ? 'active' : ''}`}
            onClick={() => setActiveTab('doseForms')}
          >
            Dose Forms ({settings.doseForms.length})
          </button>
          <button
            className={`tab ${activeTab === 'dosePatterns' ? 'active' : ''}`}
            onClick={() => setActiveTab('dosePatterns')}
          >
            Dose Patterns ({settings.dosePatterns.length})
          </button>
        </div>

        {/* Quantities Tab */}
        {activeTab === 'quantities' && (
          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Quantity Patterns</h3>
            <p style={{ color: '#64748b', marginBottom: '1rem' }}>
              Define quantity patterns like &quot;1dr&quot;, &quot;2dr&quot;, &quot;1/2oz&quot;, &quot;1oz&quot;, &quot;100ml&quot;, etc.
              These will be automatically detected and filled in prescriptions.
            </p>
            
            <div className="form-row" style={{ marginBottom: '1.5rem' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="label">Pattern (what doctor types)</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g., 1dr, 2dr, 1/2oz, 100ml"
                  value={newQuantity.pattern}
                  onChange={(e) => setNewQuantity(prev => ({ ...prev, pattern: e.target.value }))}
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="label">Value (numeric)</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g., 1, 2, 0.5, 100"
                  value={newQuantity.value}
                  onChange={(e) => setNewQuantity(prev => ({ ...prev, value: e.target.value }))}
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="label">Unit</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g., dr, oz, ml"
                  value={newQuantity.unit}
                  onChange={(e) => setNewQuantity(prev => ({ ...prev, unit: e.target.value }))}
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="label">Display</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g., 1 dr"
                  value={newQuantity.display}
                  onChange={(e) => setNewQuantity(prev => ({ ...prev, display: e.target.value }))}
                />
              </div>
              <div className="form-group" style={{ alignSelf: 'flex-end' }}>
                <button className="btn btn-primary" onClick={addQuantity}>Add</button>
              </div>
            </div>

            <div style={{ display: 'grid', gap: '0.5rem', maxHeight: '400px', overflowY: 'auto' }}>
              {settings.quantities.map(qty => (
                <div 
                  key={qty.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem',
                    background: qty.isActive ? '#f8fafc' : '#f1f5f9',
                    borderRadius: '0.375rem',
                    border: qty.isActive ? '1px solid #e2e8f0' : '1px solid #cbd5e1'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <button
                      className="btn btn-sm"
                      style={{
                        background: qty.isActive ? '#22c55e' : '#94a3b8',
                        color: 'white',
                        minWidth: '60px'
                      }}
                      onClick={() => toggleQuantityActive(qty.id)}
                    >
                      {qty.isActive ? 'Active' : 'Inactive'}
                    </button>
                    <div>
                      <strong>{qty.display}</strong>
                      <span style={{ marginLeft: '0.5rem', color: '#64748b' }}>
                        (types: &quot;{qty.pattern}&quot; = {qty.value} {qty.unit})
                      </span>
                    </div>
                  </div>
                  <button 
                    className="btn btn-danger btn-sm"
                    onClick={() => removeQuantity(qty.id)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dose Forms Tab */}
        {activeTab === 'doseForms' && (
          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Dose Form Patterns</h3>
            <p style={{ color: '#64748b', marginBottom: '1rem' }}>
              Define dose forms like &quot;pills&quot;, &quot;tab&quot;, &quot;liq&quot;, &quot;drops&quot;, &quot;sachet&quot;, &quot;powder&quot;, &quot;ointment&quot;, etc.
              These will be automatically detected and filled in prescriptions.
            </p>
            
            <div className="form-row" style={{ marginBottom: '1.5rem' }}>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="label">Pattern (what doctor types)</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g., pills, tab, liq, drops"
                  value={newDoseForm.pattern}
                  onChange={(e) => setNewDoseForm(prev => ({ ...prev, pattern: e.target.value }))}
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label className="label">Display Name</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g., Pills, Tablet, Liquid, Drops"
                  value={newDoseForm.display}
                  onChange={(e) => setNewDoseForm(prev => ({ ...prev, display: e.target.value }))}
                />
              </div>
              <div className="form-group" style={{ alignSelf: 'flex-end' }}>
                <button className="btn btn-primary" onClick={addDoseForm}>Add</button>
              </div>
            </div>

            <div style={{ display: 'grid', gap: '0.5rem', maxHeight: '400px', overflowY: 'auto' }}>
              {settings.doseForms.map(form => (
                <div 
                  key={form.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem',
                    background: form.isActive ? '#f8fafc' : '#f1f5f9',
                    borderRadius: '0.375rem',
                    border: form.isActive ? '1px solid #e2e8f0' : '1px solid #cbd5e1'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <button
                      className="btn btn-sm"
                      style={{
                        background: form.isActive ? '#22c55e' : '#94a3b8',
                        color: 'white',
                        minWidth: '60px'
                      }}
                      onClick={() => toggleDoseFormActive(form.id)}
                    >
                      {form.isActive ? 'Active' : 'Inactive'}
                    </button>
                    <div>
                      <strong>{form.display}</strong>
                      <span style={{ marginLeft: '0.5rem', color: '#64748b' }}>
                        (types: &quot;{form.pattern}&quot;)
                      </span>
                    </div>
                  </div>
                  <button 
                    className="btn btn-danger btn-sm"
                    onClick={() => removeDoseForm(form.id)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dose Patterns Tab */}
        {activeTab === 'dosePatterns' && (
          <div className="card">
            <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Dose Pattern Rules</h3>
            <p style={{ color: '#64748b', marginBottom: '1rem' }}>
              Define dose patterns like &quot;OD&quot;, &quot;BD&quot;, &quot;TDS&quot;, &quot;QID&quot;, &quot;SOS&quot;, &quot;HS&quot;, etc.
              These will be automatically converted to dosage patterns.
            </p>
            
            <div className="form-row" style={{ marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <div className="form-group" style={{ flex: '0 0 200px' }}>
                <label className="label">Pattern (what doctor types)</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g., od, bd, tds, qid"
                  value={newDosePattern.pattern}
                  onChange={(e) => setNewDosePattern(prev => ({ ...prev, pattern: e.target.value }))}
                />
              </div>
              <div className="form-group" style={{ flex: '0 0 200px' }}>
                <label className="label">Display Name</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g., Once a Day (OD)"
                  value={newDosePattern.display}
                  onChange={(e) => setNewDosePattern(prev => ({ ...prev, display: e.target.value }))}
                />
              </div>
              <div className="form-group" style={{ flex: '0 0 100px' }}>
                <label className="label">Times/Day</label>
                <select
                  className="input"
                  value={newDosePattern.timesPerDay}
                  onChange={(e) => setNewDosePattern(prev => ({ ...prev, timesPerDay: e.target.value }))}
                >
                  <option value="0">As needed</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                </select>
              </div>
              <div className="form-group" style={{ flex: '0 0 150px' }}>
                <label className="label">Default Dosage</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g., 1-0-0, 2-2-2"
                  value={newDosePattern.defaultDosage}
                  onChange={(e) => setNewDosePattern(prev => ({ ...prev, defaultDosage: e.target.value }))}
                />
              </div>
              <div className="form-group" style={{ alignSelf: 'flex-end' }}>
                <button className="btn btn-primary" onClick={addDosePattern}>Add</button>
              </div>
            </div>

            <div style={{ display: 'grid', gap: '0.5rem', maxHeight: '400px', overflowY: 'auto' }}>
              {settings.dosePatterns.map(pattern => (
                <div 
                  key={pattern.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.75rem',
                    background: pattern.isActive ? '#f8fafc' : '#f1f5f9',
                    borderRadius: '0.375rem',
                    border: pattern.isActive ? '1px solid #e2e8f0' : '1px solid #cbd5e1'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <button
                      className="btn btn-sm"
                      style={{
                        background: pattern.isActive ? '#22c55e' : '#94a3b8',
                        color: 'white',
                        minWidth: '60px'
                      }}
                      onClick={() => toggleDosePatternActive(pattern.id)}
                    >
                      {pattern.isActive ? 'Active' : 'Inactive'}
                    </button>
                    <div>
                      <strong>{pattern.display}</strong>
                      <span style={{ marginLeft: '0.5rem', color: '#64748b' }}>
                        (types: &quot;{pattern.pattern}&quot; → {pattern.defaultDosage})
                      </span>
                    </div>
                  </div>
                  <button 
                    className="btn btn-danger btn-sm"
                    onClick={() => removeDosePattern(pattern.id)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
