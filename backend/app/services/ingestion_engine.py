import uuid
import re
from typing import Dict, Any, List, Set, Tuple
from app.models.schemas import (
    DocumentIngestionRequest, IngestionResponse, EntityNode, RelationEdge, EvidenceItem
)
from app.services.graph_service import graph_service
from app.services.vector_service import vector_service
from app.services.preset_manager import preset_manager

class UniversalIngestionEngine:
    """
    Generalized Enterprise Ingestion & Dynamic Entity Linker.
    Ingests any document (Invoices, SLAs, Internal Comms, Incident Reports, Audits),
    extracts entities and relationships using ontology-driven pattern analysis and graph resolution,
    and dynamically connects them into the multi-relational Knowledge Graph.
    """

    def ingest_document(self, req: DocumentIngestionRequest) -> IngestionResponse:
        doc_id = f"doc_{uuid.uuid4().hex[:8]}"
        content = req.content
        title = req.title
        doc_type = req.doc_type.lower()
        company = preset_manager.get_active_profile()

        extracted_nodes: List[EntityNode] = []
        extracted_edges: List[RelationEdge] = []

        # 1. Extract dynamic entities from text
        discovered_entities = self._extract_dynamic_entities(content, title, doc_type, company.entity_ontology)

        # 2. Create the document entity itself in the graph
        doc_node = EntityNode(
            id=doc_id,
            label=f"[{doc_type.upper()}] {title[:28]}",
            type=doc_type,
            properties={
                "title": title,
                "source": req.source,
                "content_preview": content[:240],
                "financial_amounts": discovered_entities.get("amounts", []),
                "reference_codes": discovered_entities.get("ref_codes", []),
                "metadata": req.metadata
            },
            summary=f"Ingested {doc_type}: '{title}' from source '{req.source}' with {len(discovered_entities.get('ref_codes', []))} ref markers."
        )
        extracted_nodes.append(doc_node)
        graph_service.add_entity(doc_node)

        # 3. Dynamic Entity Resolution: match against existing graph nodes
        existing_nodes = graph_service.get_all_nodes()
        existing_labels = {n.id: (n.label.lower(), n.type.lower()) for n in existing_nodes}

        linked_target_ids: Set[str] = set()

        # Match existing entities by name or token overlap
        content_lower = content.lower()
        for nid, (nlabel, ntype) in existing_labels.items():
            if nid == doc_id:
                continue
            # Extract simple name tokens from label
            clean_label = re.sub(r'\[.*?\]', '', nlabel).strip()
            if len(clean_label) > 3 and clean_label in content_lower:
                linked_target_ids.add(nid)

        # Match ref codes (e.g. PO-8841, INC-802, HR-POL-401, INV-8921)
        for code in discovered_entities.get("ref_codes", []):
            code_lower = code.lower().replace("-", "_")
            for nid in existing_labels.keys():
                if code_lower in nid.lower():
                    linked_target_ids.add(nid)

        # 4. Infer and generate dynamic relational edges
        for target_id in linked_target_ids:
            relation_type = self._infer_relation(doc_type, existing_labels[target_id][1], content_lower)
            edge_id = f"{doc_id}->{target_id}:{relation_type}"
            
            edge = RelationEdge(
                id=edge_id,
                source=doc_id,
                target=target_id,
                relation=relation_type,
                weight=1.35,
                properties={"source": req.source, "inferred_by": "dynamic_ontology_engine"}
            )
            extracted_edges.append(edge)
            graph_service.graph.add_edge(doc_id, target_id, relation=relation_type, weight=1.35)

        # 5. Extract newly discovered sub-entities (e.g. New Vendor, Customer, or Incident mentioned)
        for org in discovered_entities.get("organizations", []):
            org_id = f"ent_{re.sub(r'[^a-zA-Z0-9]', '_', org.lower())[:20]}"
            if org_id not in graph_service.graph:
                new_ent_node = EntityNode(
                    id=org_id,
                    label=org,
                    type="organization",
                    properties={"extracted_from": doc_id},
                    summary=f"Organization '{org}' identified during ingestion of {title}."
                )
                graph_service.add_entity(new_ent_node)
                extracted_nodes.append(new_ent_node)

                # Link doc to organization
                edge = RelationEdge(
                    id=f"{doc_id}->{org_id}:MENTIONS",
                    source=doc_id,
                    target=org_id,
                    relation="MENTIONS",
                    weight=1.2,
                    properties={"source": req.source}
                )
                extracted_edges.append(edge)
                graph_service.graph.add_edge(doc_id, org_id, relation="MENTIONS", weight=1.2)

        # 6. Index into Vector Store
        evidence_item = EvidenceItem(
            id=doc_id,
            type=doc_type,
            title=title,
            source_ref=req.source,
            snippet=content[:260] + ("..." if len(content) > 260 else ""),
            full_content=f"Document: {title}\nSource: {req.source}\nType: {doc_type}\n\n{content}",
            date=req.metadata.get("date", "2026-09-17"),
            metadata=req.metadata,
            relevance_score=0.98
        )
        vector_service.add_document(evidence_item)

        return IngestionResponse(
            status="SUCCESS",
            doc_id=doc_id,
            extracted_nodes=extracted_nodes,
            extracted_edges=extracted_edges,
            message=f"Successfully ingested '{title}'. Dynamically linked to {len(extracted_edges)} existing enterprise entities."
        )

    def _extract_dynamic_entities(self, content: str, title: str, doc_type: str, ontology: List[str]) -> Dict[str, Any]:
        """
        Heuristic / regex entity extractor that identifies codes, amounts, organizations, and terms.
        """
        results: Dict[str, Any] = {
            "ref_codes": [],
            "amounts": [],
            "organizations": []
        }

        # Reference codes like INV-8921, PO-8841, INC-802, HR-POL-401, MSA-2025
        codes = set(re.findall(r'\b[A-Z]{2,5}[-_][0-9]{3,6}(?:[-_][A-Z0-9]+)?\b', content + " " + title))
        results["ref_codes"] = list(codes)

        # Currency amounts ($1,240.00, $500k, $1.2M)
        amounts = re.findall(r'\$[\d,]+(?:\.\d+)?(?:\s*(?:k|m|million|thousand))?', content, flags=re.IGNORECASE)
        results["amounts"] = list(set(amounts))[:10]

        # Vendor / Company name extraction patterns (Inc., LLC, Corp, Freight, Systems, Logistics, Technologies)
        org_matches = set(re.findall(r'\b([A-Z][a-zA-Z0-9]+(?:\s+[A-Z][a-zA-Z0-9]+)?\s+(?:Inc\.?|LLC|Corp\.?|Logistics|Systems|Freight|Technologies|Textiles|Services|Brands))\b', content))
        results["organizations"] = list(org_matches)[:5]

        return results

    def _infer_relation(self, source_type: str, target_type: str, content: str) -> str:
        """
        Ontological relationship inference between document and target entity.
        """
        st = source_type.lower()
        tt = target_type.lower()

        if "incident" in st or "incident" in tt:
            return "DISRUPTS"
        if "contract" in st or "policy" in st:
            return "GOVERNS"
        if "invoice" in st:
            return "BILLED_TO" if "customer" in tt else "BILLED_FOR"
        if any(w in content for w in ["breach", "penalty", "violat"]):
            return "VIOLATES_SLA"
        if any(w in content for w in ["delay", "congestion", "outage", "bottleneck"]):
            return "IMPACTS"
        if "customer" in tt or "carrier" in tt or "supplier" in tt:
            return "ASSOCIATED_WITH"
        return "CONNECTS_TO"

ingestion_engine = UniversalIngestionEngine()
