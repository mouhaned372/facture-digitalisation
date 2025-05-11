const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyAIERMqHUKkkqCFeYjiLvHiq0abgL9KmBo');

async function extractInvoiceData(imageBase64) {
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const prompt = `
        Analysez cette image de facture et extrayez toutes les informations disponibles. : et essentiellement le nom et les detail de fournissseur 
        Retournez uniquement un JSON valide avec la structure suivante :

        {
            "invoiceNumber": "string",
            "invoiceDate": "string (format JJ/MM/AAAA)",
            "dueDate": "string (format JJ/MM/AAAA)",
            "supplier": {
                "name": "string",
                "address": "string",
                "taxId": "string"
            },
            "items": [
                {
                    "description": "string",
                    "quantity": number,
                    "unitPrice": number,
                    "totalPrice": number
                }
            ],
            "subtotal": number,
            "taxAmount": number,
            "totalAmount": number
        }

        Si une information est manquante, utilisez null.
        Ne retournez rien d'autre que le JSON.
        `;

        const result = await model.generateContent([
            prompt,
            {
                inlineData: {
                    data: imageBase64,
                    mimeType: 'image/jpeg',
                },
            },
        ]);

        const response = await result.response;
        const text = response.text();

        // Extraction du JSON de la réponse
        const jsonStart = text.indexOf('{');
        const jsonEnd = text.lastIndexOf('}') + 1;
        const jsonString = text.slice(jsonStart, jsonEnd);

        let extractedData;
        try {
            extractedData = JSON.parse(jsonString);
        } catch (parseError) {
            console.error('Erreur de parsing JSON:', parseError);
            throw new Error('Le format de réponse du modèle est invalide');
        }

        // Validation des données minimales
        if (!extractedData.totalAmount && !extractedData.items?.length) {
            throw new Error('Aucune donnée valide extraite de la facture');
        }

        // Normalisation des données
        return {
            invoiceNumber: extractedData.invoiceNumber || `FAC-${Date.now()}`,
            invoiceDate: extractedData.invoiceDate || new Date().toISOString(),
            dueDate: extractedData.dueDate || null,
            supplier: {
                name: extractedData.supplier?.name || 'Fournisseur Inconnu',
                address: extractedData.supplier?.address || null,
                taxId: extractedData.supplier?.taxId || null,
            },
            items: extractedData.items?.map(item => ({
                description: item.description || 'Article non décrit',
                quantity: Number(item.quantity) || 1,
                unitPrice: Number(item.unitPrice) || 0,
                totalPrice: Number(item.totalPrice) || 0,
            })) || [],
            subtotal: Number(extractedData.subtotal) || 0,
            taxAmount: Number(extractedData.taxAmount) || 0,
            totalAmount: Number(extractedData.totalAmount) || 0,
            extractedData: extractedData,
        };
    } catch (error) {
        console.error('Erreur détaillée:', error);
        throw new Error(`Échec de l'extraction: ${error.message}`);
    }
}

module.exports = { extractInvoiceData };