import fs from "fs"
import { PDFParse } from "pdf-parse"
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { vectorStore } from "../config/vectorDb.js"

export const pdfRag = (state) => {
    try {
        const buffer = fs.readFileSync(state.file.path)
        const pdf = new PDFParse({
            data: buffer
        })

        const result = pdf.getText()
        const text = result.text

        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 200
        })

        const docs = await splitter.createDocuments([text])
        const collectionName = `pdf-${Date.now()}`;
        const store = await vectorStore(docs, collectionName)

    } catch (error) {
        
    }
}