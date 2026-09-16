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

export async function ingestDocument(req: DocumentIngestionRequest): Promise<IngestionResponse> {
  const res = await fetch(`${API_BASE}/ingest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(req)
  });
  if (!res.ok) throw new Error('Failed to ingest document');
  return res.json();
}
