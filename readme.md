# Qdrant and OpenAI Integration Project


<div align="center"><img src="https://openai.com/favicon.ico"/>  <img width="200" height="48" src="https://qdrant.tech/img/brand-resources-logos/logo-red-white.svg"/>
<img height="48" src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d9/Node.js_logo.svg/590px-Node.js_logo.svg.png"/>

</div>


## Description

This project demonstrates how to integrate the Qdrant vector database with the OpenAI language model to enable efficient processing and retrieval of information from large text datasets.

## Purpose

The goal of this project is to showcase how Qdrant can be used to store vectors representing text fragments and how OpenAI can be utilized to generate answers to questions based on the context provided by these fragments. This project can serve as an example for a LinkedIn post to demonstrate skills in integrating AI technologies.

## Requirements

- Node.js
- Packages: `dotenv`, `fs`, `@qdrant/js-client-rest`, `openai`, `uuid`

## Installation

1. Clone the repository to your local machine.
2. Install the required packages:
   ```bash
   npm i
   ```
3. Create a `.env` file and add your API keys:
   ```plaintext
   QDRANT_URL=your_qdrant_url
   QDRANT_KEY=your_qdrant_api_key
   OPENAI_KEY=your_openai_api_key
   ```

Remember about creating vector database via Qdrant:
https://qdrant.tech/pricing



## Files Overview

- **`index.js`**: Responsible for loading text from a file, chunking the text with overlap, creating a collection in Qdrant if it doesn't exist, generating vectors using OpenAI, and saving them in Qdrant.

- **`rag.js`**: Handles user input for questions, generates a vector for the question using OpenAI, retrieves relevant context from Qdrant, and generates an answer based on that context.










## Usage

To run the project, execute the following command:

```bash
node index.js
```

This file create a collection in Qdrant

Then, to ask a question, run:

```bash
node rag.js
```


Remember about config.js - You can change name of collection

## Summary

This project illustrates how to leverage Qdrant and OpenAI to create intelligent applications capable of processing and analyzing large text datasets. By integrating these technologies, users can obtain quick and accurate answers to their questions, opening new possibilities for data analysis and user interaction.

---

Thank you for reviewing the documentation! If you have any questions or need further information, feel free to reach out.