import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from '../types';

// Use Vite's import.meta.env instead of process.env
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY;

if (!API_KEY) {
    console.warn("GEMINI_API_KEY not set. Food analysis will fail. Set VITE_GEMINI_API_KEY in .env.local");
}

const ai = API_KEY ? new GoogleGenAI({ apiKey: API_KEY }) : null;

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        isFood: { type: Type.BOOLEAN },
        reason: { type: Type.STRING, nullable: true },
        dishName: { type: Type.STRING, nullable: true },
        ingredients: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            nullable: true,
        },
        nutrition: {
            type: Type.OBJECT,
            properties: {
                calories: { type: Type.STRING },
                protein: { type: Type.STRING },
                carbohydrates: { type: Type.STRING },
                fat: { type: Type.STRING },
            },
            nullable: true,
        },
        recipe: {
            type: Type.OBJECT,
            properties: {
                difficulty: { type: Type.STRING },
                cookTime: { type: Type.STRING },
                steps: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING },
                },
            },
            nullable: true,
        },
        uncertainty: { type: Type.STRING, nullable: true },
    },
};

const promptFi = `
Olet erittäin tarkka ruoantunnistuksen ja ravitsemuksen asiantuntija, joka toimii suomenkielisessä verkkosovelluksessa.
Tehtäväsi on analysoida käyttäjän lähettämä kuva ateriasta tai juomasta ja tuottaa luotettavaa tietoa ruokavaliosta ja ruoanlaitosta.

Vastauksesi KOKO sisällön TÄYTYY olla yksittäinen JSON-objekti. Älä lisää mitään tekstiä ennen tai jälkeen JSON-objektin.

Noudata seuraavia sääntöjä:

1.  **Tunnista ruoka:**
    *   Tunnista tarkka ruokalaji, jos mahdollista, tai lähin yleinen ruokalaji ulkonäön perusteella.
    *   Jos kuvassa on useita ruokia, keskity pääruokaan, mutta mainitse lyhyesti lisukkeet.

2.  **Ainesosat:**
    *   Listaa näkyvät tai tyypillisesti käytetyt pääainesosat.
    *   Sisällytä arvioidut määrät, jos ne ovat kohtuudella pääteltävissä.
    *   Käytä yleisiä suomalaisista ruokakaupoista löytyviä ainesosia.

3.  **Ravintoarvot:**
    *   Anna arvioitu kalorimäärä yhdelle annokselle.
    *   Arvioi proteiinin, hiilihydraattien ja rasvan määrät.
    *   Arvojen on oltava realistisia.

4.  **Resepti (suomeksi):**
    *   Kirjoita helppotajuiset suomenkieliset ohjeet, joilla tyypillinen kotikokki voi valmistaa ruoan.
    *   Sisällytä lyhyt kuvaus vaikeustasosta ja arvioitu kokonaisvalmistusaika.
    *   Ohjeiden on oltava selkeitä, loogisia ja luonnollisella suomen kielellä.

5.  **Epävarmuuden viestiminen:**
    *   Jos olet epävarma joistakin ainesosista tai valmistusmenetelmästä, mainitse tämä selkeästi suomeksi.
    *   Selitä lyhyesti, miksi arvio ei välttämättä ole tarkka (esim. epäselvä kuvakulma, piilossa olevat ainesosat, epäselvä annoskoko).

6.  **Kieli ja yksiköt:**
    *   KAIKKI JSON-kenttien sisältö on oltava suomeksi.
    *   Käytä metrisiä yksiköitä (g, ml, kpl, tl, rkl, °C).

7.  **Jos kuva EI ole ruokaa:**
    *   Palauta JSON, jossa 'isFood' on 'false' ja 'reason'-kentässä on kohtelias suomenkielinen selitys, miksi ruokaa ei voitu tunnistaa.
    *   Älä palauta tällöin ravitsemus- tai reseptitietoja.
`;

const promptEn = `
You are a highly accurate food recognition and nutrition expert working in an English-language web application.
Your task is to analyze an image of a meal or drink uploaded by the user and produce reliable dietary and cooking information.

The ENTIRE content of your response MUST be a single JSON object. Do not add any text before or after the JSON object.

Follow these rules:

1.  **Identify the food:**
    *   Recognize the exact dish if possible, or the closest common dish based on appearance.
    *   If multiple foods appear, focus on the main item but briefly mention the side items.

2.  **Ingredients:**
    *   List the main ingredients visible or typically used in the dish.
    *   Include approximate amounts if they can be reasonably inferred.
    *   Use common grocery items.

3.  **Nutritional values:**
    *   Give an approximate calorie count for one portion.
    *   Estimate protein, carbohydrate and fat levels.
    *   Values must be realistic.

4.  **Recipe (in English):**
    *   Write easy-to-understand English instructions describing how a typical home cook could prepare this dish.
    *   Include a short description of difficulty level and estimated total cooking time.
    *   Steps must be clear, logical and written in natural English.

5.  **Communicate uncertainty:**
    *   If you are unsure about some ingredients or preparation method, clearly mention this in English.
    *   Explain briefly why the estimate may not be precise (e.g., unclear angle, hidden ingredients, unclear portion size).

6.  **Language and units:**
    *   ALL content in the JSON fields must be in English.
    *   Use metric units (g, ml, pcs, tsp, tbsp, °C).

7.  **If the image is NOT food:**
    *   Return a JSON with 'isFood' set to 'false' and the 'reason' field containing a polite English explanation of why no food could be identified.
    *   Do not return nutrition or recipe data in that case.
`;


export async function analyzeFoodImage(base64Image: string, mimeType: string, language: 'fi' | 'en'): Promise<AnalysisResult> {
    if (!ai) {
        throw new Error("Gemini AI client not initialized. Please set VITE_GEMINI_API_KEY in .env.local");
    }

    const imagePart = {
        inlineData: {
            data: base64Image,
            mimeType: mimeType,
        },
    };

    const textPart = {
        text: language === 'fi' ? promptFi : promptEn,
    };

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts: [imagePart, textPart] },
        config: {
            responseMimeType: "application/json",
            responseSchema: responseSchema,
        },
    });

    try {
        const jsonText = response.text.trim();
        const result: AnalysisResult = JSON.parse(jsonText);
        return result;
    } catch (e) {
        console.error("Failed to parse JSON response:", response.text);
        throw new Error("Response was not valid JSON.");
    }
}
