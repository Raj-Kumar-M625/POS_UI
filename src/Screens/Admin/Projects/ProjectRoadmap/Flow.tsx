import { useCallback, useMemo } from "react";
import ReactFlow, {
  Node,
  Background,
  Edge,
  useNodesState,
  useEdgesState,
  MarkerType,
  Connection,
  addEdge,
} from "reactflow";
import onObjective from "./Objectivelist";
import { useLocation } from "react-router-dom";
import "reactflow/dist/style.css";
import onEmployees from "./EmployeeList";
import onTasks from "./Tasks";
import onUserInterface from "./UserInterfacelist";
import onUserStory from "./UserStory";

const connectionLineStyle = { stroke: "#fff" };

const BasicFlow = () => {
  const location = useLocation();

  const initialNodes: Node[] = [
    {
      id: "1",
      type: "input",
      style: {
        backgroundColor: "#eb7134",
        width: 200,
        height: 50,
        border: "1px solid red",
        fontSize: "20px",
        borderRadius: "15px",
        color: "white",
      },
      data: { label: location.state.projectName },
      position: { x: 650, y: 30 },
    },
    {
      id: "2",
      type: "selectorNodeEmp",
      style: {
        backgroundColor: "#5d85c2",
        color: "white",
        width: 200,
        height: 50,
        border: "1px solid blue",
        fontSize: "20px",
        borderRadius: "15px",
      },
      data: { label: "Employees" },
      position: { x: 300, y: 220 },
    },
    {
      id: "3",
      type: "selectorNode",
      data: { label: "Objective" },
      style: {
        backgroundColor: "#5d85c2",
        color: "white",
        width: 200,
        height: 50,
        border: "1px solid blue",
        fontSize: "20px",
        borderRadius: "15px",
      },
      position: { x: 1000, y: 220 },
    },

    {
      id: "4",
      type: "selectorNodeUI",
      style: {
        width: 200,
        height: 50,
        border: "1px solid green",
        fontSize: "20px",
        borderRadius: "15px",
      },
      data: {
        label: "User Interface",
        selects: {
          "handle-0": "smoothstep",
        },
      },
      position: { x: 750, y: 400 },
    },
    {
      id: "5",
      type: "slectorNodeUS",
      style: {
        width: 200,
        height: 50,
        border: "1px solid green",
        fontSize: "20px",
        borderRadius: "15px",
      },
      data: { label: "User Story" },
      position: { x: 1270, y: 400 },
    },
    {
      id: "6",
      type: "selectorNodeTask",
      style: {
        width: 200,
        height: 50,
        border: "1px solid green",
        fontSize: "20px",
        borderRadius: "15px",
      },
      data: { label: "Tasks" },
      position: { x: 300, y: 400 },
    },
  ];

  const initialEdges: Edge[] = [
    {
      id: "e1-2",
      source: "1",
      target: "2",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: "#FF0072",
      },
      style: {
        strokeWidth: 2,
        stroke: "#FF0072",
      },
    },
    {
      id: "e2a-3",
      source: "1",
      target: "3",
      markerEnd: {
        type: MarkerType.ArrowClosed,
        color: "#FF0072",
      },
      style: {
        strokeWidth: 2,
        stroke: "#FF0072",
      },
    },
    {
      id: "e1a-4",
      source: "3",
      target: "4",
      animated: true,
      style: {
        stroke: "#FF0072",
        strokeWidth: 2,
      },
    },
    {
      id: "e1a-5",
      source: "3",
      target: "5",
      animated: true,
      style: {
        stroke: "#FF0072",
        strokeWidth: 2,
      },
    },
    {
      id: "e2->6",
      source: "2",
      target: "6",
      animated: true,
      style: {
        stroke: "#FF0072",
        strokeWidth: 2,
      },
    },
  ];

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((els) => addEdge(params, els)),
    [setEdges]
  );

  const nodeTypes = useMemo(
    () => ({
      selectorNode: onObjective,
      selectorNodeEmp: onEmployees,
      selectorNodeTask: onTasks,
      selectorNodeUI: onUserInterface,
      slectorNodeUS: onUserStory,
    }),
    []
  );

  return (
    <>
      <ReactFlow
        nodeTypes={nodeTypes}
        nodesDraggable={false}
        panOnDrag={false}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        zoomOnScroll={false}
        zoomOnPinch={false}
        zoomOnDoubleClick={false}
        panOnScroll={false}
        connectionLineStyle={connectionLineStyle}
      >
        <Background
          color="#aaa"
          gap={16}
          style={{ background: "#e8e5e3", cursor: "pointer", color: "red" }}
        />
      </ReactFlow>
    </>
  );
};

export default BasicFlow;
