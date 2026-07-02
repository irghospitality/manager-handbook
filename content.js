/* =====================================================
   EDIT THIS FILE to customize the course.
   No other file needs to change for day-to-day edits.
===================================================== */

const COURSE_CONFIG = {

  // ---- Where to send completion records ----
  sheetWebhookUrl: "https://script.google.com/macros/s/AKfycbxVRmzrGhTzx78nf_Wr1pcKnL9A344GSpj4m0HFw68vswQt1DWHhY_7yPpwcoqy_tXW_A/exec",

  // ---- Final screen (shown after Module 6's quiz) ----
  final: {
    heading: "You're all set.",
    body: "That's the full Employee Handbook overview. Head to the manager portal on the IRG website any time you need the full policy library, forms, or updates.",
    portalUrl: "https://irghospitality.com/managers-portal/",
    portalLabel: "Go to Manager Portal →"
  },

  // ---- Pass threshold per quiz (3 of 3 by default) ----
  passingScore: 3,

  // ---- Modules ----
  // quiz: array of exactly 3 questions. correctIndex is 0-based.
  modules: [
    {
      id: 1,
      title: "Welcome, Mission & Hiring",
      video: "Module 1 - Handbook Overview.mp4",
      quiz: [
        {
          question: "In what year was IRG founded, and with which restaurant?",
          options: [
            "2016, with The Pancake Pantry in Nashville, TN",
            "2010, with a location in Texas",
            "2017, with a hotel in Florida",
            "2016, with a restaurant in North Carolina"
          ],
          correctIndex: 0
        },
        {
          question: "What are IRG's three core values?",
          options: [
            "Speed, Consistency, Growth",
            "History, Community, Hospitality",
            "Innovation, Tradition, Profit",
            "Quality, Integrity, Teamwork"
          ],
          correctIndex: 1
        },
        {
          question: "What is IRG's stated vision for annual charitable giving?",
          options: ["$10 million", "$50 million", "$90 million", "$200 million"],
          correctIndex: 2
        }
      ]
    },
    {
      id: 2,
      title: "Orientation, Training & Reviews",
      video: "Module 2 - Handbook Overview.mp4",
      quiz: [
        {
          question: "Orientation should be completed within how long after an employee's first day?",
          options: ["The first 2 days of employment", "The first week", "The first 30 days", "Before their first shift only"],
          correctIndex: 0
        },
        {
          question: "What is the correct order of progressive discipline?",
          options: [
            "Written Warning → Verbal → Final Warning → Termination",
            "Verbal → Written Warning → Final Warning → Termination",
            "Final Warning → Verbal → Written Warning → Termination",
            "Termination is always the first step"
          ],
          correctIndex: 1
        },
        {
          question: "Before terminating someone for a serious offense, a manager should always:",
          options: ["Handle it on their own to save time", "Consult HR first", "Wait 90 days", "Give a raise instead"],
          correctIndex: 1
        }
      ]
    },
    {
      id: 3,
      title: "Pay, Time & Benefits",
      video: "Module 3 - Handbook Overview.mp4",
      quiz: [
        {
          question: "Non-exempt (hourly) employees are paid overtime at what rate for hours worked over 40 in a week?",
          options: ["1x (regular rate)", "1.25x", "1.5x", "2x"],
          correctIndex: 2
        },
        {
          question: "Clocking in or out for another employee is:",
          options: ["Fine if a manager approves it", "A fireable offense", "Only a problem if it happens twice", "Standard practice at IRG"],
          correctIndex: 1
        },
        {
          question: "What percentage of tips must an employee claim/report at the end of every shift?",
          options: ["50%", "75%", "90%", "100%"],
          correctIndex: 3
        }
      ]
    },
    {
      id: 4,
      title: "Conduct, Dress Code & Harassment",
      video: "Module 4 - Handbook Overview.mp4",
      quiz: [
        {
          question: "If an employee brings you a harassment concern, what should you do first?",
          options: [
            "Report it to HR immediately — don't investigate it yourself",
            "Investigate it yourself before involving HR",
            "Only act if the same complaint happens twice",
            "Ask the employee to put it in writing before doing anything"
          ],
          correctIndex: 0
        },
        {
          question: "Romantic relationships between a supervisor and a direct report are:",
          options: [
            "Allowed as long as both people consent",
            "Not allowed — they must be reported and may lead to reassignment or termination",
            "Fine as long as it doesn't affect scheduling",
            "Only a problem if a complaint is filed"
          ],
          correctIndex: 1
        },
        {
          question: "Employees may not consume alcohol within how many hours of the start of a shift?",
          options: ["1 hour", "2 hours", "4 hours", "8 hours"],
          correctIndex: 2
        }
      ]
    },
    {
      id: 5,
      title: "PTO, Attendance & Accommodations",
      video: "Module 5 - Handbook Overview.mp4",
      quiz: [
        {
          question: "Does unused PTO carry over to the next year?",
          options: ["Yes, automatically", "No — it's use it or lose it", "Only for salaried managers", "Only up to 40 hours"],
          correctIndex: 1
        },
        {
          question: "Missing 2 consecutive scheduled shifts without contacting anyone is treated as:",
          options: ["A verbal warning", "Job abandonment", "An excused absence", "Nothing, as long as it doesn't happen again"],
          correctIndex: 1
        },
        {
          question: "Under IRG's nursing mothers policy, the space provided for pumping must be:",
          options: [
            "A restroom, since it's private",
            "Any available room, no requirements",
            "A private, clean space — not a restroom",
            "Only available if requested 30 days in advance"
          ],
          correctIndex: 2
        }
      ]
    },
    {
      id: 6,
      title: "Cash, Safety & Emergencies",
      video: "Module 6 - Handbook Overview.mp4",
      quiz: [
        {
          question: "If a grease fire breaks out in the kitchen, what should you use to put it out?",
          options: ["Water", "A chemical extinguisher — never water", "A wet towel", "Baking soda only"],
          correctIndex: 1
        },
        {
          question: "Who is allowed to access the safe?",
          options: ["Any employee on shift", "Only the Manager on Duty", "Only the cashier who counted it that morning", "Anyone with the door code"],
          correctIndex: 1
        },
        {
          question: "A Guest Incident Report must be completed by the MOD and sent to HR:",
          options: ["Within 30 days", "The same day", "Only if the guest requests it", "At the end of the month"],
          correctIndex: 1
        }
      ]
    }
  ]
};
