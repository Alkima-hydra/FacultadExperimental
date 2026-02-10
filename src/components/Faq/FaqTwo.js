import React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
} from 'react-accessible-accordion';

const FaqTwo = (props) => {
  const { items } = props;

  return (
    <div>
      <Accordion className="accordion" preExpanded={['a']} allowZeroExpanded>
        {items.map((item) => (
          <AccordionItem
            key={item.id}
            className="accordion-item"
            uuid={item.id}
          >
            <AccordionItemHeading className="accordion-header">
              <AccordionItemButton className="accordion-button shadow-none">
                {item.btnText}
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <p>{item.description}</p>
            </AccordionItemPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};

export default FaqTwo;
