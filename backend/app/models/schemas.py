from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class EntityNode(BaseModel):
    id: str
    label: str
    type: str  # 'carrier', 'invoice', 'shipment', 'email', 'contract', 'incident', 'route', 'facility'
    properties: Dict[str, Any] = Field(default_factory=dict)
    summary: Optional[str] = None

class RelationEdge(BaseModel):
    id: Optional[str] = None
    source: str
    target: str
    relation: str  # 'SHIPPED_BY', 'BILLED_BY', 'IMPACTED_BY', 'CITED_IN', 'TRIGGERED_BY', 'GOVERNED_BY', etc.
    weight: float = 1.0
    properties: Dict[str, Any] = Field(default_factory=dict)

class GraphData(BaseModel):
    nodes: List[EntityNode]
    edges: List[RelationEdge]

class EvidenceItem(BaseModel):
    id: str
    type: str  # 'email', 'invoice', 'contract', 'shipment_log', 'incident_report'
    title: str
    source_ref: str
    snippet: str
    full_content: Optional[str] = None
    date: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)
    relevance_score: float = 0.95

class CausalFactor(BaseModel):
    factor: str
    attribution_percentage: float
    financial_impact: float
    description: str
    evidence_ids: List[str]
    affected_entity_ids: List[str]

class RecommendationItem(BaseModel):
    id: str
    title: str
    priority: str  # 'HIGH', 'MEDIUM', 'LOW'
    action_type: str  # 'RENEGOTIATE', 'REROUTE', 'AUDIT_INVOICE', 'DISPUTE_CHARGE', 'UPDATE_SOP'
    estimated_savings: float
    description: str
    steps: List[str]
    affected_carrier: Optional[str] = None

class ReasoningStep(BaseModel):
    step_num: int
    title: str
    detail: str
    status: str = "completed"  # "pending", "in_progress", "completed"
    entities_discovered: List[str] = Field(default_factory=list)

class QueryRequest(BaseModel):
    query: str
    timeframe: Optional[str] = "Q3-2026"
    focus_entity: Optional[str] = None

class QueryResponse(BaseModel):
    query: str
    executive_summary: str
    detailed_answer: str
    causal_factors: List[CausalFactor]
    recommendations: List[RecommendationItem]
    evidence_trail: List[EvidenceItem]
    highlighted_subgraph: GraphData
    reasoning_steps: List[ReasoningStep]
    financial_metrics: Dict[str, Any]

class DocumentIngestionRequest(BaseModel):
    doc_type: str  # 'email', 'invoice', 'contract', 'incident'
    title: str
    source: str
    content: str
    metadata: Dict[str, Any] = Field(default_factory=dict)

class IngestionResponse(BaseModel):
    status: str
    doc_id: str
    extracted_nodes: List[EntityNode]
    extracted_edges: List[RelationEdge]
    message: str
