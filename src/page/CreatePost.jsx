import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

import { preview } from '../assets';
import { getRandomPrompt } from '../utils';
import { FormField, Loader } from '../components';



const CreatePost = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    prompt: '',
    prompt2: '',
    photo: '',
  });
  
  
  const [generatingImg, setGeneratingImg] = useState(false);
  const [generatingText, setGeneratingText] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData]= useState('');
  const [data2, setData2]= useState('');

  const invokeUrl = 'http://localhost:1312/generate-our-image-brotha';

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt);
    setForm({ ...form, prompt: randomPrompt });
  };

  const generateImage = async () => {

  if (form.prompt){ 
    try {
      setGeneratingImg(true);
            const res = await axios.post("https://api-inference.huggingface.co/models/openfree/flux-chatgpt-ghibli-lora"
              ,{
                inputs:form.prompt
              },{
                headers:{
                  'Authorization':'Bearer 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'
                },responseType:'blob'})

            const data = await res.data;
            const blobUrl = URL.createObjectURL(data);
            setData(blobUrl)
            
            setGeneratingImg(false);
    
          } catch (err) {
            alert(err);
          } finally {
            
          }
        } else {
          alert('Please provide proper prompt');
        }
      };

      const generateText = async () => {
        if (form.prompt2){ 
          try {
            setGeneratingText(true);
                  const res = await axios.post("https://api-inference.huggingface.co/models/Qwen/Qwen2.5-Coder-32B-Instruct"
                    ,{
                      inputs:form.prompt2
                    },{
                      headers:{
                        'Authorization':'Bearer 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',
                        "Content-Type": "application/json",
                      },})
      
                  const result = await res.data;
                  const answer = Array.isArray(result)
                  ? result[0]?.generated_text
                  : result?.generated_text || JSON.stringify(result);
                  setData2(answer)
                  
                  setGeneratingText(false);

                } catch (err) {
                  console.error(err);
                  alert("Failed to generate text. Check console for details.");
                } finally {
                  setGeneratingText(false);
                }
              } else {
                alert('Please provide a prompt first.');
              }
            };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.prompt && form.photo) {
      setLoading(true);
      try {
        const response = await fetch('https://ai.api.nvidia.com/v1/genai/stabilityai/stable-diffusion-xl', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...form }),
        });

        await response.json();
        alert('Success');
        navigate('/');
      } catch (err) {
        alert(err);
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please generate an image with proper details');
    }
  };

  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">Create</h1>
        <p className="mt-2 text-[#666e75] text-[14px] max-w-[500px]">Generate an imaginative image through NVIDIA AI and share it with the community</p>
      </div>

      <form className="mt-16 max-w-3xl" onSubmit={handleSubmit}>
        <div className="flex flex-col gap-5">
          <FormField
            labelName="Your Name"
            type="text"
            name="name"
            placeholder="Ex., john doe"
            value={form.name}
            handleChange={handleChange}
          />
         
          <FormField
            labelName="Prompt"
            type="text"
            name="prompt"
            placeholder="An Impressionist oil painting of sunflowers in a purple vase…"
            value={form.prompt}
            handleChange={handleChange}
            isSurpriseMe
            handleSurpriseMe={handleSurpriseMe}
          />

          <FormField
            labelName="Get your ideas here"
            type="text"
            name="prompt2"
            placeholder="Qwen"
            value={form.prompt2}
            handleChange={handleChange}
          />



        <div className="mt-5 flex gap-5">
          <button
            type="button"
            onClick={generateText}
            className=" text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {generatingText ? 'Answering' : 'Answer Text'}
          </button>
        </div>

        {data2 && (
  <div className="mt-6">
    <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">
      Generated Answer
    </label>
    <textarea
      id="answer"
      name="answer"
      className="w-full h-40 p-3 border border-gray-300 rounded-md shadow-sm resize-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
      value={data2}
      onChange={(e) => setData2(e.target.value)} // Optional: Make it editable
      placeholder="Generated answer will appear here..."
    />
  </div>
)}
          <div className="relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center">
            { data ? (
              <img
                src={data}
                alt={form.prompt}
                className="w-full h-full object-contain"
              />
            ) : (
              <img
                src={preview}
                alt="preview"
                className="w-9/12 h-9/12 object-contain opacity-40"
              />
            )}

            {generatingImg && (
              <div className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                <Loader />
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 flex gap-5">
          <button
            type="button"
            onClick={generateImage}
            className=" text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {generatingImg ? 'Generating...' : 'Generate'}
          </button>
        </div>

        <div className="mt-10">
          <p className="mt-2 text-[#666e75] text-[14px]">** Once you have created the image you want, you can share it with others in the community **</p>
          <button
            type="submit"
            className="mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
          >
            {loading ? 'Sharing...' : 'Share with the Community'}
          </button>
        </div>
      </form>
    </section>
  );
};

export default CreatePost