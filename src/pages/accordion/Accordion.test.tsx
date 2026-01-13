/* eslint-disable testing-library/no-node-access */
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Accordion from './Accordion';

// Mock data for testing
const mockData = [
  { title: 'First Item', desc: 'First description content' },
  { title: 'Second Item', desc: 'Second description content' }
];

const singleItemData = [
  { title: 'Single Item', desc: 'Single description content' }
];

const emptyData: any[] = [];

describe('Accordion Component', () => {

  test('renders accordion with items when data is provided via props', () => {
    render(<Accordion data={mockData} />);

    expect(screen.getByText('Accordion')).toBeInTheDocument();
    expect(screen.getByText('First Item')).toBeInTheDocument();
    expect(screen.getByText('Second Item')).toBeInTheDocument();

    expect(screen.queryByText('First description content')).not.toBeInTheDocument();
    expect(screen.queryByText('Second description content')).not.toBeInTheDocument();

    expect(screen.queryByText('no items found')).not.toBeInTheDocument();
    expect(screen.getAllByText('d')).toHaveLength(2);
  });

  test('renders "no items found" when empty data array is provided', () => {
    render(<Accordion data={emptyData} />);

    expect(screen.getByText('no items found')).toBeInTheDocument();
    expect(screen.queryByText('d')).not.toBeInTheDocument();
    expect(screen.queryByText('u')).not.toBeInTheDocument();
  });

  test('opens and closes an accordion item when clicked', () => {
    render(<Accordion data={mockData} />);

    const firstItem = screen.getByText('First Item');

    fireEvent.click(firstItem);
    expect(screen.getByText('First description content')).toBeInTheDocument();
    expect(screen.getByText('u')).toBeInTheDocument();

    fireEvent.click(firstItem);
    expect(screen.queryByText('First description content')).not.toBeInTheDocument();
    expect(screen.getAllByText('d')).toHaveLength(2);
  });

  test('opens second item and closes first item', () => {
    render(<Accordion data={mockData} />);

    const firstItem = screen.getByText('First Item');
    const secondItem = screen.getByText('Second Item');

    fireEvent.click(firstItem);
    expect(screen.getByText('First description content')).toBeInTheDocument();

    fireEvent.click(secondItem);
    expect(screen.queryByText('First description content')).not.toBeInTheDocument();
    expect(screen.getByText('Second description content')).toBeInTheDocument();
  });

  test('maintains correct arrow indicators', () => {
    render(<Accordion data={mockData} />);

    const firstItem = screen.getByText('First Item');
    const secondItem = screen.getByText('Second Item');

    expect(screen.getAllByText('d')).toHaveLength(2);

    fireEvent.click(firstItem);
    expect(screen.getByText('u')).toBeInTheDocument();
    expect(screen.getAllByText('d')).toHaveLength(1);

    fireEvent.click(secondItem);
    expect(screen.getByText('Second description content')).toBeInTheDocument();
  });

  test('handles single item accordion correctly', () => {
    render(<Accordion data={singleItemData} />);

    const item = screen.getByText('Single Item');

    fireEvent.click(item);
    expect(screen.getByText('Single description content')).toBeInTheDocument();

    fireEvent.click(item);
    expect(screen.queryByText('Single description content')).not.toBeInTheDocument();
  });

  test('uses default data when no props are provided', () => {
    render(<Accordion />);
    expect(screen.getByText('Accordion')).toBeInTheDocument();
    expect(screen.queryByText('no items found')).not.toBeInTheDocument();
  });

  test('handles rapid clicking correctly', () => {
    render(<Accordion data={singleItemData} />);

    const item = screen.getByText('Single Item');

    fireEvent.click(item);
    fireEvent.click(item);
    fireEvent.click(item);
    fireEvent.click(item);

    expect(screen.queryByText('Single description content')).not.toBeInTheDocument();
  });
});
