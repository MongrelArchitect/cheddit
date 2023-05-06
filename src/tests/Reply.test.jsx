import React from 'react';
import { act, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Reply from '../components/Reply';

describe('Reply component', () => {
  it('displays reply button', () => {
    render(<Reply />);
    expect(
      screen.getByRole('button', { name: '[ Post a Reply ]' }),
    ).toBeTruthy();
  });

  it('displays reply form when button clicked', () => {
    render(<Reply />);
    act(() => {
      userEvent.click(screen.getByRole('button', { name: '[ Post a Reply ]' }));
    });
    expect(screen.getByRole('form', { name: 'reply form' })).toBeTruthy();
  });

  it('displays correct input fields', () => {
    render(<Reply />);
    act(() => {
      userEvent.click(screen.getByRole('button', { name: '[ Post a Reply ]' }));
    });
    expect(screen.getByLabelText('Name:')).toBeTruthy();
    expect(screen.getByLabelText('Comment:')).toBeTruthy();
    expect(screen.getByLabelText('Image:')).toBeTruthy();
  });
});
