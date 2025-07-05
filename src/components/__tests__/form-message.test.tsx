import React from 'react'
import { render, screen } from '@/__tests__/utils/test-utils'
import { FormMessage } from '../form-message'

describe('FormMessage', () => {
  it('renders success message correctly', () => {
    render(<FormMessage message={{ success: 'Operation successful!' }} />)
    
    const message = screen.getByText('Operation successful!')
    expect(message).toBeInTheDocument()
    expect(message).toHaveClass('text-green-500', 'border-l-2', 'border-green-500', 'px-4')
  })

  it('renders error message correctly', () => {
    render(<FormMessage message={{ error: 'Something went wrong!' }} />)
    
    const message = screen.getByText('Something went wrong!')
    expect(message).toBeInTheDocument()
    expect(message).toHaveClass('text-red-500', 'border-l-2', 'border-red-500', 'px-4')
  })

  it('renders general message correctly', () => {
    render(<FormMessage message={{ message: 'General information' }} />)
    
    const message = screen.getByText('General information')
    expect(message).toBeInTheDocument()
    expect(message).toHaveClass('text-foreground', 'border-l-2', 'px-4')
  })

  it('applies correct container classes', () => {
    const { container } = render(<FormMessage message={{ message: 'Test' }} />)
    
    const containerDiv = container.querySelector('.flex.flex-col.gap-2')
    expect(containerDiv).toBeInTheDocument()
    expect(containerDiv).toHaveClass('flex')
    expect(containerDiv).toHaveClass('flex-col')
    expect(containerDiv).toHaveClass('gap-2')
    expect(containerDiv).toHaveClass('w-full')
    expect(containerDiv).toHaveClass('max-w-md')
    expect(containerDiv).toHaveClass('text-sm')
  })

  it('only renders the appropriate message type', () => {
    render(<FormMessage message={{ success: 'Success message' }} />)
    
    expect(screen.getByText('Success message')).toBeInTheDocument()
    expect(screen.queryByText('Error message')).not.toBeInTheDocument()
    expect(screen.queryByText('General message')).not.toBeInTheDocument()
  })

  it('handles empty message strings', () => {
    const { container } = render(<FormMessage message={{ success: '' }} />)
    
    // Should still render the container and message div with appropriate classes
    const messageDiv = container.querySelector('.text-green-500')
    expect(messageDiv).toBeInTheDocument()
    expect(messageDiv).toHaveClass('border-l-2', 'border-green-500', 'px-4')
  })

  it('handles long messages', () => {
    const longMessage = 'This is a very long message that should still be displayed correctly with proper styling and without breaking the layout of the component.'
    render(<FormMessage message={{ error: longMessage }} />)
    
    const message = screen.getByText(longMessage)
    expect(message).toBeInTheDocument()
    expect(message).toHaveClass('text-red-500')
  })
}) 