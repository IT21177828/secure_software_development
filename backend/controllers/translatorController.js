import axios from "axios";

const language = async (req, res) => {
  const options = {
    method: "GET",
    url: "https://google-translate1.p.rapidapi.com/language/translate/v2/languages",
    headers: {
      "Accept-Encoding": "application/gzip",
      "X-RapidAPI-Key": "cee2294232mshc5d1c380d8f1993p19cf0ejsn4dc41c1849fe",
      "X-RapidAPI-Host": "google-translate1.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);

    const languagesData = response.data.data;

    const mappedLanguages = languagesData.languages.map(
      (lang, key) => lang.language + key
    );

    res.status(200).json(mappedLanguages);
  } catch (error) {
    console.error(error.message);
  }
};

//translation
const translate =
  ("/translation",
  async (req, res) => {
    let { textToTranslate, outputLanguage, inputLanguage } = req.query;

    /**
     * ALTERNATUVE API INCASE OF EMERGANCY
     * */

    outputLanguage = outputLanguage.substring(0, 2).toLowerCase();

    inputLanguage = inputLanguage.substring(0, 2).toLowerCase();

    const encodedParams = new URLSearchParams();
    encodedParams.set("q", textToTranslate);
    encodedParams.set("target", outputLanguage);
    encodedParams.set("source", inputLanguage);

    const options = {
      method: "POST",
      url: "https://google-translate1.p.rapidapi.com/language/translate/v2",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "Accept-Encoding": "application/gzip",
        "X-RapidAPI-Key": "cee2294232mshc5d1c380d8f1993p19cf0ejsn4dc41c1849fe",
        "X-RapidAPI-Host": "google-translate1.p.rapidapi.com",
      },
      data: encodedParams,
    };

    try {
      const response = await axios.request(options);
      res.status(201).json(response.data.data.translations[0].translatedText);
    } catch (error) {
      console.error(error.message);
    }
  });

export default { language, translate };
