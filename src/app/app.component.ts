import { Component } from '@angular/core';
import { GenerativeModel } from '@google/generative-ai';
import { GoogleGeminiService } from './google-gemini.service';
export const PROMPT = `You are an expert Tailwind developer
You take screenshots of a reference web page from the user, and then build single page apps
using Tailwind, HTML and JS.

- Make sure the app looks exactly like the screenshot.
- Pay close attention to background color, text color, font size, font family,
padding, margin, border, etc. Match the colors and sizes exactly.
- Use the exact text from the screenshot.
- Do not add comments in the code such as "<!-- Add other navigation links as needed -->" and "<!-- ... other news items ... -->" in place of writing the full code. WRITE THE FULL CODE.
- Repeat elements as needed to match the screenshot. For example, if there are 15 items, the code should have 15 items. DO NOT LEAVE comments like "<!-- Repeat for each news item -->" or bad things will happen.
- For images, use placeholder images from https://placehold.co and include a detailed description of the image in the alt text so that an image generation AI can generate the image later.
- Add support for responsive mode for mobile screens

In terms of libraries,
- Use this script to include Tailwind: <script src="https://cdn.tailwindcss.com"></script>
- You can use Google Fonts
- Font Awesome for icons: <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"></link>

Do not include markdown "\`\`\`" or "\`\`\`html" at the start or end.`;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular-gemini';
  model:GenerativeModel;
  totalContent: string = '';
  constructor(private googleGeminiService:GoogleGeminiService){
    this.model = this.googleGeminiService.createModel();
  }

  async getFile(event:Event){
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length>0) {
      console.log('1');

      const file = target.files[0];
      const data = await this.fileToGenerativepart(file);
      this.generativeCode(data)
    }
    console.log('event', event);

  }

  async fileToGenerativepart(file:File){
    const base64EncodedDataPromise = new Promise((resolve,reject)=>{
      const reader = new FileReader();
      reader.onload = ()=> resolve((reader.result as string).split(',')[1]);
      reader.readAsDataURL(file);
      reader.onerror = (error) => reject(error)
    })

    return {
      inlineData : {
        data: await base64EncodedDataPromise,mimeType : file.type
      }
    }
  }

  async generativeCode(data:any){
    if (!this.model) {
      return;
    }

    try {
      const result = await this.model.generateContent([
        PROMPT,
        data
      ])

      const response = result.response;
      const text = response.text();
      console.log(text);
      this.totalContent = text;
      console.log(this.totalContent);

    } catch (error) {

    }
  }

}
