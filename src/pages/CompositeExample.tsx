import { useState, useRef } from "react";

import { CompositeSelect } from "composite-select/composite-select/react";
import { CompositeSelect as CompositeSelectElement } from "composite-select/composite-select/composite-select";
import type { Item } from "composite-select/types";

import "composite-select/floating-label-pattern.css";
import "composite-select/popover.css";
import "composite-select/composition/selected-section/SelectedSectionManager.css";
import "composite-select/composition/options-section/OptionsSectionManager.css";

type CustomItem = Item & {
  color: string;
  img: string;
};

export default function CompositeExample() {
  const csRef = useRef<CompositeSelectElement<CustomItem>>(null);

  const [optionsPosition, setOptionsPosition] = useState("cover-bottom");

  return (
    <div style={{ padding: "20px", background: "#fafafa", border: "1px dashed #ccc", marginBottom: "20px" }}>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <pre>{JSON.stringify({ optionsPosition }, null, 2)}</pre>
      <CompositeSelect<CustomItem>
        ref={csRef}
        //   selected-selected={selectedItems}
        //   selected-value={selectedValue}
        //   selected-label={selectedLabel}
        //   selected-disabled={selectedDisabled}
        //   selected-loading={selectedLoading}
        //   selected-error={selectedError}
        //   selected-show-input={selectedShowInput}
        //   selected-show-delete={showDeleteSel}
        //   selected-onFocus={handleFocus}
        //   selected-onDelete={handleDelete}
        //   selected-onInputChange={debouncedHandleChangeValue}
        //   selected-onClear={handleClear}
        //   selected-onChange={(selected) => console.log("onChange: ", selected)}
        //   selected-onComponentChange={handleSelectedItemsChanged}
        //   options-options={options}
        //   options-value={selectedValue}
        //   options-label={optionsLabel}
        //   options-max-height={optionsMaxHeight}
        //   options-show-footer={optionsShowFooter}
        //   options-show-filter={optionsShowFilter}
        //   options-disabled={optionsDisabled}
        //   options-loading={optionsLoading}
        //   options-onItemPick={handlePick}
        //   options-onInputChange={debouncedHandleInputChange}
        //   options-onOk={handleOk}
        //   options-onCancel={handleCancel}
        //   options-onComponentChange={handleOptionsChanged}
        container-position={optionsPosition}
        //   container-onClose={handleClose}
      ></CompositeSelect>
      <hr />
      <select onChange={(e) => setOptionsPosition(e.target.value)} value={optionsPosition}>
        <option value="cover-bottom" selected={optionsPosition === "cover-bottom"}>
          cover-bottom
        </option>
        <option value="cover-top" selected={optionsPosition === "cover-top"}>
          cover-top
        </option>
        <option value="anchor-bottom" selected={optionsPosition === "anchor-bottom"}>
          anchor-bottom
        </option>
        <option value="anchor-top" selected={optionsPosition === "anchor-top"}>
          anchor-top
        </option>
        <option value="attach-bottom" selected={optionsPosition === "attach-bottom"}>
          attach-bottom
        </option>
        <option value="attach-top" selected={optionsPosition === "attach-top"}>
          attach-top
        </option>
        <option value="attach-left" selected={optionsPosition === "attach-left"}>
          attach-left
        </option>
        <option value="attach-right" selected={optionsPosition === "attach-right"}>
          attach-right
        </option>
      </select>
      <hr />
      <a href="https://github.com/stopsopa/select-component-sandbox/blob/main/src/pages/CompositeExample.tsx" className="gcp-css">source</a>
    </div>
  );
}
