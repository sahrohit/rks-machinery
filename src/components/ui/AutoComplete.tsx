/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Fragment, type ReactNode, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { BsChevronExpand } from "react-icons/bs";
import { AiOutlineCheck } from "react-icons/ai";
import { type IProduct } from "~/pages/admin/products";
import { type UseFormSetValue } from "react-hook-form";

interface AutoCompleteProps {
  options: {
    id: string;
    name: string;
  }[];
  setValue: UseFormSetValue<IProduct>;
  description?: ReactNode;
}

const AutoComplete = ({ options, setValue ,description}: AutoCompleteProps) => {
  const [selected, setSelected] = useState(options[0]);
  const [query, setQuery] = useState("");

  const filteredOptions =
    query === ""
      ? options
      : options.filter((option) =>
          option.name
            .toLowerCase()
            .replace(/\s+/g, "")
            .includes(query.toLowerCase().replace(/\s+/g, ""))
        );

  return (
    <Combobox
      value={selected}
      onChange={(val) => {
        setSelected(val);
        setValue("categoryId", val.id);
      }}
    >
      <div className="relative h-full w-full">
        <div className="group relative z-20 inline-flex h-14 min-h-unit-10 w-full flex-col items-start justify-center gap-0 rounded-medium border-medium border-default-200 shadow-sm transition-colors !duration-150 transition-background data-[hover=true]:border-default-400 group-data-[focus=true]:border-foreground motion-reduce:transition-none">
          <Combobox.Input
            className="w-full rounded-md border-none py-4 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
            displayValue={(option: any) => option.name}
            onChange={(event) => setQuery(event.target.value)}
          />

          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <BsChevronExpand
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </Combobox.Button>
        </div>
        {description}
       
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
          afterLeave={() => setQuery("")}
        >
          <Combobox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredOptions.length === 0 && query !== "" ? (
              <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                Nothing found.
              </div>
            ) : (
              filteredOptions.map((option) => (
                <Combobox.Option
                  key={option.id}
                  className={({ active }) =>
                    `relative cursor-default select-none py-2 pl-10 pr-4 ${
                      active ? "bg-teal-600 text-white" : "text-gray-900"
                    }`
                  }
                  value={option}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-medium" : "font-normal"
                        }`}
                      >
                        {option.name}
                      </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? "text-white" : "text-teal-600"
                          }`}
                        >
                          <AiOutlineCheck
                            className="h-5 w-5"
                            aria-hidden="true"
                          />
                        </span>
                      ) : null}
                    </>
                  )}
                </Combobox.Option>
              ))
            )}
          </Combobox.Options>
        </Transition>
      </div>
    </Combobox>
  );
};

export default AutoComplete;
