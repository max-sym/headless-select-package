import React, { useEffect, useRef } from "react"
import { Combobox, Portal } from "@headlessui/react"
import { useSelectPopper } from "./use-select-popper"

const options = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
]

export const LocationSelect = ({
  form,
  menu: Menu,
  menuContainer: MenuContainer,
  option: Option,
  inputComponent: InputComponent,
  selectOnClick = true,
  name,
  autoComplete = "off",
  placeholder,
  offset,
}) => {
  const formStateItem = form?.state?.[name]
  const { element, setElement, setPopper, styles, attributes } =
    useSelectPopper({
      offset,
    })

  const btn = useRef<HTMLButtonElement | null>(null)

  const onSelect = (option) => {
    form.setFieldState(name, { value: option })
    setTimeout(() => {
      const focusOnNext = form.formSchema[name].focusOnNext
      if (!focusOnNext) return

      const formItem = form.formSchema[focusOnNext]
      if (formItem.type === "location")
        return form.refs[focusOnNext]?.current?.focus()

      form.focusOn(focusOnNext)
    }, 50)
  }

  const onFocus = () => {
    btn?.current?.click?.()
    if (selectOnClick) {
      element?.select?.()
    }
  }

  useEffect(() => {
    //@ts-ignore
    form.refs[name].current = element
  }, [element])

  return (
    <Combobox value={formStateItem.value} onChange={onSelect}>
      {({ open }) => (
        <>
          <Combobox.Input
            onFocus={onFocus}
            displayValue={(v: any) => v.label}
            onChange={() => {}}
            ref={setElement}
            as={InputComponent}
            placeholder={placeholder}
            autoComplete={autoComplete}
            name={name}
            form={form}
          />
          <Combobox.Button style={{ display: "none" }} ref={btn} />
          <Portal>
            <Combobox.Options
              as={MenuContainer}
              ref={setPopper}
              static
              style={{ ...styles.popper, pointerEvents: open ? "" : "none" }}
              {...attributes.popper}
            >
              <Menu open={open}>
                {options.map((option) => (
                  <Combobox.Option
                    key={option.value}
                    value={option}
                    as={React.Fragment}
                  >
                    {option.label}
                  </Combobox.Option>
                ))}
              </Menu>
            </Combobox.Options>
          </Portal>
        </>
      )}
    </Combobox>
  )
}
