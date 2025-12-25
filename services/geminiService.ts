import OpenAI from 'openai';
import { AnalysisResult } from '../types';

// OpenAI API configuration
// Using GPT-4o-mini which supports vision for food image analysis
const API_KEY = import.meta.env.VITE_OPENAI_API_KEY;

if (!API_KEY) {
    console.warn("API_KEY not set. Food analysis will fail. Set VITE_OPENAI_API_KEY in .env");
}

const openai = new OpenAI({
    apiKey: API_KEY,
    dangerouslyAllowBrowser: true // Required for client-side usage
});

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

Palauta JSON seuraavassa muodossa:
{
  "isFood": boolean,
  "reason": string | null,
  "dishName": string | null,
  "ingredients": string[] | null,
  "nutrition": {
    "calories": string,
    "protein": string,
    "carbohydrates": string,
    "fat": string
  } | null,
  "recipe": {
    "difficulty": string,
    "cookTime": string,
    "steps": string[]
  } | null,
  "uncertainty": string | null
}
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

Return JSON in this format:
{
  "isFood": boolean,
  "reason": string | null,
  "dishName": string | null,
  "ingredients": string[] | null,
  "nutrition": {
    "calories": string,
    "protein": string,
    "carbohydrates": string,
    "fat": string
  } | null,
  "recipe": {
    "difficulty": string,
    "cookTime": string,
    "steps": string[]
  } | null,
  "uncertainty": string | null
}
`;

export async function analyzeFoodImage(base64Image: string, mimeType: string, language: 'fi' | 'en'): Promise<AnalysisResult> {
    if (!API_KEY) {
        throw new Error("OpenAI API key not set. Please set VITE_OPENAI_API_KEY in .env");
    }

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini', // GPT-4o-mini supports vision and is cost-effective
            messages: [
                {
                    role: 'user',
                    content: [
                        {
                            type: 'text',
                            text: language === 'fi' ? promptFi : promptEn
                        },
                        {
                            type: 'image_url',
                            image_url: {
                                url: `data:${mimeType};base64,${base64Image}`,
                                detail: 'low' // Use low detail for cost efficiency
                            }
                        }
                    ]
                }
            ],
            response_format: { type: 'json_object' },
            temperature: 0.7,
            max_tokens: 2000
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
            throw new Error("No response from OpenAI API");
        }

        const result: AnalysisResult = JSON.parse(content);
        return result;
    } catch (e: any) {
        console.error("OpenAI API error:", e);
        throw new Error(e.message || "Failed to analyze image");
    }
}
