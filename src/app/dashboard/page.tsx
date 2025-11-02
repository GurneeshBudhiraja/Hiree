"use client";
import { useState, useCallback, useEffect, useMemo } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  type NodeChange,
  type EdgeChange,
  type Connection,
  type Node,
  type Edge,
  Background,
  Controls,
  NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useApplicationContext } from "@/providers/application-context-provider";
import { useConvex } from "convex/react";
import { api } from "../../../convex/_generated/api";
import {
  AgentCoreNode,
  NumbersDropdownNode,
  ApifyNode,
  ResumeAnalyzerNode,
  GmailNode,
} from "@/components/workflow/nodes";
import { Play } from "lucide-react";

// Custom node types
const nodeTypes: NodeTypes = {
  agentCore: AgentCoreNode,
  numbersDropdown: NumbersDropdownNode,
  apify: ApifyNode,
  resumeAnalyzer: ResumeAnalyzerNode,
  gmail: GmailNode,
};

// Default workflow nodes
const getDefaultWorkflowNodes = (): Node[] => [
  {
    id: "agent-core",
    type: "agentCore",
    data: { label: "Agent Core" },
    position: { x: 100, y: 300 },
  },
  {
    id: "numbers-dropdown",
    type: "numbersDropdown",
    data: { label: "Numbers", value: 5 },
    position: { x: 300, y: 300 },
  },
  {
    id: "apify",
    type: "apify",
    data: { label: "Apify" },
    position: { x: 500, y: 300 },
  },
  {
    id: "resume-analyzer",
    type: "resumeAnalyzer",
    data: { label: "Resume Analyzer" },
    position: { x: 700, y: 300 },
  },
  {
    id: "gmail",
    type: "gmail",
    data: { label: "Gmail" },
    position: { x: 900, y: 300 },
  },
];

// Default workflow edges - fixed and non-deletable
const getDefaultWorkflowEdges = (): Edge[] => [
  {
    id: "e-agent-core-numbers",
    source: "agent-core",
    sourceHandle: "agent-core-output",
    target: "numbers-dropdown",
    targetHandle: "numbers-input",
    deletable: false,
  },
  {
    id: "e-numbers-apify",
    source: "numbers-dropdown",
    sourceHandle: "numbers-output",
    target: "apify",
    targetHandle: "apify-input",
    deletable: false,
  },
  {
    id: "e-apify-resume-analyzer",
    source: "apify",
    sourceHandle: "apify-output",
    target: "resume-analyzer",
    targetHandle: "resume-analyzer-input",
    deletable: false,
  },
  {
    id: "e-resume-analyzer-gmail",
    source: "resume-analyzer",
    sourceHandle: "resume-analyzer-output",
    target: "gmail",
    targetHandle: "gmail-input",
    deletable: false,
  },
];

function DashboardPage() {
  const { userInfo } = useApplicationContext();
  const convex = useConvex();
  const [showDefaultWorkflow, setShowDefaultWorkflow] = useState<
    boolean | null
  >(null);

  // Use memoized default workflow nodes and edges
  const defaultNodes = useMemo(() => getDefaultWorkflowNodes(), []);
  const defaultEdges = useMemo(() => getDefaultWorkflowEdges(), []);

  const [nodes, setNodes] = useState<Node[]>(defaultNodes);
  const [edges, setEdges] = useState<Edge[]>(defaultEdges);

  useEffect(() => {
    const fetchUserWorkflow = async () => {
      if (!userInfo?.userId) return;

      try {
        const userWorkflow = await convex.query(api.workflow.getUserWorkflow, {
          userId: userInfo.userId,
        });

        if (
          userWorkflow &&
          typeof userWorkflow.showDefaultWorkflow === "boolean"
        ) {
          setShowDefaultWorkflow(userWorkflow.showDefaultWorkflow);
        } else {
          setShowDefaultWorkflow(false);
        }
      } catch (error) {
        console.error("Error fetching user workflow:", error);
        setShowDefaultWorkflow(false);
      }
    };

    fetchUserWorkflow();
  }, [userInfo?.userId, convex]);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  // Prevent deletion of fixed edges
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      const filteredChanges = changes.filter((change) => {
        if (change.type === "remove") {
          const edge = edges.find((e) => e.id === change.id);
          return edge?.deletable !== false; // Only allow deletion of deletable edges
        }
        return true;
      });
      setEdges((eds) => applyEdgeChanges(filteredChanges, eds));
    },
    [edges]
  );

  // Allow connections from Resume Analyzer output to multiple nodes
  const onConnect = useCallback((params: Connection) => {
    // Only allow connections from Resume Analyzer output
    if (
      params.source === "resume-analyzer" &&
      params.sourceHandle === "resume-analyzer-output"
    ) {
      setEdges((eds) => [
        ...eds,
        {
          id: `e-resume-analyzer-${params.target}-${Date.now()}`,
          source: params.source!,
          sourceHandle: params.sourceHandle,
          target: params.target!,
          targetHandle: params.targetHandle,
          deletable: true, // New connections from Resume Analyzer can be deleted
        },
      ]);
    }
  }, []);

  // Handle Run button click - log nodes with their IDs
  const handleRun = useCallback(() => {
    console.log("🚀 Running workflow...");
    console.log(
      "📋 Nodes with IDs:",
      nodes.map((node) => ({
        id: node.id,
        type: node.type,
        label: node.data?.label,
        data: node.data,
      }))
    );
  }, [nodes]);

  // Show nothing if showDefaultWorkflow is false or null
  if (showDefaultWorkflow !== true) {
    return null;
  }

  return (
    <div className="h-screen w-full bg-background relative">
      {/* Run Button */}
      <button
        onClick={handleRun}
        className="absolute top-4 right-4 z-10 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-lg"
        title="Run Workflow"
      >
        <Play size={18} className="fill-primary-foreground" />
        Run
      </button>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        nodesDraggable={true}
        nodesConnectable={true}
        elementsSelectable={true}
      >
        <Background gap={16} size={1} />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default DashboardPage;
