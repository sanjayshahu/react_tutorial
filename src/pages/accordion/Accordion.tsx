import './Accordion.scss';
import defaultData, { accordionItem } from './data';
import { useState } from 'react';
import AccordionTestTut from './AccordionTestTut'
import TestIntuitionVisualizer from './AccordionVisualiser';

interface AccordionProps {
  data?: accordionItem[];
}

export default function Accordion({ data = defaultData }: AccordionProps) {
  const [oi, setOi] = useState<number | null>(null);

  const Hoi = (index: number) => {
    setOi(oi === index ? null : index);
  };

  return (
    <div className="accordion">
      <span>Accordion</span>

      {data.length === 0 && <div>No items found</div>}

      {data.map((d, index) => (
        <div className="accordion__item" key={index}>
          <button
            className="accordion__title"
            onClick={() => Hoi(index)}
            aria-expanded={oi === index}
          >
            {d.title}
            <span className="accordion__arrow">
              {oi === index ? 'u' : 'd'}
            </span>
          </button>

          {index === oi && (
            <div className="accordion__description">{d.desc}</div>
          )}
        </div>
      ))}

      <span>tutorial begins here</span>
      <TestIntuitionVisualizer/>
     {/* < AccordionTestTut/> */}
    </div>
  );
}
