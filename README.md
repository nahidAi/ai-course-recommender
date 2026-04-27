# AI Course Recommender for Astronomy Learners

An AI‑powered adaptive learning assistant designed to recommend astronomy courses based on the user's question and learning level.  
Built as a lightweight, front-end + serverless back-end experiment using Gemini 2.5 Flash.

---

## 🌌 Overview

This project provides personalized course recommendations for astronomy enthusiasts.  
Users can:

- Ask any astronomy‑related question  
- Choose their learning level (Beginner / Intermediate / Advanced)  
- Receive adaptive explanations + recommended learning path  

The back-end uses Google’s **Gemini 2.5 Flash** via the `generateContent` API to create adaptive and relevant responses.

---

## 🚀 Live Demo  
🔗 **https://ai-course-recommender-DELTA.vercel.app**  
*(replace with your final URL if needed)*

---

## 🧠 Features

### ✔ AI‑Generated Recommendations  
Uses Gemini to analyze the user’s question and generate a tailored learning response.

### ✔ Adaptive Explanations  
The system adjusts the tone and depth based on:
- Beginner
- Intermediate
- Advanced

### ✔ Serverless API  
Back-end deployed on Vercel using a simple Node.js serverless function.

### ✔ Clean Front-end  
Minimal HTML/CSS/JS UI with:
- Input box
- Dropdown for level
- Loading state
- Response container

---

## 🛠 Tech Stack

### **Front-end**
- HTML5  
- CSS3  
- Vanilla JavaScript  

### **Back-end**
- Node.js Serverless Function (Vercel)  
- Google Gemini API (`gemini-2.5-flash`)  

### **Deployment**
- Vercel  
- GitHub Integration (CI/CD)  

---

## 📁 Project Structure
