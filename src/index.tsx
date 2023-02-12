/* eslint-disable react/no-unused-class-component-methods */
/* eslint-disable no-constructor-return */
/* eslint-disable react/prop-types */
import React, { Component } from 'react'

let id = 0
function* generateId() {
  while (true) {
    yield (id += 1)
  }
}
const idGenerator = generateId()

interface ModalManagerProps {
  name: string
}

interface ModalManagerState {
  modals: any
}

interface contentProps {
  open: boolean
  onClose(): void
}

interface modalProps {
  key: number
  id: number
  props: any
  Component: any
  open: boolean
  onClose(): void
}

const defaultState: ModalManagerState = {
  modals: [],
}

class ModalManager extends Component<ModalManagerProps, ModalManagerState> {
  static #instanceArray: any = []

  static instance: any

  constructor(props: ModalManagerProps) {
    super(props)
    this.state = defaultState

    const modalManager = ModalManager.#instanceArray.find(({ name }: any) => name === props.name)
    if (modalManager) modalManager.instance = this
    else ModalManager.#instanceArray.unshift({ name: props.name, instance: this })
    ModalManager.instance = ModalManager.#instanceArray[0].instance

    return ModalManager.instance
  }

  componentWillUnmount() {
    this.unmount()
    this.clear()
  }

  showModal(Component: any, options = {}) {
    const { key, ...props }: any = options
    const [...modals] = this.state.modals
    const modal = modals.find((modal: any) => modal.key && modal.key === key)

    if (modal) {
      modal.open = true
      modal.props = props
    } else modals.push({ open: true, props, Component, key, id: key || idGenerator.next().value })

    this.setState({ modals })
  }

  delDueToBackButton(id: number) {
    this.setState(state => {
      const modal = state.modals.find((modal: any) => modal.id === id)
      if (modal) modal.open = false
      return { ...state }
    })
  }

  delModal(id: number) {
    this.delDueToBackButton(id)
  }

  unmount() {
    const instance = ModalManager.#instanceArray.find(({ name }: any) => name === this.props.name)
    const index = ModalManager.#instanceArray.indexOf(instance)
    if (index > -1) ModalManager.#instanceArray.splice(index, 1)

    ModalManager.instance = ModalManager.#instanceArray[0]?.instance
  }

  clear() {
    this.state.modals.forEach((_: any, i: number) => {
      this.delModal(i)
    })
  }

  render() {
    return this.state.modals.map(({ Component, open, props, id }: modalProps) => (
      <Component
        key={id}
        {...props}
        {...{
          open,
          onClose: () => {
            this.delModal(id)
          },
        }}
      />
    ))
  }
}

export const showModal = (...args: any) => ModalManager.instance.showModal(...args)

export default ModalManager
