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

export interface OperationalMetric {
  id: string;
  name: string;
  current_value: string;
  target_value: string;
  trend: 'UP' | 'DOWN' | 'STABLE' | 'WARNING';
  unit: string;
  category: 'FINANCIAL' | 'OPERATIONAL' | 'COMPLIANCE' | 'CUSTOMER';
  financial_impact_annual: number;
}

export interface StrategicGoal {
  id: string;
  title: string;
  target_quarter: string;
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  owner_department: string;
  target_roi_multiple: number;
  description: string;
}

export interface CompanyProfile {
  id: string;
  name: string;
  tagline: string;
  industry: string;
  annual_revenue: number;
  currency: string;
  headcount: number;
  headquarters: string;
  description: string;
  departments: string[];
  active_metrics: OperationalMetric[];
  strategic_goals: StrategicGoal[];
  entity_ontology: string[];
  relation_ontology: string[];
}

export interface CompanyPresetSummary {
  id: string;
  name: string;
  industry: string;
  tagline: string;
  description: string;
  node_count_estimate: number;
  evidence_count_estimate: number;
}

export interface RoadmapPhaseItem {
  id: string;
  title: string;
  owner: string;
  estimated_weeks: number;
  estimated_impact: string;
  status: string;
  action_items: string[];
}

export interface RoadmapPhase {
  phase_name: string;
  focus_area: string;
  target_window: string;
  projected_savings: number;
  initiatives: RoadmapPhaseItem[];
}

export interface AuditFinding {
  id: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  category: string;
  title: string;
  description: string;
  annual_financial_exposure: number;
  affected_entities: string[];
  recommended_action: string;
}

export interface EnterpriseAuditResult {
  company_id: string;
  company_name: string;
  overall_health_score: number;
  efficiency_index: number;
  total_financial_leakage: number;
  critical_risks_count: number;
  findings: AuditFinding[];
  audit_date: string;
}

export interface StrategicBusinessPlan {
  company_id: string;
  company_name: string;
  industry: string;
  plan_title: string;
  executive_summary: string;
  current_posture_assessment: string;
  swot_analysis: Record<string, string[]>;
  causal_diagnosis: Array<{
    root_driver: string;
    category: string;
    annual_financial_exposure: number;
    attribution_pct: number;
    affected_nodes: string[];
    mitigation: string;
  }>;
  strategic_objectives: Array<{
    objective: string;
    target_quarter: string;
    priority: string;
    department: string;
    roi_multiple: string;
    description: string;
  }>;
  execution_roadmap: RoadmapPhase[];
  projected_financial_impact: {
    annual_revenue_baseline: number;
    total_leakage_identified: number;
    total_projected_annual_recovery: number;
    net_margin_expansion_bps: number;
    implementation_cost_estimate: number;
    net_roi_multiple: number;
    payback_period_months: number;
  };
  governance_and_risks: Array<{ risk: string; mitigation: string }>;
  source_evidence_citations: string[];
}

