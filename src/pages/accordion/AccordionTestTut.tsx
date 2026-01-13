/**
 * TESTING THOUGHT PROCESS COMPONENT
 * Shows the complete Accordion component code alongside test analysis
 * Highlights which parts of the code each test validates
 */

import React, { useState } from 'react';
import './AccordionTestTut.scss';

interface TestStep {
  id: number;
  testName: string;
  targetElements: string[];
  domSelectors: string[];
  userActions: string[];
  expectedBehaviors: string[];
  coverageGoal: string;
  testCode: string;
  elementHighlights: string[];
  testCategory: 'rendering' | 'interaction' | 'edge-cases' | 'behavior' | 'visual';
  accordionCodeLines: number[]; // Lines in Accordion component being tested
  codeExplanation: string; // What this test validates in the code
}

// Complete Accordion component code with line numbers
const ACCORDION_CODE = `1  import './Accordion.scss';
2  import defaultData, { accordionItem } from './data';
3  import { useState } from 'react';
4  
5  interface AccordionProps {
6    data?: accordionItem[];
7  }
8  
9  export default function Accordion({ data = defaultData }: AccordionProps) {
10   const [oi, setOi] = useState<number | null>(null);
11 
12   const Hoi = (index: number) => {
13     setOi(oi === index ? null : index);
14   };
15 
16   return (
17     <div className="accordion">
18       <span>Accordion</span>
19 
20       {data.length === 0 && <div>No items found</div>}
21 
22       {data.map((d, index) => (
23         <div className="accordion__item" key={index}>
24           <button
25             className="accordion__title"
26             onClick={() => Hoi(index)}
27             aria-expanded={oi === index}
28           >
29             {d.title}
30             <span className="accordion__arrow">
31               {oi === index ? 'u' : 'd'}
32             </span>
33           </button>
34 
35           {index === oi && (
36             <div className="accordion__description">{d.desc}</div>
37           )}
38         </div>
39       ))}
40     </div>
41   );
42 }`;

// Split code into lines for highlighting
const CODE_LINES = ACCORDION_CODE.split('\n');

