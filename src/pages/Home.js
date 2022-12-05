import { useState, useEffect } from 'react'
import BarChart from '../components/BarChart'
import {Bar} from 'react-chartjs-2'
import {Chart as ChartJS, BarElement,Legend, ArcElement, Tooltip, CategoryScale, LinearScale} from "chart.js"; 

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
)

const Home = () => {

  const [file, setFile] = useState(null)
  const [time, setTime] = useState(999999)
  const [lectureSubject, setLectureSubject] = useState("")
  const [success, setSuccess] = useState(false)
  const [waiting, setWaiting] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [polling, setPolling] = useState(false)
  const [chartDataField, setChartDataField] = useState([])
  const [labelField, setlabelField] = useState([])
  const [showFileUploadSection, setShowFileUploadSection] = useState(true)


  var chartData = {
    labels: labelField,
    datasets: [{
      label: 'Classification',
      data: chartDataField,
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(255, 159, 64, 0.2)',
        'rgba(255, 205, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(201, 203, 207, 0.2)'
      ],
      borderColor: [
        'rgb(255, 99, 132)',
        'rgb(255, 159, 64)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(54, 162, 235)',
        'rgb(153, 102, 255)',
        'rgb(201, 203, 207)'
      ],
      borderWidth: 1
    }]
  }
  
  var options ={
      mainAspectRation: false,
      Scales: {
          y: {
              beginAtZero: true
          },
      },
      legend: {
          lablels : {
              fontSize: 25, 
          },
      },
  }

  
	useEffect(() => {
   
      const intervalId = setInterval(() => {  
       
        fetch("http://localhost:8000/polling")
        .then(response => response.json())
        .then((data) => {
        if(data.resolved){
          setlabelField(Object.keys(data.data))
          setChartDataField(Object.values(data.data))
         
          setTime(999999)
          setLoading(false)
          setShowFileUploadSection(false)
        }
        
        })
      
      }, time)
    
      return () => clearInterval(intervalId); //This is important

  
           
  })

  async function getTxtFile(event) {
    event.preventDefault()

    fetch("http://localhost:8000/txt")
    .then(response => {
      window.open("http://localhost:8000/txt", '_blank', 'noopener,noreferrer');
     })

  }

  async function getPdfFile(event) {
    event.preventDefault()
    fetch("http://localhost:8000/pdf")
    .then(response => {
      window.open("http://localhost:8000/pdf", '_blank', 'noopener,noreferrer');
     })

  }

  async function getWordFile(event) {
    event.preventDefault()
    fetch("http://localhost:8000/word")
    .then(response => {
      window.open("http://localhost:8000/word", '_blank', 'noopener,noreferrer');
     })
  }

  


  async function requestTranscription(event) {
		event.preventDefault()

    setLoading(true)

    const formData =new FormData();

    formData.append(
      "file",
      file,
      file.name
    );

    
    const requestOptions = {
      method: "POST",
      body: formData
    };

    fetch("http://localhost:8000/upload", requestOptions)
    .then(res => res.json())
    .then(function(res){
  if(res.name){
    setTimeout(() => {
      setTime(5000)
      setLoading(false)
      setSuccess(true)
    }, 2000)
    
    

    setTimeout(() => {
      setSuccess(false)
      setWaiting(true)
      setPolling(true)

    }, 3000);

    setTimeout(() => {
      setWaiting(false)
      setLoading(true)

    }, 4000);

  }
  else{
    setTimeout(() => {
      setLoading(false)
      setError(true)
    }, 2000);
  }
    })

		
	}

  return (
    <section className="min-h-screen h-[100vh] bg-gray-900 main overflow-y-auto ml-[256px] z-0 top-0  pt-[70px] pb-[100px] right-0   min-h-[calc(100vh-256px)]  bg-gray-900 px-[50px]" >
  
  {showFileUploadSection ? <><span class="text-primary mb-4 block text-base font-semibold text-[#48F4FF]">
  Convert Audio Lecture recordings to Text Notes </span>
  
 
  <form onSubmit={requestTranscription}>
  {loading && <div className='absolute z-[5] bg-[rgba(0,0,0,0.8)] w-[60vw] h-[60vh] flex justify-center items-center' role="status">
    <p className='text-white font-semibold mr-1 text-[20px]'>Processing. Please wait &nbsp;&nbsp;</p>
    <svg aria-hidden="true" class="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
        <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
    </svg>
    <span class="sr-only">Loading...</span>
</div>}

<div class="flex items-center justify-center w-[80%] mb-4">
{success && <div id=" toast-interactive" className="absolute z-[2] flex items-center p-4 mb-4 w-full max-w-xs text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
      <div class="inline-flex flex-shrink-0 justify-center items-center w-8 h-8 text-purple-500 bg-purple-100 rounded-lg dark:bg-green-800 dark:text-green-200">
          <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path></svg>
          <span class="sr-only">Check icon</span>
      </div>
      <div class="ml-3 text-sm font-normal">File is successfully uploaded!</div>
    </div>}

    {waiting && <div id=" toast-interactive" className="absolute z-[2] flex items-center p-4 mb-4 w-full max-w-xs text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
      <div class="inline-flex flex-shrink-0 justify-center items-center w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200">
      <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"></path></svg>          <span class="sr-only">Check icon</span>
      </div>
      <div class="ml-3 text-sm font-normal">Transcription is happening in the background. Please wait</div>
    </div>}
    
    {error && <div id="toast-warning" className="absolute z-[2] flex items-center p-4 w-full max-w-xs text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800" role="alert">
    <div class="inline-flex flex-shrink-0 justify-center items-center w-8 h-8 text-orange-500 bg-orange-100 rounded-lg dark:bg-orange-700 dark:text-orange-200">
        <svg aria-hidden="true" class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>
        <span class="sr-only">Warning icon</span>
    </div>
    <div class="ml-3 text-sm font-normal">An unexpected error occur. Please try again.</div>
   
</div>}
    


    <label for="dropzone-file" class="flex flex-col items-center justify-center w-full h-[200px] border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
        <div class="flex flex-col items-center justify-center pt-2 pb-3">
            <svg aria-hidden="true" class="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
         {!file ?  <>
         <p class="mb-2 text-sm text-gray-500 dark:text-gray-400"><span class="font-semibold">Click to upload</span> or drag and drop</p>
          <p class="text-xs text-gray-500 dark:text-gray-400"> Lecture Recordings ( 30 minutes max )</p>
          </>
          :
          <>
          <p class="mb-2 text-lg text-cyan-500 dark:text-gray-400"><span class="font-semibold">File Selected</span></p>
          </>
          }
  </div>



        <input id="dropzone-file" type="file"
  onChange={(e)=>{ setFile(e.target.files[0])}} accept ="audio/*" class="hidden" />
    </label>
</div> 


<button 
type="submit" 
class="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-[#48F4FF] to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 w-[80%]">
  <p class="relative px-5 font-bold text-[17px] py-2.5 transition-all ease-in duration-75 bg-white  rounded-md bg-opacity-0  group-hover:bg-opacity-0">
        Convert to Notes
  </p>
</button>

</form>
</>
:
<>
<span class="text-primary mb-4 block text-base font-semibold text-[#48F4FF]">
  Analytics </span>


<div class="w-full p-4 text-center bg-white border rounded-lg shadow-md sm:p-8 dark:bg-gray-800 dark:border-gray-700">
    <h5 className="mb-[40px] text-3xl font-bold text-gray-900 dark:text-white">  Classification of words present in the audio lecture</h5>
 <div className='flex justify-around a'>
<div className="max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
 
<Bar
      data={chartData}
      height={400}
      options={options}

    />


</div>

<div className="max-w-md p-6 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
<span class="text-primary mb-[60px] block text-base font-semibold text-[#48F4FF]">
  Choose a format to get the transripted audio lecture. </span>

  <button 
   type="submit"
   onClick={getTxtFile}
    className="block text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-[25px] w-full">.TXT File</button>
  
  <button 
  type="submit"
  onClick={getWordFile}
   className="block text-white bg-gradient-to-r from-pink-400 via-pink-500 to-pink-600 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-pink-300 dark:focus:ring-pink-800 shadow-lg shadow-pink-500/50 dark:shadow-lg dark:shadow-pink-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-[25px] w-full">Word file</button>
  <button 
 type="submit"
 onClick={getPdfFile }
  className="block text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-purple-300 dark:focus:ring-purple-800 shadow-lg shadow-purple-500/50 dark:shadow-lg dark:shadow-purple-800/80 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-[25px] w-full">PDF File</button>
</div>

</div>

</div>

</>
}

    </section>
  )
}

export default Home