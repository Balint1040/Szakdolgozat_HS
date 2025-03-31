"use client";

import "vanilla-cookieconsent/dist/cookieconsent.css";
import * as CookieConsent from "vanilla-cookieconsent";
import { useEffect } from "react";

import type { CookieConsentConfig } from "vanilla-cookieconsent";

const pluginConfig: CookieConsentConfig = {
  guiOptions: {
    consentModal: {
      layout: "box",
      position: "bottom left",
      equalWeightButtons: false,
      flipButtons: false,
    },
    preferencesModal: {
      layout: "box",
      position: "left",
      equalWeightButtons: false,
      flipButtons: false,
    },
  },

  /*onFirstConsent: function () {
    console.log("onFirstAction fired");
  },

  onConsent: function ({ cookie }) {
    console.log("onConsent fired ...");
  },

  onChange: function ({ changedCategories, cookie }) {
    console.log("onChange fired ...");
  },*/

  categories: {
    necessary: {
      readOnly: true,
      enabled: true,
    },
    functional: {
      enabled: true,
    }
  },

  language: {
    default: "hu",

    translations: {
      hu: {
        consentModal: {
          title: "Oldalunk sütiket használ!",
          description:
            'Weboldalunk sütiket használ az alapvető funkciók biztosítása és az Ön online élményének javítása érdekében. <a href="#privacy-policy" data-cc="show-preferencesModal" class="cc__link">Beállítások kezelése</a>',
          acceptAllBtn: "Elfogadás",
          acceptNecessaryBtn: "Elutasítás",
          showPreferencesBtn: "Beállítások kezelése",
          //closeIconLabel: 'Close',
          footer: `
              <div class="w-100 d-flex justify-content-around">
                <a href="/adatvedelem">Adatvédelem</a>
                <a href="/impresszum">Impresszum</a>
              </div>
            `,
        },
        preferencesModal: {
          title: "Süti beállítások",
          acceptAllBtn: "Elfogadás",
          acceptNecessaryBtn: "Elutasítás",
          savePreferencesBtn: "Beállítások mentése",
          closeIconLabel: "Bezárás",
          sections: [
            {
              title: "Süti használat",
              description:
                'Sütiket használunk a weboldal alapvető funkcióinak biztosítása és az Ön online élményének javítása érdekében. Minden egyes kategória esetében bármikor kiválaszthatja a ki/bekapcsolást. A sütikkel és egyéb érzékeny adatokkal kapcsolatos további részletekért kérjük, olvassa el a teljes <a href="/adatvedelem" class="cc__link">adatkezelési tájékoztatónkat</a>.',
            },
            {
              title: "Szükséges sütik",
              description: "A szükséges sütik döntő fontosságúak a weboldal alapvető funkciói szempontjából, és a weboldal ezek nélkül nem fog megfelelően működni. Ezek a sütik nem tárolnak személyazonosításra alkalmas adatokat.",
              linkedCategory: "necessary",
            },
            {
              title: "Funkcionális sütik",
              description: "A funkcionális sütik segítenek bizonyos funkciók végrehajtásában, például a weboldal tartalmának megosztásában a közösségi média platformokon, visszajelzések gyűjtésében és más, harmadik féltől származó funkciókban.",
              linkedCategory: "functional"
            }
          ],
        },
      },
    },
  },
};

export default function CookieConsentClient() {
  useEffect(() => {
    CookieConsent.run(pluginConfig);
  }, []);

  return (
    <></>
  )
}
