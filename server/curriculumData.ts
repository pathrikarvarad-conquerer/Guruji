import { CurriculumTopic, Skill, Lesson, Question, VideoResource } from '../src/types/index.js';

export const TOPICS: CurriculumTopic[] = [
  {
    id: 'topic_place_value',
    subject: 'Mathematics',
    gradeMin: 1,
    gradeMax: 3,
    titleEn: 'Place Value & Number Sense',
    titleMr: 'स्थानिक मूल्य आणि संख्या ज्ञान',
    descriptionEn: 'Master tens, ones, grouping, and building numbers.',
    descriptionMr: 'दशक, एकक आणि संख्यांची रचना समजून घ्या.',
    icon: 'Layers'
  },
  {
    id: 'topic_addition_subtraction',
    subject: 'Mathematics',
    gradeMin: 1,
    gradeMax: 3,
    titleEn: 'Visual Addition & Subtraction',
    titleMr: 'बेरीज आणि वजाबाकी',
    descriptionEn: 'Use ten-frames, number lines, and regrouping.',
    descriptionMr: 'दहाच्या चौकटी, संख्यारेषा आणि हातच्याची बेरीज-वजाबाकी.',
    icon: 'Calculator'
  },
  {
    id: 'topic_shapes_geometry',
    subject: 'Mathematics',
    gradeMin: 1,
    gradeMax: 2,
    titleEn: 'Shapes & Spatial Sense',
    titleMr: 'आकार आणि भूमिती',
    descriptionEn: 'Explore 2D shapes, sides, corners, and symmetry.',
    descriptionMr: 'विविध आकार, बाजू, कोपरे आणि सममिती.',
    icon: 'Shapes'
  },
  {
    id: 'topic_fractions',
    subject: 'Mathematics',
    gradeMin: 3,
    gradeMax: 4,
    titleEn: 'Fractions as Equal Parts',
    titleMr: 'अपूर्णांक - समान भाग',
    descriptionEn: 'Halves, thirds, and quarters using visual fraction strips.',
    descriptionMr: 'पट्टीच्या साहाय्याने अर्धा, तृतीयांश आणि पाव भाग समजून घेणे.',
    icon: 'PieChart'
  }
];

export const SKILLS: Skill[] = [
  {
    id: 'skill_count_objects',
    topicId: 'topic_place_value',
    subject: 'Mathematics',
    code: 'MATH-101',
    titleEn: 'Counting Objects up to 10',
    titleMr: '१० पर्यंत वस्तू मोजणे',
    descriptionEn: 'Count physical or visual items accurately one by one.',
    descriptionMr: 'वस्तू एक एक करून अचूक मोजणे.',
    prerequisites: [],
    difficulty: 1,
    targetAgeMin: 4,
    targetAgeMax: 6
  },
  {
    id: 'skill_tens_and_ones',
    topicId: 'topic_place_value',
    subject: 'Mathematics',
    code: 'MATH-201',
    titleEn: 'Understanding Tens and Ones',
    titleMr: 'दशक आणि एकक समजून घेणे',
    descriptionEn: 'Group objects into rods of 10 and single unit cubes to build 2-digit numbers.',
    descriptionMr: '१० चा गट्टा (दशक) आणि सुटे (एकक) एकत्र करून संख्या बनवणे.',
    prerequisites: ['skill_count_objects'],
    difficulty: 2,
    targetAgeMin: 6,
    targetAgeMax: 8
  },
  {
    id: 'skill_add_tenframe',
    topicId: 'topic_addition_subtraction',
    subject: 'Mathematics',
    code: 'MATH-202',
    titleEn: 'Making 10 with Ten-Frames',
    titleMr: '१० ची चौकट वापरून बेरीज करणे',
    descriptionEn: 'Use visual 10-frames to fill up ten and see addition clearly.',
    descriptionMr: 'दहाच्या चौकटीत ठिपके भरून बेरीज सोपी करणे.',
    prerequisites: ['skill_tens_and_ones'],
    difficulty: 2,
    targetAgeMin: 6,
    targetAgeMax: 8
  },
  {
    id: 'skill_sub_numberline',
    topicId: 'topic_addition_subtraction',
    subject: 'Mathematics',
    code: 'MATH-203',
    titleEn: 'Subtraction on a Number Line',
    titleMr: 'संख्यारेषेवर उड्या मारून वजाबाकी',
    descriptionEn: 'Start at the big number and hop backwards to find the difference.',
    descriptionMr: 'मोठ्या संख्येपासून मागे उडी मारून फरक काढणे.',
    prerequisites: ['skill_count_objects'],
    difficulty: 2,
    targetAgeMin: 6,
    targetAgeMax: 8
  },
  {
    id: 'skill_add_regroup',
    topicId: 'topic_addition_subtraction',
    subject: 'Mathematics',
    code: 'MATH-301',
    titleEn: '2-Digit Addition with Regrouping',
    titleMr: 'हातच्याची दोन अंकी बेरीज',
    descriptionEn: 'When ones add up to 10 or more, trade 10 ones for 1 ten.',
    descriptionMr: 'जेव्हा एकक १० किंवा जास्त होतात, तेव्हा १० एककांचा १ दशक बनवणे.',
    prerequisites: ['skill_tens_and_ones', 'skill_add_tenframe'],
    difficulty: 3,
    targetAgeMin: 7,
    targetAgeMax: 9
  },
  {
    id: 'skill_shapes_2d',
    topicId: 'topic_shapes_geometry',
    subject: 'Mathematics',
    code: 'MATH-102',
    titleEn: '2D Shapes: Sides and Corners',
    titleMr: 'द्विमितीय आकार: बाजू आणि कोपरे',
    descriptionEn: 'Identify circles, triangles, squares, and count their straight sides and corners.',
    descriptionMr: 'वर्तुळ, त्रिकोण, चौरस ओळखून त्यांच्या बाजू आणि कोपरे मोजणे.',
    prerequisites: [],
    difficulty: 1,
    targetAgeMin: 5,
    targetAgeMax: 7
  }
];

