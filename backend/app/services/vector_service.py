import math
import re
from typing import List, Dict, Any, Optional
from app.models.schemas import EvidenceItem
from data.seed.seed_data import SEED_DATA

class VectorEvidenceService:
    """
    Hybrid semantic & textual retrieval service for enterprise evidence trail.
    Indexes documents across HR Policies, Finance Procedures, Contracts,
    Vendor Emails, Invoices, and Operational Incidents.
    """
    def __init__(self):
        self.documents: Dict[str, EvidenceItem] = {}
        self._build_seed_evidence_index()

    def _tokenize(self, text: str) -> List[str]:
        return [w.lower() for w in re.findall(r'\b[A-Za-z0-9_-]+\b', text) if len(w) > 2]

    def _build_seed_evidence_index(self):
        data = SEED_DATA
        
        # 1. HR Policies
        for pol in data.get("hr_policies", []):
            full_clauses = "\n\n".join([f"Section {c['section']} ({c['title']}):\n{c['text']}" for c in pol.get("clauses", [])])
            self.documents[pol["id"]] = EvidenceItem(
                id=pol["id"],
                type="hr_policy",
                title=f"Policy: {pol['title']}",
                source_ref=pol["doc_ref"],
                snippet=pol["summary"],
                full_content=f"Document: {pol['title']} ({pol['doc_ref']})\nCategory: {pol['category']}\n\nSummary:\n{pol['summary']}\n\nDetailed Clauses:\n{full_clauses}",
                date="2026-01-01",
                metadata={"category": pol["category"], "doc_ref": pol["doc_ref"]},
                relevance_score=0.97
            )

        # 2. Finance Policies
        for pol in data.get("finance_policies", []):
            full_clauses = "\n\n".join([f"Section {c['section']} ({c['title']}):\n{c['text']}" for c in pol.get("clauses", [])])
            self.documents[pol["id"]] = EvidenceItem(
                id=pol["id"],
                type="finance_policy",
                title=f"Finance Guideline: {pol['title']}",
                source_ref=pol["doc_ref"],
                snippet=pol["summary"],
                full_content=f"Document: {pol['title']} ({pol['doc_ref']})\nCategory: {pol['category']}\n\nSummary:\n{pol['summary']}\n\nDetailed Provisions:\n{full_clauses}",
                date="2026-01-01",
                metadata={"category": pol["category"], "doc_ref": pol["doc_ref"]},
                relevance_score=0.96
            )

        # 3. Emails
        for email in data.get("emails", []):
            self.documents[email["id"]] = EvidenceItem(
                id=email["id"],
                type="email",
                title=f"Email: {email['subject']}",
                source_ref=email["doc_ref"],
                snippet=email["content"][:220] + "...",
                full_content=f"Date: {email['date']}\nFrom: {email['sender']}\nTo: {email['recipient']}\nSubject: {email['subject']}\n\n{email['content']}",
                date=email["date"],
                metadata={"carrier_id": email.get("carrier_id"), "flags": email.get("flags", [])},
                relevance_score=0.95
            )

        # 4. Invoices
        for inv in data.get("invoices", []):
            items_str = "\n".join([f" - {it['description']}: ${it['amount']:,.2f} ({it.get('flag', 'OK')})" for it in inv["line_items"]])
            self.documents[inv["id"]] = EvidenceItem(
                id=inv["id"],
                type="invoice",
                title=f"Invoice {inv['doc_ref']} - {inv['carrier_name']}",
                source_ref=inv["doc_ref"],
                snippet=f"Total: ${inv['total_amount']:,.2f} | Base: ${inv['base_freight']:,.2f} | Fuel: ${inv['fuel_surcharge']:,.2f} | Accessorial: ${inv['congestion_accessorial']:,.2f}",
                full_content=f"Invoice ID: {inv['doc_ref']}\nCarrier: {inv['carrier_name']}\nDate: {inv['invoice_date']}\nDue: {inv['due_date']}\nStatus: {inv['status']}\n\nLine Items:\n{items_str}\n\nTotal: ${inv['total_amount']:,.2f}",
                date=inv["invoice_date"],
                metadata={"carrier_id": inv["carrier_id"], "amount": inv["total_amount"], "status": inv["status"]},
                relevance_score=0.92
            )

        # 5. Contracts
        for contract in data.get("contracts", []):
            for clause in contract["clauses"]:
                clause_id = f"{contract['id']}_cl_{clause['clause_num'].replace('.', '_')}"
                self.documents[clause_id] = EvidenceItem(
                    id=clause_id,
                    type="contract",
                    title=f"{contract['doc_ref']} Clause {clause['clause_num']}: {clause['title']}",
                    source_ref=f"{contract['doc_ref']} §{clause['clause_num']}",
                    snippet=clause["text"][:240] + "...",
                    full_content=f"Document: {contract['title']} ({contract['doc_ref']})\nClause {clause['clause_num']}: {clause['title']}\nEffective: {contract['effective_date']}\n\n{clause['text']}",
                    date=contract["effective_date"],
                    metadata={"carrier_id": contract["carrier_id"], "clause_num": clause["clause_num"]},
                    relevance_score=0.96
                )

        # 6. Incidents
        for inc in data.get("incidents", []):
            self.documents[inc["id"]] = EvidenceItem(
                id=inc["id"],
                type="incident",
                title=f"Disruption Event: {inc['title']}",
                source_ref=f"LOG-{inc['id'].upper()}",
                snippet=inc["impact"],
                full_content=f"Date: {inc['date']}\nLocation: {inc['location']}\nSeverity: {inc['severity']}\n\nSummary:\n{inc['description']}\n\nOperational Impact:\n{inc['impact']}",
                date=inc["date"],
                metadata={"severity": inc["severity"], "location": inc["location"]},
                relevance_score=0.90
            )

    def search_evidence(self, query: str, top_k: int = 5) -> List[EvidenceItem]:
        query_tokens = set(self._tokenize(query))
        if not query_tokens:
            return []

        scored_results = []
        for doc in self.documents.values():
            doc_text = f"{doc.title} {doc.source_ref} {doc.snippet} {doc.full_content or ''}".lower()
            doc_tokens = self._tokenize(doc_text)
            
            score = 0.0
            matched = 0
            for qt in query_tokens:
                count = doc_tokens.count(qt)
                if count > 0:
                    matched += 1
                    tf = math.log(1 + count)
                    score += tf * 2.0
                    if qt in doc.title.lower():
                        score += 4.0
            
            if matched > 0:
                coverage = matched / len(query_tokens)
                final_score = (score * 0.7) + (coverage * 3.0)
                scored_results.append((final_score, doc))

        scored_results.sort(key=lambda x: x[0], reverse=True)
        return [doc for _, doc in scored_results[:top_k]]

    def get_by_id(self, doc_id: str) -> Optional[EvidenceItem]:
        return self.documents.get(doc_id)

    def add_document(self, item: EvidenceItem):
        self.documents[item.id] = item

vector_service = VectorEvidenceService()
