import { useCallback, useState, useRef, useEffect } from 'react';
import { Tree, RawNodeDatum, TreeProps } from 'react-d3-tree';

interface TreeVisualizationProps {
  contents: any[];
  repoName: string;
  onNodeClick?: (path: string) => void;
}

interface CustomNodeProps {
  nodeDatum: RawNodeDatum;
  toggleNode: () => void;
}

interface ExtendedRawNodeDatum extends RawNodeDatum {
  __rd3t?: {
    collapsed: boolean;
  };
}

const CustomNode = ({ nodeDatum, toggleNode, onNodeClick }: CustomNodeProps & { onNodeClick: (path: string) => void }) => {
  const isDirectory = nodeDatum.children && nodeDatum.children.length > 0;
  const [clickTimeout, setClickTimeout] = useState<NodeJS.Timeout | null>(null);
  
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (clickTimeout) {
      // Double click detected
      clearTimeout(clickTimeout);
      setClickTimeout(null);
      onNodeClick(String(nodeDatum.attributes?.path || nodeDatum.name));
    } else {
      // Set timeout for single click
      const timeout = setTimeout(() => {
        toggleNode();
        setClickTimeout(null);
      }, 250); // 250ms delay to detect double click
      
      setClickTimeout(timeout);
    }
  };
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (clickTimeout) {
        clearTimeout(clickTimeout);
      }
    };
  }, [clickTimeout]);
  
  return (
    <g onClick={handleClick}>
      <circle r={15} fill={isDirectory ? "#E3A008" : "#4299E1"} />
      <text
        fill="white"
        strokeWidth="1"
        x={-8}
        y={5}
        style={{ fontSize: '1.2rem' }}
      >
        {isDirectory ? "📁" : "📄"}
      </text>
      <text
        className="rd3t-label"
        textAnchor="start"
        x={25}
        y={5}
        style={{ fill: '#4A5568' }}
      >
        {nodeDatum.name}
      </text>
    </g>
  );
};

const TreeVisualization = ({ contents, repoName, onNodeClick }: TreeVisualizationProps) => {
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const [treeRef, setTreeRef] = useState<any>(null);
  const initialZoom = 0.8;
  const [showOnlyDirectories, setShowOnlyDirectories] = useState(false);

  // Transform data
  const transformToTreeData = useCallback((items: any[], parentName: string): ExtendedRawNodeDatum => ({
    name: parentName,
    attributes: { path: items[0]?.path?.split('/')[0] || parentName },
    children: items
      .filter(item => !showOnlyDirectories || item.type === 'dir')
      .map(item => {
        if (item.type === 'dir' && item.contents) {
          return transformToTreeData(item.contents, item.name);
        }
        return { 
          name: item.name,
          attributes: { path: item.path }
        };
      }),
  }), [showOnlyDirectories]);

  const treeData = [transformToTreeData(contents, repoName)];

  // Handle container resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        setDimensions({ width, height });
        const newTranslate = { x: width / 2, y: 50 };
        setTranslate(newTranslate);
        
        // If treeRef exists, update its state too
        if (treeRef) {
          treeRef.setState({
            translate: newTranslate,
            zoom: initialZoom
          });
        }
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [treeRef, initialZoom]);

  const handleExpandAll = useCallback(() => {
    if (treeRef) {
      treeRef.setState({
        data: treeRef.state.data.map((node: ExtendedRawNodeDatum) => {
          return expandNode(node);
        }),
      });
    }
  }, [treeRef]);

  const handleCollapseAll = useCallback(() => {
    if (treeRef) {
      treeRef.setState({
        data: treeRef.state.data.map((node: ExtendedRawNodeDatum) => {
          return collapseNode(node);
        }),
      });
    }
  }, [treeRef]);

  // Add these helper functions
  const expandNode = (node: ExtendedRawNodeDatum): ExtendedRawNodeDatum => {
    const newNode = { ...node };
    if (newNode.children) {
      newNode.__rd3t = { ...newNode.__rd3t, collapsed: false };
      newNode.children = newNode.children.map(expandNode);
    }
    return newNode;
  };

  const collapseNode = (node: ExtendedRawNodeDatum): ExtendedRawNodeDatum => {
    const newNode = { ...node };
    if (newNode.children) {
      newNode.__rd3t = { ...newNode.__rd3t, collapsed: true };
      newNode.children = newNode.children.map(collapseNode);
    }
    return newNode;
  };

  return (
    <div className="mt-6 bg-white rounded-xl p-2 sm:p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold text-gray-800">Repository Structure</h3>
          <div className="flex gap-2">
            <button
              onClick={() => setShowOnlyDirectories(!showOnlyDirectories)}
              className={`px-3 py-1 text-sm ${
                showOnlyDirectories 
                  ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-800' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              } rounded-md transition-colors`}
            >
              {showOnlyDirectories ? 'Show All' : 'Directories Only'}
            </button>
            <button
              onClick={handleExpandAll}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
            >
              Expand All
            </button>
            <button
              onClick={handleCollapseAll}
              className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors"
            >
              Collapse All
            </button>
          </div>
        </div>
        
        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
          <p>
            <span className="font-medium">📁 Directories</span> are shown in yellow, 
            <span className="font-medium"> 📄 Files</span> in blue.
          </p>
          <p className="mt-1">
            <span className="font-medium">Single click</span> to expand/collapse nodes.
            <span className="font-medium ml-2">Double click</span> to jump to file contents.
          </p>
        </div>
      </div>
      
      <div 
        ref={containerRef}
        style={{ width: '100%', height: '40vh' }}
        className="overflow-hidden"
      >
        <Tree 
          data={treeData}
          orientation="vertical"
          translate={translate}
          dimensions={dimensions}
          nodeSize={{ x: 200, y: 100 }}
          separation={{ siblings: 1, nonSiblings: 1.5 }}
          zoomable={true}
          zoom={0.8}
          pathFunc="step"
          renderCustomNodeElement={(rd3tProps) => (
            <CustomNode 
              nodeDatum={rd3tProps.nodeDatum}
              toggleNode={rd3tProps.toggleNode}
              onNodeClick={onNodeClick || (() => {})}  // Provide default empty function
            />
          )}
          enableLegacyTransitions={true}
          transitionDuration={800}
          ref={(ref) => setTreeRef(ref)}
        />
      </div>
    </div>
  );
};

export default TreeVisualization; 