export const LESSONS: Record<string, Lesson> = {
  skill_tens_and_ones: {
    id: 'lesson_tens_and_ones',
    skillId: 'skill_tens_and_ones',
    titleEn: 'The Magic of Tens and Ones',
    titleMr: 'दशक आणि एककांचे जादूई जग',
    learningObjectiveEn: 'Learn how 2-digit numbers are built from groups of 10 and leftover ones.',
    learningObjectiveMr: 'दोन अंकी संख्या १० चे गट आणि उरलेल्या सुट्यांनी कशा बनतात ते शिका.',
    simpleExplanationEn: 'When we have a lot of items, counting them one by one takes forever! So we tie 10 items into one neat bunch called a TEN (दशक). Any loose items left over are called ONES (एकक). For example, 3 tens and 4 ones make 34!',
    simpleExplanationMr: 'जेव्हा आपल्याकडे खूप वस्तू असतात, तेव्हा एक एक मोजायला वेळ लागतो. म्हणून आपण १० वस्तूंचा एक गट्टा बनवतो, त्याला "दशक" म्हणतात. उरलेल्या सुट्या वस्तूंना "एकक" म्हणतात. जसे ३ दशक आणि ४ एकक मिळून ३४ होतात!',
    visualModel: {
      type: 'tens_ones',
      data: {
        tens: 3,
        ones: 4,
        total: 34,
        customMessage: '3 Ten-Rods (30) + 4 One-Cubes (4) = 34'
      }
    },
    workedExample: {
      problemEn: 'How many tens and ones are in the number 25?',
      problemMr: '२५ या संख्येत किती दशक आणि किती एकक आहेत?',
      stepsEn: [
        'Step 1: Look at the left digit (2). This shows we have 2 full groups of ten (20).',
        'Step 2: Look at the right digit (5). This shows we have 5 single units left over.',
        'Step 3: Combine them: 2 tens and 5 ones equal 25.'
      ],
      stepsMr: [
        'पायरी १: डावीकडचा अंक पहा (२). याचा अर्थ २ दशकांचे गट्टे आहेत (२०).',
        'पायरी २: उजवीकडचा अंक पहा (५). याचा अर्थ ५ सुटे एकक आहेत.',
        'पायरी ३: एकत्र करा: २ दशक आणि ५ एकक मिळून २५ होतात.'
      ],
      solutionEn: '25 has 2 Tens and 5 Ones.',
      solutionMr: '२५ मध्ये २ दशक आणि ५ एकक आहेत.'
    },
    comprehensionCheck: {
      questionEn: 'If Guruji has 4 Ten-Rods and 2 One-Cubes, what number is it?',
      questionMr: 'जर गुरुजींकडे ४ दशकांचे गट्टे आणि २ सुटे एकक असतील, तर कोणती संख्या बनेल?',
      optionsEn: ['42', '24', '6', '420'],
      optionsMr: ['४२', '२४', '६', '४२०'],
      correctIndex: 0,
      explanationEn: '4 tens is 40, and 2 ones is 2. 40 + 2 = 42!',
      explanationMr: '४ दशक म्हणजे ४०, आणि २ एकक म्हणजे २. ४० + २ = ४२!'
    }
  },
  skill_add_tenframe: {
    id: 'lesson_add_tenframe',
    skillId: 'skill_add_tenframe',
    titleEn: 'Fill the Frame: Making 10',
    titleMr: 'चौकट भरा: १० बनवणे',
    learningObjectiveEn: 'Learn to add numbers quickly by filling up a ten-frame first.',
    learningObjectiveMr: 'दहाची चौकट भरून जलद बेरीज करायला शिका.',
    simpleExplanationEn: 'A ten-frame has 10 friendly spots (5 on top, 5 on bottom). If you have 7 red counters, you need 3 more to make 10. To add 7 + 5, fill the frame with 3 from the 5, making 10, with 2 left over. 10 + 2 = 12!',
    simpleExplanationMr: 'दहाच्या चौकटीत १० जागा असतात (वर ५, खाली ५). तुमच्याकडे ७ लाल ठिपके असल्यास, १० बनवण्यासाठी आणखी ३ लागतील. ७ + ५ करताना, ५ मधून ३ घेऊन चौकट पूर्ण १० करा, आणि उरलेले २ जोडा. १० + २ = १२!',
    visualModel: {
      type: 'ten_frame',
      data: {
        start: 7,
        jump: 5,
        total: 12,
        customMessage: '7 filled + 3 to complete 10 + 2 leftover = 12'
      }
    },
    workedExample: {
      problemEn: 'Find 8 + 6 using a ten-frame.',
      problemMr: '१० ची चौकट वापरून ८ + ६ ची बेरीज करा.',
      stepsEn: [
        'Step 1: Put 8 blue counters in the first ten-frame.',
        'Step 2: How many spots are empty? Exactly 2 spots.',
        'Step 3: Take 2 from the 6 to fill the ten-frame (8 + 2 = 10).',
        'Step 4: You have 4 left from the 6. 10 + 4 = 14!'
      ],
      stepsMr: [
        'पायरी १: पहिल्या चौकटीत ८ ठिपके ठेवा.',
        'पायरी २: किती जागा रिकाम्या आहेत? २ जागा रिकाम्या आहेत.',
        'पायरी ३: ६ मधून २ घेऊन पहिली चौकट पूर्ण १० करा (८ + २ = १०).',
        'पायरी ४: ६ मधून ४ उरले. १० + ४ = १४!'
      ],
      solutionEn: '8 + 6 = 14',
      solutionMr: '८ + ६ = १४'
    },
    comprehensionCheck: {
      questionEn: 'How many more counters does 6 need to make 10 in a ten-frame?',
      questionMr: 'चौकटीत ६ ठिपके असल्यास, १० बनवण्यासाठी आणखी किती ठिपके लागतील?',
      optionsEn: ['4', '3', '5', '6'],
      optionsMr: ['४', '३', '५', '६'],
      correctIndex: 0,
      explanationEn: '6 + 4 = 10. You need 4 more spots to fill the ten-frame!',
      explanationMr: '६ + ४ = १०. चौकट भरण्यासाठी आणखी ४ जागा लागतात!'
    }
  },
  skill_sub_numberline: {
    id: 'lesson_sub_numberline',
    skillId: 'skill_sub_numberline',
    titleEn: 'Hopping Back: Subtraction on a Number Line',
    titleMr: 'मागे उड्या मारणे: संख्यारेषेवर वजाबाकी',
    learningObjectiveEn: 'Subtract by landing on the starting number and hopping backwards.',
    learningObjectiveMr: 'संख्यारेषेवर मोठ्या संख्येवरून डावीकडे मागे उड्या मारून वजाबाकी करा.',
    simpleExplanationEn: 'Imagine a little frog sitting on a number line! In 9 - 4, the frog sits on 9. Subtraction means jumping BACKWARDS to smaller numbers. The frog takes 4 hops back: 8, 7, 6, 5! The frog lands on 5.',
    simpleExplanationMr: 'कल्पना करा एक छोटा बेडूक संख्यारेषेवर बसला आहे! ९ - ४ मध्ये बेडूक ९ वर बसतो. वजाबाकी म्हणजे डावीकडे मागे उडी मारणे. बेडूक ४ उड्या मागे मारतो: ८, ७, ६, ५! बेडूक ५ वर पोहोचतो.',
    visualModel: {
      type: 'number_line',
      data: {
        start: 9,
        jump: 4,
        end: 5,
        customMessage: 'Start at 9, hop back 4 places -> lands on 5'
      }
    },
    workedExample: {
      problemEn: 'Calculate 12 - 5 using the number line.',
      problemMr: 'संख्यारेषेचा वापर करून १२ - ५ चे उत्तर काढा.',
      stepsEn: [
        'Step 1: Put your finger on the starting number, 12.',
        'Step 2: Hop backwards 5 times: 11, 10, 9, 8, 7.',
        'Step 3: Where do you land? On number 7!'
      ],
      stepsMr: [
        'पायरी १: सुरुवातीची संख्या १२ वर बोट ठेवा.',
        'पायरी २: मागे ५ उड्या मारा: ११, १०, ९, ८, ७.',
        'पायरी ३: तुम्ही कुठे थांबलात? ७ वर!'
      ],
      solutionEn: '12 - 5 = 7',
      solutionMr: '१२ - ५ = ७'
    },
    comprehensionCheck: {
      questionEn: 'If you are at 8 on a number line and hop back 3 times, where do you land?',
      questionMr: 'जर तुम्ही संख्यारेषेवर ८ वर असाल आणि ३ उड्या मागे मारल्या, तर कुठे पोहोचाल?',
      optionsEn: ['5', '11', '6', '4'],
      optionsMr: ['५', '११', '६', '४'],
      correctIndex: 0,
      explanationEn: '8 - 3 = 5. You hop back 3 steps: 7, 6, 5!',
      explanationMr: '८ - ३ = ५. मागे ३ पावले: ७, ६, ५!'
    }
  },
  skill_add_regroup: {
    id: 'lesson_add_regroup',
    skillId: 'skill_add_regroup',
    titleEn: 'Carrying Over: Adding with Regrouping',
    titleMr: 'हातचा देणे: पुनर्गठन करून बेरीज',
    learningObjectiveEn: 'Understand when 10 ones turn into 1 ten and carry to the tens column.',
    learningObjectiveMr: '१० सुटे एकत्र येऊन १ दशक कसा बनतो आणि दशकाच्या घरात कसा जातो ते शिका.',
    simpleExplanationEn: 'In our place-value house, the Ones room can only fit single digits (0 to 9). If 7 ones and 5 ones meet, they make 12 ones. That is 1 TEN and 2 ONES! We send the 1 Ten to live in the Tens room as a "carry over", and keep 2 in the Ones room.',
    simpleExplanationMr: 'आपल्या घरामध्ये एककाच्या खोलीत फक्त ९ पर्यंतच जागा असते. जेव्हा ७ एकक आणि ५ एकक एकत्र येतात, तेव्हा १२ एकक होतात. म्हणजेच १ दशक आणि २ एकक! आपण १ दशकाला दशकाच्या खोलीत "हातचा" पाठवतो आणि २ एककाच्या घरात ठेवतो.',
    visualModel: {
      type: 'tens_ones',
      data: {
        tens: 4,
        ones: 2,
        total: 42,
        customMessage: '27 + 15: 7+5=12 (1 carried ten + 2 ones). Tens: 2+1+1=4. Total = 42.'
      }
    },
    workedExample: {
      problemEn: 'Add 28 + 15',
      problemMr: '२८ + १५ ची बेरीज करा',
      stepsEn: [
        'Step 1: Add the ones first: 8 + 5 = 13.',
        'Step 2: 13 ones = 1 ten and 3 ones.',
        'Step 3: Write down 3 in the ones column, carry 1 to the tens column.',
        'Step 4: Add the tens: 1 (carried) + 2 + 1 = 4 tens.',
        'Step 5: Total is 4 tens and 3 ones = 43.'
      ],
      stepsMr: [
        'पायरी १: प्रथम एकक जोडा: ८ + ५ = १३.',
        'पायरी २: १३ एकक = १ दशक आणि ३ एकक.',
        'पायरी ३: एककाच्या घरात ३ लिहा, आणि १ दशकाच्या घरात हातचा द्या.',
        'पायरी ४: दशक जोडा: १ (हातचा) + २ + १ = ४ दशक.',
        'पायरी ५: एकूण ४ दशक आणि ३ एकक = ४३.'
      ],
      solutionEn: '28 + 15 = 43',
      solutionMr: '२८ + १५ = ४३'
    },
    comprehensionCheck: {
      questionEn: 'When adding 19 + 6, what happens to the ones (9 + 6 = 15)?',
      questionMr: '१९ + ६ करताना, एककांची बेरीज ९ + ६ = १५ होते. मग काय करावे?',
      optionsEn: [
        'Keep 5 in ones, carry 1 ten to tens column',
        'Write 15 in the ones column',
        'Ignore the 1 ten',
        'Change it to 96'
      ],
      optionsMr: [
        'एककाच्या घरात ५ ठेवा आणि १ दशक हातचा द्या',
        'एककाच्या घरात १५ लिहा',
        '१ दशकाकडे दुर्लक्ष करा',
        'त्याला ९६ करा'
      ],
      correctIndex: 0,
      explanationEn: '15 ones is 1 ten and 5 ones. The 1 ten goes to the tens column!',
      explanationMr: '१५ एकक म्हणजे १ दशक आणि ५ एकक. १ दशक दशकाच्या घरात हातचा जातो!'
    }
  },
  skill_count_objects: {
    id: 'lesson_count_objects',
    skillId: 'skill_count_objects',
    titleEn: 'Count Along with Guruji',
    titleMr: 'गुरुजींसोबत मोजणी करा',
    learningObjectiveEn: 'Point and count items up to 10 with 1-to-1 correspondence.',
    learningObjectiveMr: '१० पर्यंतच्या वस्तू एकामागे एक बोट ठेवून अचूक मोजा.',
    simpleExplanationEn: 'Every object gets ONE number tag! When we count yummy apples: 1, 2, 3, 4, 5. The last number we say tells us how many apples there are in all!',
    simpleExplanationMr: 'प्रत्येक वस्तूला एकच क्रमांक मिळतो! जेव्हा आपण सफरचंद मोजतो: १, २, ३, ४, ५. आपण जो शेवटचा अंक बोलतो, तीच एकूण वस्तूंची संख्या असते!',
    visualModel: {
      type: 'counting_objects',
      data: {
        total: 5,
        items: [{ count: 5, label: 'Apples', icon: 'Apple' }],
        customMessage: 'Touch each apple to count: 1, 2, 3, 4, 5!'
      }
    },
    workedExample: {
      problemEn: 'How many golden stars are there? ⭐ ⭐ ⭐ ⭐',
      problemMr: 'येथे किती तारे आहेत? ⭐ ⭐ ⭐ ⭐',
      stepsEn: [
        'Step 1: Touch the first star: "One".',
        'Step 2: Touch the next star: "Two".',
        'Step 3: Touch the third: "Three", and the fourth: "Four".',
        'Step 4: The last number is Four.'
      ],
      stepsMr: [
        'पायरी १: पहिल्या ताऱ्याला स्पर्श करा: "एक".',
        'पायरी २: दुसऱ्याला: "दोन".',
        'पायरी ३: तिसऱ्याला: "तीन" आणि चौथ्याला: "चार".',
        'पायरी ४: शेवटचा अंक चार आहे.'
      ],
      solutionEn: 'There are 4 stars.',
      solutionMr: 'येथे ४ तारे आहेत.'
    },
    comprehensionCheck: {
      questionEn: 'If you count 6 colorful birds, how many birds are there in total?',
      questionMr: 'जर तुम्ही ६ पक्षी मोजले, तर एकूण किती पक्षी आहेत?',
      optionsEn: ['6', '5', '7', '1'],
      optionsMr: ['६', '५', '७', '१'],
      correctIndex: 0,
      explanationEn: 'The last number counted tells how many: 6 birds!',
      explanationMr: 'शेवटचा मोजलेला अंक म्हणजे एकूण संख्या: ६ पक्षी!'
    }
  },
  skill_shapes_2d: {
    id: 'lesson_shapes_2d',
    skillId: 'skill_shapes_2d',
    titleEn: 'Fun with 2D Shapes',
    titleMr: 'आकारांची गम्मत',
    learningObjectiveEn: 'Identify triangles, squares, and circles by counting sides and corners.',
    learningObjectiveMr: 'बाजू आणि कोपरे मोजून त्रिकोण, चौरस आणि वर्तुळ ओळखा.',
    simpleExplanationEn: 'Shapes are everywhere! A TRIANGLE has 3 straight sides and 3 sharp corners (like a slice of pizza!). A SQUARE has 4 equal sides and 4 corners (like a window). A CIRCLE has 0 straight sides and 0 corners—it is round and rolls like a ball!',
    simpleExplanationMr: 'आपल्या भोवती अनेक आकार आहेत! त्रिकोणाला ३ सरळ बाजू आणि ३ कोपरे असतात (जसे समोसा किंवा पिझ्झाचा तुकडा). चौरसाला ४ समान बाजू आणि ४ कोपरे असतात. वर्तुळाला शून्य बाजू आणि शून्य कोपरे असतात—ते चेंडूसारखे गोल असते!',
    visualModel: {
      type: 'shapes_geometry',
      data: {
        shape: 'triangle',
        customMessage: 'A triangle has 3 straight sides and 3 corners!'
      }
    },
    workedExample: {
      problemEn: 'How many corners does a square have?',
      problemMr: 'चौरसाला किती कोपरे असतात?',
      stepsEn: [
        'Step 1: Look at the top two corners: that is 2 corners.',
        'Step 2: Look at the bottom two corners: that is 2 more.',
        'Step 3: 2 + 2 = 4 corners.'
      ],
      stepsMr: [
        'पायरी १: वरचे दोन कोपरे पहा: २ कोपरे.',
        'पायरी २: खालचे दोन कोपरे पहा: आणखी २.',
        'पायरी ३: २ + २ = ४ कोपरे.'
      ],
      solutionEn: 'A square has 4 corners.',
      solutionMr: 'चौरसाला ४ कोपरे असतात.'
    },
    comprehensionCheck: {
      questionEn: 'Which shape has 3 sides and 3 corners?',
      questionMr: 'कोणत्या आकाराला ३ बाजू आणि ३ कोपरे असतात?',
      optionsEn: ['Triangle', 'Square', 'Circle', 'Rectangle'],
      optionsMr: ['त्रिकोण', 'चौरस', 'वर्तुळ', 'आयताकृती'],
      correctIndex: 0,
      explanationEn: 'A triangle always has 3 sides and 3 corners!',
      explanationMr: 'त्रिकोणाला नेहमी ३ बाजू आणि ३ कोपरे असतात!'
    }
  }
};

