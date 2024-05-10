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
  it('renders text area and button', () => {
    render(<TextSplitter />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
    expect(screen.getByText('Split Text')).toBeInTheDocument()
  })

  it('splits text into chunks of specified size when button is clicked with no removal option', async () => {
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

    // Verify the chunks
    const regex = new RegExp(`.{1,50}`, 'g')
    const expectedChunks = testText.match(regex) || []

    await waitFor(() => {
      const chunks = screen.getAllByRole('textbox', {
        name: 'chunk',
      }) as HTMLTextAreaElement[]
      expect(chunks.length).toBe(expectedChunks.length)
      chunks.forEach((chunk, index) => {
        expect(chunk.value).toBe(expectedChunks[index])
      })
    })
  })

  it('splits text into chunks of specified size when button is clicked with whitespace removal', async () => {
    const testText =
      'This is a longer test string that should be split into several smaller chunks based on the specified chunk size.'
    render(<TextSplitter />)
    const textArea = screen.getByRole('textbox')
    const chunkSizeInput = screen.getByLabelText(
      'Specify character count to split by:',
    )
    const removeWhitespace = screen.getByLabelText('Whitespace')
    const splitButton = screen.getByText('Split Text')

    fireEvent.change(chunkSizeInput, { target: { value: '50' } })
    fireEvent.click(removeWhitespace)
    fireEvent.change(textArea, { target: { value: testText } })
    fireEvent.click(splitButton)

    // Remove whitespace and verify the chunks
    const flattenedText = testText.replace(/\s/g, '')
    const regex = new RegExp(`.{1,50}`, 'g')
    const expectedChunks = flattenedText.match(regex) || []

    await waitFor(() => {
      const chunks = screen.getAllByRole('textbox', {
        name: 'chunk',
      }) as HTMLTextAreaElement[]
      expect(chunks.length).toBe(expectedChunks.length)
      chunks.forEach((chunk, index) => {
        expect(chunk.value).toBe(expectedChunks[index])
      })
    })
  })

  it('splits text into chunks of specified size when button is clicked with newline removal', async () => {
    const testText =
      'This is a longer test string\nthat should be split\ninto several smaller chunks\nbased on the specified chunk size.'
    render(<TextSplitter />)
    const textArea = screen.getByRole('textbox')
    const chunkSizeInput = screen.getByLabelText(
      'Specify character count to split by:',
    )
    const removeNewlines = screen.getByLabelText('Newlines')
    const splitButton = screen.getByText('Split Text')

    fireEvent.change(chunkSizeInput, { target: { value: '50' } })
    fireEvent.click(removeNewlines)
    fireEvent.change(textArea, { target: { value: testText } })
    fireEvent.click(splitButton)

    // Remove newlines and verify the chunks
    const flattenedText = testText.replace(/\n/g, '')
    const regex = new RegExp(`.{1,50}`, 'g')
    const expectedChunks = flattenedText.match(regex) || []

    await waitFor(() => {
      const chunks = screen.getAllByRole('textbox', {
        name: 'chunk',
      }) as HTMLTextAreaElement[]
      expect(chunks.length).toBe(expectedChunks.length)
      chunks.forEach((chunk, index) => {
        expect(chunk.value).toBe(expectedChunks[index])
      })
    })
  })

  it('splits text into chunks of specified size when button is clicked with both whitespace and newline removal', async () => {
    const testText =
      'This is a longer test string\nthat should be split\ninto several smaller chunks\nbased on the specified chunk size.'
    render(<TextSplitter />)
    const textArea = screen.getByRole('textbox')
    const chunkSizeInput = screen.getByLabelText(
      'Specify character count to split by:',
    )
    const removeWhitespace = screen.getByLabelText('Whitespace')
    const removeNewlines = screen.getByLabelText('Newlines')
    const splitButton = screen.getByText('Split Text')

    fireEvent.change(chunkSizeInput, { target: { value: '50' } })
    fireEvent.click(removeWhitespace)
    fireEvent.click(removeNewlines)
    fireEvent.change(textArea, { target: { value: testText } })
    fireEvent.click(splitButton)

    // Remove whitespace and newlines and verify the chunks
    const flattenedText = testText.replace(/\s/g, '').replace(/\n/g, '')
    const regex = new RegExp(`.{1,50}`, 'g')
    const expectedChunks = flattenedText.match(regex) || []

    await waitFor(() => {
      const chunks = screen.getAllByRole('textbox', {
        name: 'chunk',
      }) as HTMLTextAreaElement[]
      expect(chunks.length).toBe(expectedChunks.length)
      chunks.forEach((chunk, index) => {
        expect(chunk.value).toBe(expectedChunks[index])
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
    const testText = 'Sample text\nthat will be\nsplit into chunks'
    render(<TextSplitter />)
    const textArea = screen.getByRole('textbox')
    const splitButton = screen.getByText('Split Text')
    const chunkSizeInput = screen.getByLabelText(/character count to split by/i)
    const removeNewlines = screen.getByLabelText('Newlines')

    fireEvent.change(chunkSizeInput, { target: { value: '50' } })
    fireEvent.click(removeNewlines)
    fireEvent.change(textArea, { target: { value: testText } })

    await waitFor(() => {
      fireEvent.click(splitButton)
    })

    const copyButtons = screen.getAllByText('', { selector: 'button' })

    await waitFor(() => {
      fireEvent.click(copyButtons[0])
    })

    const expectedText = testText.replace(/\n/g, '')

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(expectedText)
  })
})
