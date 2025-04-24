const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');
const path = require('path');
const { pdfToImage } = require('../utils/pdfConverter');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function processDocument(file) {
    try {
        let imageData;

        if (file.mimetype === 'application/pdf') {
            const imagePath = await pdfToImage(file.path);
            imageData = fs.readFileSync(imagePath);
            fs.unlinkSync(imagePath); // Supprimer le fichier temporaire
        } else {
            imageData = fs.readFileSync(file.path);
        }

        const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
        const prompt = createGenericPrompt();

        const result = await model.generateContent([prompt, imageData]);
        const response = await result.response;
        const text = response.text();

        // Nettoyage du JSON
        const jsonStr = text.replace(/```json|```/g, '').trim();
        return JSON.parse(jsonStr);
    } catch (error) {
        console.error('Error processing document:', error);
        throw new Error('Failed to process document');
    }
}

function createGenericPrompt() {
    return `
  Extrayez TOUTES les informations disponibles de ce document (facture, devis, bon de commande ou autre) 
  et retournez-les dans un format JSON structuré. 

  Incluez absolument toutes les données que vous pouvez identifier, y compris mais sans vous limiter à :
  - En-tête et métadonnées du document
  - Informations sur l'émetteur et le destinataire
  - Détails complets des produits/services
  - Totaux, taxes et remises
  - Conditions de paiement et livraison
  - Mentions légales
  - Toute autre information pertinente

  Structurez les données de manière logique et conservez toutes les informations originales.
  Retournez uniquement le JSON sans commentaires.
  `;
}

module.exports = { processDocument };