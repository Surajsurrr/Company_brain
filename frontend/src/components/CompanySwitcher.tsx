import React, { useState, useEffect } from 'react';
import { CompanyPresetSummary, CompanyProfile } from '../types';
import { fetchCompanyPresets, switchCompanyPreset } from '../services/api';

interface CompanySwitcherProps {
  currentProfile: CompanyProfile | null;
  onPresetSwitched: (newProfile: CompanyProfile) => void;
}

export const CompanySwitcher: React.FC<CompanySwitcherProps> = ({ currentProfile, onPresetSwitched }) => {
  const [presets, setPresets] = useState<CompanyPresetSummary[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCompanyPresets()
      .then(data => setPresets(data))
      .catch(err => console.error("Failed to fetch presets:", err));
  }, []);

  const handleSelect = async (presetId: string) => {
    if (currentProfile && currentProfile.id === presetId) {
      setIsOpen(false);
      return;
    }
    setLoading(true);
    try {
      const updated = await switchCompanyPreset(presetId);
      onPresetSwitched(updated);
      setIsOpen(false);
    } catch (err) {
      console.error("Failed to switch preset:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={loading}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(30, 41, 59, 0.8)',
          border: '1px solid rgba(59, 130, 246, 0.4)',
          borderRadius: '8px',
          padding: '6px 14px',
          color: '#f8fafc',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: 600,
          backdropFilter: 'blur(8px)',
          transition: 'all 0.2s ease',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }}
        title="Switch Company Preset (Client Customization)"
      >
        <span style={{ fontSize: '15px' }}>🏢</span>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: '#60a5fa' }}>
            {currentProfile ? currentProfile.name : "Select Client Preset"}
          </div>
          <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {currentProfile ? currentProfile.industry : "Custom Company"}
          </div>
        </div>
        <span style={{ fontSize: '10px', color: '#94a3b8', marginLeft: '4px' }}>▼</span>
      </button>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 8px)',
            right: 0,
            width: '320px',
            background: '#0f172a',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '10px',
            boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
            zIndex: 1000,
            overflow: 'hidden',
            backdropFilter: 'blur(16px)'
          }}
        >
          <div style={{ padding: '12px 14px', background: 'rgba(30, 41, 59, 0.6)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: '12px', fontWeight: 700, color: '#f8fafc', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Target Company Presets
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>
              Tailor Brain to prospective client industry
            </div>
          </div>

          <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
            {presets.map((preset) => {
              const isSelected = currentProfile?.id === preset.id;
              return (
                <div
                  key={preset.id}
                  onClick={() => handleSelect(preset.id)}
                  style={{
                    padding: '12px 14px',
                    borderBottom: '1px solid rgba(255,255,255,0.04)',
                    cursor: 'pointer',
                    background: isSelected ? 'rgba(59, 130, 246, 0.15)' : 'transparent',
                    borderLeft: isSelected ? '3px solid #3b82f6' : '3px solid transparent',
                    transition: 'all 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ fontSize: '13px', fontWeight: 600, color: isSelected ? '#60a5fa' : '#f1f5f9' }}>
                      {preset.name}
                    </div>
                    <span
                      style={{
                        fontSize: '9px',
                        padding: '2px 6px',
                        borderRadius: '4px',
                        background: 'rgba(59, 130, 246, 0.2)',
                        color: '#93c5fd',
                        fontWeight: 600
                      }}
                    >
                      {preset.industry}
                    </span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '4px', lineHeight: 1.4 }}>
                    {preset.tagline}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
