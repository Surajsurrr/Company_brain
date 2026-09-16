import networkx as nx
from typing import List, Dict, Any, Optional
from app.models.schemas import EntityNode, RelationEdge, GraphData
from data.seed.seed_data import SEED_DATA

class GraphService:
    def __init__(self):
        self.graph = nx.DiGraph()
        self._initialize_seed_graph()

    def _initialize_seed_graph(self):
        """Build initial knowledge graph from seed enterprise data."""
        data = SEED_DATA
        
        # 1. Add Leadership & Departments
        for leader in data.get("leadership", []):
            leader_id = f"leader_{leader['name'].lower().replace(' ', '_')}"
            self.graph.add_node(
                leader_id,
                label=leader["name"],
                type="person",
                properties=leader,
                summary=f"{leader['title']} - {leader['department']}"
            )

        # 2. Add HR Policies
        for pol in data.get("hr_policies", []):
            self.graph.add_node(
                pol["id"],
                label=pol["title"],
                type="policy",
                properties=pol,
                summary=pol["summary"]
            )
            # Link to HR leader
            self.graph.add_edge("leader_priya_sharma", pol["id"], relation="GOVERNS_POLICY", weight=1.0)

        # 3. Add Finance Policies
        for pol in data.get("finance_policies", []):
            self.graph.add_node(
                pol["id"],
                label=pol["title"],
                type="policy",
                properties=pol,
                summary=pol["summary"]
            )
            self.graph.add_edge("leader_marcus_sterling", pol["id"], relation="GOVERNS_POLICY", weight=1.0)

        # 4. Add Carriers
        for carrier in data.get("carriers", []):
            self.graph.add_node(
                carrier["id"],
                label=carrier["name"],
                type="carrier",
                properties=carrier,
                summary=f"{carrier['name']} ({carrier['tier']}) - On-Time: {carrier['on_time_rate']}, Spend: ${carrier['total_spend_q3']:,}"
            )
            self.graph.add_edge("leader_elena_ramos", carrier["id"], relation="MANAGES_SUPPLIER", weight=1.0)
            
        # 5. Add Contracts
        for contract in data.get("contracts", []):
            self.graph.add_node(
                contract["id"],
                label=f"{contract['doc_ref']}: {contract['title'][:25]}...",
                type="contract",
                properties=contract,
                summary=f"Contract {contract['doc_ref']} with {len(contract['clauses'])} governance clauses"
            )
            self.graph.add_edge(
                contract["carrier_id"],
                contract["id"],
                relation="GOVERNED_BY",
                weight=1.0,
                properties={"effective": contract["effective_date"]}
            )

        # 6. Add Routes
        for route in data.get("routes", []):
            self.graph.add_node(
                route["id"],
                label=route["name"],
                type="route",
                properties=route,
                summary=f"{route['origin']} -> {route['destination']} ({route['miles']} mi)"
            )
            self.graph.add_edge(
                route["primary_carrier_id"],
                route["id"],
                relation="OPERATES_ROUTE",
                weight=1.0,
                properties={"risk": route["risk_level"]}
            )

        # 7. Add Incidents
        for inc in data.get("incidents", []):
            self.graph.add_node(
                inc["id"],
                label=inc["title"][:32] + "...",
                type="incident",
                properties=inc,
                summary=f"[{inc['severity']}] {inc['title']} ({inc['date']})"
            )
            for route_id in inc.get("affected_route_ids", []):
                self.graph.add_edge(inc["id"], route_id, relation="DISRUPTED_ROUTE", weight=1.5)
            for carrier_id in inc.get("affected_carrier_ids", []):
                self.graph.add_edge(inc["id"], carrier_id, relation="IMPACTED_CARRIER", weight=1.2)

        # 8. Add Emails
        for email in data.get("emails", []):
            self.graph.add_node(
                email["id"],
                label=f"{email['doc_ref']}: {email['subject'][:28]}...",
                type="email",
                properties=email,
                summary=f"Email from {email['sender']} on {email['date']}"
            )
            if email.get("carrier_id"):
                self.graph.add_edge(email["carrier_id"], email["id"], relation="SENT_COMMUNICATION", weight=1.0)

        # 9. Add Invoices
        for inv in data.get("invoices", []):
            self.graph.add_node(
                inv["id"],
                label=f"{inv['doc_ref']} (${inv['total_amount']:,.0f})",
                type="invoice",
                properties=inv,
                summary=f"Invoice {inv['doc_ref']} for ${inv['total_amount']:,} [{inv['status']}]"
            )
            self.graph.add_edge(inv["carrier_id"], inv["id"], relation="ISSUED_INVOICE", weight=1.0)
            for email_id in inv.get("linked_email_ids", []):
                self.graph.add_edge(email_id, inv["id"], relation="CITES_TRANSACTION", weight=1.4)
            if "DISPUTED" in inv.get("status", "") or any("VIOLATES" in item.get("flag", "") for item in inv.get("line_items", [])):
                contract_id = f"contract_apex_2025" if "apx" in inv["id"] else None
                if contract_id and self.graph.has_node(contract_id):
                    self.graph.add_edge(inv["id"], contract_id, relation="VIOLATES_TERMS", weight=2.0)

        # 10. Add Shipments
        for shp in data.get("shipments", []):
            self.graph.add_node(
                shp["id"],
                label=f"{shp['tracking_code']} ({shp['status']})",
                type="shipment",
                properties=shp,
                summary=f"Shipment {shp['tracking_code']}: {shp['status']}, Cost: ${shp['freight_cost']}"
            )
            self.graph.add_edge(shp["carrier_id"], shp["id"], relation="TRANSPORTED_BY", weight=1.0)
            self.graph.add_edge(shp["id"], shp["route_id"], relation="TRANSITED_ON", weight=1.0)
            self.graph.add_edge(shp["id"], shp["invoice_id"], relation="BILLED_ON", weight=1.0)
            if shp.get("sla_breach"):
                contract_id = f"contract_apex_2025" if "apx" in shp["id"] else None
                if contract_id and self.graph.has_node(contract_id):
                    self.graph.add_edge(shp["id"], contract_id, relation="BREACHED_SLA", weight=1.8)

    def get_full_graph(self) -> GraphData:
        nodes = []
        for node_id, data in self.graph.nodes(data=True):
            nodes.append(EntityNode(
                id=node_id,
                label=data.get("label", node_id),
                type=data.get("type", "unknown"),
                properties=data.get("properties", {}),
                summary=data.get("summary")
            ))
        edges = []
        for u, v, data in self.graph.edges(data=True):
            edges.append(RelationEdge(
                id=f"{u}->{v}:{data.get('relation', 'CONNECTED')}",
                source=u,
                target=v,
                relation=data.get("relation", "CONNECTED"),
                weight=data.get("weight", 1.0),
                properties=data.get("properties", {})
            ))
        return GraphData(nodes=nodes, edges=edges)

    def get_subgraph(self, node_ids: List[str], include_neighbors: bool = True) -> GraphData:
        target_nodes = set(node_ids)
        if include_neighbors:
            for n in node_ids:
                if self.graph.has_node(n):
                    target_nodes.update(self.graph.predecessors(n))
                    target_nodes.update(self.graph.successors(n))
        
        sub = self.graph.subgraph(target_nodes)
        nodes = []
        for node_id, data in sub.nodes(data=True):
            nodes.append(EntityNode(
                id=node_id,
                label=data.get("label", node_id),
                type=data.get("type", "unknown"),
                properties=data.get("properties", {}),
                summary=data.get("summary")
            ))
        edges = []
        for u, v, data in sub.edges(data=True):
            edges.append(RelationEdge(
                id=f"{u}->{v}:{data.get('relation', 'CONNECTED')}",
                source=u,
                target=v,
                relation=data.get("relation", "CONNECTED"),
                weight=data.get("weight", 1.0),
                properties=data.get("properties", {})
            ))
        return GraphData(nodes=nodes, edges=edges)

    def add_entity(self, node: EntityNode, connected_to: Optional[List[Dict[str, Any]]] = None):
        self.graph.add_node(
            node.id,
            label=node.label,
            type=node.type,
            properties=node.properties,
            summary=node.summary
        )
        if connected_to:
            for conn in connected_to:
                target = conn.get("target")
                relation = conn.get("relation", "RELATED_TO")
                if target and self.graph.has_node(target):
                    self.graph.add_edge(node.id, target, relation=relation, weight=1.0)

    def search_entities(self, query: str) -> List[EntityNode]:
        q = query.lower()
        results = []
        for node_id, data in self.graph.nodes(data=True):
            label = data.get("label", "").lower()
            summary = (data.get("summary") or "").lower()
            props_str = str(data.get("properties", {})).lower()
            if q in label or q in summary or q in props_str:
                results.append(EntityNode(
                    id=node_id,
                    label=data.get("label", node_id),
                    type=data.get("type", "unknown"),
                    properties=data.get("properties", {}),
                    summary=data.get("summary")
                ))
        return results

graph_service = GraphService()
