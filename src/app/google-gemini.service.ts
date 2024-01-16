import { Injectable } from '@angular/core';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable({
  providedIn: 'root'
})
export class GoogleGeminiService {

  constructor() { }

  createModel(){
    const api = new GoogleGenerativeAI('AIzaSyBhrPTnQBt2NGMBwbklonLJ9R3DJdT2jdI');
    return api.getGenerativeModel({
      model:'gemini-pro-vision',
      generationConfig:{
        maxOutputTokens:4096
      }
    })
  }
}
