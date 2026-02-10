import React from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionItemButton,
  AccordionItemHeading,
  AccordionItemPanel,
} from 'react-accessible-accordion';

const FaqOne = (props) => {
  const { itemClass, items } = props;

  return (
    <div
      className={
        itemClass
          ? itemClass
          : 'it-custom-accordion it-custom-accordion-style-2'
      }
    >
      <Accordion className="accordion" preExpanded={['a']} allowZeroExpanded>
        {items.map((item) => (
          <AccordionItem
            key={item.id}
            className="accordion-items"
            uuid={item.id}
          >
            <AccordionItemHeading className="accordion-header">
              <AccordionItemButton className="accordion-buttons">
                {item.btnText}
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              <div className="accordion-body d-flex align-items-center">
                <p className="mb-0">{item.description}</p>
                <img className="d-none d-xl-block" src={item.faqImage} alt="" />
              </div>
            </AccordionItemPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
};
export default FaqOne;
