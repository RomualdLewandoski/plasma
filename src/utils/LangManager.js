import lang_fr from "../lang/lang_fr";
import lang_en from "../lang/lang_en";

function getLang() {
    const userLocale =
        navigator.languages && navigator.languages.length
            ? navigator.languages[0]
            : navigator.language;
    if (userLocale.startsWith("fr")) {
        return lang_fr.lang
    } else {
        return lang_en.lang
    }
}

export default {getLang}