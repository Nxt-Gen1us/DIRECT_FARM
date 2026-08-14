const enAi = {
  aiDesk: {
    kicker: "Farm model · demo desk",
    title: "AI Agriculture",
    subtitle:
      "Eight field tools with realistic sample runs. Nothing here is a live model until the farm API is wired.",
    disclaimer:
      "Demo preview only. These numbers and labels are sample runs for the interface. They are not live model output and must not be used as agronomy advice until a backend is connected.",
    demoTag: "sample run",
    run: "Run sample",
    running: "Reading the lot…",
    rerun: "Run again",
    sampleShot: "Choose a field still",
    sampleCrop: "Sample crop",
    upload: "Use your own still (still a sample run)",
    uploaded: "your still · sample labels only",
    copy: "Copy sample note",
    copied: "Copied",
    confidence: "Model confidence",
    tools: {
      detect: { name: "Product detection", blurb: "Name the crop in a crate photo." },
      grade: { name: "Grade detection", blurb: "A / B band from colour and size." },
      price: { name: "Price recommendation", blurb: "A farm price beside APMC mid." },
      describe: { name: "Description generator", blurb: "A lot note a kitchen can trust." },
      demand: { name: "Demand prediction", blurb: "Which week the city will pull." },
      disease: { name: "Disease detection", blurb: "Leaf spots named, with a next step." },
      harvest: { name: "Harvest prediction", blurb: "When the orchard is ready." },
      remind: { name: "Harvest reminder", blurb: "Crew times for the next lifts." },
    },
    detect: {
      found: "Most likely crop",
      also: "Also considered",
    },
    grade: {
      result: "Suggested grade",
      hold: "Pack note",
    },
    price: {
      recommend: "Suggested farm price",
      band: "APMC band today",
      chart: "APMC mid vs last farm ask",
    },
    describe: {
      title: "Lot title",
      body: "Kitchen note",
    },
    demand: {
      peak: "Peak week",
      chart: "Kitchen demand vs farm supply (t)",
    },
    disease: {
      name: "Likely issue",
      signs: "What the still shows",
      action: "Next step on the sample",
    },
    harvest: {
      window: "Sample harvest window",
      ready: "Colour-break share",
      chart: "Readiness on the sample orchard",
    },
    remind: {
      due: "Due",
      empty: "No sample reminders on this desk.",
      dismiss: "Dismiss sample",
    },
    ask: "Ask the sample agronomist",
    placeholder: "e.g. Should I spray tomato before Thursday’s rain?",
    submit: "Ask",
    reply:
      "Sample reply only: hold urea and apply a bio-fungicide 12 hours before the Thursday shower. Night drip saves about 18% water this week. Confirm with your own agronomist — this is not a live model.",
  },
};

export default enAi;