export const QUESTIONS: Question[] = [
  // --- Skill: skill_tens_and_ones ---
  {
    id: 'q_to_01',
    skillId: 'skill_tens_and_ones',
    type: 'single_choice',
    difficulty: 2,
    promptEn: 'Look at the rods: There are 4 Ten-Rods and 3 One-Cubes. What number does this show?',
    promptMr: 'पहा: येथे ४ दशकांचे गट्टे आणि ३ सुटे एकक आहेत. ही कोणती संख्या आहे?',
    optionsEn: ['43', '34', '7', '403'],
    optionsMr: ['४३', '३४', '७', '४०३'],
    correctAnswer: '43',
    visualModel: {
      type: 'tens_ones',
      data: { tens: 4, ones: 3, total: 43 }
    },
    hints: {
      tier1NudgeEn: 'Remember, each Ten-Rod counts as 10!',
      tier1NudgeMr: 'लक्षात ठेवा, प्रत्येक दशकाचा गट्टा १० चा असतो!',
      tier2GuidedEn: '4 tens is 40. Now count the 3 single ones. What is 40 + 3?',
      tier2GuidedMr: '४ दशक म्हणजे ४०. आता ३ सुटे मोजा. ४० + ३ किती होतात?',
      tier3VisualEn: 'Count by tens: 10, 20, 30, 40... then 41, 42, 43.',
      tier3VisualMr: 'दशकाने मोजा: १०, २०, ३०, ४०... मग ४१, ४२, ४३.'
    },
    commonMisconceptions: [
      {
        answer: '34',
        key: 'tens_ones_reversed',
        explanationEn: 'It looks like you reversed the tens and ones! The 4 Ten-Rods go in the tens place (40), not the ones place.',
        explanationMr: 'तुम्ही दशक आणि एकक उलटे लिहिले आहेत! ४ दशकांचे गट्टे दशकाच्या स्थानी (४०) येतात.',
        remedyEn: 'Always write the tens digit first on the left, then the ones digit on the right.',
        remedyMr: 'नेहमी डावीकडे दशक आणि उजवीकडे एकक लिहा.'
      },
      {
        answer: '7',
        key: 'counted_rods_as_single_units',
        explanationEn: 'You added 4 + 3 = 7, but each rod is worth 10 cubes, not 1 cube!',
        explanationMr: 'तुम्ही ४ + ३ = ७ केले, पण प्रत्येक गट्टा १० चा आहे, १ चा नाही!',
        remedyEn: 'Treat a Ten-Rod as 10 separate blocks bundled together.',
        remedyMr: 'दशकाच्या गट्ट्याला १० ठोकळ्यांचा समूह मानून मोजा.'
      }
    ]
  },
  {
    id: 'q_to_02',
    skillId: 'skill_tens_and_ones',
    type: 'numeric',
    difficulty: 2,
    promptEn: 'How many tens are in the number 58?',
    promptMr: '५८ या संख्येत किती दशक आहेत?',
    correctAnswer: 5,
    visualModel: {
      type: 'tens_ones',
      data: { tens: 5, ones: 8, total: 58 }
    },
    hints: {
      tier1NudgeEn: 'Look at the digit on the left side of 58.',
      tier1NudgeMr: '५८ मधील डावीकडचा अंक पहा.',
      tier2GuidedEn: '58 is made of 50 and 8. How many groups of 10 make 50?',
      tier2GuidedMr: '५८ ही संख्या ५० आणि ८ मिळून बनते. ५० बनवण्यासाठी १० चे किती गट लागतात?',
      tier3VisualEn: '50 is 5 tens. So in 58, there are 5 tens.',
      tier3VisualMr: '५० म्हणजे ५ दशक. म्हणून ५८ मध्ये ५ दशक आहेत.'
    },
    commonMisconceptions: [
      {
        answer: 8,
        key: 'confused_tens_with_ones',
        explanationEn: '8 is the ones digit! The question asks for the tens digit.',
        explanationMr: '८ हा एकक आहे! प्रश्नात दशक विचारला आहे.',
        remedyEn: 'Remember: Tens are on the left, Ones are on the right.',
        remedyMr: 'लक्षात ठेवा: डावीकडे दशक, उजवीकडे एकक.'
      },
      {
        answer: 50,
        key: 'wrote_place_value_instead_of_digit',
        explanationEn: 'The value is 50, but that means 5 groups of ten! So there are 5 tens.',
        explanationMr: 'त्याचे मूल्य ५० आहे, पण याचा अर्थ १० चे ५ गट आहेत! म्हणून ५ दशक.',
        remedyEn: 'When asked "how many tens", write the number of groups (5).',
        remedyMr: '"किती दशक" विचारल्यावर गटांची संख्या (५) लिहावी.'
      }
    ]
  },
  {
    id: 'q_to_03',
    skillId: 'skill_tens_and_ones',
    type: 'single_choice',
    difficulty: 3,
    promptEn: 'Which number is bigger: 6 tens and 2 ones, OR 2 tens and 9 ones?',
    promptMr: 'कोणती संख्या मोठी आहे: ६ दशक आणि २ एकक, की २ दशक आणि ९ एकक?',
    optionsEn: ['6 tens and 2 ones (62)', '2 tens and 9 ones (29)', 'Both are equal', 'Cannot tell'],
    optionsMr: ['६ दशक आणि २ एकक (६२)', '२ दशक आणि ९ एकक (२९)', 'दोन्ही समान आहेत', 'सांगता येत नाही'],
    correctAnswer: '6 tens and 2 ones (62)',
    hints: {
      tier1NudgeEn: 'First compare the tens! Tens have much bigger value than ones.',
      tier1NudgeMr: 'आधी दशक तपासा! दशकाचे मूल्य एककापेक्षा खूप मोठे असते.',
      tier2GuidedEn: '6 tens = 60. 2 tens = 20. Which group has more?',
      tier2GuidedMr: '६ दशक = ६०. २ दशक = २०. कोणता गट मोठा आहे?',
      tier3VisualEn: '62 has 6 Ten-Rods. 29 only has 2 Ten-Rods. 62 is much larger!',
      tier3VisualMr: '६२ मध्ये ६ दशकांचे गट्टे आहेत. २९ मध्ये फक्त २ आहेत. ६२ मोठी आहे!'
    },
    commonMisconceptions: [
      {
        answer: '2 tens and 9 ones (29)',
        key: 'tricked_by_single_digit_magnitude',
        explanationEn: 'You saw 9 and thought it was bigger, but 9 ones is only 9! 6 tens is 60.',
        explanationMr: 'तुम्ही ९ अंक पाहून तो मोठा मानला, पण ९ एकक म्हणजे फक्त ९! ६ दशक म्हणजे ६०.',
        remedyEn: 'Always compare the tens place first when comparing 2-digit numbers.',
        remedyMr: 'दोन अंकी संख्यांची तुलना करताना प्रथम दशकाचे स्थान तपासा.'
      }
    ]
  },

  // --- Skill: skill_add_tenframe ---
  {
    id: 'q_atf_01',
    skillId: 'skill_add_tenframe',
    type: 'single_choice',
    difficulty: 2,
    promptEn: 'You have 8 dots in a ten-frame. You want to add 5 dots. How do you make 10 first?',
    promptMr: 'तुमच्याकडे १० च्या चौकटीत ८ ठिपके आहेत. तुम्हाला ५ ठिपके जोडायचे आहेत. आधी १० कसे बनवाल?',
    optionsEn: [
      'Take 2 from 5 to make 10, then add 3 left over',
      'Take all 5 and squeeze them in',
      'Add 8 and 5 directly as 85',
      'Take 1 from 5 to make 9'
    ],
    optionsMr: [
      '५ मधून २ घेऊन १० बनवा, मग उरलेले ३ जोडा',
      'सर्व ५ ठिपके एकाच चौकटीत कोंबा',
      '८ आणि ५ एकत्र करून ८५ लिहा',
      '५ मधून १ घेऊन ९ बनवा'
    ],
    correctAnswer: 'Take 2 from 5 to make 10, then add 3 left over',
    visualModel: {
      type: 'ten_frame',
      data: { start: 8, jump: 5, total: 13 }
    },
    hints: {
      tier1NudgeEn: 'How many empty spots are in the ten-frame with 8 dots?',
      tier1NudgeMr: '८ ठिपके असलेल्या चौकटीत किती जागा रिकाम्या आहेत?',
      tier2GuidedEn: '8 + 2 makes 10! So take 2 from the 5.',
      tier2GuidedMr: '८ + २ मिळून १० होतात! म्हणून ५ मधून २ घ्या.',
      tier3VisualEn: '10 + 3 leftover = 13!',
      tier3VisualMr: '१० + ३ उरलेले = १३!'
    }
  },
  {
    id: 'q_atf_02',
    skillId: 'skill_add_tenframe',
    type: 'numeric',
    difficulty: 2,
    promptEn: 'Solve: 9 + 4 = ? (Tip: Give 1 from 4 to 9 to make 10!)',
    promptMr: 'सोडवा: ९ + ४ = ? (टीप: ४ मधून १ घेऊन ९ ला द्या आणि १० बनवा!)',
    correctAnswer: 13,
    visualModel: {
      type: 'ten_frame',
      data: { start: 9, jump: 4, total: 13 }
    },
    hints: {
      tier1NudgeEn: '9 needs just 1 more to reach 10.',
      tier1NudgeMr: '९ ला १० होण्यासाठी फक्त १ ची गरज आहे.',
      tier2GuidedEn: 'Take 1 from 4 to make 10. How many are left from 4? 3 are left.',
      tier2GuidedMr: '४ मधून १ काढून १० करा. ४ मधून किती उरले? ३ उरले.',
      tier3VisualEn: '10 + 3 = 13.',
      tier3VisualMr: '१० + ३ = १३.'
    },
    commonMisconceptions: [
      {
        answer: 14,
        key: 'forgot_to_decrease_second_addend',
        explanationEn: 'You made 10, but added all 4 instead of taking 1 away!',
        explanationMr: 'तुम्ही १० बनवले, पण ४ मधून १ वजा न करता पूर्ण ४ जोडले!',
        remedyEn: 'When you take 1 from 4, only 3 remain: 10 + 3 = 13.',
        remedyMr: 'जेव्हा ४ मधून १ घेता, तेव्हा ३ उरतात: १० + ३ = १३.'
      }
    ]
  },

  // --- Skill: skill_sub_numberline ---
  {
    id: 'q_snl_01',
    skillId: 'skill_sub_numberline',
    type: 'numeric',
    difficulty: 2,
    promptEn: 'On a number line, start at 11 and hop backwards 4 steps. Where do you land?',
    promptMr: 'संख्यारेषेवर ११ वरून सुरुवात करून ४ पावले मागे उडी मारा. तुम्ही कुठे पोहोचाल?',
    correctAnswer: 7,
    visualModel: {
      type: 'number_line',
      data: { start: 11, jump: 4, end: 7 }
    },
    hints: {
      tier1NudgeEn: 'Count backwards from 11: 10, 9, 8...',
      tier1NudgeMr: '११ पासून उलटी मोजणी करा: १०, ९, ८...',
      tier2GuidedEn: 'Step 1: 10, Step 2: 9, Step 3: 8, Step 4: 7.',
      tier2GuidedMr: 'पायरी १: १०, पायरी २: ९, पायरी ३: ८, पायरी ४: ७.',
      tier3VisualEn: 'You land on 7! 11 - 4 = 7.',
      tier3VisualMr: 'तुम्ही ७ वर पोहोचता! ११ - ४ = ७.'
    },
    commonMisconceptions: [
      {
        answer: 15,
        key: 'hopped_forward_instead_of_backward',
        explanationEn: 'You hopped forward (11 + 4 = 15). Subtraction means hopping BACKWARDS!',
        explanationMr: 'तुम्ही पुढे उडी मारली (११ + ४ = १५). वजाबाकी म्हणजे मागे उडी मारणे!',
        remedyEn: 'Minus means jumping to the left towards smaller numbers.',
        remedyMr: 'वजा म्हणजे डावीकडे लहान संख्यांकडे जाणे.'
      },
      {
        answer: 8,
        key: 'counted_starting_point_as_hop_one',
        explanationEn: 'You counted 11 as the first jump! You only count after you move.',
        explanationMr: 'तुम्ही ११ ला पहिली उडी मानले! उडी मारल्यावरच अंक मोजायचा असतो.',
        remedyEn: 'Say "0" on 11, then jump to 10 (one), 9 (two), 8 (three), 7 (four).',
        remedyMr: '११ वर "०" म्हणा, मग १० वर १, ९ वर २, ८ वर ३, ७ वर ४.'
      }
    ]
  },

  // --- Skill: skill_add_regroup ---
  {
    id: 'q_ar_01',
    skillId: 'skill_add_regroup',
    type: 'numeric',
    difficulty: 3,
    promptEn: 'Solve: 36 + 17 = ? (Remember to carry over the tens!)',
    promptMr: 'सोडवा: ३६ + १७ = ? (हातचा द्यायला विसरू नका!)',
    correctAnswer: 53,
    visualModel: {
      type: 'tens_ones',
      data: { tens: 5, ones: 3, total: 53 }
    },
    hints: {
      tier1NudgeEn: 'Add the ones first: 6 + 7 = 13.',
      tier1NudgeMr: 'आधी एकक जोडा: ६ + ७ = १३.',
      tier2GuidedEn: '13 ones = 1 ten and 3 ones. Carry 1 ten to the top of tens.',
      tier2GuidedMr: '१३ एकक म्हणजे १ दशक आणि ३ एकक. १ दशक हातचा द्या.',
      tier3VisualEn: 'Tens: 1 (carried) + 3 + 1 = 5 tens. Ones = 3. Answer: 53!',
      tier3VisualMr: 'दशक: १ (हातचा) + ३ + १ = ५ दशक. एकक = ३. उत्तर: ५३!'
    },
    commonMisconceptions: [
      {
        answer: 43,
        key: 'forgot_to_add_carried_ten',
        explanationEn: 'You added the ones (6+7=13) and wrote 3, but forgot to add the 1 carried ten to 3+1!',
        explanationMr: 'तुम्ही एकक जोडले (६+७=१३) आणि ३ लिहिले, पण १ हातचा ३+१ मध्ये जोडायला विसरलात!',
        remedyEn: 'Always write the small carried 1 on top of the tens column so you do not forget it.',
        remedyMr: 'दशकाच्या डोक्यावर लहान १ हातचा नक्की लिहा जेणेकरून विसर पडणार नाही.'
      },
      {
        answer: 413,
        key: 'wrote_both_digits_in_ones_column',
        explanationEn: 'You wrote 13 right next to 4, making 413! Only 1 digit can fit in the ones column.',
        explanationMr: 'तुम्ही ४ च्या शेजारी पूर्ण १३ लिहिले आणि ४१३ झाले! एककाच्या घरात फक्त एकच अंक बसतो.',
        remedyEn: 'Regroup 13 into 1 ten and 3 ones. The 1 ten moves to the tens column.',
        remedyMr: '१३ चे १ दशक आणि ३ एकक असे विभाजन करून १ दशक पुढे पाठवा.'
      }
    ]
  },

  // --- Skill: skill_count_objects ---
  {
    id: 'q_co_01',
    skillId: 'skill_count_objects',
    type: 'numeric',
    difficulty: 1,
    promptEn: 'How many juicy red apples are on the tree? 🍎 🍎 🍎 🍎 🍎 🍎 🍎',
    promptMr: 'झाडावर किती लाल सफरचंद आहेत? 🍎 🍎 🍎 🍎 🍎 🍎 🍎',
    correctAnswer: 7,
    visualModel: {
      type: 'counting_objects',
      data: {
        total: 7,
        items: [{ count: 7, label: 'Apples', icon: 'Apple' }]
      }
    },
    hints: {
      tier1NudgeEn: 'Point your finger and count one by one: 1, 2, 3...',
      tier1NudgeMr: 'बोट ठेवून एक एक मोजा: १, २, ३...',
      tier2GuidedEn: 'There are 5 on the top row and 2 more.',
      tier2GuidedMr: 'वरच्या रांगेत ५ आहेत आणि खाली २ आहेत.',
      tier3VisualEn: '5 + 2 = 7 apples!',
      tier3VisualMr: '५ + २ = ७ सफरचंद!'
    }
  },

  // --- Skill: skill_shapes_2d ---
  {
    id: 'q_sh_01',
    skillId: 'skill_shapes_2d',
    type: 'single_choice',
    difficulty: 1,
    promptEn: 'A shape has 3 straight sides and 3 corners. What shape is it?',
    promptMr: 'एका आकाराला ३ सरळ बाजू आणि ३ कोपरे आहेत. तो कोणता आकार आहे?',
    optionsEn: ['Triangle', 'Square', 'Circle', 'Rectangle'],
    optionsMr: ['त्रिकोण', 'चौरस', 'वर्तुळ', 'आयताकृती'],
    correctAnswer: 'Triangle',
    visualModel: {
      type: 'shapes_geometry',
      data: { shape: 'triangle' }
    },
    hints: {
      tier1NudgeEn: '"Tri" means three! Think of a tricycle with 3 wheels.',
      tier1NudgeMr: '"त्रिकोण" म्हणजे तीन कोन असलेला आकार!',
      tier2GuidedEn: 'A square has 4 sides. A circle has no straight sides.',
      tier2GuidedMr: 'चौरसाला ४ बाजू असतात. वर्तुळाला सरळ बाजू नसते.',
      tier3VisualEn: 'A triangle always has 3 sides and 3 corners!',
      tier3VisualMr: 'त्रिकोणाला नेहमी ३ बाजू आणि ३ कोपरे असतात!'
    }
  }
];

