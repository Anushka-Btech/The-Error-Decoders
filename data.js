// data.js
export const attractions = {
  jaipur: [
    {
      id: "j1",
      name: "Hawa Mahal",
      img: "https://media.istockphoto.com/id/1027216080/photo/hawa-mahal-palace-of-the-winds-jaipur-rajasthan.jpg?s=612x612&w=0&k=20&c=KrPAx2DsH8COKUK-cMKIzZfe987iuCpxoVQUNiHktkU=",
      desc: "The iconic Palace of Winds built with red and pink sandstone.",
    },
    {
      id: "j2",
      name: "Amber Fort",
      img: "https://s7ap1.scene7.com/is/image/incredibleindia/amber-fort-jaipur-rajasthan-1-attr-hero?qlt=82&ts=1742157903972",
      desc: "Hilltop fort offering stunning sunrise views and elephant rides.",
    },
    {
      id: "j3",
      name: "City Palace",
      img: "https://accidentallywesanderson.com/wp-content/uploads/2020/04/City-Palace-India-scaled.jpg",
      desc: "Royal residence featuring courtyards, museums, and architecture.",
    },
  ],

  udaipur: [
    {
      id: "u1",
      name: "Lake Pichola",
      img: "https://images.unsplash.com/photo-1609168388133-0f47c2a02c36?auto=format&fit=crop&w=1200&q=60",
      desc: "Romantic lake famous for boat rides and sunset views.",
    },
    {
      id: "u2",
      name: "City Palace Udaipur",
      img: "https://images.unsplash.com/photo-1603643466308-6579c0ed984f?auto=format&fit=crop&w=1200&q=60",
      desc: "A beautiful fusion of Mughal and Rajasthani architecture.",
    },
  ],

  agra: [
    {
      id: "ag1",
      name: "Taj Mahal",
      img: "https://images.unsplash.com/photo-1583241514659-1d9e912b8896?auto=format&fit=crop&w=1200&q=60",
      desc: "World-famous marble mausoleum symbolizing eternal love.",
    },
    {
      id: "ag2",
      name: "Agra Fort",
      img: "https://images.unsplash.com/photo-1589641360464-f43506b47696?auto=format&fit=crop&w=1200&q=60",
      desc: "UNESCO fort built from red sandstone with majestic halls.",
    },
  ],

  varanasi: [
    {
      id: "v1",
      name: "Dashashwamedh Ghat",
      img: "https://images.unsplash.com/photo-1606220684236-8c5fbcaa0c11?auto=format&fit=crop&w=1200&q=60",
      desc: "Famous for Ganga Aarti and spiritual ambiance.",
    },
    {
      id: "v2",
      name: "Kashi Vishwanath Temple",
      img: "https://images.unsplash.com/photo-1606220920891-16206540fd7e?auto=format&fit=crop&w=1200&q=60",
      desc: "One of the holiest temples dedicated to Lord Shiva.",
    },
  ],

  khajuraho: [
    {
      id: "k1",
      name: "Kandariya Mahadeva Temple",
      img: "https://images.unsplash.com/photo-1589871898250-82d49edc1bec?auto=format&fit=crop&w=1200&q=60",
      desc: "Intricately carved sandstone temples famous for sculpture art.",
    },
    {
      id: "k2",
      name: "Lakshmana Temple",
      img: "https://images.unsplash.com/photo-1613735872471-e557e0d72a6b?auto=format&fit=crop&w=1200&q=60",
      desc: "UNESCO site representing Nagara-style architecture.",
    },
  ],
};

export const guides = {
  jaipur: [
    {
      id: "jg1",
      name: "Asha Verma",
      rating: 4.9,
      experience: "12 yrs",
      language: "Hindi, English",
      price: 1500,
      bio: "Heritage expert with deep knowledge of Jaipur history.",
    },
    {
      id: "jg2",
      name: "Ravi Sharma",
      rating: 4.8,
      experience: "10 yrs",
      language: "Hindi, English, French",
      price: 1800,
      bio: "Specializes in food tours & cultural walks.",
    },
  ],

  udaipur: [
    {
      id: "ug1",
      name: "Meera Rana",
      rating: 4.7,
      experience: "8 yrs",
      language: "English, Hindi",
      price: 1600,
      bio: "Palace & lake tour expert.",
    },
  ],

  agra: [
    {
      id: "ag1",
      name: "Imran Khan",
      rating: 4.9,
      experience: "14 yrs",
      language: "English, Hindi",
      price: 1900,
      bio: "Taj Mahal storytelling expert.",
    },
  ],

  varanasi: [
    {
      id: "v1",
      name: "Shivam Tiwari",
      rating: 4.8,
      experience: "9 yrs",
      language: "Hindi, English",
      price: 1500,
      bio: "Ghat walks & Aarti guide.",
    },
  ],

  khajuraho: [
    {
      id: "k1",
      name: "Prakash Singh",
      rating: 4.7,
      experience: "11 yrs",
      language: "English, Hindi",
      price: 1700,
      bio: "Temple architecture specialist.",
    },
  ],
};

export const plans = {
  jaipur: {
    title: "Royal Jaipur Day Plan",
    schedule: [
      "09:00 Amber Fort",
      "12:00 City Palace",
      "15:00 Hawa Mahal",
      "17:00 Jaipur Bazaar Walk",
    ],
  },
  udaipur: {
    title: "Udaipur Romantic Day",
    schedule: [
      "08:00 Lake Pichola",
      "11:00 City Palace",
      "14:00 Ropeway",
      "17:30 Sunset Boat Ride",
    ],
  },
  agra: {
    title: "Agra Heritage Day",
    schedule: [
      "06:00 Taj Mahal Sunrise",
      "10:00 Agra Fort",
      "13:00 Local Restaurant",
      "16:00 Mehtab Bagh Sunset",
    ],
  },
  varanasi: {
    title: "Varanasi Spiritual Day",
    schedule: [
      "05:00 Morning Boat Ride",
      "10:00 Kashi Vishwanath",
      "14:00 Local Food Tour",
      "18:30 Ganga Aarti",
    ],
  },
  khajuraho: {
    title: "Khajuraho Sculptures Trail",
    schedule: [
      "09:00 Western Temples",
      "12:00 Lakshmana Temple",
      "15:00 Eastern Group",
      "17:00 Sunset Point",
    ],
  },
};

export const requests = []; // store booking requests
