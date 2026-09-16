export interface EntityNode {
  id: string;
  label: string;
  type: string;
  properties: Record<string, any>;
  summary?: string;
}

export interface RelationEdge {
  id?: string;
  source: string;
  target: string;
  relation: string;
  weight: number;
  properties?: Record<string, any>;
}

export interface GraphData {
  nodes: EntityNode[];
  edges: RelationEdge[];
}

export interface EvidenceItem {
  id: string;
  type: string;
  title: string;
  source_ref: string;
  snippet: string;
  full_content?: string;
  date?: string;
  metadata?: Record<string, any>;
  relevance_score: number;
}

export interface CausalFactor {
  factor: string;
  attribution_percentage: number;
  financial_impact: number;
  description: string;
  evidence_ids: string[];
  affected_entity_ids: string[];
}

export interface RecommendationItem {
  id: string;
  title: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  action_type: string;
  estimated_savings: number;
  description: string;
  steps: string[];
  affected_carrier?: string;
}

export interface ReasoningStep {
  step_num: number;
  title: string;
  detail: string;
  status: 'pending' | 'in_progress' | 'completed';
  entities_discovered: string[];
}

export interface QueryResponse {
  query: string;
  executive_summary: string;
  detailed_answer: string;
  causal_factors: CausalFactor[];
  recommendations: RecommendationItem[];
  evidence_trail: EvidenceItem[];
  highlighted_subgraph: GraphData;
  reasoning_steps: ReasoningStep[];
  financial_metrics: Record<string, any>;
}

export interface DocumentIngestionRequest {
  doc_type: string;
  title: string;
  source: string;
  content: string;
  metadata?: Record<string, any>;
}

export interface IngestionResponse {
  status: string;
  doc_id: string;
  extracted_nodes: EntityNode[];
  extracted_edges: RelationEdge[];
  message: string;
}
