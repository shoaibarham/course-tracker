export const AI_OPTION_REQUIREMENTS = {
  totalCourses: 6,
  lists: {
    list1: {
      name: "Society & Ethics",
      required: 1,
      description: "Complete 1 of the following courses dealing with societal implications of AI",
      courses: [
        "HIST212",
        "MSE442", 
        "STV205",
        "STV208",
        "STV210",
        "STV302"
      ]
    },
    list2: {
      name: "Core AI/ML",
      required: 2,
      description: "Complete 2 of the following core AI and machine learning courses",
      courses: [
        "CS480",
        "CS485",
        "CS486", 
        "ECE457A",
        "ECE457B",
        "ECE457C",
        "MSE435",
        "MSE446",
        "SYDE522"
      ]
    },
    additional: {
      name: "Additional Courses",
      required: 3,
      description: "Complete 3 additional courses from List 2 or List 3",
      list3Courses: [
        "AMATH449",
        "BIOL487",
        "CHE521",
        "CHE522", 
        "CHE524",
        "CO367",
        "CO456",
        "CO463",
        "CO466",
        "CS452",
        "CS479",
        "CS484",
        "ECE423",
        "ECE455",
        "ECE481",
        "ECE484",
        "ECE486",
        "ECE488",
        "ECE495",
        "MSE546",
        "MTE544",
        "MTE546",
        "STAT341",
        "STAT440",
        "STAT441",
        "STAT444",
        "SYDE552",
        "SYDE556",
        "SYDE572",
        "SYDE577"
      ]
    }
  }
};

export const MANAGEMENT_ENGINEERING_CURRICULUM = {
  term1A: {
    name: "Term 1A (Fall)",
    courses: [
      "CHE 102",
      "MSCI 100", 
      "MATH 115",
      "MATH 116",
      "PHYS 115"
    ]
  },
  term1B: {
    name: "Term 1B (Winter)",
    courses: [
      "COMMST 192",
      "GENE 123",
      "MSCI 100B",
      "MSCI 121",
      "MSCI 131", 
      "MATH 118",
      "PHYS 125"
    ]
  },
  term2A: {
    name: "Term 2A (Fall)", 
    courses: [
      "MSCI 200A",
      "MSCI 240",
      "MSCI 251",
      "MSCI 261",
      "MSCI 271",
      "Natural Science Elective"
    ]
  },
  term2B: {
    name: "Term 2B (Spring)",
    courses: [
      "MSCI 200B",
      "MSCI 245", 
      "MSCI 253",
      "MSCI 263",
      "MSCI 331",
      "Natural Science Elective"
    ]
  },
  term3A: {
    name: "Term 3A (Winter)",
    courses: [
      "MSCI 211",
      "MSCI 300A",
      "MSCI 334",
      "MSCI 342",
      "MSCI 391",
      "MSCI 431",
      "Elective"
    ]
  },
  term3B: {
    name: "Term 3B (Fall)",
    courses: [
      "MSCI 300B",
      "MSCI 302",
      "MSCI 332", 
      "MSCI 333",
      "MSCI 343",
      "MSCI 392",
      "Elective"
    ]
  },
  term4A: {
    name: "Term 4A (Spring)",
    courses: [
      "MSCI 400A",
      "MSCI 401",
      "MSCI 434",
      "MSCI 436",
      "MSCI 491",
      "Two electives"
    ]
  },
  term4B: {
    name: "Term 4B (Winter)",
    courses: [
      "MSCI 311",
      "MSCI 400B", 
      "MSCI 402",
      "Three electives"
    ]
  }
};

export const TECHNICAL_ELECTIVES = [
  "MSCI 433",
  "MSCI 435",
  "MSCI 446",
  "MSCI 452",
  "MSCI 531",
  "MSCI 541",
  "MSCI 543",
  "MSCI 546",
  "MSCI 551",
  "MSCI 555",
  "MSCI 598"
];

export const NATURAL_SCIENCE_ELECTIVES = [
  "BIOL 110", "BIOL 130", "BIOL 150", "BIOL 165", 
  "BIOL 211", "BIOL 220", "BIOL 239", "BIOL 240", "BIOL 273",
  "CHE 161",
  "CHEM 262", 
  "EARTH 121", "EARTH 122", "EARTH 123", "EARTH 221",
  "ENVS 200",
  "PHYS 124", "PHYS 175", "PHYS 233", "PHYS 275",
  "PSYCH 207", "PSYCH 261",
  "SCI 238", "SCI 250"
];
