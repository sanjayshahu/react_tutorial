/* eslint-disable testing-library/no-node-access */
import { describe, test, expect } from 'vitest'//imp
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Accordion from './Accordion'

// Mock data
const mockData = [
  { title: 'First Item', desc: 'First description content' },
  { title: 'Second Item', desc: 'Second description content' }
]

const singleItemData = [
  { title: 'Single Item', desc: 'Single description content' }
]

const emptyData: any[] = []

describe('Accordion Component', () => {
  test('renders accordion with items when data is provided via props', () => {
    render(<Accordion data={mockData} />)

    expect(screen.getByText('Accordion')).toBeInTheDocument()
    expect(screen.getByText('First Item')).toBeInTheDocument()
    expect(screen.getByText('Second Item')).toBeInTheDocument()
    expect(
      screen.queryByText('First description content')
    ).not.toBeInTheDocument()
  })

  test('renders no items found when empty data provided', () => {
    render(<Accordion data={emptyData} />)

    expect(screen.getByText('no items found')).toBeInTheDocument()
  })

  test('opens and closes accordion item', () => {
    render(<Accordion data={mockData} />)

    const firstButton = screen.getByText('First Item').closest('button')

    fireEvent.click(firstButton!)
    expect(screen.getByText('First description content')).toBeInTheDocument()

    fireEvent.click(firstButton!)
    expect(
      screen.queryByText('First description content')
    ).not.toBeInTheDocument()
  })
})