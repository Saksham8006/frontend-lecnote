import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react'
import { NavLink } from 'react-router-dom'

const TextConversion = () => {

  const navigate = useNavigate();

  const [text, setText] = useState('')
  const [translatedText, setTranslatedText] = useState('')

  async function requestTranslation(event) {
		event.preventDefault()

		const response = await fetch(`http://localhost:8000/translation`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
      body: JSON.stringify({
				text
			}),
      
		
		})

		const data = await response.json()

		if (data) {
      setTranslatedText(data.text)
		}
	}

  return (
    <section className="min-h-screen h-[100vh] bg-gray-900 main overflow-y-auto ml-[256px] z-0 top-0  pt-[80px] pb-[100px] right-0   min-h-[calc(100vh-256px)]  bg-gray-900 px-[50px]" >
    <span class="text-primary mb-4 block text-base font-semibold text-[#48F4FF]">
Text Translation</span>

<form  onSubmit={requestTranslation}>
  <label for="message" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your text</label>
  <textarea 
  required 
  value={text}
  onChange={(e)=>{ setText(e.target.value)}}
    id="message" 
    rows="4" 
    class="block p-2.5 w-[80%] text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Enter the piece of text you want to translate"></textarea>
  <button 
  type="submit"
  class="relative inline-flex items-center justify-center p-0.5 mt-2 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-[#48F4FF] to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 w-[80%]">
    <p class="relative px-5 font-bold text-[14px] py-2.5 transition-all ease-in duration-75 bg-white  rounded-md bg-opacity-0  group-hover:bg-opacity-0">
          Proceed to Translate
    </p>
  </button>
</form>
{translatedText === "" ? null :
<div className='mt-[40px] '>
<span class="text-primary mb-4 block text-base font-semibold text-[#48F4FF]">
Translated Text 👇</span>
  <p 
    class="block p-2.5 w-[80%] text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" > {translatedText}
    </p>
   </div>}
</section>
  )
}

export default TextConversion