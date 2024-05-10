import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { TextSplitter } from './TextSplitter'

// Mock navigator.clipboard.writeText function
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn().mockResolvedValue(undefined),
  },
})

describe('TextSplitter Component', () => {
  test('renders text area and button', () => {
    render(<TextSplitter />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByText('Split Text')).toBeInTheDocument()
  })

  test('splits text into chunks of specified size when button is clicked', async () => {
    const testText =
      'This is a longer test string that should be split into several smaller chunks based on the specified chunk size.'
    render(<TextSplitter />)
    const textArea = screen.getByRole('textbox')
    const chunkSizeInput = screen.getByLabelText(
      'Specify character count to split by:',
    )
    const splitButton = screen.getByText('Split Text')

    fireEvent.change(chunkSizeInput, { target: { value: '50' } })
    fireEvent.change(textArea, { target: { value: testText } })
    fireEvent.click(splitButton)

    const flattenedText = testText.replace(/\n/g, '')
    const expectedChunks = Math.ceil(flattenedText.length / 50)

    await waitFor(() => {
      const chunks = screen.getAllByRole('textbox', {
        name: 'chunk',
      }) as HTMLInputElement[]
      expect(chunks.length).toBe(expectedChunks)
      chunks.forEach((chunk) => {
        expect(chunk.value.length).toBeLessThanOrEqual(50)
      })
    })
  })

  it('updates chunk size', () => {
    render(<TextSplitter />)
    const chunkSizeInput = screen.getByLabelText(
      /character count to split by/i,
    ) as HTMLInputElement
    fireEvent.change(chunkSizeInput, { target: { value: '50' } })

    expect(chunkSizeInput.value).toBe('50')
  })

  it('copies text to clipboard', async () => {
    const testText = 'Sample text that will be split into chunks'
    render(<TextSplitter />)
    const textArea = screen.getByRole('textbox')
    const splitButton = screen.getByText('Split Text')
    const chunkSizeInput = screen.getByLabelText(/character count to split by/i)

    fireEvent.change(chunkSizeInput, { target: { value: '50' } })
    fireEvent.change(textArea, { target: { value: testText } })

    await waitFor(() => {
      fireEvent.click(splitButton)
    })

    const copyButtons = screen.getAllByText('', { selector: 'button' })

    await waitFor(() => {
      fireEvent.click(copyButtons[0])
    })

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      (screen.getAllByRole('textbox', { name: '' })[0] as HTMLTextAreaElement)
        .value,
    )
  })
})
