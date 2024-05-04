'use client'
import React, { useState } from 'react'
import './TextSplitter.css'

export const TextSplitter: React.FC = () => {
  const [text, setText] = useState('')
  const [chunks, setChunks] = useState<string[]>([])
  const [copySuccess, setCopySuccess] = useState('')

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value)
  }

  const handleCopy = (chunk: string) => {
    navigator.clipboard.writeText(chunk).then(() => {
      setCopySuccess('Copied!')
      setTimeout(() => setCopySuccess(''), 2000) // Reset the message after 2 seconds
    })
  }

  const splitText = () => {
    const chunkSize = 4000
    const regex = new RegExp(`.{1,${chunkSize}}`, 'g')
    const chunks = text.match(regex) || []
    setChunks(chunks)
  }

  return (
    <div className='p-4'>
      <textarea
        className='w-full h-60 p-2 border border-gray-300 text-black'
        value={text}
        onChange={handleTextChange}
      />
      <button
        className='mt-2 p-2 bg-blue-500 text-white rounded mb-4'
        onClick={splitText}
      >
        Split Text
      </button>
      <div className='mt-8 grid grid-cols-4 gap-4'>
        {chunks.map((chunk, index) => (
          <div key={index} className='relative'>
            <div className='bg-white shadow-lg rounded-lg p-4 relative overflow-visible mb-6 mr-6'>
              <div className='absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 text-white flex items-center justify-center w-10 h-10 rounded-full shadow text-lg font-semibold'>
                #{index + 1}
              </div>
              <textarea
                className='w-full h-64 p-2 border border-gray-200 text-black bg-gray-50 mt-2'
                value={chunk}
                readOnly
              />
            </div>
            <button
              onClick={() => handleCopy(chunk)}
              className='absolute top-0 right-0 -mt-3 p-2 rounded-full hover:bg-gray-200 bg-white border border-gray-400'
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                className='w-5 h-5 text-blue-500'
                aria-hidden='true'
              >
                <rect x='9' y='9' width='13' height='13' rx='2' ry='2'></rect>
                <path d='M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h11a2 2 0 012 2v1'></path>
              </svg>
            </button>
          </div>
        ))}
        {copySuccess && (
          <div
            className='fixed inset-x-0 bottom-4 mx-auto bg-green-500 bg-opacity-100 text-white py-3 px-8 rounded-md shadow-lg text-center'
            style={{ maxWidth: '30%', animation: 'fadeInOut 3s' }}
          >
            {copySuccess}
          </div>
        )}
      </div>
    </div>
  )
}
