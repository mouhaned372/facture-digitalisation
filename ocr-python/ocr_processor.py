import google.generativeai as genai
import json
import os
import re
from pdf2image import convert_from_path
from typing import Dict, List, Optional

class GeminiInvoiceDataExtractor:
    def __init__(self, api_key: str):
        """Initialise le modèle Gemini avec la clé API."""
        genai.configure(api_key=api_key)
        # Modèle multimodal pour traiter texte et images
        self.model = genai.GenerativeModel('gemini-2.0-flash')

    def process_document(self, file_path: str) -> Dict:
        """
        Traite un document (image ou PDF) et extrait les données structurées.
        
        Args:
            file_path: Chemin vers le fichier (JPG, PNG, PDF)
            
        Returns:
            Dictionnaire contenant les données extraites
        """
        if file_path.lower().endswith(('.jpg', '.jpeg', '.png')):
            with open(file_path, 'rb') as img_file:
                image_data = img_file.read()
            prompt = self._create_generic_prompt()
            return self._call_gemini(prompt, image_data)

        elif file_path.lower().endswith('.pdf'):
            try:
                images = convert_from_path(file_path, dpi=300)
                if not images:
                    return {"error": "PDF vide ou non lisible"}

                # Traite seulement la première page pour simplifier
                image_path = "temp_page.jpg"
                images[0].save(image_path, "JPEG")

                with open(image_path, 'rb') as img_file:
                    image_data = img_file.read()

                result = self._call_gemini(self._create_generic_prompt(), image_data)
                os.remove(image_path)
                return result

            except Exception as e:
                return {"error": f"Erreur PDF: {str(e)}"}
        else:
            return {"error": "Format non supporté"}

    def _create_generic_prompt(self) -> str:
        """Crée un prompt générique pour extraire toutes les informations."""
        return """
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
        """

    def _call_gemini(self, prompt: str, image_data: bytes) -> Dict:
        """Appelle l'API Gemini avec le prompt et l'image."""
        try:
            response = self.model.generate_content(
                contents=[{'mime_type': 'image/jpeg', 'data': image_data}, prompt]
            )

            if not response.text:
                return {"error": "Réponse vide de Gemini"}

            # Nettoyage du JSON
            json_str = response.text.strip()
            json_str = json_str.replace('```json', '').replace('```', '')
            json_str = re.sub(r',\s*}', '}', json_str)
            json_str = re.sub(r',\s*]', ']', json_str)

            return json.loads(json_str)

        except json.JSONDecodeError:
            return {"error": "JSON invalide", "raw": response.text}
        except Exception as e:
            return {"error": f"Erreur API: {str(e)}"}

def save_results(data: Dict, original_path: str):
    """Sauvegarde les résultats en JSON."""
    base_name = os.path.splitext(original_path)[0]
    output_path = f"{base_name}_extracted.json"

    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

    print(f"Résultats sauvegardés dans: {output_path}")
    return output_path

def display_all_details(data: Dict):
    """Affiche toutes les données extraites de manière claire."""
    if "error" in data:
        print(f"❌ Erreur: {data['error']}")
        if "raw" in data:
            print("Réponse brute:", data["raw"])
        return

    print("\n=== TOUTES LES DONNÉES EXTRAITES ===")

    # Fonction récursive pour afficher les données
    def print_recursive(data, indent=0):
        for key, value in data.items():
            if isinstance(value, dict):
                print(" " * indent + f"{key}:")
                print_recursive(value, indent + 2)
            elif isinstance(value, list):
                print(" " * indent + f"{key}:")
                for i, item in enumerate(value, 1):
                    if isinstance(item, (dict, list)):
                        print(" " * (indent + 2) + f"Item {i}:")
                        print_recursive(item, indent + 4)
                    else:
                        print(" " * (indent + 2) + f"{i}. {item}")
            else:
                print(" " * indent + f"{key}: {value}")

    print_recursive(data)

if __name__ == "__main__":
    import sys

    if len(sys.argv) != 3:
        print("Usage: python extractor.py <fichier> <clé_api>")
        sys.exit(1)

    file_path = sys.argv[1]
    api_key = sys.argv[2]

    if not os.path.exists(file_path):
        print(f"Fichier introuvable: {file_path}")
        sys.exit(1)

    print("Démarrage de l'extraction...")
    extractor = GeminiInvoiceDataExtractor(api_key)
    result = extractor.process_document(file_path)

    display_all_details(result)

    if "error" not in result:
        save_results(result, file_path)