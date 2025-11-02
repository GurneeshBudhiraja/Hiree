"use client";
import { Handle, Position, type NodeProps } from "@xyflow/react";
import { useState } from "react";

// Agent Core Node - only output on right
export function AgentCoreNode({ data }: NodeProps) {
  return (
    <div className="px-4 py-3 bg-card border border-border rounded-lg shadow-sm min-w-[140px]">
      <div className="text-sm font-medium text-foreground">{data.label}</div>
      <Handle
        type="source"
        position={Position.Right}
        id="agent-core-output"
        className="bg-muted-foreground! border-border! w-3! h-3!"
      />
    </div>
  );
}

// Numbers Dropdown Node
export function NumbersDropdownNode({ data }: NodeProps) {
  const [value, setValue] = useState(data.value || 5);

  return (
    <div className="px-4 py-3 bg-card border border-border rounded-lg shadow-sm min-w-[140px]">
      <div className="text-sm font-medium text-foreground mb-2">
        {data.label}
      </div>
      <select
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full px-2 py-1 bg-background border border-border rounded text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      >
        {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
          <option key={num} value={num}>
            {num}
          </option>
        ))}
      </select>
      <Handle
        type="target"
        position={Position.Left}
        id="numbers-input"
        className="bg-muted-foreground! border-border! w-3! h-3!"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="numbers-output"
        className="bg-muted-foreground! border-border! w-3! h-3!"
      />
    </div>
  );
}

// Apify Node
export function ApifyNode({ data }: NodeProps) {
  return (
    <div className="px-4 py-3 bg-card border border-border rounded-lg shadow-sm min-w-[140px]">
      <div className="text-sm font-medium text-foreground">{data.label}</div>
      <Handle
        type="target"
        position={Position.Left}
        id="apify-input"
        className="bg-muted-foreground! border-border! w-3! h-3!"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="apify-output"
        className="bg-muted-foreground! border-border! w-3! h-3!"
      />
    </div>
  );
}

// Resume Analyzer Node - can have multiple outputs
export function ResumeAnalyzerNode({ data }: NodeProps) {
  return (
    <div className="px-4 py-3 bg-card border border-border rounded-lg shadow-sm min-w-[140px]">
      <div className="text-sm font-medium text-foreground">{data.label}</div>
      <Handle
        type="target"
        position={Position.Left}
        id="resume-analyzer-input"
        className="bg-muted-foreground! border-border! w-3! h-3!"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="resume-analyzer-output"
        className="bg-muted-foreground! border-border! w-3! h-3!"
      />
    </div>
  );
}

// Gmail Node - only input on left
export function GmailNode({ data }: NodeProps) {
  return (
    <div className="px-4 py-3 bg-card border border-border rounded-lg shadow-sm min-w-[140px]">
      <div className="text-sm font-medium text-foreground">{data.label}</div>
      <Handle
        type="target"
        position={Position.Left}
        id="gmail-input"
        className="bg-muted-foreground! border-border! w-3! h-3!"
      />
    </div>
  );
}
