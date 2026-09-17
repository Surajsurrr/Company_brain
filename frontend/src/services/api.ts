import { GraphData, QueryResponse, EvidenceItem, DocumentIngestionRequest, IngestionResponse } from '../types';

const API_BASE = 'http://localhost:8000/api';

export async function fetchKnowledgeGraph(): Promise<GraphData> {
  const res = await fetch(`${API_BASE}/graph`);
  if (!res.ok) throw new Error('Failed to fetch knowledge graph');
  return res.json();
}

export async function fetchGraphStats(): Promise<any> {
  const res = await fetch(`${API_BASE}/graph/stats`);
  if (!res.ok) throw new Error('Failed to fetch graph stats');
  return res.json();
}

export async function executeQuery(query: string): Promise<QueryResponse> {
  const res = await fetch(`${API_BASE}/query`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query })
  });
  if (!res.ok) throw new Error('Failed to execute reasoning query');
  return res.json();
}

export async function fetchSampleQueries(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/sample-queries`);
  if (!res.ok) throw new Error('Failed to fetch sample queries');
  return res.json();
}

export async function fetchEvidenceItem(id: string): Promise<EvidenceItem> {
  const res = await fetch(`${API_BASE}/evidence/${id}`);
  if (!res.ok) throw new Error('Failed to fetch evidence document');
  return res.json();
}

export async function fetchEvidenceList(): Promise<EvidenceItem[]> {
  const res = await fetch(`${API_BASE}/evidence`);
  if (!res.ok) throw new Error('Failed to fetch evidence list');
  return res.json();
}

export async function ingestDocument(req: DocumentIngestionRequest): Promise<IngestionResponse> {
  const res = await fetch(`${API_BASE}/ingest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req)
  });
  if (!res.ok) throw new Error('Failed to ingest document');
  return res.json();
}

export async function fetchCompanyPresets(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/company/presets`);
  if (!res.ok) throw new Error('Failed to fetch company presets');
  return res.json();
}

export async function switchCompanyPreset(presetId: string): Promise<any> {
  const res = await fetch(`${API_BASE}/company/switch-preset`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ preset_id: presetId })
  });
  if (!res.ok) throw new Error('Failed to switch company preset');
  return res.json();
}

export async function fetchCompanyProfile(): Promise<any> {
  const res = await fetch(`${API_BASE}/company/profile`);
  if (!res.ok) throw new Error('Failed to fetch company profile');
  return res.json();
}

export async function runDiagnosticAudit(): Promise<any> {
  const res = await fetch(`${API_BASE}/consultancy/audit`);
  if (!res.ok) throw new Error('Failed to run diagnostic audit');
  return res.json();
}

export async function generateStrategicBusinessPlan(): Promise<any> {
  const res = await fetch(`${API_BASE}/consultancy/business-plan`);
  if (!res.ok) throw new Error('Failed to generate strategic business plan');
  return res.json();
}

