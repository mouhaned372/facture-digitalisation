const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyAOCbGTDfyyiidMR-993WW8JKGIiHan5ZQ');

async function extractInvoiceData(imageBase64) {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const prompt = `
      Extrayez toutes les informations de cette facture et retournez-les en JSON structuré.
      Incluez les champs suivants:
      - invoiceNumber: numéro de facture
      - invoiceDate: date de facturation
      - dueDate: date d'échéance
      - supplier: objet avec name, address, taxId
      - items: tableau d'objets avec description, quantity, unitPrice, totalPrice
      - subtotal: montant HT
      - taxAmount: montant TVA
      - totalAmount: montant TTC

      Retournez uniquement le JSON sans commentaires.
    `;

        const result = await model.generateContent([prompt, {
            inlineData: {
                data: imageBase64,
                mimeType: 'image/jpeg',
            },
        }]);

        const response = await result.response;
        const text = response.text();

        const jsonStart = text.indexOf('{');
        const jsonEnd = text.lastIndexOf('}') + 1;
        const jsonString = text.slice(jsonStart, jsonEnd);

        const extractedData = JSON.parse(jsonString);

        return {
            invoiceNumber: extractedData.invoiceNumber,
            invoiceDate: extractedData.invoiceDate,
            dueDate: extractedData.dueDate,
            supplier: {
                name: extractedData.supplier?.name || 'Inconnu',
                address: extractedData.supplier?.address,
                taxId: extractedData.supplier?.taxId,
            },
            items: extractedData.items?.map((item) => ({
                description: item.description,
                quantity: item.quantity || 1,
                unitPrice: item.unitPrice || item.totalPrice,
                totalPrice: item.totalPrice || item.unitPrice,
            })) || [],
            subtotal: extractedData.subtotal,
            taxAmount: extractedData.taxAmount,
            totalAmount: extractedData.totalAmount,
            extractedData: extractedData,
        };
    } catch (error) {
        console.error('Erreur lors de l\'extraction des données:', error);
        throw new Error('Échec de l\'extraction des données de la facture');
    }
}

module.exports = { extractInvoiceData };