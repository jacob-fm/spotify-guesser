import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import "./Accordion.css";

const Accordion = ({ items, keepOthersOpen }) => {
  const [accorionItems, setAccordionItems] = useState(null);

  useEffect(() => {
    if (items) {
      setAccordionItems([
        ...items.map((item) => ({
          ...item,
          toggled: false,
        })),
      ]);
    }
  }, [items]);

  function handleAccordionToggle(clickedItem) {
    setAccordionItems([
      ...accorionItems.map((item) => {
        let toggled = item.toggled;

        if (clickedItem.id === item.id) {
          toggled = !item.toggled;
        } else if (!keepOthersOpen) {
          toggled = false;
        }

        return {
          ...item,
          toggled,
        };
      }),
    ]);
  }

  return (
    <div className="accordion-parent">
      {accorionItems?.map((listItem, key) => {
        return (
          <div
            className={`accordion ${listItem.toggled ? "toggled" : ""}`}
            key={key}
          >
            <button
              className="toggle"
              onClick={() => handleAccordionToggle(listItem)}
            >
              <p>{listItem.label}</p>
              <ChevronDown
                size={34}
                className={`arrow ${listItem.toggled ? "active" : ""}`}
              />
            </button>
            <div className="content-parent">
              <div className="content">{listItem.renderContent()}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
