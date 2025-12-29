// Scale Library - Western, Hindustani, and Carnatic scales/ragas

const SCALE_LIBRARY = {
  // ===== WESTERN SCALES =====

  'major': {
    name: 'Major (Ionian)',
    category: 'western',
    ratios: [1, 9/8, 5/4, 4/3, 3/2, 5/3, 15/8],
    solfege: {
      western: ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Ti'],
      hindustani: ['Sa', 'Re', 'Ga', 'Ma', 'Pa', 'Dha', 'Ni'],
      carnatic: ['Sa', 'Ri2', 'Ga3', 'Ma1', 'Pa', 'Da2', 'Ni3']
    }
  },

  'natural-minor': {
    name: 'Natural Minor (Aeolian)',
    category: 'western',
    ratios: [1, 9/8, 6/5, 4/3, 3/2, 8/5, 9/5],
    solfege: {
      western: ['Do', 'Re', 'Me', 'Fa', 'Sol', 'Le', 'Te'],
      hindustani: ['Sa', 'Re', 'Ga♭', 'Ma', 'Pa', 'Dha♭', 'Ni♭'],
      carnatic: ['Sa', 'Ri2', 'Ga2', 'Ma1', 'Pa', 'Da1', 'Ni2']
    }
  },

  'harmonic-minor': {
    name: 'Harmonic Minor',
    category: 'western',
    ratios: [1, 9/8, 6/5, 4/3, 3/2, 8/5, 15/8],
    solfege: {
      western: ['Do', 'Re', 'Me', 'Fa', 'Sol', 'Le', 'Ti'],
      hindustani: ['Sa', 'Re', 'Ga♭', 'Ma', 'Pa', 'Dha♭', 'Ni'],
      carnatic: ['Sa', 'Ri2', 'Ga2', 'Ma1', 'Pa', 'Da1', 'Ni3']
    }
  },

  'melodic-minor': {
    name: 'Melodic Minor (Ascending)',
    category: 'western',
    ratios: [1, 9/8, 6/5, 4/3, 3/2, 5/3, 15/8],
    solfege: {
      western: ['Do', 'Re', 'Me', 'Fa', 'Sol', 'La', 'Ti'],
      hindustani: ['Sa', 'Re', 'Ga♭', 'Ma', 'Pa', 'Dha', 'Ni'],
      carnatic: ['Sa', 'Ri2', 'Ga2', 'Ma1', 'Pa', 'Da2', 'Ni3']
    }
  },

  'pentatonic-major': {
    name: 'Pentatonic Major',
    category: 'western',
    ratios: [1, 9/8, 5/4, 3/2, 5/3],
    solfege: {
      western: ['Do', 'Re', 'Mi', 'Sol', 'La'],
      hindustani: ['Sa', 'Re', 'Ga', 'Pa', 'Dha'],
      carnatic: ['Sa', 'Ri2', 'Ga3', 'Pa', 'Da2']
    },
    notes: 5
  },

  'pentatonic-minor': {
    name: 'Pentatonic Minor',
    category: 'western',
    ratios: [1, 6/5, 4/3, 3/2, 9/5],
    solfege: {
      western: ['Do', 'Me', 'Fa', 'Sol', 'Te'],
      hindustani: ['Sa', 'Ga♭', 'Ma', 'Pa', 'Ni♭'],
      carnatic: ['Sa', 'Ga2', 'Ma1', 'Pa', 'Ni2']
    },
    notes: 5
  },

  // ===== HINDUSTANI RAGAS =====

  'bhairav': {
    name: 'Bhairav',
    category: 'hindustani',
    ratios: [1, 16/15, 5/4, 4/3, 3/2, 8/5, 15/8],
    solfege: {
      western: ['Do', 'Ra', 'Mi', 'Fa', 'Sol', 'Le', 'Ti'],
      hindustani: ['Sa', 'Re♭', 'Ga', 'Ma', 'Pa', 'Dha♭', 'Ni'],
      carnatic: ['Sa', 'Ri1', 'Ga3', 'Ma1', 'Pa', 'Da1', 'Ni3']
    },
    time: 'Morning (6-9am)',
    mood: 'Serious, spiritual, devotional',
    pakad: [
      [1, 2, 3, 4, 2],  // S r G m r
      [1, 2, 1, 3, 2],  // S r S G r
      [6, 1, 7, 1]      // d. S N. S
    ]
  },

  'yaman': {
    name: 'Yaman (Kalyan)',
    category: 'hindustani',
    ratios: [1, 9/8, 5/4, 45/32, 3/2, 27/16, 15/8],
    solfege: {
      western: ['Do', 'Re', 'Mi', 'Fi', 'Sol', 'La', 'Ti'],
      hindustani: ['Sa', 'Re', 'Ga', 'Ma♯', 'Pa', 'Dha', 'Ni'],
      carnatic: ['Sa', 'Ri2', 'Ga3', 'Ma2', 'Pa', 'Da2', 'Ni3']
    },
    time: 'Evening (7-10pm)',
    mood: 'Sweet, calm, peaceful, romantic',
    pakad: [
      [7, 2, 3],        // Ni Re Ga
      [2, 7, 2, 1],     // Re Ni Re Sa
      [3, 4, 7, 2]      // Ga Ma+ Ni Re
    ]
  },

  'kafi': {
    name: 'Kafi',
    category: 'hindustani',
    ratios: [1, 9/8, 6/5, 4/3, 3/2, 27/16, 9/5],
    solfege: {
      western: ['Do', 'Re', 'Me', 'Fa', 'Sol', 'La', 'Te'],
      hindustani: ['Sa', 'Re', 'Ga♭', 'Ma', 'Pa', 'Dha', 'Ni♭'],
      carnatic: ['Sa', 'Ri2', 'Ga2', 'Ma1', 'Pa', 'Da2', 'Ni2']
    },
    time: 'Afternoon (12-3pm)',
    mood: 'Devotional, bhakti, folk-like',
    pakad: [
      [1, 4, 3, 2, 1],  // S m g r S
      [3, 4, 6, 5, 3]   // g m d P g
    ]
  },

  'bilaval': {
    name: 'Bilaval',
    category: 'hindustani',
    ratios: [1, 9/8, 5/4, 4/3, 3/2, 5/3, 15/8],  // Same as major
    solfege: {
      western: ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Ti'],
      hindustani: ['Sa', 'Re', 'Ga', 'Ma', 'Pa', 'Dha', 'Ni'],
      carnatic: ['Sa', 'Ri2', 'Ga3', 'Ma1', 'Pa', 'Da2', 'Ni3']
    },
    time: 'Morning (6-9am)',
    mood: 'Bright, joyful, positive',
    pakad: [
      [1, 2, 3, 5],     // S R G P
      [5, 4, 3, 2, 1]   // P m G R S
    ]
  },

  'bhairavi': {
    name: 'Bhairavi',
    category: 'hindustani',
    ratios: [1, 16/15, 6/5, 4/3, 3/2, 8/5, 9/5],
    solfege: {
      western: ['Do', 'Ra', 'Me', 'Fa', 'Sol', 'Le', 'Te'],
      hindustani: ['Sa', 'Re♭', 'Ga♭', 'Ma', 'Pa', 'Dha♭', 'Ni♭'],
      carnatic: ['Sa', 'Ri1', 'Ga2', 'Ma1', 'Pa', 'Da1', 'Ni2']
    },
    time: 'Night/Early morning (3-6am)',
    mood: 'Melancholic, pathos, serious',
    pakad: [
      [1, 2, 3, 2, 1],  // S r g r S
      [5, 6, 5, 4, 3]   // P d P m g
    ]
  },

  'todi': {
    name: 'Todi (Miyan ki Todi)',
    category: 'hindustani',
    ratios: [1, 16/15, 6/5, 45/32, 3/2, 8/5, 15/8],
    solfege: {
      western: ['Do', 'Ra', 'Me', 'Fi', 'Sol', 'Le', 'Ti'],
      hindustani: ['Sa', 'Re♭', 'Ga♭', 'Ma♯', 'Pa', 'Dha♭', 'Ni'],
      carnatic: ['Sa', 'Ri1', 'Ga2', 'Ma2', 'Pa', 'Da1', 'Ni3']
    },
    time: 'Afternoon (12-3pm)',
    mood: 'Complex, intense, contemplative',
    pakad: [
      [2, 3, 4, 6],     // r g m+ d
      [3, 4, 5, 4]      // g m+ P m+
    ]
  },

  // ===== CARNATIC RAGAS =====

  'mayamalavagowla': {
    name: 'Mayamalavagowla',
    category: 'carnatic',
    melakarta: 15,
    ratios: [1, 16/15, 5/4, 4/3, 3/2, 8/5, 15/8],
    solfege: {
      western: ['Do', 'Ra', 'Mi', 'Fa', 'Sol', 'Le', 'Ti'],
      hindustani: ['Sa', 'Re♭', 'Ga', 'Ma', 'Pa', 'Dha♭', 'Ni'],
      carnatic: ['Sa', 'Ri1', 'Ga3', 'Ma1', 'Pa', 'Da1', 'Ni3']
    },
    description: 'Beginner raga, morning practice, same as Bhairav',
    time: 'Morning',
    mood: 'Serious, devotional'
  },

  'shankarabharanam': {
    name: 'Shankarabharanam',
    category: 'carnatic',
    melakarta: 29,
    ratios: [1, 9/8, 5/4, 4/3, 3/2, 5/3, 15/8],  // Same as major
    solfege: {
      western: ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Ti'],
      hindustani: ['Sa', 'Re', 'Ga', 'Ma', 'Pa', 'Dha', 'Ni'],
      carnatic: ['Sa', 'Ri2', 'Ga3', 'Ma1', 'Pa', 'Da2', 'Ni3']
    },
    description: 'Most versatile raga, equivalent to Bilaval',
    time: 'Anytime',
    mood: 'Joyful, bright, auspicious'
  },

  'kalyani': {
    name: 'Kalyani',
    category: 'carnatic',
    melakarta: 65,
    ratios: [1, 9/8, 5/4, 45/32, 3/2, 27/16, 15/8],  // Same as Yaman
    solfege: {
      western: ['Do', 'Re', 'Mi', 'Fi', 'Sol', 'La', 'Ti'],
      hindustani: ['Sa', 'Re', 'Ga', 'Ma♯', 'Pa', 'Dha', 'Ni'],
      carnatic: ['Sa', 'Ri2', 'Ga3', 'Ma2', 'Pa', 'Da2', 'Ni3']
    },
    description: 'Joyful, auspicious raga for celebrations',
    time: 'Evening',
    mood: 'Happy, celebratory'
  },

  'kharaharapriya': {
    name: 'Kharaharapriya',
    category: 'carnatic',
    melakarta: 22,
    ratios: [1, 9/8, 6/5, 4/3, 3/2, 5/3, 9/5],
    solfege: {
      western: ['Do', 'Re', 'Me', 'Fa', 'Sol', 'La', 'Te'],
      hindustani: ['Sa', 'Re', 'Ga♭', 'Ma', 'Pa', 'Dha', 'Ni♭'],
      carnatic: ['Sa', 'Ri2', 'Ga2', 'Ma1', 'Pa', 'Da2', 'Ni2']
    },
    description: 'Serious, contemplative raga',
    time: 'Evening',
    mood: 'Serious, devotional'
  },

  'harikambhoji': {
    name: 'Harikambhoji',
    category: 'carnatic',
    melakarta: 28,
    ratios: [1, 9/8, 5/4, 4/3, 3/2, 5/3, 9/5],
    solfege: {
      western: ['Do', 'Re', 'Mi', 'Fa', 'Sol', 'La', 'Te'],
      hindustani: ['Sa', 'Re', 'Ga', 'Ma', 'Pa', 'Dha', 'Ni♭'],
      carnatic: ['Sa', 'Ri2', 'Ga3', 'Ma1', 'Pa', 'Da2', 'Ni2']
    },
    description: 'Bright, devotional raga',
    time: 'Evening',
    mood: 'Devotional, peaceful'
  },

  'natabhairavi': {
    name: 'Natabhairavi',
    category: 'carnatic',
    melakarta: 20,
    ratios: [1, 9/8, 6/5, 4/3, 3/2, 8/5, 9/5],
    solfege: {
      western: ['Do', 'Re', 'Me', 'Fa', 'Sol', 'Le', 'Te'],
      hindustani: ['Sa', 'Re', 'Ga♭', 'Ma', 'Pa', 'Dha♭', 'Ni♭'],
      carnatic: ['Sa', 'Ri2', 'Ga2', 'Ma1', 'Pa', 'Da1', 'Ni2']
    },
    description: 'Evening raga, contemplative mood',
    time: 'Evening',
    mood: 'Contemplative, calm'
  }
};

// Helper function to get scale count (some are pentatonic)
function getScaleLength(scaleKey) {
  const scale = SCALE_LIBRARY[scaleKey];
  return scale.notes || 7;  // Default to 7 if not specified
}

// Get all scales by category
function getScalesByCategory(category) {
  return Object.keys(SCALE_LIBRARY).filter(
    key => SCALE_LIBRARY[key].category === category
  );
}

// Get scale display name with info
function getScaleDisplayName(scaleKey) {
  const scale = SCALE_LIBRARY[scaleKey];
  let name = scale.name;

  if (scale.time) {
    name += ` (${scale.time})`;
  }

  return name;
}
