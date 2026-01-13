/**
 * TEST INTUITION VISUALIZER
 * Shows how each test case covers specific lines of component code
 * Helps understand the thought process behind test writing
 */

import React, { useState, useEffect } from 'react';
import './AccordionVisualiser.scss';

interface CodeCoverage {
  lineNumber: number;
  code: string;
  testCoverage: number[]; // Array of test IDs that cover this line
  purpose: string;
  category: 'props' | 'state' | 'logic' | 'rendering' | 'event' | 'conditional';
}

interface TestCase {
  id: number;
  name: string;
  description: string;
  testCode: string;
  coveredLines: number[];
  intuition: string;
  whyTestThis: string[];
  userStory: string;
  category: 'rendering' | 'interaction' | 'edge' | 'behavior' | 'visual';
}

const TestIntuitionVisualizer: React.FC = () => {
  const [activeTestId, setActiveTestId] = useState<number>(1);
  const [viewMode, setViewMode] = useState<'coverage' | 'intuition' | 'comparison'>('coverage');
  const [hoveredLine, setHoveredLine] = useState<number | null>(null);
  
  // Accordion component code with line numbers
  const accordionCode = `01 | import './Accordion.scss';
02 | import defaultData, { accordionItem } from './data';
03 | import { useState } from 'react';
04 | 
05 | interface AccordionProps {
06 |   data?: accordionItem[];
07 | }
08 | 
09 | export default function Accordion({ data = defaultData }: AccordionProps) {
10 |   const [oi, setOi] = useState<number | null>(null);
11 | 
12 |   const Hoi = (index: number) => {
13 |     setOi(oi === index ? null : index);
14 |   };
15 | 
16 |   return (
17 |     <div className="accordion">
18 |       <span>Accordion</span>
19 | 
20 |       {data.length === 0 && <div>No items found</div>}
21 | 
22 |       {data.map((d, index) => (
23 |         <div className="accordion__item" key={index}>
24 |           <button
25 |             className="accordion__title"
26 |             onClick={() => Hoi(index)}
27 |             aria-expanded={oi === index}
28 |           >
29 |             {d.title}
30 |             <span className="accordion__arrow">
31 |               {oi === index ? 'u' : 'd'}
32 |             </span>
33 |           </button>
34 | 
35 |           {index === oi && (
36 |             <div className="accordion__description">{d.desc}</div>
37 |           )}
38 |         </div>
39 |       ))}
40 |     </div>
41 |   );
42 | }`;

  // Parse code lines
  const codeLines = accordionCode.split('\n').map((line, index) => ({
    lineNumber: index + 1,
    code: line,
    originalLine: line
  }));

  // Test cases with detailed intuition
  const testCases: TestCase[] = [
    {
      id: 1,
      name: "Basic Rendering Test",
      description: "Renders accordion with items when data is provided",
      testCode: `test('renders accordion with items', () => {
  render(<Accordion data={mockData} />);
  expect(screen.getByText('Accordion')).toBeInTheDocument();
  expect(screen.getByText('First Item')).toBeInTheDocument();
  expect(screen.getByText('Second Item')).toBeInTheDocument();
  expect(screen.queryByText('First description')).not.toBeInTheDocument();
  expect(screen.getAllByText('d')).toHaveLength(2);
});`,
      coveredLines: [1, 2, 3, 5, 6, 7, 9, 10, 16, 17, 18, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33],
      intuition: `This is a "happy path" test. We want to ensure that when the component receives valid data, it renders correctly. We test:
      1. The container renders (lines 16-18)
      2. All items from props are displayed (lines 22-23)
      3. Initial state is correct (all arrows show 'd' - line 31)
      4. Descriptions are initially hidden (lines 35-37 NOT covered - that's intentional!)`,
      whyTestThis: [
        "Ensures component doesn't crash with valid data",
        "Verifies props are correctly passed to child elements",
        "Confirms initial UI state matches expectations",
        "Tests the data mapping logic works"
      ],
      userStory: "As a user, I should see all accordion titles when the page loads",
      category: 'rendering'
    },
    {
      id: 2,
      name: "Empty State Test",
      description: "Renders 'no items found' when empty data array is provided",
      testCode: `test('renders "no items found"', () => {
  render(<Accordion data={emptyData} />);
  expect(screen.getByText('no items found')).toBeInTheDocument();
  expect(screen.queryByText('d')).not.toBeInTheDocument();
});`,
      coveredLines: [1, 2, 3, 5, 6, 7, 9, 10, 16, 17, 18, 20],
      intuition: `This tests an edge case - what happens when there's no data? We need to ensure:
      1. The component handles empty arrays gracefully (line 20)
      2. No items are rendered when data is empty
      3. No arrows appear (since there are no items)
      This prevents crashes and provides a good user experience for empty states.`,
      whyTestThis: [
        "Prevents crashes with empty data",
        "Ensures graceful degradation",
        "Provides good UX for empty states",
        "Tests conditional rendering logic"
      ],
      userStory: "As a user, I should see a helpful message when there are no items to display",
      category: 'edge'
    },
    {
      id: 3,
      name: "Toggle Functionality Test",
      description: "Opens and closes an accordion item when clicked",
      testCode: `test('opens and closes item when clicked', () => {
  render(<Accordion data={mockData} />);
  const firstItem = screen.getByText('First Item');
  
  // Open
  fireEvent.click(firstItem);
  expect(screen.getByText('First description')).toBeInTheDocument();
  expect(screen.getByText('u')).toBeInTheDocument();
  
  // Close
  fireEvent.click(firstItem);
  expect(screen.queryByText('First description')).not.toBeInTheDocument();
});`,
      coveredLines: [1, 2, 3, 5, 6, 7, 9, 10, 12, 13, 14, 16, 17, 18, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 35, 36, 37],
      intuition: `This tests the core functionality - the toggle mechanism. We verify:
      1. The click handler works (line 26 triggers lines 12-14)
      2. State updates correctly (line 13 logic)
      3. UI responds to state changes (lines 31-32, 35-37)
      4. Opening and closing both work (full cycle test)
      This is the most important test for user interaction.`,
      whyTestThis: [
        "Tests the main user interaction",
        "Verifies state management works",
        "Ensures UI updates correctly with state",
        "Tests the complete toggle cycle"
      ],
      userStory: "As a user, I should be able to click on an accordion item to see its content, and click again to hide it",
      category: 'interaction'
    },
    {
      id: 4,
      name: "Single Open Behavior Test",
      description: "Opens second item and closes first item automatically",
      testCode: `test('opens second item and closes first', () => {
  render(<Accordion data={mockData} />);
  const firstItem = screen.getByText('First Item');
  const secondItem = screen.getByText('Second Item');
  
  fireEvent.click(firstItem);
  expect(screen.getByText('First description')).toBeInTheDocument();
  
  fireEvent.click(secondItem);
  expect(screen.queryByText('First description')).not.toBeInTheDocument();
  expect(screen.getByText('Second description')).toBeInTheDocument();
});`,
      coveredLines: [1, 2, 3, 5, 6, 7, 9, 10, 12, 13, 14, 16, 17, 18, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 35, 36, 37],
      intuition: `This tests the "single item open at a time" behavior. The key insight is testing the logic in line 13:
      setOi(oi === index ? null : index). This ensures:
      1. Clicking a different item closes the currently open one
      2. Only one description is visible at any time
      3. The component manages state transitions correctly between items`,
      whyTestThis: [
        "Tests business logic (single-open behavior)",
        "Ensures proper state transitions",
        "Verifies UI consistency with state",
        "Tests component behavior with multiple items"
      ],
      userStory: "As a user, when I open a new accordion item, the previously open item should automatically close",
      category: 'behavior'
    },
    {
      id: 5,
      name: "Arrow Indicator Test",
      description: "Maintains correct arrow indicators (d/u) based on state",
      testCode: `test('maintains correct arrow indicators', () => {
  render(<Accordion data={mockData} />);
  expect(screen.getAllByText('d')).toHaveLength(2);
  
  const firstItem = screen.getByText('First Item');
  fireEvent.click(firstItem);
  expect(screen.getByText('u')).toBeInTheDocument();
  expect(screen.getAllByText('d')).toHaveLength(1);
});`,
      coveredLines: [1, 2, 3, 5, 6, 7, 9, 10, 12, 13, 14, 16, 17, 18, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33],
      intuition: `This tests visual feedback - ensuring the UI accurately reflects state. The key is lines 31-32:
      {oi === index ? 'u' : 'd'}. We test:
      1. Initial state shows all 'd' arrows
      2. Clicked item shows 'u' arrow
      3. Other items still show 'd'
      4. The arrow changes are synchronized with description visibility`,
      whyTestThis: [
        "Tests visual feedback matches state",
        "Ensures good UX through clear indicators",
        "Verifies conditional rendering of UI elements",
        "Tests state-to-UI synchronization"
      ],
      userStory: "As a user, I should see visual indicators (arrows) that clearly show which items are open or closed",
      category: 'visual'
    },
    {
      id: 6,
      name: "Default Props Test",
      description: "Uses default data when no props are provided",
      testCode: `test('uses default data when no props', () => {
  render(<Accordion />);
  expect(screen.getByText('Accordion')).toBeInTheDocument();
  expect(screen.queryByText('no items found')).not.toBeInTheDocument();
});`,
      coveredLines: [1, 2, 3, 5, 6, 7, 9, 16, 17, 18, 20, 22],
      intuition: `This tests the default prop value in line 9: { data = defaultData }. We need to ensure:
      1. Component doesn't crash when no props are passed
      2. Uses sensible defaults
      3. Still renders correctly
      4. Doesn't show empty state when defaults exist
      This prevents runtime errors when consumers forget to pass props.`,
      whyTestThis: [
        "Tests default prop behavior",
        "Prevents runtime errors with missing props",
        "Ensures component is resilient",
        "Verifies graceful handling of optional props"
      ],
      userStory: "As a developer using this component, I should be able to use it without providing data and it should still work",
      category: 'edge'
    }
  ];

  const activeTest = testCases.find(test => test.id === activeTestId) || testCases[0];

  // Calculate coverage statistics
  const allCoveredLines = testCases.flatMap(test => test.coveredLines);
  const uniqueCoveredLines = Array.from(new Set(allCoveredLines));
  const totalLines = 42; // Total lines in accordion component
  
  // Find lines covered by current test
  const linesCoveredByActiveTest = new Set(activeTest.coveredLines);

  // Find lines NOT covered by any test
  const allLines = Array.from({ length: totalLines }, (_, i) => i + 1);
  const uncoveredLines = allLines.filter(line => !uniqueCoveredLines.includes(line));

  // Get coverage percentage
  const coveragePercentage = ((uniqueCoveredLines.length / totalLines) * 100).toFixed(1);

  return (
    <div className="intuition-visualizer">
      <header className="visualizer-header">
        <h1>🧠 Test Writing Intuition Visualizer</h1>
        <p className="subtitle">
          See how each test case validates specific parts of the Accordion component
        </p>
        <div className="coverage-stats">
          <div className="stat">
            <span className="stat-label">Total Tests:</span>
            <span className="stat-value">{testCases.length}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Lines Covered:</span>
            <span className="stat-value">{uniqueCoveredLines.length}/{totalLines}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Coverage:</span>
            <span className="stat-value highlight">{coveragePercentage}%</span>
          </div>
          <div className="stat">
            <span className="stat-label">Uncovered Lines:</span>
            <span className="stat-value warning">{uncoveredLines.length}</span>
          </div>
        </div>
      </header>

      <div className="visualizer-container">
        {/* Left Panel: Test Selection and Details */}
        <div className="left-panel">
          <div className="view-controls">
            <button 
              className={`view-btn ${viewMode === 'coverage' ? 'active' : ''}`}
              onClick={() => setViewMode('coverage')}
            >
              🎯 Code Coverage
            </button>
            <button 
              className={`view-btn ${viewMode === 'intuition' ? 'active' : ''}`}
              onClick={() => setViewMode('intuition')}
            >
              💡 Test Intuition
            </button>
            <button 
              className={`view-btn ${viewMode === 'comparison' ? 'active' : ''}`}
              onClick={() => setViewMode('comparison')}
            >
              🔄 Test Comparison
            </button>
          </div>

          <div className="test-selector">
            <h3>Test Cases</h3>
            <div className="test-list">
              {testCases.map(test => (
                <div 
                  key={test.id}
                  className={`test-card ${activeTestId === test.id ? 'active' : ''} ${test.category}`}
                  onClick={() => setActiveTestId(test.id)}
                >
                  <div className="test-header">
                    <span className="test-id">Test #{test.id}</span>
                    <span className="test-category">{test.category}</span>
                  </div>
                  <h4 className="test-name">{test.name}</h4>
                  <p className="test-description">{test.description}</p>
                  <div className="test-meta">
                    <span className="meta-item">📝 Covers {test.coveredLines.length} lines</span>
                    <span className="meta-item">👤 {test.userStory.split(' ').slice(0, 4).join(' ')}...</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Test Details Panel */}
          <div className="test-details-panel">
            <h3>🧪 Test #{activeTest.id}: {activeTest.name}</h3>
            
            {viewMode === 'intuition' && (
              <div className="intuition-details">
                <div className="intuition-section">
                  <h4>💭 Developer's Thought Process:</h4>
                  <p>{activeTest.intuition}</p>
                </div>
                
                <div className="intuition-section">
                  <h4>❓ Why Test This?</h4>
                  <ul>
                    {activeTest.whyTestThis.map((reason, idx) => (
                      <li key={idx}>{reason}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="intuition-section">
                  <h4>👥 User Story:</h4>
                  <p className="user-story">"{activeTest.userStory}"</p>
                </div>
              </div>
            )}

            {viewMode === 'comparison' && (
              <div className="comparison-view">
                <h4>📊 This Test vs Other Tests:</h4>
                <div className="coverage-comparison">
                  {testCases.map(test => (
                    <div key={test.id} className="test-comparison">
                      <div className="comparison-header">
                        <span>Test #{test.id}: {test.name}</span>
                        <span>{test.coveredLines.length} lines</span>
                      </div>
                      <div className="line-coverage">
                        {Array.from({ length: allLines.length }, (_, i) => i + 1).map(line => (
                          <div 
                            key={line}
                            className={`line-dot ${
                              test.coveredLines.includes(line) 
                                ? activeTestId === test.id 
                                  ? 'active-test' 
                                  : 'other-test' 
                                : ''
                            }`}
                            title={`Line ${line}`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Code Visualization */}
        <div className="right-panel">
          <div className="code-header">
            <h3>📄 Accordion Component Code</h3>
            <div className="code-legend">
              <div className="legend-item">
                <div className="legend-color current-test"></div>
                <span>Covered by current test</span>
              </div>
              <div className="legend-item">
                <div className="legend-color other-test"></div>
                <span>Covered by other tests</span>
              </div>
              <div className="legend-item">
                <div className="legend-color uncovered"></div>
                <span>Not covered by any test</span>
              </div>
            </div>
          </div>

          <div className="code-container">
            <div className="code-lines">
              {codeLines.map(line => {
                // Determine coverage status
                let coverageStatus = 'uncovered';
                const coveredByTests: number[] = [];
                
                testCases.forEach(test => {
                  if (test.coveredLines.includes(line.lineNumber)) {
                    coveredByTests.push(test.id);
                    if (test.id === activeTestId) {
                      coverageStatus = 'current-test';
                    } else if (coverageStatus !== 'current-test') {
                      coverageStatus = 'other-test';
                    }
                  }
                });

                return (
                  <div 
                    key={line.lineNumber}
                    className={`code-line ${coverageStatus} ${hoveredLine === line.lineNumber ? 'hovered' : ''}`}
                    onMouseEnter={() => setHoveredLine(line.lineNumber)}
                    onMouseLeave={() => setHoveredLine(null)}
                  >
                    <div className="line-number">{line.lineNumber.toString().padStart(2, '0')}</div>
                    <div className="line-content">
                      <code>{line.code}</code>
                      {coverageStatus !== 'uncovered' && (
                        <div className="coverage-info">
                          <span className="coverage-label">
                            {coverageStatus === 'current-test' 
                              ? '✓ Covered by this test' 
                              : `✓ Covered by ${coveredByTests.length} test${coveredByTests.length > 1 ? 's' : ''}`}
                          </span>
                          {coveredByTests.length > 0 && (
                            <span className="test-ids">
                              Tests: {coveredByTests.join(', ')}
                            </span>
                          )}
                        </div>
                      )}
                      {hoveredLine === line.lineNumber && (
                        <div className="line-tooltip">
                          <h4>Line {line.lineNumber}</h4>
                          <p><strong>Purpose:</strong> {
                            line.lineNumber >= 1 && line.lineNumber <= 3 ? 'Imports and dependencies' :
                            line.lineNumber >= 5 && line.lineNumber <= 7 ? 'Props interface definition' :
                            line.lineNumber === 9 ? 'Component function with default props' :
                            line.lineNumber === 10 ? 'State initialization' :
                            line.lineNumber >= 12 && line.lineNumber <= 14 ? 'Toggle function logic' :
                            line.lineNumber === 20 ? 'Empty state conditional rendering' :
                            line.lineNumber >= 22 && line.lineNumber <= 33 ? 'Data mapping and item rendering' :
                            line.lineNumber >= 35 && line.lineNumber <= 37 ? 'Conditional content rendering' :
                            'Component structure'
                          }</p>
                          <p><strong>Category:</strong> {
                            line.lineNumber >= 1 && line.lineNumber <= 3 ? 'Imports' :
                            line.lineNumber >= 5 && line.lineNumber <= 7 ? 'Props' :
                            line.lineNumber === 10 ? 'State' :
                            line.lineNumber >= 12 && line.lineNumber <= 14 ? 'Logic' :
                            line.lineNumber >= 16 && line.lineNumber <= 41 ? 'Rendering' :
                            'Structure'
                          }</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Coverage Analysis */}
          <div className="coverage-analysis">
            <h4>📈 Coverage Analysis for Test #{activeTest.id}</h4>
            <div className="analysis-grid">
              <div className="analysis-card">
                <div className="analysis-value">{activeTest.coveredLines.length}</div>
                <div className="analysis-label">Lines Covered</div>
                <div className="analysis-detail">
                  {((activeTest.coveredLines.length / totalLines) * 100).toFixed(1)}% of component
                </div>
              </div>
              
              <div className="analysis-card">
                <div className="analysis-value">
                  {activeTest.coveredLines.filter(line => 
                    line >= 12 && line <= 14
                  ).length}
                </div>
                <div className="analysis-label">Logic Lines</div>
                <div className="analysis-detail">
                  Core toggle function tested
                </div>
              </div>
              
              <div className="analysis-card">
                <div className="analysis-value">
                  {activeTest.coveredLines.filter(line => 
                    line >= 22 && line <= 33
                  ).length}
                </div>
                <div className="analysis-label">Rendering Lines</div>
                <div className="analysis-detail">
                  UI mapping and display
                </div>
              </div>
              
              <div className="analysis-card">
                <div className="analysis-value">
                  {activeTest.coveredLines.filter(line => 
                    line >= 35 && line <= 37
                  ).length}
                </div>
                <div className="analysis-label">Conditional Lines</div>
                <div className="analysis-detail">
                  Dynamic content rendering
                </div>
              </div>
            </div>
            
            {/* Critical Lines Highlight */}
            <div className="critical-lines">
              <h5>🎯 Critical Logic Tested:</h5>
              <div className="critical-line-list">
                {activeTest.coveredLines.includes(13) && (
                  <div className="critical-line">
                    <span className="line-num">Line 13:</span>
                    <code>setOi(oi === index ? null : index)</code>
                    <span className="line-desc">Core toggle logic - tested for correctness</span>
                  </div>
                )}
                {activeTest.coveredLines.includes(20) && (
                  <div className="critical-line">
                    <span className="line-num">Line 20:</span>
                    <code>{`{data.length === 0 && <div>No items found</div>}`}</code>
                    <span className="line-desc">Empty state handling - tested for edge case</span>
                  </div>
                )}
                {activeTest.coveredLines.includes(31) && (
                  <div className="critical-line">
                    <span className="line-num">Line 31:</span>
                    <code>{`{oi === index ? 'u' : 'd'}`}</code>
                    <span className="line-desc">UI state synchronization - tested for visual feedback</span>
                  </div>
                )}
                {activeTest.coveredLines.includes(35) && (
                  <div className="critical-line">
                    <span className="line-num">Line 35:</span>
                    <code>{`{index === oi && (`}</code>
                    <span className="line-desc">Conditional rendering - tested for content visibility</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Test Code Display */}
      <div className="test-code-section">
        <div className="section-header">
          <h3>🔬 Test Code for "{activeTest.name}"</h3>
          <div className="test-meta">
            <span className="test-category-badge">{activeTest.category}</span>
            <span className="lines-covered">{activeTest.coveredLines.length} component lines validated</span>
          </div>
        </div>
        <pre className="test-code-display">
          {activeTest.testCode}
        </pre>
        
        <div className="test-breakdown">
          <h4>🧩 What This Test Actually Does:</h4>
          <div className="breakdown-grid">
            <div className="breakdown-step">
              <div className="step-number">1</div>
              <div className="step-content">
                <strong>Setup:</strong> Renders component with specific test data
              </div>
            </div>
            <div className="breakdown-step">
              <div className="step-number">2</div>
              <div className="step-content">
                <strong>Initial Assertions:</strong> Verifies component renders without crashing
              </div>
            </div>
            <div className="breakdown-step">
              <div className="step-number">3</div>
              <div className="step-content">
                <strong>Interaction:</strong> Simulates user clicks (if applicable)
              </div>
            </div>
            <div className="breakdown-step">
              <div className="step-number">4</div>
              <div className="step-content">
                <strong>Verification:</strong> Checks UI updates match expected behavior
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Insights */}
      <div className="learning-insights">
        <h3>🎓 Key Learning Points from This Test</h3>
        <div className="insights-grid">
          <div className="insight-card">
            <h4>Test Category: {activeTest.category.toUpperCase()}</h4>
            <p>
              {activeTest.category === 'rendering' 
                ? "Rendering tests verify that components display correctly with given props. They test the 'output' of the component."
                : activeTest.category === 'interaction'
                ? "Interaction tests simulate user actions and verify component responses. They test event handlers and state updates."
                : activeTest.category === 'edge'
                ? "Edge case tests handle boundary conditions and error states. They ensure robustness."
                : activeTest.category === 'behavior'
                ? "Behavior tests verify complex logic and state management. They test 'how' the component works."
                : "Visual tests ensure UI elements correctly reflect component state."}
            </p>
          </div>
          
          <div className="insight-card">
            <h4>Testing Strategy</h4>
            <p>
              {activeTest.id === 1 
                ? "Start with rendering tests - they're the foundation. Ensure basic display works before testing interactions."
                : activeTest.id === 2
                ? "Test edge cases early. Empty states, null values, and boundary conditions often hide bugs."
                : activeTest.id === 3
                ? "Test user interactions by simulating events. Verify both the action and the resulting UI changes."
                : activeTest.id === 4
                ? "Test component behavior, not just appearance. Verify state transitions and business logic."
                : activeTest.id === 5
                ? "Test visual feedback. UI should accurately reflect component state."
                : "Test default behaviors and prop fallbacks. Components should be resilient."}
            </p>
          </div>
          
          <div className="insight-card">
            <h4>Code Coverage Insight</h4>
            <p>
              This test validates {activeTest.coveredLines.length} lines of code.
              {activeTest.coveredLines.includes(13) 
                ? " Importantly, it tests the core toggle logic on line 13."
                : " It focuses on the rendering and display aspects."}
              {uncoveredLines.length > 0 && activeTest.id === testCases.length 
                ? ` There are still ${uncoveredLines.length} lines not covered by any test. Consider adding tests for these.`
                : " Good test coverage ensures code maintainability and prevents regressions."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestIntuitionVisualizer;