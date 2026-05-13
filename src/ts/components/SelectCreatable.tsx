/**
https://mantine.dev/combobox/?e=SelectCreatable
*/

import { withMantine } from "../utils/withMantine";
import React, { useState } from "react";
import { DashComponentProps } from "../props";

const groceries = [
  '🍎 Apples',
  '🍌 Bananas',
  '🥦 Broccoli',
  '🥕 Carrots',
  '🍫 Chocolate',
  '🍇 Grapes',
];


type Props = DashComponentProps & {
  /**
   * Internal property used to pass Mantine components to the component.
   */
  mantine?: any;
};

// Component will be exported using the `withMantine` wrapper below.
function SelectCreatable(props: Props) {
  const { id, mantine } = props;
  const {
    Combobox,
    InputBase,
    useCombobox,
  } = mantine;
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const [data, setData] = useState(groceries);
  const [value, setValue] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const exactOptionMatch = data.some((item) => item === search);
  const filteredOptions = exactOptionMatch
    ? data
    : data.filter((item) => item.toLowerCase().includes(search.toLowerCase().trim()));

  const options = filteredOptions.map((item) => (
    <Combobox.Option value={item} key={item}>
      {item}
    </Combobox.Option>
  ));

  return (
    <Combobox
      store={combobox}
      withinPortal={false}
      onOptionSubmit={(val) => {
        if (val === '$create') {
          setData((current) => [...current, search]);
          setValue(search);
        } else {
          setValue(val);
          setSearch(val);
        }

        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <InputBase
          rightSection={<Combobox.Chevron />}
          value={search}
          onChange={(event) => {
            combobox.openDropdown();
            combobox.updateSelectedOptionIndex();
            setSearch(event.currentTarget.value);
          }}
          onClick={() => combobox.openDropdown()}
          onFocus={() => combobox.openDropdown()}
          onBlur={() => {
            combobox.closeDropdown();
            setSearch(value || '');
          }}
          placeholder="Search value"
          rightSectionPointerEvents="none"
        />
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>
          {options}
          {!exactOptionMatch && search.trim().length > 0 && (
            <Combobox.Option value="$create">+ Create {search}</Combobox.Option>
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}


/**
 * A combobox with an option to create new options.
 * When the user types in the input, they can either select an existing option or create a new one by submitting the current search value.
 */
export default withMantine(SelectCreatable);