import uuid
import re
from typing import Dict, Any, List
from app.models.schemas import (
    DocumentIngestionRequest, IngestionResponse, EntityNode, RelationEdge, EvidenceItem
)
from app.services.graph_service import graph_service
from app.services.vector_service import vector_service

class IngestionEngine:
    """
    Ingestion & Structuring Engine.
    Parses unstructured & semi-structured enterprise inputs (emails, invoices, SOPs, ERP records),
    extracts entities and relational edges, and dynamically attaches them to the Company Brain.
    """

    def ingest_document(self, req: DocumentIngestionRequest) -> IngestionResponse:
        doc_id = f"doc_{uuid.uuid4().hex[:8]}"
        content = req.content
        title = req.title
        doc_type = req.doc_type.lower()

        extracted_nodes: List[EntityNode] = []
        extracted_edges: List[RelationEdge] = []

        # 1. Detect Carrier Mentions
        matched_carriers = []
        if "apex" in content.lower():
            matched_carriers.append("carrier_apex")
        if "swift" in content.lower():
            matched_carriers.append("carrier_swift")
        if "nordic" in content.lower():
            matched_carriers.append("carrier_nordic")

        # 2. Detect Route Mentions
        matched_routes = []
        if "101" in content or "northeast" in content.lower() or "newark" in content.lower():
            matched_routes.append("route_ne_101")
        if "202" in content or "midwest" in content.lower() or "chicago" in content.lower():
            matched_routes.append("route_mw_202")
        if "303" in content or "southeast" in content.lower() or "savannah" in content.lower():
            matched_routes.append("route_so_303")

        # 3. Create Main Entity Node
        node = EntityNode(
            id=doc_id,
            label=f"[{doc_type.upper()}] {title[:25]}",
            type=doc_type,
            properties={
                "title": title,
                "source": req.source,
                "content_preview": content[:200],
                "metadata": req.metadata
            },
            summary=f"Ingested {doc_type}: '{title}' from source '{req.source}'"
        )
        extracted_nodes.append(node)
        graph_service.add_entity(node)

        # 4. Create Edges
        for carrier_id in matched_carriers:
            edge = RelationEdge(
                id=f"{carrier_id}->{doc_id}:ASSOCIATED_WITH",
                source=carrier_id,
                target=doc_id,
                relation="ASSOCIATED_WITH",
                weight=1.2,
                properties={"source": req.source}
            )
            extracted_edges.append(edge)
            graph_service.graph.add_edge(carrier_id, doc_id, relation="ASSOCIATED_WITH", weight=1.2)

        for route_id in matched_routes:
            edge = RelationEdge(
                id=f"{doc_id}->{route_id}:IMPACTS_ROUTE",
                source=doc_id,
                target=route_id,
                relation="IMPACTS_ROUTE",
                weight=1.3,
                properties={"source": req.source}
            )
            extracted_edges.append(edge)
            graph_service.graph.add_edge(doc_id, route_id, relation="IMPACTS_ROUTE", weight=1.3)

        # 5. Index into Vector Store
        evidence_item = EvidenceItem(
            id=doc_id,
            type=doc_type,
            title=title,
            source_ref=req.source,
            snippet=content[:240] + ("..." if len(content) > 240 else ""),
            full_content=f"Document: {title}\nSource: {req.source}\nType: {doc_type}\n\n{content}",
            date=req.metadata.get("date", "2026-09-16"),
            metadata=req.metadata,
            relevance_score=0.98
        )
        vector_service.add_document(evidence_item)

        return IngestionResponse(
            status="SUCCESS",
            doc_id=doc_id,
            extracted_nodes=extracted_nodes,
            extracted_edges=extracted_edges,
            message=f"Successfully ingested '{title}'. Linked to {len(matched_carriers)} carriers and {len(matched_routes)} routes in the Knowledge Graph."
        )

ingestion_engine = IngestionEngine()