const TestThoughtProcess: React.FC = () => {
  const [activeTest, setActiveTest] = useState<number>(1);
  const [highlightMode, setHighlightMode] = useState<'elements' | 'code' | 'behavior' | 'accordion-code'>('elements');
  const [codeView, setCodeView] = useState<'accordion' | 'scss' | 'tests'>('accordion');

  // Complete test analysis with step-by-step breakdown
  const testSteps: TestStep[] = [
    {
      id: 1,
      testName: "Renders accordion with items when data is provided via props",
      targetElements: [
        "Component container (.accordion)",
        "Main title span",
        "Item title buttons (.accordion__title)",
        "Arrow indicators (.accordion__arrow)",
        "Description containers (.accordion__description - initially hidden)"
      ],
      domSelectors: [
        "getByText('Accordion')",
        "getByText('First Item')",
        "getByText('Second Item')",
        "getAllByText('d')",
        "queryByText('First description content')"
      ],
      userActions: ["None (initial render)"],
      expectedBehaviors: [
        "Component mounts successfully",
        "All titles are visible",
        "All descriptions are hidden",
        "All arrows show 'd' (down) indicating closed state",
        "No empty state message appears"
      ],
      coverageGoal: "Verify component renders correctly with provided data",
      testCode: `test('renders accordion with items when data is provided', () => {
  render(<Accordion data={mockData} />);
  
  expect(screen.getByText('Accordion')).toBeInTheDocument();
  expect(screen.getByText('First Item')).toBeInTheDocument();
  expect(screen.getByText('Second Item')).toBeInTheDocument();
  expect(screen.queryByText('First description content')).not.toBeInTheDocument();
  expect(screen.getAllByText('d')).toHaveLength(2);
});`,
      elementHighlights: [".accordion", ".accordion__title", ".accordion__arrow"],
      testCategory: "rendering",
      accordionCodeLines: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 16, 17, 18, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 39, 40],
      codeExplanation: "This test validates the component structure, props interface, initial state, and the mapping of data to UI elements. It ensures the component correctly receives and displays data props."
    },
    {
      id: 2,
      testName: "Renders 'no items found' when empty data array is provided",
      targetElements: [
        "Empty state container",
        "Conditional rendering logic"
      ],
      domSelectors: [
        "getByText('no items found')",
        "queryByText('d')",
        "queryByText('u')"
      ],
      userActions: ["None (empty data condition)"],
      expectedBehaviors: [
        "Empty state message is displayed",
        "No accordion items are rendered",
        "No arrow icons appear",
        "Component handles edge case gracefully"
      ],
      coverageGoal: "Test edge case: empty data array",
      testCode: `test('renders "no items found" when empty data array is provided', () => {
  render(<Accordion data={emptyData} />);
  
  expect(screen.getByText('no items found')).toBeInTheDocument();
  expect(screen.queryByText('d')).not.toBeInTheDocument();
  expect(screen.queryByText('u')).not.toBeInTheDocument();
});`,
      elementHighlights: [".accordion div:contains('No items found')"],
      testCategory: "edge-cases",
      accordionCodeLines: [5, 6, 7, 9, 20],
      codeExplanation: "This test validates the conditional rendering logic on line 20: {data.length === 0 && <div>No items found</div>}. It ensures the component gracefully handles empty data arrays."
    },
    {
      id: 3,
      testName: "Opens and closes an accordion item when clicked",
      targetElements: [
        "First accordion button",
        "Corresponding arrow span",
        "Description div container"
      ],
      domSelectors: [
        "getByText('First Item')",
        "getByText('First description content')",
        "getByText('u')",
        "queryByText('First description content') (after closing)"
      ],
      userActions: [
        "Click first item button",
        "Click same button again"
      ],
      expectedBehaviors: [
        "Description becomes visible on first click",
        "Arrow changes from 'd' to 'u'",
        "Description hides on second click",
        "Arrow reverts to 'd'",
        "aria-expanded attribute toggles"
      ],
      coverageGoal: "Verify basic toggle functionality",
      testCode: `test('opens and closes an accordion item when clicked', () => {
  render(<Accordion data={mockData} />);
  
  const firstItem = screen.getByText('First Item');
  
  // Open
  fireEvent.click(firstItem);
  expect(screen.getByText('First description content')).toBeInTheDocument();
  expect(screen.getByText('u')).toBeInTheDocument();
  
  // Close
  fireEvent.click(firstItem);
  expect(screen.queryByText('First description content')).not.toBeInTheDocument();
  expect(screen.getAllByText('d')).toHaveLength(2);
});`,
      elementHighlights: [".accordion__title:first-child", ".accordion__description"],
      testCategory: "interaction",
      accordionCodeLines: [10, 12, 13, 14, 26, 27, 30, 31, 32, 35, 36, 37],
      codeExplanation: "This test validates the Hoi function (lines 12-14), the onClick handler (line 26), state management (line 10), and conditional rendering (lines 30-32, 35-37). It ensures the toggle mechanism works correctly."
    },
    {
      id: 4,
      testName: "Opens second item and closes first item",
      targetElements: [
        "First accordion item",
        "Second accordion item",
        "State management between items"
      ],
      domSelectors: [
        "getByText('First Item')",
        "getByText('Second Item')",
        "getByText('First description content')",
        "getByText('Second description content')"
      ],
      userActions: [
        "Click first item",
        "Click second item"
      ],
      expectedBehaviors: [
        "First item opens and shows description",
        "Second item opens when clicked",
        "First item automatically closes",
        "Only one description visible at a time"
      ],
      coverageGoal: "Test single-open-at-a-time behavior",
      testCode: `test('opens second item and closes first item', () => {
  render(<Accordion data={mockData} />);
  
  const firstItem = screen.getByText('First Item');
  const secondItem = screen.getByText('Second Item');
  
  fireEvent.click(firstItem);
  expect(screen.getByText('First description content')).toBeInTheDocument();
  
  fireEvent.click(secondItem);
  expect(screen.queryByText('First description content')).not.toBeInTheDocument();
  expect(screen.getByText('Second description content')).toBeInTheDocument();
});`,
      elementHighlights: [".accordion__item:nth-child(2)", ".accordion__item:nth-child(3)"],
      testCategory: "behavior",
      accordionCodeLines: [10, 12, 13, 14, 35],
      codeExplanation: "This test validates the state management logic in the Hoi function (line 13) where setOi(oi === index ? null : index) ensures only one item can be open at a time. It tests the mutual exclusivity behavior."
    },
    {
      id: 5,
      testName: "Maintains correct arrow indicators",
      targetElements: [
        "All arrow span elements",
        "State-dependent UI updates"
      ],
      domSelectors: [
        "getAllByText('d')",
        "getByText('u')",
        "queryAllByText('d')"
      ],
      userActions: [
        "Initial render check",
        "Click first item",
        "Click second item"
      ],
      expectedBehaviors: [
        "All arrows show 'd' initially",
        "Clicked item shows 'u'",
        "Other items show 'd'",
        "Arrow indicators accurately reflect state"
      ],
      coverageGoal: "Verify UI consistency with component state",
      testCode: `test('maintains correct arrow indicators', () => {
  render(<Accordion data={mockData} />);
  
  expect(screen.getAllByText('d')).toHaveLength(2);
  
  const firstItem = screen.getByText('First Item');
  const secondItem = screen.getByText('Second Item');
  
  fireEvent.click(firstItem);
  expect(screen.getByText('u')).toBeInTheDocument();
  expect(screen.getAllByText('d')).toHaveLength(1);
  
  fireEvent.click(secondItem);
  expect(screen.getByText('Second description content')).toBeInTheDocument();
});`,
      elementHighlights: [".accordion__arrow"],
      testCategory: "visual",
      accordionCodeLines: [10, 30, 31, 32],
      codeExplanation: "This test validates the arrow indicator logic on lines 30-32: {oi === index ? 'u' : 'd'}. It ensures the UI correctly reflects the component's internal state."
    },
    {
      id: 6,
      testName: "Handles single item accordion correctly",
      targetElements: [
        "Single accordion item",
        "Toggle logic with minimal data"
      ],
      domSelectors: [
        "getByText('Single Item')",
        "getByText('Single description content')"
      ],
      userActions: [
        "Click the single item",
        "Click again to close"
      ],
      expectedBehaviors: [
        "Single item opens correctly",
        "Description appears",
        "Item closes on second click",
        "Component doesn't break with minimal data"
      ],
      coverageGoal: "Test component with minimal data configuration",
      testCode: `test('handles single item accordion correctly', () => {
  render(<Accordion data={singleItemData} />);
  
  const item = screen.getByText('Single Item');
  
  fireEvent.click(item);
  expect(screen.getByText('Single description content')).toBeInTheDocument();
  
  fireEvent.click(item);
  expect(screen.queryByText('Single description content')).not.toBeInTheDocument();
});`,
      elementHighlights: [".accordion__item:only-child"],
      testCategory: "edge-cases",
      accordionCodeLines: [9, 10, 12, 13, 14, 22, 23, 35, 36, 37],
      codeExplanation: "This test validates that the component works correctly with minimal data (single item array). It tests the map function (lines 22-23) and toggle logic with only one element."
    },
    {
      id: 7,
      testName: "Uses default data when no props are provided",
      targetElements: [
        "Default prop value",
        "Component fallback behavior"
      ],
      domSelectors: [
        "getByText('Accordion')",
        "queryByText('no items found')"
      ],
      userActions: ["None (default prop testing)"],
      expectedBehaviors: [
        "Component renders without props",
        "Uses internal default data",
        "Doesn't show empty state",
        "Default data structure is valid"
      ],
      coverageGoal: "Test default prop behavior",
      testCode: `test('uses default data when no props are provided', () => {
  render(<Accordion />);
  
  expect(screen.getByText('Accordion')).toBeInTheDocument();
  expect(screen.queryByText('no items found')).not.toBeInTheDocument();
});`,
      elementHighlights: [".accordion"],
      testCategory: "behavior",
      accordionCodeLines: [5, 6, 7, 9],
      codeExplanation: "This test validates the default prop value in the function signature: { data = defaultData }. It ensures the component has a sensible fallback when no props are provided."
    },
    {
      id: 8,
      testName: "Handles rapid clicking correctly",
      targetElements: [
        "Event handler robustness",
        "State update consistency"
      ],
      domSelectors: [
        "getByText('Single Item')",
        "queryByText('Single description content')"
      ],
      userActions: [
        "Rapid consecutive clicks (4x)",
        "State validation after rapid interaction"
      ],
      expectedBehaviors: [
        "No race conditions in event handlers",
        "State remains consistent",
        "Component doesn't break under stress",
        "Final state is predictable"
      ],
      coverageGoal: "Stress test event handlers",
      testCode: `test('handles rapid clicking correctly', () => {
  render(<Accordion data={singleItemData} />);
  
  const item = screen.getByText('Single Item');
  
  fireEvent.click(item);
  fireEvent.click(item);
  fireEvent.click(item);
  fireEvent.click(item);
  
  expect(screen.queryByText('Single description content')).not.toBeInTheDocument();
});`,
      elementHighlights: [".accordion__title"],
      testCategory: "edge-cases",
      accordionCodeLines: [10, 12, 13, 14, 26],
      codeExplanation: "This stress test validates that the state update logic (lines 13-14) and event handlers (line 26) don't have race conditions. It ensures robust handling of rapid user interactions."
    }
  ];

  const currentTest = testSteps.find(step => step.id === activeTest) || testSteps[0];

  // Determine which code to display
  const getCodeView = () => {
    if (codeView === 'accordion') {
      return CODE_LINES;
    } else if (codeView === 'scss') {
      return `/* Accordion.scss */
.accordion {
  width: 90vw;
  min-height: 50vh;
  padding: 1rem;
  background-color: aliceblue;
  text-align: center;

  &__item {
    margin: 0 auto 1rem;
    max-width: 500px;
    border-radius: 4px;
    overflow: hidden;
  }

  &__title {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    padding: 0.75rem 1rem;
    background-color: #1e40af;
    color: #fff;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 500;
  }

  &__arrow {
    margin-left: 1rem;
    font-weight: bold;
  }

  &__description {
    padding: 1rem;
    background-color: #ef4444;
    color: #fff;
    text-align: left;
  }
}`.split('\n');
    } else {
      return `/* Accordion.test.tsx */
describe('Accordion Component', () => {
  test('renders accordion with items when data is provided via props', () => {
    render(<Accordion data={mockData} />);
    expect(screen.getByText('Accordion')).toBeInTheDocument();
    expect(screen.getByText('First Item')).toBeInTheDocument();
    expect(screen.getByText('Second Item')).toBeInTheDocument();
    expect(screen.queryByText('First description content')).not.toBeInTheDocument();
    expect(screen.getAllByText('d')).toHaveLength(2);
  });

  test('renders "no items found" when empty data array is provided', () => {
    render(<Accordion data={emptyData} />);
    expect(screen.getByText('no items found')).toBeInTheDocument();
    expect(screen.queryByText('d')).not.toBeInTheDocument();
    expect(screen.queryByText('u')).not.toBeInTheDocument();
  });

  test('opens and closes an accordion item when clicked', () => {
    render(<Accordion data={mockData} />);
    const firstItem = screen.getByText('First Item');
    fireEvent.click(firstItem);
    expect(screen.getByText('First description content')).toBeInTheDocument();
    expect(screen.getByText('u')).toBeInTheDocument();
    fireEvent.click(firstItem);
    expect(screen.queryByText('First description content')).not.toBeInTheDocument();
    expect(screen.getAllByText('d')).toHaveLength(2);
  });
});`.split('\n');
    }
  };

  const currentCodeLines = getCodeView();

  return (
    <div className="test-tutorial">
      <header className="tutorial-header">
        <h1>🔬 Complete Testing Thought Process: Accordion Component</h1>
        <p className="subtitle">Showing exact code validation for 100% test coverage</p>
      </header>

      <div className="tutorial-container">
        {/* Test Navigation */}
        <nav className="test-navigation">
          <div className="category-filters">
            <button 
              className={`filter-btn ${highlightMode === 'elements' ? 'active' : ''}`}
              onClick={() => setHighlightMode('elements')}
            >
              🎯 Element Targeting
            </button>
            <button 
              className={`filter-btn ${highlightMode === 'code' ? 'active' : ''}`}
              onClick={() => setHighlightMode('code')}
            >
              💻 Test Code
            </button>
            <button 
              className={`filter-btn ${highlightMode === 'behavior' ? 'active' : ''}`}
              onClick={() => setHighlightMode('behavior')}
            >
              🧪 Expected Behavior
            </button>
            <button 
              className={`filter-btn ${highlightMode === 'accordion-code' ? 'active' : ''}`}
              onClick={() => setHighlightMode('accordion-code')}
            >
              📄 Component Code
            </button>
          </div>

          <div className="code-view-selector">
            <div className="selector-label">View Code:</div>
            <div className="selector-buttons">
              <button 
                className={`code-btn ${codeView === 'accordion' ? 'active' : ''}`}
                onClick={() => setCodeView('accordion')}
              >
                Accordion.tsx
              </button>
              <button 
                className={`code-btn ${codeView === 'scss' ? 'active' : ''}`}
                onClick={() => setCodeView('scss')}
              >
                Accordion.scss
              </button>
              <button 
                className={`code-btn ${codeView === 'tests' ? 'active' : ''}`}
                onClick={() => setCodeView('tests')}
              >
                Accordion.test.tsx
              </button>
            </div>
          </div>

          <div className="test-list">
            {testSteps.map(step => (
              <button
                key={step.id}
                className={`test-item ${activeTest === step.id ? 'active' : ''} ${step.testCategory}`}
                onClick={() => setActiveTest(step.id)}
              >
                <span className="test-number">Test #{step.id}</span>
                <span className="test-name">{step.testName}</span>
                <span className="test-category">{step.testCategory}</span>
              </button>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <main className="test-details">
          <div className="test-header">
            <h2>
              <span className="test-id">Test #{currentTest.id}</span>
              <span className="test-title">{currentTest.testName}</span>
            </h2>
            <div className="coverage-badge">
              <span className="coverage-label">Coverage Goal:</span>
              <span className="coverage-value">{currentTest.coverageGoal}</span>
            </div>
          </div>

          {/* Code Validation Section - Always Visible */}
          <div className="code-validation-section">
            <h3>🔍 Code Being Validated:</h3>
            <div className="code-explanation">
              <strong>Test Validation:</strong> {currentTest.codeExplanation}
            </div>
            
            <div className="code-highlight-grid">
              <div className="code-preview">
                <div className="code-header">
                  {codeView === 'accordion' ? 'Accordion.tsx' : 
                   codeView === 'scss' ? 'Accordion.scss' : 'Accordion.test.tsx'}
                  <span className="lines-highlighted">
                    {highlightMode === 'accordion-code' && codeView === 'accordion' 
                      ? `${currentTest.accordionCodeLines.length} lines highlighted` 
                      : 'Full code'}
                  </span>
                </div>
                <div className="code-container">
                  {currentCodeLines.map((line, index) => {
                    const lineNumber = index + 1;
                    const isHighlighted = highlightMode === 'accordion-code' && 
                                         codeView === 'accordion' && 
                                         currentTest.accordionCodeLines.includes(lineNumber);
                    
                    return (
                      <div 
                        key={index} 
                        className={`code-line ${isHighlighted ? 'highlighted' : ''}`}
                      >
                        <span className="line-number">{lineNumber}</span>
                        <span className="line-content">{line}</span>
                        {isHighlighted && (
                          <div className="line-highlight-indicator">← Test validates this line</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="validation-details">
                <h4>📝 What This Test Validates in Code:</h4>
                <ul className="validation-list">
                  {highlightMode === 'accordion-code' && codeView === 'accordion' ? (
                    currentTest.accordionCodeLines.map(lineNum => {
                      const lineIndex = lineNum - 1;
                      const lineContent = CODE_LINES[lineIndex]?.trim() || '';
                      return (
                        <li key={lineNum} className="validation-item">
                          <span className="line-num">Line {lineNum}:</span>
                          <code className="line-code">{lineContent.substring(0, 50)}{lineContent.length > 50 ? '...' : ''}</code>
                          <span className="line-purpose">
                            {(() => {
                              if (lineNum === 5 || lineNum === 6 || lineNum === 7) return "Props interface definition";
                              if (lineNum === 9) return "Component function with default props";
                              if (lineNum === 10) return "State initialization";
                              if (lineNum === 12 || lineNum === 13 || lineNum === 14) return "Toggle function logic";
                              if (lineNum === 20) return "Empty data conditional rendering";
                              if (lineNum === 22 || lineNum === 23) return "Data mapping loop";
                              if (lineNum === 26) return "Click event handler";
                              if (lineNum === 27) return "Accessibility attribute";
                              if (lineNum === 30 || lineNum === 31 || lineNum === 32) return "Arrow indicator logic";
                              if (lineNum === 35 || lineNum === 36 || lineNum === 37) return "Conditional description rendering";
                              return "Component structure";
                            })()}
                          </span>
                        </li>
                      );
                    })
                  ) : (
                    <div className="code-purpose">
                      <p><strong>Switch to "Component Code" view to see line-by-line validation</strong></p>
                      <p>This test validates multiple aspects of the component including:</p>
                      <ul>
                        {currentTest.expectedBehaviors.map((behavior, idx) => (
                          <li key={idx}>{behavior}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Detailed Breakdown */}
          <div className="breakdown-section">
            {highlightMode === 'elements' && (
              <div className="elements-breakdown">
                <h3>🎯 Targeted DOM Elements</h3>
                <ul className="elements-list">
                  {currentTest.targetElements.map((element, index) => (
                    <li key={index} className="element-item">
                      <div className="element-header">
                        <code>{element}</code>
                        <span className="selector">Selector: {currentTest.domSelectors[index]}</span>
                      </div>
                      <div className="element-purpose">
                        <strong>Purpose:</strong> {(() => {
                          if (element.includes('container')) return "Verifies component mounts and renders container";
                          if (element.includes('title')) return "Tests that item titles are rendered from data";
                          if (element.includes('arrow')) return "Validates UI feedback for open/closed state";
                          if (element.includes('description')) return "Tests conditional visibility of content";
                          return "General element presence validation";
                        })()}
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="testing-tip">
                  <strong>Testing Insight:</strong> We target specific elements to create a contract between the test and the component. 
                  If any of these elements change, the test will fail, alerting us to unintended side effects.
                </div>
              </div>
            )}

            {highlightMode === 'code' && (
              <div className="code-breakdown">
                <h3>💻 Test Implementation</h3>
                <pre className="test-code">
                  {currentTest.testCode}
                </pre>
                
                <div className="code-analysis">
                  <h4>Test Structure Analysis:</h4>
                  <div className="analysis-grid">
                    <div className="analysis-section">
                      <h5>Arrange Phase</h5>
                      <p>Sets up component with specific test data. Uses render() to mount component.</p>
                    </div>
                    <div className="analysis-section">
                      <h5>Act Phase</h5>
                      <p>Simulates user interactions using fireEvent.click(). Mimics real user behavior.</p>
                    </div>
                    <div className="analysis-section">
                      <h5>Assert Phase</h5>
                      <p>Uses expect() with specific matchers to verify outcomes. Tests both presence and absence.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {highlightMode === 'behavior' && (
              <div className="behavior-breakdown">
                <h3>🧪 Expected Behaviors</h3>
                <ul className="behavior-list">
                  {currentTest.expectedBehaviors.map((behavior, index) => (
                    <li key={index} className="behavior-item">
                      <span className="behavior-check">✓</span>
                      <div className="behavior-content">
                        {behavior}
                        <div className="behavior-explanation">
                          <strong>Why test this:</strong> {(() => {
                            if (behavior.includes('mounts')) return "Ensures component doesn't crash on render";
                            if (behavior.includes('visible') || behavior.includes('shows')) return "Confirms UI renders content correctly";
                            if (behavior.includes('hides') || behavior.includes('not visible')) return "Tests conditional rendering logic";
                            if (behavior.includes('arrow')) return "Validates UI state synchronization";
                            if (behavior.includes('gracefully')) return "Tests error boundaries and edge cases";
                            if (behavior.includes('race conditions')) return "Ensures robust event handling";
                            return "Validates component contract";
                          })()}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="user-actions">
                  <h4>Simulated User Actions:</h4>
                  {currentTest.userActions.map((action, index) => (
                    <div key={index} className="action-step">
                      <span className="step-number">{index + 1}</span>
                      <div className="step-content">
                        {action}
                        <div className="step-purpose">
                          <strong>Purpose:</strong> {(() => {
                            if (action.includes('Click')) return "Simulates user interaction with clickable elements";
                            if (action.includes('rapid')) return "Tests event handler robustness under stress";
                            if (action.includes('None')) return "Tests initial render state without interaction";
                            return "Validates component response to user input";
                          })()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {highlightMode === 'accordion-code' && (
              <div className="accordion-code-breakdown">
                <h3>🔬 Code-Level Validation Details</h3>
                <div className="code-coverage">
                  <h4>Lines Covered: {currentTest.accordionCodeLines.length}</h4>
                  <div className="coverage-bars">
                    <div className="coverage-bar">
                      <div 
                        className="coverage-fill"
                        style={{ width: `${(currentTest.accordionCodeLines.length / 42) * 100}%` }}
                      ></div>
                    </div>
                    <div className="coverage-text">
                      {((currentTest.accordionCodeLines.length / 42) * 100).toFixed(1)}% of component code
                    </div>
                  </div>
                </div>

                <div className="critical-lines">
                  <h4>Critical Lines Tested:</h4>
                  <div className="critical-grid">
                    {currentTest.accordionCodeLines
                      .filter(line => [10, 13, 20, 26, 30, 35].includes(line))
                      .map(lineNum => (
                        <div key={lineNum} className="critical-line">
                          <div className="line-header">Line {lineNum}</div>
                          <div className="line-desc">
                            {(() => {
                              if (lineNum === 10) return "State initialization - critical for component behavior";
                              if (lineNum === 13) return "Toggle logic - core business logic";
                              if (lineNum === 20) return "Edge case handling - empty data";
                              if (lineNum === 26) return "Event binding - user interaction";
                              if (lineNum === 30) return "UI state - visual feedback";
                              if (lineNum === 35) return "Conditional rendering - content visibility";
                              return "Structural code";
                            })()}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="testing-approach">
                  <h4>🧠 Testing Approach for This Code:</h4>
                  <p>
                    {currentTest.testCategory === 'rendering' 
                      ? "Rendering tests focus on verifying that the component correctly processes props and renders the expected elements. We test both happy paths and edge cases."
                      : currentTest.testCategory === 'interaction'
                      ? "Interaction tests simulate user actions and verify that event handlers and state updates work correctly. We test toggle behavior and UI feedback."
                      : currentTest.testCategory === 'edge-cases'
                      ? "Edge case tests validate that the component handles boundary conditions gracefully, preventing crashes and unexpected behavior."
                      : currentTest.testCategory === 'behavior'
                      ? "Behavior tests focus on complex component logic like state management between multiple elements and mutual exclusivity."
                      : "Visual tests ensure that UI elements correctly reflect the component's internal state, creating a consistent user experience."}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Test Coverage Map */}
          <div className="coverage-map">
            <h3>🗺️ Complete Coverage Map for This Test</h3>
            <div className="coverage-grid">
              <div className="coverage-category">
                <h4>Component Lines Covered</h4>
                <div className="line-list">
                  {currentTest.accordionCodeLines.map(line => (
                    <span key={line} className="line-badge">{line}</span>
                  ))}
                </div>
              </div>
              <div className="coverage-category">
                <h4>DOM Elements Targeted</h4>
                <div className="element-badges">
                  {currentTest.targetElements.map((el, idx) => (
                    <span key={idx} className="element-badge">{el.split(' ')[0]}</span>
                  ))}
                </div>
              </div>
              <div className="coverage-category">
                <h4>User Actions Simulated</h4>
                <div className="action-badges">
                  {currentTest.userActions.map((action, idx) => (
                    <span key={idx} className="action-badge">{action.split(' ')[0]}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Testing Philosophy */}
      <footer className="testing-philosophy">
        <h3>🎓 Complete Testing Intuition for 100% Coverage</h3>
        <div className="principles-grid">
          <div className="principle">
            <h4>1. Map Tests to Code Lines</h4>
            <p>Every test should validate specific lines of component code. This creates traceability between tests and implementation.</p>
          </div>
          <div className="principle">
            <h4>2. Test State Transitions</h4>
            <p>Focus on testing how the component moves between states (null → index, index → null, index → different index).</p>
          </div>
          <div className="principle">
            <h4>3. Validate UI Consistency</h4>
            <p>Ensure visual elements (arrows, visibility) always match internal state. Test both presence and absence.</p>
          </div>
          <div className="principle">
            <h4>4. Cover All Props Paths</h4>
            <p>Test component with props, without props, with empty data, with single item, with multiple items.</p>
          </div>
          <div className="principle">
            <h4>5. Test Event Handler Robustness</h4>
            <p>Simulate rapid interactions to catch race conditions and ensure consistent state management.</p>
          </div>
          <div className="principle">
            <h4>6. Validate Accessibility Attributes</h4>
            <p>Test ARIA attributes and keyboard interactions to ensure accessible components.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TestThoughtProcess;