export const VETTED_VIDEOS: VideoResource[] = [
  {
    id: 'vid_nb_tens',
    title: 'Meet Numberblock 10 and Place Value',
    provider: 'Numberblocks (BBC/Learning)',
    embedUrl: 'https://www.youtube-nocookie.com/embed/p13qm_O1Uyo',
    duration: '4:20',
    skillId: 'skill_tens_and_ones',
    ageMin: 5,
    ageMax: 8,
    description: 'A fun visual adventure showing how ten ones click together to make Ten!',
    thumbnail: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?w=400&q=80'
  },
  {
    id: 'vid_ka_tenframe',
    title: 'Making 10 with Ten Frames',
    provider: 'Khan Academy Kids',
    embedUrl: 'https://www.youtube-nocookie.com/embed/5F_1J8Q548o',
    duration: '3:15',
    skillId: 'skill_add_tenframe',
    ageMin: 5,
    ageMax: 8,
    description: 'Learn how filling a ten-frame makes adding numbers up to 20 simple and friendly.',
    thumbnail: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&q=80'
  },
  {
    id: 'vid_ma_regroup',
    title: 'Multi-Digit Addition with Regrouping',
    provider: 'Math Antics',
    embedUrl: 'https://www.youtube-nocookie.com/embed/mAvuom42NyY',
    duration: '6:10',
    skillId: 'skill_add_regroup',
    ageMin: 7,
    ageMax: 10,
    description: 'Clear animated breakdown of carrying over tens when adding large numbers.',
    thumbnail: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&q=80'
  }
];
