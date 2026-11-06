/**
 * ANANTADEEPA: The Journey of Light (अनंतदीपा)
 * Chapter-by-Chapter Sacred Content & Configuration Data
 * Aligned 100% with the 7 Master Diwali Artworks in reference/
 */

const ACTS_DATA = [
  {
    id: "origin",
    actNumber: "0",
    dayLabel: "PROLOGUE · THE ESSENCE",
    tithi: "KARTIKA KRISHNA PAKSHA",
    sanskritTitle: "प्रकाशस्य उदयः",
    title: "The Awakening of Light",
    subtitle: "Homecoming of Shri Rama, Mata Sita & Lakshmana to Ayodhya",
    shloka: "तमसो मा ज्योतिर्गमय । मृत्योर्माऽमृतं गमय ॥",
    phonetic: "Asato mā sadgamaya, tamaso mā jyotirgamaya, mṛtyormā'mṛtaṁ gamaya.",
    translation: "Lead us from darkness unto light, from ignorance unto truth.",
    description: "Deepavali is the eternal triumph of righteousness over darkness. It celebrates the glorious homecoming of Bhagwan Shri Rama, Mata Sita, and Lakshmana to Ayodhya after fourteen years of exile and the defeat of Ravana. Overjoyed citizens filled the night sky with radiant fireworks and illuminated every courtyard and palace terrace with thousands of glowing earthen diyas (Deepotsav). Spiritually, it awakens the immortal divine light within every human soul.",
    rituals: ["Deepotsav", "Ayodhya Homecoming", "Rama-Sita Darshan", "Triumph of Dharma"],
    image: "originofdiwali.png",
    colorTheme: {
      core: "#FFF5E0",
      halo: "#E5A93C",
      accent: "#FF8C00",
      bg: "#06070D",
      lightBeam: "#FFD700"
    },
    camera: {
      position: { x: 0, y: 0, z: 9.8 },
      target: { x: 0, y: 0, z: 0 },
      fov: 50
    }
  },
  {
    id: "vasubaras",
    actNumber: "I",
    dayLabel: "DAY I · ASHVIN DWADASHI",
    tithi: "GOVATSA DWADASHI / VASU BARAS",
    sanskritTitle: "गोधन पूजनम्",
    title: "Vasu Baras",
    subtitle: "Devout Women Honoring Gau Mata & Her Nursing Calf",
    shloka: "गावो ममाग्रतो नित्यं गावः पृष्ठत एव च । गावो मे सर्वतश्चैव गवां मध्ये वसाम्यहम् ॥",
    phonetic: "Gāvo mamāgrato nityaṁ gāvaḥ pṛṣṭhata eva ca | Gāvo me sarvataścaiva gavāṁ madhye vasāmyaham ||",
    translation: "May cows reside before me, behind me, and all around me; in their sacred presence I abide.",
    description: "Marking the gentle beginning of Deepavali festivities, Vasu Baras honors the sacred cow (Gau Mata) and her nursing calf as living embodiments of Kamadhenu and divine maternal nurturance. In village courtyards, devout women perform holy aarti with lit brass thalis, applying auspicious haldi-kumkum, draping marigold garlands, and offering sprouted moong and sweets in deep ecological and maternal reverence.",
    rituals: ["Govatsa Pujan", "Kamadhenu Aradhana", "Maternal Aarti", "Sprouted Grain Offerings"],
    image: "vasubaras.png",
    colorTheme: {
      core: "#FFFDF2",
      halo: "#F4C430",
      accent: "#FF9E1B",
      bg: "#090805",
      lightBeam: "#FFE484"
    },
    camera: {
      position: { x: 0, y: 0, z: 9.8 },
      target: { x: 0, y: 0, z: 0 },
      fov: 50
    }
  },
  {
    id: "dhanteras",
    actNumber: "II",
    dayLabel: "DAY II · ASHVIN TRAYODASHI",
    tithi: "DHANTRAYODASHI",
    sanskritTitle: "धनत्रयोदशी",
    title: "Dhanteras",
    subtitle: "Three Golden Kalash, Amrit Vessel & Auspicious Wealth",
    shloka: "नमामि धन्वन्तरिमादिदेवं सुरासुरैर्वन्दितपादपद्मम् ॥",
    phonetic: "Namāmi dhanvantarimādidevaṁ surāsurairvanditapādapadmam ||",
    translation: "Salutations to Lord Dhanvantari, holding the vessel of celestial nectar.",
    description: "During the churning of the cosmic ocean (Samudra Manthan), Lord Dhanvantari manifested holding the sacred vessel of Amrita (the elixir of holistic health), while Goddess Mahalakshmi arose embodying auspicious abundance. Three radiant golden kalash pots overflow with gold coins, gems, and pearls, adorned with sacred coconuts and mango leaves. Families light the southern-facing Yamadeepdaan to dispel untimeliness and invite divine vitality.",
    rituals: ["Golden Kalash Pujan", "Dhanvantari Aradhana", "Yamadeepdaan", "Sacred Prosperity"],
    image: "dhanteras.png",
    colorTheme: {
      core: "#FFFDF0",
      halo: "#D4AF37",
      accent: "#E5A00D",
      bg: "#0B0A06",
      lightBeam: "#FFDF73"
    },
    camera: {
      position: { x: 0, y: 0, z: 9.8 },
      target: { x: 0, y: 0, z: 0 },
      fov: 50
    }
  },
  {
    id: "chaturdashi",
    actNumber: "III",
    dayLabel: "DAY III · ASHVIN CHATURDASHI",
    tithi: "NARAKA CHATURDASHI / CHOTI DIWALI",
    sanskritTitle: "नरक चतुर्दशी",
    title: "Naraka Chaturdashi",
    subtitle: "Bhagwan Shri Krishna Defeating Narakasura",
    shloka: "निशीथे वरदे देवि नरकध्वान्तनाशिनि ॥",
    phonetic: "Niśīthe varade devi narakadhvāntanāśini ||",
    translation: "Dispelling the darkness of misery and liberating consciousness.",
    description: "Commemorating the cosmic victory of Bhagwan Shri Krishna and Satyabhama over the tyrannical demon king Narakasura on the stone battlefield, liberating sixteen thousand souls from bondage. Celebrated pre-dawn with holy Abhyanga Snan—cleansing mind and body with fragrant herbal ubtan and sesame oil to wash away inner impurities and ego, before greeting the new dawn with luminous fireworks and diyas.",
    rituals: ["Krishna Victory", "Narakasura Moksha", "Abhyanga Snan", "Sudarshana Illumination"],
    image: "narakachaturdashi.png",
    colorTheme: {
      core: "#FFEAEA",
      halo: "#FF4500",
      accent: "#FF2200",
      bg: "#0D0607",
      lightBeam: "#FF7733"
    },
    camera: {
      position: { x: 0, y: 0, z: 9.8 },
      target: { x: 0, y: 0, z: 0 },
      fov: 50
    }
  },
  {
    id: "lakshmipoojan",
    actNumber: "IV",
    dayLabel: "DAY IV · KARTIKA AMAVASYA",
    tithi: "LAKSHMI PUJAN · DEEPOTSAV",
    sanskritTitle: "लक्ष्मी पूजनम्",
    title: "Lakshmi Pujan",
    subtitle: "Mata Mahalakshmi on Pink Lotus with the Radiant Diya",
    shloka: "ॐ श्रीं ह्रीं श्रीं कमले कमलालये प्रसीद प्रसीद ॥",
    phonetic: "Oṁ Śrīṁ Hrīṁ Śrīṁ Kamale Kamalālaye Prasīda Prasīda ||",
    translation: "O Goddess of abundance, seated upon the lotus, shower thy grace.",
    description: "On the darkest night of the year, Goddess Mahalakshmi manifests seated upon her celestial pink lotus throne (Kamalasana), showering golden coins and spiritual grace with four blessing hands. In front of her shines a sacred rangoli mandala and a living earthen Diya, radiating warmth into every sanctified home. Families and merchants conduct Chopda Pujan, dedicating new ledgers to truth and ethical prosperity.",
    rituals: ["Mata Mahalakshmi Pujan", "Kamalasana Darshan", "Sacred Diya Lau", "Chopda Pujan"],
    image: "laxmipoojan.png",
    colorTheme: {
      core: "#FFFFFF",
      halo: "#FF9933",
      accent: "#FF5500",
      bg: "#0A0604",
      lightBeam: "#FFAA44"
    },
    camera: {
      position: { x: 0, y: 0, z: 9.8 },
      target: { x: 0, y: 0, z: 0 },
      fov: 50
    }
  },
  {
    id: "padwa",
    actNumber: "V",
    dayLabel: "DAY V · KARTIKA PRATIPADA",
    tithi: "BALI PRATIPADA / GOVARDHAN PUJA",
    sanskritTitle: "दीपावली पाडवा",
    title: "Diwali Padwa",
    subtitle: "Lord Vamana & King Bali beneath Cosmic Trivikrama",
    shloka: "बलिराज नमस्तुभ्यं विरोचनसुत प्रभो ॥",
    phonetic: "Balirāja namastubhyaṁ virocanasuta prabho ||",
    translation: "Salutations to King Bali, crowned with nobility and devotion.",
    description: "Commemorating Lord Vamana accepting King Bali's humble devotion by placing his foot upon Bali's head, while manifesting the cosmic Trivikrama form that spans the celestial sun and planetary orbits. Concurrently celebrated as Diwali Padwa—the dawn of the Vikram Samvat New Year—honoring mutual love, respect, and steadfast companionship between husband and wife through celebratory gifts and aarti.",
    rituals: ["Bali Pratipada", "Vamana Trivikrama", "New Year Inception", "Pativrata Aarti"],
    image: "balipadwa.png",
    colorTheme: {
      core: "#FFF8EA",
      halo: "#E08D3C",
      accent: "#FF4500",
      bg: "#080705",
      lightBeam: "#FFBA5A"
    },
    camera: {
      position: { x: 0, y: 0, z: 9.8 },
      target: { x: 0, y: 0, z: 0 },
      fov: 50
    }
  },
  {
    id: "bhavbeez",
    actNumber: "VI",
    dayLabel: "DAY VI · KARTIKA DWITIYA",
    tithi: "BHAU BEEJ / YAMA DWITIYA",
    sanskritTitle: "यम द्वितीया / भाऊबीज",
    title: "Bhau Beej",
    subtitle: "The Sister's Aarti Ovalana & Auspicious Tilak Blessing",
    shloka: "भ्रातस्तवानुजाताहं भुङ्क्ष्व भक्तमिमं शुभम् ॥",
    phonetic: "Bhrātastavānujātāhaṁ bhuṅkṣva bhaktamimaṁ śubham ||",
    translation: "O brother, accept this sanctified feast and walk in long life and grace.",
    description: "Revered as the sacred day Lord Yamaraj visited his loving sister Yamuna, celebrating an unbroken bond of sibling protection and goodwill. The sister circles the luminous brass Aarti Thali with lit diya, flowers, and sweets before her seated brother, applying the sacred red vermilion tilak and unbroken rice (akshata) to his forehead while praying for his long life, prosperity, and fearlessness.",
    rituals: ["Aarti Ovalana", "Tilak Application", "Sweet Offerings", "Sibling Covenant"],
    image: "bhaubeej.png",
    colorTheme: {
      core: "#FFFFFF",
      halo: "#FF2A6D",
      accent: "#FF007F",
      bg: "#0A050A",
      lightBeam: "#FF77AA"
    },
    camera: {
      position: { x: 0, y: 0, z: 9.8 },
      target: { x: 0, y: 0, z: 0 },
      fov: 50
    }
  }
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ACTS_DATA };
}
