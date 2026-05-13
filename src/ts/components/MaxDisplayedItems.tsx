/**
Based on https://mantine.dev/combobox/?e=MaxDisplayedItems
*/
import { withMantine } from "../utils/withMantine";
import React, { useState } from "react";
import { DashComponentProps } from "../props";

const groceries = [
  "🍎 Apples",
  "🍌 Bananas",
  "🥦 Broccoli",
  "🥕 Carrots",
  "🍫 Chocolate",
];


type Props = DashComponentProps & {
  /**
   * Maximum number of items that will be displayed. Once the limit is reached, options will be summarized in a single pill "+n more".
   */
  maxItems: number;
  /**
   * Internal property used to pass Mantine components to the component.
   */
  mantine?: any;
};

// Component will be exported using the `withMantine` wrapper below.
function MaxDisplayedItems(props: Props) {
  const { id, mantine, maxItems } = props;

  const {
    CheckIcon,
    Combobox,
    Group,
    Input,
    Pill,
    PillsInput,
    useCombobox,
  } = mantine;

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => combobox.updateSelectedOptionIndex('active'),
  });

  const [value, setValue] = useState<string[]>([]);

  const handleValueSelect = (val: string) =>
    setValue((current) =>
      current.includes(val) ? current.filter((v) => v !== val) : [...current, val]
    );

  const handleValueRemove = (val: string) =>
    setValue((current) => current.filter((v) => v !== val));

  const values = value
    .slice(
      0,
      props.maxItems === value.length ? props.maxItems : props.maxItems - 1
    )
    .map((item) => (
      <Pill key={item} withRemoveButton onRemove={() => handleValueRemove(item)}>
        {item}
      </Pill>
    ));

  const options = groceries.map((item) => (
    <Combobox.Option value={item} key={item} active={value.includes(item)}>
      <Group gap="sm">
        {value.includes(item) ? <CheckIcon size={12} /> : null}
        <span>{item}</span>
      </Group>
    </Combobox.Option>
  ));

  return (
    <Combobox store={combobox} onOptionSubmit={handleValueSelect} withinPortal={false}>
      <Combobox.DropdownTarget>
        <PillsInput pointer onClick={() => combobox.toggleDropdown()}>
          <Pill.Group>
            {value.length > 0 ? (
              <>
                {values}
                {value.length > props.maxItems && (
                  <Pill>+{value.length - (props.maxItems - 1)} more</Pill>
                )}
              </>
            ) : (
              <Input.Placeholder>Pick one or more values</Input.Placeholder>
            )}

            <Combobox.EventsTarget>
              <PillsInput.Field
                type="hidden"
                onBlur={() => combobox.closeDropdown()}
                onKeyDown={(event) => {
                  if (event.key === 'Backspace' && value.length > 0) {
                    event.preventDefault();
                    handleValueRemove(value[value.length - 1]);
                  }
                }}
              />
            </Combobox.EventsTarget>
          </Pill.Group>
        </PillsInput>
      </Combobox.DropdownTarget>

      <Combobox.Dropdown>
        <Combobox.Options>{options}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}

/**
 * A combobox that limits the max number of options that can be displayed.
 * Once the limit is reached, options will be summarized in a single pill "+n more".
 */
export default withMantine(MaxDisplayedItems);