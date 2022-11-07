import React, { useState, useEffect } from "react";
import AdSense from "react-adsense";
import domtoimage from "dom-to-image";
// import axios from "axios";
import "../statBlock.css";

import genders from "../lists/genders.json";
import names from "../lists/names.json";
import races from "../lists/races.json";
import jobs from "../lists/jobs.json";
import traits from "../lists/traits.json";
import appearance from "../lists/appearance.json";
import useAnalyticsEventTracker from "../functions/useAnalyticsEventTracker.js";

import AdComponent from "./AdComponent";

import ReactGA from "react-ga";

import {
  FaChevronDown,
  FaChevronLeft,
  FaLock,
  FaLockOpen,
} from "react-icons/fa";
import { computeHeadingLevel } from "@testing-library/react";

const Generator = () => {
  const gaEventTracker = useAnalyticsEventTracker("Generator");
  const NULL_GENDER = {
    type: "None",
  };
  const NONE = "none";
  const BASIC = "basic";
  const SPECIAL = "special";
  const ADDITIONAL = "additional";
  const MEN = "men";
  const WOMEN = "women";
  const ALL = "all";

  const [listData, setListData] = useState({
    genderList: genders,
    nameList: names.human,
    raceList: races.sort(function (a, b) {
      return a.name > b.name ? 1 : b.name > a.name ? -1 : 0;
    }),
    jobsList: jobs.sort(function (a, b) {
      return a.name > b.name ? 1 : b.name > a.name ? -1 : 0;
    }),
    traitsList: traits,
    appearanceList: appearance,
    npcList: [],
    currentNPCindex: 0,
  });
  const {
    genderList,
    nameList,
    raceList,
    jobsList,
    traitsList,
    appearanceList,
    npcList,
    currentNPCindex,
  } = listData;

  const [modifierData, setModifierData] = useState({
    allowedAges: {
      child: false,
      adult: true,
      elderly: true,
    },
    proficiencyBonus: 2,
    traitAmount: {
      universal: 3,
      positive: 1,
      neutral: 1,
      negative: 1,
    },
    powerLevel: 3,
    powerDescription: [
      "average base stat value = 8 --- 2 hit dice",
      "average base stat value = 10 --- 3 hit dice",
      "average base stat value = 12 --- 4 hit dice",
      "average base stat value = 14 --- 5 hit dice",
      "average base stat value = 16 --- 6 hit dice",
    ],
    powerVariance: 3,
    voiceTypes: {
      effort: [
        ["https://youtu.be/FVmAEezr6ao?t=167"],
        [
          "Dabbing",
          "Light + Direct + Sudden",
          "https://youtu.be/ms5ouV-PAX4?t=148",
        ],
        [
          "Flicking",
          "Light + Indirect + Sudden",
          "https://youtu.be/ms5ouV-PAX4?t=163",
        ],
        [
          "Pressing",
          "Strong + Direct + Sustained",
          "https://youtu.be/ms5ouV-PAX4?t=113",
        ],
        [
          "Thrusting",
          "Strong + Direct + Sudden",
          "https://youtu.be/ms5ouV-PAX4?t=51",
        ],
        [
          "Wringing",
          "Strong + Indirect + Sustained",
          "https://youtu.be/ms5ouV-PAX4?t=93",
        ],
        [
          "Slashing",
          "Strong + Indirect + Sudden",
          "https://youtu.be/ms5ouV-PAX4?t=132",
        ],
        [
          "Gliding",
          "Light + Direct + Sustained",
          "https://youtu.be/ms5ouV-PAX4?t=30",
        ],
        [
          "Floating",
          "Light + Indirect + Sustained",
          "https://youtu.be/ms5ouV-PAX4?t=72",
        ],
      ],
      location: [
        ["https://youtu.be/FVmAEezr6ao?t=325"],
        ["Nasally", "Throaty", "Balanced location"],
      ],
      dryness: [["https://youtu.be/FVmAEezr6ao?t=400"], ["Breathy", "Dry"]],
      tempo: [
        ["https://youtu.be/FVmAEezr6ao?t=573"],
        ["Slow", "Standard Tempo", "Fast"],
      ],
      attitude: [
        ["https://youtu.be/FVmAEezr6ao?t=630"],
        ["Friendly", "Impartial", "Aggressive"],
      ],
    },
    showLocks: true,
    showVoiceLinks: true,
    showStatCalc: false,
    capStats: true,
    importError: "",
  });
  const {
    allowedAges,
    proficiencyBonus,
    traitAmount,
    powerLevel,
    powerDescription,
    powerVariance,
    voiceTypes,
    showLocks,
    showVoiceLinks,
    showStatCalc,
    capStats,
    importError,
  } = modifierData;

  const [resultData, setResultData] = useState({
    resultGender: {},
    resultName: "",
    resultRace: {},
    resultAge: -1,
    resultAgeType: "",
    resultJob: {},
    resultHook: ["", ""],
    resultTraits: {
      universal: [],
      positive: [],
      neutral: [],
      negative: [],
    },
    resultVoice: {
      effort: "",
      location: "",
      dryness: "",
      tempo: "",
      attitude: "",
    },
    resultAppearance: {
      skinType: "",
      skinColour: "",
      hairStyle: "",
      hairColour: "",
      facialHairStyle: "",
      eyeColour: "",
      weight: "",
      height: "",
      heightInches: -1,
      damage: [],
      underClothing: "",
      overClothing: "",
      accessory: "",
    },
    resultProficiencies: [],
    resultSavingThrows: [],
    resultStats: {
      AC: -1,
      HP: "",
      speed: {},
      STR: -1,
      DEX: -1,
      CON: -1,
      INT: -1,
      WIS: -1,
      CHA: -1,
      CR: -1,
    },
    baseStats: {
      STR: -1,
      DEX: -1,
      CON: -1,
      INT: -1,
      WIS: -1,
      CHA: -1,
    },
    showResults: false,
  });
  const {
    resultAge,
    resultAgeType,
    resultRace,
    resultGender,
    resultName,
    resultJob,
    resultHook,
    resultTraits,
    resultVoice,
    resultAppearance,
    resultProficiencies,
    resultSavingThrows,
    resultStats,
    baseStats,
    showResults,
  } = resultData;

  const [lockData, setLockData] = useState({
    nameLock: false,
    genderLock: false,
    raceLock: false,
    ageLock: false,
    jobLock: false,
    hookLock: false,
    skinColourLock: false,
    hairStyleLock: false,
    hairColourLock: false,
    facialHairLock: false,
    eyeColourLock: false,
    weightLock: false,
    heightLock: false,
    bodyDamageLock: [false, false, false],
    underClothingLock: false,
    overClothingLock: false,
    accessoryLock: false,
    uniTraitLock: [false, false, false],
    posTraitLock: [false],
    neuTraitLock: [false],
    negTraitLock: [false],
    voiceEffortLock: false,
    voiceLocationLock: false,
    voiceDrynessLock: false,
    voiceTempoLock: false,
    voiceAttitudeLock: false,
  });
  const {
    nameLock,
    genderLock,
    raceLock,
    ageLock,
    jobLock,
    hookLock,
    skinColourLock,
    hairStyleLock,
    hairColourLock,
    facialHairLock,
    eyeColourLock,
    weightLock,
    heightLock,
    bodyDamageLock,
    underClothingLock,
    overClothingLock,
    accessoryLock,
    uniTraitLock,
    posTraitLock,
    neuTraitLock,
    negTraitLock,
    voiceEffortLock,
    voiceLocationLock,
    voiceDrynessLock,
    voiceTempoLock,
    voiceAttitudeLock,
  } = lockData;

  useEffect(() => {
    onGenerate();
    gaEventTracker("generate");
  }, []);

  const onGenerate = () => {
    // console.log(powerLevel);
    // Create arrays based off preferences
    // GENERATE GENDER
    let generatedGender = {};
    if (genderLock) {
      generatedGender = resultGender;
    } else {
      const selectedGenders = genderList.filter(
        (gender) => gender.defaultCheckbox
      );
      if (selectedGenders.length === 0) {
        generatedGender = NULL_GENDER;
      } else if (selectedGenders.length === 1) {
        generatedGender = selectedGenders[0];
      } else {
        let totalWeight = 0;
        for (let i = 0; i < selectedGenders.length; i++) {
          totalWeight += selectedGenders[i].weight;
        }
        const randomWeight = Math.random() * totalWeight;
        let rollingWeight = 0;
        for (let i = 0; i < selectedGenders.length; i++) {
          if (selectedGenders[i].weight + rollingWeight >= randomWeight) {
            generatedGender = selectedGenders[i];
            break;
          }
          rollingWeight += selectedGenders[i].weight;
        }
      }
    }

    // GENERATE NAME
    let generatedName = "";
    if (nameLock) {
      generatedName = resultName;
    } else {
      var arrayNames = [];
      if (
        generatedGender.type === "Male" ||
        generatedGender.type === "Non-Binary" ||
        generatedGender.type === "None"
      ) {
        arrayNames = [...arrayNames, ...nameList.maleNames];
      }
      if (
        generatedGender.type === "Female" ||
        generatedGender.type === "Non-Binary" ||
        generatedGender.type === "None"
      ) {
        arrayNames = [...arrayNames, ...nameList.femaleNames];
      }
      generatedName =
        arrayNames[Math.floor(Math.random() * (arrayNames.length - 1))] +
        " " +
        nameList.surnames[
          Math.floor(Math.random() * (nameList.surnames.length - 1))
        ];
    }

    // GENERATE RACE
    let generatedRace = {};
    if (raceLock) {
      generatedRace = resultRace;
    } else {
      const selectedRaces = raceList.filter((race) => race.defaultCheckbox);
      if (selectedRaces.length === 0) {
        generatedRace =
          raceList[Math.floor(Math.random() * (raceList.length - 1) + 0.5)];
      } else {
        generatedRace =
          selectedRaces[
            Math.floor(Math.random() * (selectedRaces.length - 1) + 0.5)
          ];
      }
    }

    // GENERATE AGE
    let generatedAge = -1;
    let generatedAgeType = "";
    const elderlyAge = Math.floor(generatedRace.lifespan * 0.75);
    let ageFloor = 1;
    let ageRoof = generatedRace.lifespan;

    if (ageLock) {
      generatedAge = resultAge;
      if (allowedAges.child) {
      } else if (allowedAges.adult) {
        ageFloor = generatedRace.matureAge;
      } else if (allowedAges.elderly) {
        ageFloor = elderlyAge;
      }
      if (allowedAges.elderly) {
      } else if (allowedAges.adult) {
        ageRoof = elderlyAge;
      } else if (allowedAges.child) {
        ageRoof = generatedRace.matureAge;
      }
    } else {
      if (allowedAges.child && !allowedAges.adult && allowedAges.elderly) {
        while (
          generatedAge === -1 ||
          (!(generatedAge >= elderlyAge) &&
            !(generatedAge < generatedRace.matureAge))
        ) {
          generatedAge = Math.floor(
            Math.random() * (ageRoof - ageFloor) + ageFloor
          );
          // console.log(generatedAge);
        }
      } else {
        if (allowedAges.child) {
        } else if (allowedAges.adult) {
          ageFloor = generatedRace.matureAge;
        } else if (allowedAges.elderly) {
          ageFloor = elderlyAge;
        }
        if (allowedAges.elderly) {
        } else if (allowedAges.adult) {
          ageRoof = elderlyAge;
        } else if (allowedAges.child) {
          ageRoof = generatedRace.matureAge;
        }

        generatedAge = Math.floor(
          Math.random() * (ageRoof - ageFloor) + ageFloor
        );
      }
    }

    if (generatedAge < generatedRace.matureAge) {
      generatedAgeType = "Child";
    } else if (generatedAge >= elderlyAge) {
      generatedAgeType = "Elderly";
    } else {
      generatedAgeType = "Adult";
    }

    // GENERATE JOB
    let generatedJob = {};

    if (jobLock) {
      generatedJob = resultJob;
    } else {
      const selectedJobs = jobsList.filter((job) => job.defaultCheckbox);
      if (selectedJobs.length !== 0) {
        generatedJob =
          selectedJobs[
            Math.floor(Math.random() * (selectedJobs.length - 1) + 0.5)
          ];
      } else if (selectedJobs.length === 0) {
        generatedJob = jobsList.find((job, index) => job.name === "Unemployed");
      }
    }

    // GENERATE TRAITS

    let universalList = traitsList.positive.concat(
      traitsList.neutral.concat(traitsList.negative)
    );
    let generatedUniTraits = [];
    if (uniTraitLock.includes(true)) {
      generatedUniTraits = resultTraits.universal.filter(
        (trait, index) => uniTraitLock[index]
      );
      for (let i = 0; i < generatedUniTraits.length; i++) {
        universalList = universalList.filter(
          (trait, index) => trait.name !== generatedUniTraits[i].name
        );
      }
    }
    let num = -1;

    if (traitAmount.universal > 0) {
      for (
        let i = 0;
        i < traitAmount.universal &&
        generatedUniTraits.length < traitAmount.universal &&
        universalList.length > 0;
        i++
      ) {
        // random number for positive array
        num = Math.floor(Math.random() * (universalList.length - 1) + 0.5);
        // add trait to generated positive list
        const tmpTrait = universalList[num];
        generatedUniTraits.push(tmpTrait);
        // if trait has conflicts, remove from other arrays
        if (tmpTrait.hasOwnProperty("conflicts")) {
          for (let j = 0; j < tmpTrait.conflicts.length; j++) {
            universalList = universalList.filter(
              (trait, index) => trait.name !== tmpTrait.conflicts[j]
            );
          }
        }
        // remove trait from original positive list
        universalList = universalList.filter(
          (trait, index) => trait.name !== tmpTrait.name
        );
      }
    }

    // let positiveList = traitsList.positive;
    // let neutralList = traitsList.neutral;
    // let negativeList = traitsList.negative;

    // // GENERATE POSITIVE TRAITS
    // let generatedPosTraits = [];
    // if (posTraitLock.includes(true)) {
    //   generatedPosTraits = resultTraits.positive.filter(
    //     (trait, index) => posTraitLock[index]
    //   );
    //   for (let i = 0; i < generatedPosTraits.length; i++) {
    //     positiveList = positiveList.filter(
    //       (trait, index) => trait.name !== generatedPosTraits[i].name
    //     );
    //   }
    // }
    // num = -1;

    // if (traitAmount.positive > 0) {
    //   for (
    //     let i = 0;
    //     i < traitAmount.positive &&
    //     generatedPosTraits.length < traitAmount.positive &&
    //     positiveList.length > 0;
    //     i++
    //   ) {
    //     // random number for positive array
    //     num = Math.floor(Math.random() * (positiveList.length - 1) + 0.5);
    //     // add trait to generated positive list
    //     const tmpTrait = positiveList[num];
    //     generatedPosTraits.push(tmpTrait);
    //     // if trait has conflicts, remove from other arrays
    //     if (tmpTrait.hasOwnProperty("conflicts")) {
    //       for (let j = 0; j < tmpTrait.conflicts.length; j++) {
    //         neutralList = neutralList.filter(
    //           (trait, index) => trait.name !== tmpTrait.conflicts[j]
    //         );
    //         negativeList = negativeList.filter(
    //           (trait, index) => trait.name !== tmpTrait.conflicts[j]
    //         );
    //         positiveList = positiveList.filter(
    //           (trait, index) => trait.name !== tmpTrait.conflicts[j]
    //         );
    //       }
    //     }
    //     // remove trait from original positive list
    //     positiveList = positiveList.filter(
    //       (trait, index) => trait.name !== tmpTrait.name
    //     );
    //   }
    // }

    // // GENERATE NEUTRAL TRAITS
    // // TODO ADD CONFLICT LOGIC
    // let generatedNeuTraits = [];
    // if (neuTraitLock.includes(true)) {
    //   generatedNeuTraits = resultTraits.neutral.filter(
    //     (trait, index) => neuTraitLock[index]
    //   );
    //   for (let i = 0; i < generatedNeuTraits.length; i++) {
    //     neutralList = neutralList.filter(
    //       (trait, index) => trait.name !== generatedNeuTraits[i].name
    //     );
    //   }
    // }
    // num = -1;

    // if (traitAmount.neutral > 0) {
    //   for (
    //     let i = 0;
    //     i < traitAmount.neutral &&
    //     generatedNeuTraits.length < traitAmount.neutral &&
    //     neutralList.length > 0;
    //     i++
    //   ) {
    //     num = Math.floor(Math.random() * (neutralList.length - 1) + 0.5);
    //     const tmpTrait = neutralList[num];
    //     generatedNeuTraits.push(tmpTrait);
    //     // if trait has conflicts, remove from other arrays
    //     if (tmpTrait.hasOwnProperty("conflicts")) {
    //       for (let j = 0; j < tmpTrait.conflicts.length; j++) {
    //         negativeList = negativeList.filter(
    //           (trait, index) => trait.name !== tmpTrait.conflicts[j]
    //         );
    //         neutralList = neutralList.filter(
    //           (trait, index) => trait.name !== tmpTrait.conflicts[j]
    //         );
    //       }
    //     }
    //     neutralList = neutralList.filter(
    //       (trait, index) => trait.name !== tmpTrait.name
    //     );
    //   }
    // }

    // // GENERATE NEGATIVE TRAITS
    // // TODO ADD CONFLICT LOGIC
    // let generatedNegTraits = [];
    // if (negTraitLock.includes(true)) {
    //   generatedNegTraits = resultTraits.negative.filter(
    //     (trait, index) => negTraitLock[index]
    //   );
    //   for (let i = 0; i < generatedNegTraits.length; i++) {
    //     negativeList = negativeList.filter(
    //       (trait, index) => trait.name !== generatedNegTraits[i].name
    //     );
    //   }
    // }
    // num = -1;

    // if (traitAmount.negative > 0) {
    //   for (
    //     let i = 0;
    //     i < traitAmount.negative &&
    //     generatedNegTraits.length < traitAmount.negative &&
    //     negativeList.length > 0;
    //     i++
    //   ) {
    //     num = Math.floor(Math.random() * (negativeList.length - 1) + 0.5);
    //     const tmpTrait = negativeList[num];
    //     generatedNegTraits.push(tmpTrait);
    //     // if trait has conflicts, remove from other arrays
    //     if (tmpTrait.hasOwnProperty("conflicts")) {
    //       for (let j = 0; j < tmpTrait.conflicts.length; j++) {
    //         negativeList = negativeList.filter(
    //           (trait, index) => trait.name !== tmpTrait.conflicts[j]
    //         );
    //       }
    //     }
    //     negativeList = negativeList.filter(
    //       (trait, index) => trait.name !== tmpTrait.name
    //     );
    //   }
    // }

    const tempUniTraitLock = uniTraitLock.filter((lock, trait) => lock);
    // const tempPosTraitLock = posTraitLock.filter((lock, trait) => lock);
    // const tempNeuTraitLock = neuTraitLock.filter((lock, trait) => lock);
    // const tempNegTraitLock = negTraitLock.filter((lock, trait) => lock);

    setLockData({
      ...lockData,
      uniTraitLock: Array(generatedUniTraits.length)
        .fill(false)
        .map((lock, index) =>
          tempUniTraitLock[index] !== undefined
            ? tempUniTraitLock[index]
            : false
        ),
      // posTraitLock: Array(generatedPosTraits.length)
      //   .fill(false)
      //   .map((lock, index) =>
      //     tempPosTraitLock[index] !== undefined
      //       ? tempPosTraitLock[index]
      //       : false
      //   ),
      // neuTraitLock: Array(generatedNeuTraits.length)
      //   .fill(false)
      //   .map((lock, index) =>
      //     tempNeuTraitLock[index] !== undefined
      //       ? tempNeuTraitLock[index]
      //       : false
      //   ),
      // negTraitLock: Array(generatedNegTraits.length)
      //   .fill(false)
      //   .map((lock, index) =>
      //     tempNegTraitLock[index] !== undefined
      //       ? tempNegTraitLock[index]
      //       : false
      //   ),
    });

    // GENERATE HOOK
    let generatedHook = ["", ""];
    if (hookLock) {
      generatedHook = resultHook;
    } else {
      let hookList = generatedJob.hooks;
      // add hooks from traits
      for (let i = 0; i < generatedUniTraits.length; i++) {
        if (generatedUniTraits[i].hasOwnProperty("hooks")) {
          hookList = hookList.concat(generatedUniTraits[i].hooks);
        }
      }
      // for (let i = 0; i < generatedPosTraits.length; i++) {
      //   if (generatedPosTraits[i].hasOwnProperty("hooks")) {
      //     hookList = hookList.concat(generatedPosTraits[i].hooks);
      //   }
      // }
      // for (let i = 0; i < generatedNeuTraits.length; i++) {
      //   if (generatedNeuTraits[i].hasOwnProperty("hooks")) {
      //     hookList = hookList.concat(generatedNeuTraits[i].hooks);
      //   }
      // }
      // for (let i = 0; i < generatedNegTraits.length; i++) {
      //   if (generatedNegTraits[i].hasOwnProperty("hooks")) {
      //     hookList = hookList.concat(generatedNegTraits[i].hooks);
      //   }
      // }

      generatedHook =
        hookList[Math.floor(Math.random() * (hookList.length - 1) + 0.5)];
    }

    // GENERATE VOICE
    let generatedVoice = {
      effort: voiceEffortLock
        ? resultVoice.effort
        : voiceTypes.effort[
            Math.floor(Math.random() * (voiceTypes.effort.length - 2) + 1.5)
          ],
      location: voiceLocationLock
        ? resultVoice.location
        : voiceTypes.location[1][
            Math.floor(
              Math.random() * (voiceTypes.location[1].length - 1) + 0.5
            )
          ],
      dryness: voiceDrynessLock
        ? resultVoice.dryness
        : voiceTypes.dryness[1][
            Math.floor(Math.random() * (voiceTypes.dryness[1].length - 1) + 0.5)
          ],
      tempo: voiceTempoLock
        ? resultVoice.tempo
        : voiceTypes.tempo[1][
            Math.floor(Math.random() * (voiceTypes.tempo[1].length - 1) + 0.5)
          ],
      attitude: voiceAttitudeLock
        ? resultVoice.attitude
        : voiceTypes.attitude[1][
            Math.floor(
              Math.random() * (voiceTypes.attitude[1].length - 1) + 0.5
            )
          ],
    };

    // console.log(generatedVoice);

    // GENERATE APPEARANCE
    let generatedAppearance = {
      skinType: generatedRace.appearance.skinType,
      skinColour: "",
      hairStyle: "",
      hairColour: "",
      facialHairStyle: "",
      eyeColour: "",
      weight: "",
      height: "",
      heightInches: -1,
      damage: [],
      underClothing: "",
      overClothing: "",
      accessory: "",
    };

    // skin colour
    if (skinColourLock) {
      generatedAppearance.skinColour = resultAppearance.skinColour;
    } else {
      if (generatedRace.appearance.skinColourType === BASIC) {
        generatedAppearance.skinColour =
          appearanceList.basicSkinColour[
            Math.floor(
              Math.random() * (appearanceList.basicSkinColour.length - 1) + 0.5
            )
          ];
      } else if (generatedRace.appearance.skinColourType === SPECIAL) {
        generatedAppearance.skinColour =
          generatedRace.appearance.skinColour[
            Math.floor(
              Math.random() * (generatedRace.appearance.skinColour.length - 1) +
                0.5
            )
          ];
      } else if (generatedRace.appearance.skinColourType === ADDITIONAL) {
        const skinList = appearanceList.basicSkinColour.concat(
          generatedRace.appearance.skinColour
        );
        generatedAppearance.skinColour =
          skinList[Math.floor(Math.random() * (skinList.length - 1) + 0.5)];
      }
    }

    // hair style and colour
    if (hairStyleLock) {
      generatedAppearance.hairStyle = resultAppearance.hairStyle;
    } else {
      if (generatedRace.appearance.hairType === NONE) {
        generatedAppearance.hairStyle = "Bald";
      } else if (generatedRace.appearance.hairType === BASIC) {
        generatedAppearance.hairStyle =
          appearanceList.hairStyle[
            Math.floor(
              Math.random() * (appearanceList.hairStyle.length - 1) + 0.5
            )
          ];
      }
    }

    if (hairColourLock) {
      generatedAppearance.hairColour = resultAppearance.hairColour;
    } else {
      if (generatedAppearance.hairStyle === "Bald") {
        generatedAppearance.hairColour = "None";
      } else {
        generatedAppearance.hairColour =
          appearanceList.basicHairColour[
            Math.floor(
              Math.random() * (appearanceList.basicHairColour.length - 1) + 0.5
            )
          ];
      }
    }

    // facial hair
    if (facialHairLock) {
      generatedAppearance.facialHairStyle = resultAppearance.facialHairStyle;
    } else {
      const facialHairRoll = Math.random();
      if (generatedRace.appearance.facialHairType === NONE) {
        generatedAppearance.facialHairStyle = "No Facial Hair";
      } else if (
        generatedRace.appearance.facialHairType === MEN ||
        generatedGender.type === "Female"
      ) {
        generatedAppearance.facialHairStyle = "No Facial Hair";
      } else if (facialHairRoll <= generatedRace.appearance.facialHairChance) {
        generatedAppearance.facialHairStyle =
          appearanceList.facialHair[
            Math.floor(
              Math.random() * (appearanceList.facialHair.length - 1) + 0.5
            )
          ];
      } else {
        generatedAppearance.facialHairStyle = "No Facial Hair";
      }
    }

    // eye colour
    if (eyeColourLock) {
      generatedAppearance.eyeColour = resultAppearance.eyeColour;
    } else {
      if (generatedRace.appearance.eyeColourType === BASIC) {
        generatedAppearance.eyeColour =
          appearanceList.basicEyeColour[
            Math.floor(
              Math.random() * (appearanceList.basicEyeColour.length - 1) + 0.5
            )
          ];
      }
    }

    // weight
    if (weightLock) {
      generatedAppearance.weight = resultAppearance.weight;
    } else {
      generatedAppearance.weight =
        appearanceList.weight[
          Math.floor(Math.random() * (appearanceList.weight.length - 1) + 0.5)
        ];
    }

    // height
    if (heightLock) {
      generatedAppearance.height = resultAppearance.height;
    } else {
      generatedAppearance.height =
        appearanceList.height[
          Math.floor(Math.random() * (appearanceList.height.length - 1) + 0.5)
        ];
    }

    let heightFloor = 0;
    let heightRoof = 100;
    // "Very Short", "Short", "Average", "Tall", "Very Tall"

    if (generatedAppearance.height === "Very Short") {
      heightFloor = 0.85 * generatedRace.avgHeight;
      heightRoof = 0.9 * generatedRace.avgHeight;
    } else if (generatedAppearance.height === "Short") {
      heightFloor = 0.9 * generatedRace.avgHeight;
      heightRoof = 0.95 * generatedRace.avgHeight;
    } else if (generatedAppearance.height === "Average Height") {
      heightFloor = 0.95 * generatedRace.avgHeight;
      heightRoof = 1.05 * generatedRace.avgHeight;
    } else if (generatedAppearance.height === "Tall") {
      heightFloor = 1.05 * generatedRace.avgHeight;
      heightRoof = 1.1 * generatedRace.avgHeight;
    } else if (generatedAppearance.height === "Very Tall") {
      heightFloor = 1.1 * generatedRace.avgHeight;
      heightRoof = 1.15 * generatedRace.avgHeight;
    }

    generatedAppearance.heightInches = Math.floor(
      Math.random() * (heightRoof - heightFloor) + heightFloor
    );

    // body damage
    if (bodyDamageLock.includes(true)) {
      generatedAppearance.damage = resultAppearance.damage.filter(
        (damage, index) => bodyDamageLock[index]
      );
      setLockData({
        ...lockData,
        bodyDamageLock: bodyDamageLock.filter((lock, index) => lock),
      });
    }
    const bodyDamageRoll = Math.random();
    let bodyDamageNum = 0;
    if (bodyDamageRoll <= 0.25) {
      bodyDamageNum = 3;
    } else if (bodyDamageRoll <= 0.5) {
      bodyDamageNum = 2;
    } else if (bodyDamageRoll <= 0.8) {
      bodyDamageNum = 1;
    }

    let tempDamageArea = appearance.basicDamageArea;
    for (
      let i = 0;
      i < bodyDamageNum && generatedAppearance.damage.length < bodyDamageNum;
      i++
    ) {
      const rolledBodyDamageType =
        appearanceList.basicDamageType[
          Math.floor(
            Math.random() * (appearanceList.basicDamageType.length - 1) + 0.5
          )
        ];
      const rolledBodyDamageArea =
        tempDamageArea[
          Math.floor(Math.random() * (tempDamageArea.length - 1) + 0.5)
        ];
      tempDamageArea = tempDamageArea.filter(
        (area, index) => area !== rolledBodyDamageArea
      );
      const bodyDamageString =
        rolledBodyDamageType + " " + rolledBodyDamageArea;
      generatedAppearance.damage.push(bodyDamageString);
    }

    // under clothing
    if (underClothingLock) {
      generatedAppearance.underClothing = resultAppearance.underClothing;
    } else {
      if (generatedJob.hasOwnProperty("armor")) {
        generatedAppearance.underClothing = generatedJob.armor.name;
      } else {
        const rolledClothingColour =
          appearanceList.underClothingColour[
            Math.floor(
              Math.random() * (appearanceList.underClothingColour.length - 1) +
                0.5
            )
          ];
        const rolledClothing =
          appearanceList.underClothing[
            Math.floor(
              Math.random() * (appearanceList.underClothing.length - 1) + 0.5
            )
          ];
        generatedAppearance.underClothing =
          rolledClothingColour + " " + rolledClothing;
      }
    }

    // outer clothing
    if (overClothingLock) {
      generatedAppearance.overClothing = resultAppearance.overClothing;
    } else {
      generatedAppearance.overClothing =
        appearanceList.overClothing[
          Math.floor(
            Math.random() * (appearanceList.overClothing.length - 1) + 0.5
          )
        ];
    }

    // accessory
    if (accessoryLock) {
      generatedAppearance.accessory = resultAppearance.accessory;
    } else {
      generatedAppearance.accessory =
        appearanceList.accessory[
          Math.floor(
            Math.random() * (appearanceList.accessory.length - 1) + 0.5
          )
        ];
    }

    // GENERATE STATS
    const statAverage = 10 + (powerLevel - 3) * 2;
    const statFloor = statAverage - powerVariance;
    const statRoof = statAverage + powerVariance;

    let generatedSTR = Math.floor(
      Math.random() * (statRoof - statFloor) + statFloor + 0.5
    );
    let generatedDEX = Math.floor(
      Math.random() * (statRoof - statFloor) + statFloor + 0.5
    );
    let generatedCON = Math.floor(
      Math.random() * (statRoof - statFloor) + statFloor + 0.5
    );
    let generatedINT = Math.floor(
      Math.random() * (statRoof - statFloor) + statFloor + 0.5
    );
    let generatedWIS = Math.floor(
      Math.random() * (statRoof - statFloor) + statFloor + 0.5
    );
    let generatedCHA = Math.floor(
      Math.random() * (statRoof - statFloor) + statFloor + 0.5
    );

    const generatedBaseStats = {
      STR: generatedSTR,
      DEX: generatedDEX,
      CON: generatedCON,
      INT: generatedINT,
      WIS: generatedWIS,
      CHA: generatedCHA,
    };

    // console.log(generatedBaseStats);

    // add job bonuses
    generatedSTR += generatedJob.statBonuses.STR;
    generatedDEX += generatedJob.statBonuses.DEX;
    generatedCON += generatedJob.statBonuses.CON;
    generatedINT += generatedJob.statBonuses.INT;
    generatedWIS += generatedJob.statBonuses.WIS;
    generatedCHA += generatedJob.statBonuses.CHA;

    // add trait bonuses
    for (let i = 0; i < generatedUniTraits.length; i++) {
      if (generatedUniTraits[i].hasOwnProperty("statBonuses")) {
        generatedSTR += generatedUniTraits[i].statBonuses.STR;
        generatedDEX += generatedUniTraits[i].statBonuses.DEX;
        generatedCON += generatedUniTraits[i].statBonuses.CON;
        generatedINT += generatedUniTraits[i].statBonuses.INT;
        generatedWIS += generatedUniTraits[i].statBonuses.WIS;
        generatedCHA += generatedUniTraits[i].statBonuses.CHA;
      }
    }

    // for (let i = 0; i < generatedPosTraits.length; i++) {
    //   if (generatedPosTraits[i].hasOwnProperty("statBonuses")) {
    //     generatedSTR += generatedPosTraits[i].statBonuses.STR;
    //     generatedDEX += generatedPosTraits[i].statBonuses.DEX;
    //     generatedCON += generatedPosTraits[i].statBonuses.CON;
    //     generatedINT += generatedPosTraits[i].statBonuses.INT;
    //     generatedWIS += generatedPosTraits[i].statBonuses.WIS;
    //     generatedCHA += generatedPosTraits[i].statBonuses.CHA;
    //   }
    // }

    // for (let i = 0; i < generatedNeuTraits.length; i++) {
    //   if (generatedNeuTraits[i].hasOwnProperty("statBonuses")) {
    //     generatedSTR += generatedNeuTraits[i].statBonuses.STR;
    //     generatedDEX += generatedNeuTraits[i].statBonuses.DEX;
    //     generatedCON += generatedNeuTraits[i].statBonuses.CON;
    //     generatedINT += generatedNeuTraits[i].statBonuses.INT;
    //     generatedWIS += generatedNeuTraits[i].statBonuses.WIS;
    //     generatedCHA += generatedNeuTraits[i].statBonuses.CHA;
    //   }
    // }

    // for (let i = 0; i < generatedNegTraits.length; i++) {
    //   if (generatedNegTraits[i].hasOwnProperty("statBonuses")) {
    //     generatedSTR += generatedNegTraits[i].statBonuses.STR;
    //     generatedDEX += generatedNegTraits[i].statBonuses.DEX;
    //     generatedCON += generatedNegTraits[i].statBonuses.CON;
    //     generatedINT += generatedNegTraits[i].statBonuses.INT;
    //     generatedWIS += generatedNegTraits[i].statBonuses.WIS;
    //     generatedCHA += generatedNegTraits[i].statBonuses.CHA;
    //   }
    // }

    // cap stats
    if (capStats) {
      if (generatedSTR < 2) {
        generatedSTR = 2;
      } else if (generatedSTR > 18) {
        generatedSTR = 18;
      }
      if (generatedDEX < 2) {
        generatedDEX = 2;
      } else if (generatedDEX > 18) {
        generatedDEX = 18;
      }
      if (generatedCON < 2) {
        generatedCON = 2;
      } else if (generatedCON > 18) {
        generatedCON = 18;
      }
      if (generatedINT < 2) {
        generatedINT = 2;
      } else if (generatedINT > 18) {
        generatedINT = 18;
      }
      if (generatedWIS < 2) {
        generatedWIS = 2;
      } else if (generatedWIS > 18) {
        generatedWIS = 18;
      }
      if (generatedCHA < 2) {
        generatedCHA = 2;
      } else if (generatedCHA > 18) {
        generatedCHA = 18;
      }
    }

    // + power
    const dexBonusCap = generatedJob.hasOwnProperty("armor")
      ? generatedJob.armor.hasOwnProperty("dexCap")
        ? generatedJob.armor.dexCap
        : 10
      : 10;

    let dexBonus = Math.floor((generatedDEX - 10) / 2);
    if (dexBonus > dexBonusCap) {
      dexBonus = dexBonusCap;
    }

    const generatedAC =
      (generatedJob.hasOwnProperty("armor") ? generatedJob.armor.acBase : 10) +
      dexBonus;
    // + armor and shield bonus

    // 10 + 1d10 by default
    const generatedHP =
      8 +
      (powerLevel - 1) * Math.floor(Math.random() * 8 + 0.5) +
      powerLevel * Math.floor((generatedCON - 10) / 2) +
      " (" +
      powerLevel +
      "d8 " +
      (Math.floor((generatedCON - 10) / 2) >= 0 ? "+" : "-") +
      " " +
      Math.abs(powerLevel * Math.floor((generatedCON - 10) / 2)) +
      ")";
    // console.log(generatedHP);

    let generatedSpeed = {
      walking: generatedRace.speed.walking,
    };
    // + other modifiers
    if (generatedRace.speed.hasOwnProperty("flying")) {
      generatedSpeed = {
        ...generatedSpeed,
        flying: generatedRace.speed.flying,
      };
    }

    // GENERATE PROFICIENCIES
    let generatedProficiencies = [];

    // Race proficiencies
    for (let i = 0; i < generatedRace.proficiencies.length; i++) {
      if (Array.isArray(generatedRace.proficiencies[i])) {
        let tmpArray = generatedRace.proficiencies[i];
        for (let j = 0; j < generatedProficiencies.length; j++) {
          tmpArray.filter((prof, index) => generatedProficiencies[j] !== prof);
        }
        // tmpArray[0] contains the amount of proficiencies to pick from the list, if amount to pick is > amount available, cap amount
        if (tmpArray[0] > tmpArray.length - 1) {
          tmpArray[0] = tmpArray.length - 1;
        }

        for (let j = 0; j < tmpArray[0]; j++) {
          const randomNum = Math.floor(
            Math.random() * (tmpArray.length - 2) + 1.5
          );
          generatedProficiencies.push(tmpArray[randomNum]);
          tmpArray = tmpArray.filter(
            (prof, index) => prof !== tmpArray[randomNum]
          );
        }
      } else {
        // if its not an array then its a guaranteed proficiency, which is a string
        if (!generatedProficiencies.includes(generatedRace.proficiencies[i])) {
          generatedProficiencies.push(generatedRace.proficiencies[i]);
        }
      }
    }

    // Job proficiencies
    for (let i = 0; i < generatedJob.proficiencies.length; i++) {
      if (!generatedProficiencies.includes(generatedJob.proficiencies[i])) {
        generatedProficiencies.push(generatedJob.proficiencies[i]);
      }
    }

    // Trait proficiencies

    // Add stat values
    const proficiencyMasterList = [
      ["Acrobatics", Math.floor((generatedDEX - 10) / 2) + proficiencyBonus],
      [
        "Animal Handling",
        Math.floor((generatedWIS - 10) / 2) + proficiencyBonus,
      ],
      ["Arcana", Math.floor((generatedINT - 10) / 2) + proficiencyBonus],
      ["Athletics", Math.floor((generatedSTR - 10) / 2) + proficiencyBonus],
      ["Deception", Math.floor((generatedCHA - 10) / 2) + proficiencyBonus],
      ["History", Math.floor((generatedINT - 10) / 2) + proficiencyBonus],
      ["Insight", Math.floor((generatedWIS - 10) / 2) + proficiencyBonus],
      ["Intimidation", Math.floor((generatedCHA - 10) / 2) + proficiencyBonus],
      ["Investigation", Math.floor((generatedINT - 10) / 2) + proficiencyBonus],
      ["Medicine", Math.floor((generatedWIS - 10) / 2) + proficiencyBonus],
      ["Nature", Math.floor((generatedINT - 10) / 2) + proficiencyBonus],
      ["Perception", Math.floor((generatedWIS - 10) / 2) + proficiencyBonus],
      ["Performance", Math.floor((generatedCHA - 10) / 2) + proficiencyBonus],
      ["Persuasion", Math.floor((generatedCHA - 10) / 2) + proficiencyBonus],
      ["Religion", Math.floor((generatedINT - 10) / 2) + proficiencyBonus],
      [
        "Sleight of Hand",
        Math.floor((generatedDEX - 10) / 2) + proficiencyBonus,
      ],
      ["Stealth", Math.floor((generatedDEX - 10) / 2) + proficiencyBonus],
      ["Survival", Math.floor((generatedWIS - 10) / 2) + proficiencyBonus],
    ];

    for (let i = 0; i < generatedProficiencies.length; i++) {
      for (let j = 0; j < proficiencyMasterList.length; j++) {
        if (generatedProficiencies[i] === proficiencyMasterList[j][0]) {
          generatedProficiencies[i] =
            proficiencyMasterList[j][0] +
            " " +
            (proficiencyMasterList[j][1] >= 0 ? "+" : "") +
            proficiencyMasterList[j][1];
        }
      }
    }

    // GENERATE SAVING THROWS
    // race
    let generatedSavingThrows = [];
    if (generatedRace.hasOwnProperty("savingThrows")) {
      generatedSavingThrows.push(...generatedRace.savingThrows);
    }

    // job
    for (let i = 0; i < generatedJob.savingThrows.length; i++) {
      if (!generatedSavingThrows.includes(generatedJob.savingThrows[i])) {
        generatedSavingThrows.push(generatedJob.savingThrows[i]);
      }
    }

    // traits

    // add stat values
    for (let i = 0; i < generatedSavingThrows.length; i++) {
      if (generatedSavingThrows[i] === "STR") {
        generatedSavingThrows[i] =
          generatedSavingThrows[i] +
          " " +
          (Math.floor((generatedSTR - 10) / 2) + proficiencyBonus >= 0
            ? "+"
            : "") +
          (Math.floor((generatedSTR - 10) / 2) + proficiencyBonus);
      } else if (generatedSavingThrows[i] === "DEX") {
        generatedSavingThrows[i] =
          generatedSavingThrows[i] +
          " " +
          (Math.floor((generatedDEX - 10) / 2) + proficiencyBonus >= 0
            ? "+"
            : "") +
          (Math.floor((generatedDEX - 10) / 2) + proficiencyBonus);
      } else if (generatedSavingThrows[i] === "CON") {
        generatedSavingThrows[i] =
          generatedSavingThrows[i] +
          " " +
          (Math.floor((generatedCON - 10) / 2) + proficiencyBonus >= 0
            ? "+"
            : "") +
          (Math.floor((generatedCON - 10) / 2) + proficiencyBonus);
      } else if (generatedSavingThrows[i] === "INT") {
        generatedSavingThrows[i] =
          generatedSavingThrows[i] +
          " " +
          (Math.floor((generatedINT - 10) / 2) + proficiencyBonus >= 0
            ? "+"
            : "") +
          (Math.floor((generatedINT - 10) / 2) + proficiencyBonus);
      } else if (generatedSavingThrows[i] === "WIS") {
        generatedSavingThrows[i] =
          generatedSavingThrows[i] +
          " " +
          (Math.floor((generatedWIS - 10) / 2) + proficiencyBonus >= 0
            ? "+"
            : "") +
          (Math.floor((generatedWIS - 10) / 2) + proficiencyBonus);
      } else if (generatedSavingThrows[i] === "CHA") {
        generatedSavingThrows[i] =
          generatedSavingThrows[i] +
          " " +
          (Math.floor((generatedCHA - 10) / 2) + proficiencyBonus >= 0
            ? "+"
            : "") +
          (Math.floor((generatedCHA - 10) / 2) + proficiencyBonus);
      }
    }

    // SET DATA
    // setResultData({
    //   ...resultData,
    //   resultGender: generatedGender,
    //   resultName: generatedName,
    //   resultAge: generatedAge,
    //   resultAgeType: generatedAgeType,
    //   resultRace: generatedRace,
    //   resultJob: generatedJob,
    //   resultHook: generatedHook,
    //   resultTraits: {
    //     positive: generatedPosTraits,
    //     neutral: generatedNeuTraits,
    //     negative: generatedNegTraits,
    //   },
    //   resultVoice: generatedVoice,
    //   resultAppearance: generatedAppearance,
    //   resultStats: {
    //     AC: generatedAC,
    //     HP: generatedHP,
    //     speed: generatedSpeed,
    //     STR: generatedSTR,
    //     DEX: generatedDEX,
    //     CON: generatedCON,
    //     INT: generatedINT,
    //     WIS: generatedWIS,
    //     CHA: generatedCHA,
    //     CR: -1,
    //   },
    //   showResults: true,
    // });

    npcList.push({
      resultGender: generatedGender,
      resultName: generatedName,
      resultAge: generatedAge,
      resultAgeType: generatedAgeType,
      resultRace: generatedRace,
      resultJob: generatedJob,
      resultHook: generatedHook,
      resultTraits: {
        universal: generatedUniTraits,
        // positive: generatedPosTraits,
        // neutral: generatedNeuTraits,
        // negative: generatedNegTraits,
      },
      resultVoice: generatedVoice,
      resultAppearance: generatedAppearance,
      resultProficiencies: generatedProficiencies,
      resultSavingThrows: generatedSavingThrows,
      resultStats: {
        AC: generatedAC,
        HP: generatedHP,
        speed: generatedSpeed,
        STR: generatedSTR,
        DEX: generatedDEX,
        CON: generatedCON,
        INT: generatedINT,
        WIS: generatedWIS,
        CHA: generatedCHA,
        CR: -1,
      },
      baseStats: generatedBaseStats,
      showResults: true,
    });
    if (npcList.length > 20) {
      npcList.shift();
    }

    setListData({
      ...listData,
      currentNPCindex: npcList.length - 1,
    });
    setResultData(npcList[npcList.length - 1]);
  };

  const onDownload = () => {
    var node = document.getElementById("my-node");

    domtoimage
      .toJpeg(document.getElementById("my-node"), { quality: 1 })
      .then(function (dataUrl) {
        var link = document.createElement("a");
        link.download = "NPC " + resultName + ", " + resultJob.name + ".jpeg";
        link.href = dataUrl;
        link.click();
      })
      .catch(function (error) {
        console.error("oops, something went wrong!", error);
      });
  };

  const onExport = () => {
    const text = JSON.stringify(resultData, null, 2);
    var element = document.createElement("a");
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + encodeURIComponent(text)
    );
    element.setAttribute(
      "download",
      "NPC " + resultName + ", " + resultJob.name
    );

    element.style.display = "none";
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);
  };

  const onImport = async (event) => {
    try {
      const character = await event.target.files[0].text();
      setResultData(JSON.parse(character));
      setListData({
        ...listData,
        npcList: npcList.map((npc, index) =>
          index === currentNPCindex ? JSON.parse(character) : npc
        ),
      });
      // npcList[currentNPCindex] = JSON.parse(character);
    } catch (error) {
      setModifierData({
        ...modifierData,
        importError: "oops, something went wrong! " + error,
      });
      console.error("oops, something went wrong!", error);
    }
  };

  return (
    <div className="mb-4">
      {/* <AdComponent path="test" /> */}
      {/* <AdSense.Google client="ca-pub-8996586400495676" slot="8142577961" /> */}
      {/* 1ST GENERATE BUTTON */}
      <div className="text-center m-2 mt-4">
        <button
          type="button"
          className="btn btn-success btn-rounded px-3 py-2"
          onClick={() => {
            onGenerate();
            gaEventTracker("generate");
          }}
        >
          Generate
        </button>
      </div>

      {/* MODIFIERS */}
      <div className="card bg-dark">
        <h5 className="card-header">
          <a
            className="btn collapsed d-block text-white"
            data-bs-toggle="collapse"
            href="#collapseExample"
            role="button"
            aria-expanded="false"
            aria-controls="collapseExample"
            id="heading-collapsed"
          >
            Modifiers &nbsp;
            <FaChevronLeft className="fa" />
          </a>
        </h5>
        <div
          id="collapseExample"
          className="collapse"
          aria-labelledby="heading-collapsed"
        >
          <div className="text-center m-2">
            <button
              type="button"
              className="btn btn-danger btn-rounded px-3 py-2"
              onClick={(e) => {
                setListData({
                  ...listData,
                  genderList: genders,
                  nameList: names.human,
                  raceList: races.sort(function (a, b) {
                    return a.name > b.name ? 1 : b.name > a.name ? -1 : 0;
                  }),
                  jobsList: jobs.sort(function (a, b) {
                    return a.name > b.name ? 1 : b.name > a.name ? -1 : 0;
                  }),
                });
                setModifierData({
                  ...modifierData,
                  allowedAges: {
                    child: false,
                    adult: true,
                    elderly: true,
                  },
                  traitAmount: {
                    universal: 3,
                    positive: 1,
                    neutral: 1,
                    negative: 1,
                  },
                  powerLevel: 3,
                  powerVariance: 3,
                  proficiencyBonus: 2,
                  capStats: true,
                });
              }}
            >
              Reset Modifiers
            </button>
          </div>

          <div className="card modifier-heading text-white">
            <div className="card-header text-center">Gender</div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item modifier-body text-white">
                <div className=" w-75 m-auto">
                  {genderList.map((gender, index) => (
                    <div className="form-check col-sm-4 d-sm-inline-flex">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id={"flexCheckChecked" + gender.type}
                        checked={gender.defaultCheckbox}
                        onChange={(e) => {
                          setListData({
                            ...listData,
                            genderList: [
                              ...genderList.filter(
                                (item) => item.type !== gender.type
                              ),
                              {
                                ...gender,
                                defaultCheckbox: !gender.defaultCheckbox,
                              },
                            ].sort((a, b) => a.index - b.index),
                          });
                        }}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={"flexCheckChecked" + gender.type}
                      >
                        &nbsp;{gender.type}
                      </label>
                    </div>
                  ))}
                </div>
              </li>
            </ul>
          </div>
          <div className="card modifier-heading text-white">
            <div className="card-header text-center">Race</div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item modifier-body text-white">
                <div className=" w-75 m-auto">
                  {raceList.map((race, index) => (
                    <div className="form-check col-sm-4 d-sm-inline-flex">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id={"flexCheckChecked" + race.name}
                        checked={race.defaultCheckbox}
                        onChange={(e) => {
                          setListData({
                            ...listData,
                            raceList: [
                              ...raceList.filter(
                                (item) => item.name !== race.name
                              ),
                              {
                                ...race,
                                defaultCheckbox: !race.defaultCheckbox,
                              },
                            ].sort(function (a, b) {
                              return a.name > b.name
                                ? 1
                                : b.name > a.name
                                ? -1
                                : 0;
                            }),
                          });
                        }}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={"flexCheckChecked" + race.name}
                      >
                        &nbsp;{race.name}
                      </label>
                    </div>
                  ))}
                  {raceList.filter((race) => race.defaultCheckbox).length ===
                  0 ? (
                    <p className="text-center text-danger">
                      If no race is selected a random race will be chosen
                    </p>
                  ) : null}
                </div>
                <div className="text-center m-2">
                  <button
                    type="button"
                    className="btn btn-danger btn-rounded px-3 py-2 m-1"
                    onClick={(e) => {
                      setListData({
                        ...listData,
                        raceList: raceList
                          .map((race, index) => ({
                            ...race,
                            defaultCheckbox: false,
                          }))
                          .sort(function (a, b) {
                            return a.name > b.name
                              ? 1
                              : b.name > a.name
                              ? -1
                              : 0;
                          }),
                      });
                    }}
                  >
                    Unselect All
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-rounded px-3 py-2 m-1"
                    onClick={(e) => {
                      setListData({
                        ...listData,
                        raceList: raceList
                          .map((race, index) => ({
                            ...race,
                            defaultCheckbox: true,
                          }))
                          .sort(function (a, b) {
                            return a.name > b.name
                              ? 1
                              : b.name > a.name
                              ? -1
                              : 0;
                          }),
                      });
                    }}
                  >
                    Select All
                  </button>
                </div>
              </li>
            </ul>
          </div>
          <div className="card modifier-heading text-white">
            <div className="card-header text-center">Age</div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item modifier-body text-white">
                <div className=" w-75 m-auto">
                  <div className="form-check col-sm-4 d-sm-inline-flex">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value=""
                      id="flexCheckCheckedChild"
                      checked={modifierData.allowedAges.child}
                      onChange={(e) => {
                        setModifierData({
                          ...modifierData,
                          allowedAges: {
                            ...allowedAges,
                            child: !allowedAges.child,
                          },
                        });
                      }}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexCheckCheckedChild"
                    >
                      &nbsp;Child
                    </label>
                  </div>
                  <div className="form-check col-sm-4 d-sm-inline-flex">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value=""
                      id="flexCheckCheckedAdult"
                      checked={modifierData.allowedAges.adult}
                      onChange={(e) => {
                        setModifierData({
                          ...modifierData,
                          allowedAges: {
                            ...allowedAges,
                            adult: !allowedAges.adult,
                          },
                        });
                      }}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexCheckCheckedAdult"
                    >
                      &nbsp;Adult
                    </label>
                  </div>
                  <div className="form-check col-sm-4 d-sm-inline-flex">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      value=""
                      id="flexCheckCheckedElderly"
                      checked={modifierData.allowedAges.elderly}
                      onChange={(e) => {
                        setModifierData({
                          ...modifierData,
                          allowedAges: {
                            ...allowedAges,
                            elderly: !allowedAges.elderly,
                          },
                        });
                      }}
                    />
                    <label
                      className="form-check-label"
                      htmlFor="flexCheckCheckedElderly"
                    >
                      &nbsp;Elderly
                    </label>
                  </div>
                  {!allowedAges.child &&
                  !allowedAges.adult &&
                  !allowedAges.elderly ? (
                    <p className="text-center text-danger">
                      If no age is selected then any age within their lifespan
                      will be chosen
                    </p>
                  ) : null}
                </div>
              </li>
            </ul>
          </div>
          <div className="card modifier-heading text-white">
            <div className="card-header text-center">Jobs</div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item modifier-body text-white">
                <div className=" w-75 m-auto">
                  {jobsList.map((job, index) => (
                    <div className="form-check col-sm-4 d-sm-inline-flex">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value=""
                        id={"flexCheckChecked" + job.name}
                        checked={job.defaultCheckbox}
                        onChange={(e) => {
                          setListData({
                            ...listData,
                            jobsList: [
                              ...jobsList.filter(
                                (item) => item.name !== job.name
                              ),
                              {
                                ...job,
                                defaultCheckbox: !job.defaultCheckbox,
                              },
                            ].sort(function (a, b) {
                              return a.name > b.name
                                ? 1
                                : b.name > a.name
                                ? -1
                                : 0;
                            }),
                          });
                        }}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={"flexCheckChecked" + job.name}
                      >
                        &nbsp;{job.name}
                      </label>
                    </div>
                  ))}
                  {jobsList.filter((job) => job.defaultCheckbox).length ===
                  0 ? (
                    <p className="text-center text-danger">
                      If no job is selected then Unemployed will be chosen
                    </p>
                  ) : null}
                </div>
                <div className="text-center m-2">
                  <button
                    type="button"
                    className="btn btn-danger btn-rounded px-3 py-2 m-1"
                    onClick={(e) => {
                      setListData({
                        ...listData,
                        jobsList: jobsList
                          .map((job, index) =>
                            job.name === "Unemployed"
                              ? { ...job, defaultCheckbox: true }
                              : {
                                  ...job,
                                  defaultCheckbox: false,
                                }
                          )
                          .sort(function (a, b) {
                            return a.name > b.name
                              ? 1
                              : b.name > a.name
                              ? -1
                              : 0;
                          }),
                      });
                    }}
                  >
                    Unselect All
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary btn-rounded px-3 py-2 m-1"
                    onClick={(e) => {
                      setListData({
                        ...listData,
                        jobsList: jobsList
                          .map((job, index) => ({
                            ...job,
                            defaultCheckbox: true,
                          }))
                          .sort(function (a, b) {
                            return a.name > b.name
                              ? 1
                              : b.name > a.name
                              ? -1
                              : 0;
                          }),
                      });
                    }}
                  >
                    Select All
                  </button>
                </div>
              </li>
            </ul>
          </div>
          <div className="card modifier-heading text-white">
            <div className="card-header text-center">Traits</div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item modifier-body text-white">
                <div className="form-floating my-2 w-50 m-auto">
                  <input
                    type="number"
                    className="form-control"
                    id="floatingInput"
                    value={traitAmount.universal}
                    min="0"
                    max={
                      traits.positive.length +
                      traits.neutral.length +
                      traits.negative.length
                    }
                    onChange={(e) => {
                      setModifierData({
                        ...modifierData,
                        traitAmount: {
                          ...traitAmount,
                          universal: parseInt(e.target.value, 10),
                        },
                      });
                    }}
                  />
                  <label
                    htmlFor="floatingInput"
                    className="text-dark"
                    // style={{ color: "rgb(0,0,75)" }}
                  >
                    Num Traits
                  </label>
                </div>
                {traitAmount.universal ===
                traits.positive.length +
                  traits.neutral.length +
                  traits.negative.length ? (
                  <div className="w-50 m-auto text-danger">
                    This is the total number of traits in the pool, although
                    this amount cannot be generated as some traits are mutually
                    exclusive
                  </div>
                ) : null}
                {/* <div className="form-floating my-2 w-50 m-auto">
                  <input
                    type="number"
                    className="form-control"
                    id="floatingInput"
                    value={traitAmount.positive}
                    min="0"
                    max={traits.positive.length}
                    onChange={(e) => {
                      setModifierData({
                        ...modifierData,
                        traitAmount: {
                          ...traitAmount,
                          positive: parseInt(e.target.value, 10),
                        },
                      });
                    }}
                  />
                  <label
                    htmlFor="floatingInput"
                    style={{ color: "rgb(0,75,0)" }}
                  >
                    Positive Traits
                  </label>
                </div>
                {traitAmount.positive === traits.positive.length ? (
                  <div className="w-50 m-auto text-danger">
                    This is the total number of traits in this pool, although
                    this amount cannot be generated as some traits are mutually
                    exclusive
                  </div>
                ) : null}
                <div className="form-floating my-2 w-50 m-auto">
                  <input
                    type="number"
                    className="form-control"
                    id="floatingInput"
                    value={traitAmount.neutral}
                    min="0"
                    max={traits.neutral.length}
                    onChange={(e) => {
                      setModifierData({
                        ...modifierData,
                        traitAmount: {
                          ...traitAmount,
                          neutral: parseInt(e.target.value, 10),
                        },
                      });
                    }}
                  />
                  <label
                    htmlFor="floatingInput"
                    style={{ color: "rgb(0,0,0)" }}
                  >
                    Neutral Traits
                  </label>
                </div>
                {traitAmount.neutral === traits.neutral.length ? (
                  <div className="w-50 m-auto text-danger">
                    This is the total number of traits in this pool, although
                    this amount cannot be generated as some traits are mutually
                    exclusive
                  </div>
                ) : null}
                <div className="form-floating my-2 w-50 m-auto">
                  <input
                    type="number"
                    className="form-control"
                    id="floatingInput"
                    value={traitAmount.negative}
                    min="0"
                    max={traits.negative.length}
                    onChange={(e) => {
                      setModifierData({
                        ...modifierData,
                        traitAmount: {
                          ...traitAmount,
                          negative: parseInt(e.target.value, 10),
                        },
                      });
                    }}
                  />
                  <label
                    htmlFor="floatingInput"
                    style={{ color: "rgb(75,0,0)" }}
                  >
                    Negative Traits
                  </label>
                </div>
                {traitAmount.negative === traits.negative.length ? (
                  <div className="w-50 m-auto text-danger">
                    This is the total number of traits in this pool, although
                    this amount cannot be generated as some traits are mutually
                    exclusive
                  </div>
                ) : null} */}
              </li>
            </ul>
          </div>
          <div className="card modifier-heading text-white">
            <div className="card-header text-center">Power</div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item modifier-body text-white text-center">
                <label htmlFor="customRange3" className="form-label">
                  Base Stat Value: {(powerLevel - 3) * 2 + 10}
                </label>
                <div>Hit Dice: {powerLevel}</div>
                <div className="w-50 m-auto">
                  <input
                    // defaultValue={powerLevel}
                    value={powerLevel}
                    onChange={(e) => {
                      setModifierData({
                        ...modifierData,
                        powerLevel: parseInt(e.target.value, 10),
                      });
                    }}
                    type="range"
                    className="form-range"
                    min="1"
                    max="5"
                    step="1"
                    id="customRange3"
                  />
                </div>
                <label htmlFor="customRange4" className="form-label">
                  Base Stat Value Variance: &plusmn;{powerVariance}
                </label>
                <div className="w-50 m-auto">
                  <input
                    // defaultValue={powerVariance}
                    value={powerVariance}
                    onChange={(e) => {
                      setModifierData({
                        ...modifierData,
                        powerVariance: parseInt(e.target.value, 10),
                      });
                    }}
                    type="range"
                    className="form-range"
                    min="2"
                    max="6"
                    step="1"
                    id="customRange4"
                  />
                </div>
                <label htmlFor="customRange4" className="form-label">
                  Proficiency Bonus: +{proficiencyBonus}
                </label>
                <div className="w-50 m-auto">
                  <input
                    // defaultValue={proficiencyBonus}
                    value={proficiencyBonus}
                    onChange={(e) => {
                      setModifierData({
                        ...modifierData,
                        proficiencyBonus: parseInt(e.target.value, 10),
                      });
                    }}
                    type="range"
                    className="form-range"
                    min="2"
                    max="6"
                    step="1"
                    id="customRange4"
                  />
                </div>
                {capStats ? (
                  <div className="text-center m-2">
                    <button
                      type="button"
                      className="btn btn-danger btn-rounded px-3 py-2"
                      onClick={(e) => {
                        setModifierData({
                          ...modifierData,
                          capStats: !capStats,
                        });
                      }}
                    >
                      Uncap Stats
                    </button>
                  </div>
                ) : (
                  <div className="text-center m-2">
                    <button
                      type="button"
                      className="btn btn-primary btn-rounded px-3 py-2"
                      onClick={(e) => {
                        setModifierData({
                          ...modifierData,
                          capStats: !capStats,
                        });
                      }}
                    >
                      Cap Stats
                    </button>
                    <div className="text-center text-danger mt-2">
                      Uncapped may generate negative stat values or values over
                      20
                    </div>
                  </div>
                )}
              </li>
            </ul>
          </div>
          <div className="card modifier-heading text-white">
            <div className="card-header text-center">Result Settings</div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item modifier-body text-white">
                <div className="row">
                  <div className="col-sm-4">
                    {showLocks ? (
                      <div className="text-center m-2">
                        <button
                          type="button"
                          className="btn btn-danger btn-rounded px-3 py-2"
                          onClick={(e) => {
                            setModifierData({
                              ...modifierData,
                              showLocks: !showLocks,
                            });
                          }}
                        >
                          Hide Locks
                        </button>
                      </div>
                    ) : (
                      <div className="text-center m-2">
                        <button
                          type="button"
                          className="btn btn-primary btn-rounded px-3 py-2"
                          onClick={(e) => {
                            setModifierData({
                              ...modifierData,
                              showLocks: !showLocks,
                            });
                          }}
                        >
                          Show Locks
                        </button>
                        <div className="text-center text-danger mt-2">
                          Locks are still active while they are hidden
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="col-sm-4">
                    {showVoiceLinks ? (
                      <div className="text-center m-2">
                        <button
                          type="button"
                          className="btn btn-danger btn-rounded px-3 py-2"
                          onClick={(e) => {
                            setModifierData({
                              ...modifierData,
                              showVoiceLinks: !showVoiceLinks,
                            });
                          }}
                        >
                          Hide Voice Links
                        </button>
                      </div>
                    ) : (
                      <div className="text-center m-2">
                        <button
                          type="button"
                          className="btn btn-primary btn-rounded px-3 py-2"
                          onClick={(e) => {
                            setModifierData({
                              ...modifierData,
                              showVoiceLinks: !showVoiceLinks,
                            });
                          }}
                        >
                          Show Voice Links
                        </button>
                      </div>
                    )}
                  </div>
                  <div className="col-sm-4">
                    {showStatCalc ? (
                      <div className="text-center m-2">
                        <button
                          type="button"
                          className="btn btn-danger btn-rounded px-3 py-2"
                          onClick={(e) => {
                            setModifierData({
                              ...modifierData,
                              showStatCalc: !showStatCalc,
                            });
                          }}
                        >
                          Hide Stat Calculation
                        </button>
                      </div>
                    ) : (
                      <div className="text-center m-2">
                        <button
                          type="button"
                          className="btn btn-primary btn-rounded px-3 py-2"
                          onClick={(e) => {
                            setModifierData({
                              ...modifierData,
                              showStatCalc: !showStatCalc,
                            });
                          }}
                        >
                          Show Stat Calculation
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 2ND GENERATE BUTTON */}
      <div className="text-center row my-2">
        <div className="col text-end">
          {currentNPCindex !== 0 ? (
            <button
              type="button"
              className="btn btn-primary btn-rounded px-2 py-2 mx-1"
              onClick={(e) => {
                setListData({
                  ...listData,
                  currentNPCindex: currentNPCindex - 1,
                });
                setResultData(npcList[currentNPCindex - 1]);
              }}
            >
              <div className="row px-2">
                <div className="col-sm-6 px-1 order-2 order-sm-1">{"<--"}</div>
                <div className="col-sm-6 px-1 order-1 order-sm-2">Prev</div>
              </div>
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary btn-rounded px-2 py-2 mx-1"
              disabled
            >
              <div className="row px-2">
                <div className="col-sm-6 px-1 order-2 order-sm-1">{"<--"}</div>
                <div className="col-sm-6 px-1 order-1 order-sm-2">Prev</div>
              </div>
            </button>
          )}
        </div>

        <div className="col m-auto">
          <button
            type="button"
            className="btn btn-success btn-rounded px-3 py-2 mx-1"
            onClick={() => {
              onGenerate();
              gaEventTracker("generate");
            }}
          >
            Generate
          </button>
        </div>
        <div className="col text-start">
          {currentNPCindex < npcList.length - 1 ? (
            <button
              type="button"
              className="btn btn-primary btn-rounded px-2 py-2 mx-1"
              onClick={(e) => {
                setListData({
                  ...listData,
                  currentNPCindex: currentNPCindex + 1,
                });
                setResultData(npcList[currentNPCindex + 1]);
              }}
            >
              <div className="row px-2">
                <div className="col-sm-6 px-1">Next</div>
                <div className="col-sm-6 px-1">{"-->"}</div>
              </div>
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary btn-rounded px-2 py-2 mx-1"
              disabled
            >
              <div className="row px-2">
                <div className="col-sm-6 px-1">Next</div>
                <div className="col-sm-6 px-1">{"-->"}</div>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* NPC LIST */}
      <div className="row justify-content-center">
        <div className="col text-white text-center">
          <hr />
        </div>
        <div className="col-auto text-white text-center">
          <a
            className="btn d-block text-white"
            data-bs-toggle="collapse"
            href="#collapseExample2"
            role="button"
            aria-expanded="false"
            aria-controls="collapseExample2"
            id="heading-collapsed"
          >
            NPC List &nbsp;
            <FaChevronLeft className="fa2" />
          </a>
        </div>
        <div className="col text-white text-center">
          <hr />
        </div>
      </div>
      <div
        id="collapseExample2"
        className="border npc-list-border rounded my-2 text-white fs-6 collapse show"
        aria-labelledby="heading-collapsed"
      >
        <div className="row">
          <div className="col-md-6">
            {npcList.map((npc, index) =>
              index > 9 ? null : currentNPCindex === index ? (
                <div className="my-1 mx-2 px-2 py-1 npc-list npc-list-active rounded row">
                  <div className="col-1">{index + 1}.</div>
                  <div className="col-4">{npc.resultName}</div>
                  <div className="col-4">{npc.resultRace.name}</div>
                  <div className="col-3 ">{npc.resultJob.name}</div>
                </div>
              ) : (
                <div
                  className="my-1 mx-2 px-2 py-1 npc-list row"
                  onClick={() => {
                    setResultData(npcList[index]);
                    setListData({
                      ...listData,
                      currentNPCindex: index,
                    });
                  }}
                >
                  <div className="col-1">{index + 1}.</div>
                  <div className="col-4">{npc.resultName}</div>
                  <div className="col-4">{npc.resultRace.name}</div>
                  <div className="col-3 ">{npc.resultJob.name}</div>
                </div>
              )
            )}
          </div>
          <div className="col-md-6">
            {npcList.map((npc, index) =>
              index < 10 ? null : currentNPCindex === index ? (
                <div className="my-1 mx-2 px-2 py-1 npc-list npc-list-active rounded row">
                  <div className="col-1">{index + 1}.</div>
                  <div className="col-4">{npc.resultName}</div>
                  <div className="col-4">{npc.resultRace.name}</div>
                  <div className="col-3 ">{npc.resultJob.name}</div>
                </div>
              ) : (
                <div
                  className="my-1 mx-2 px-2 py-1 npc-list row"
                  onClick={() => {
                    setResultData(npcList[index]);
                    setListData({
                      ...listData,
                      currentNPCindex: index,
                    });
                  }}
                >
                  <div className="col-1">{index + 1}.</div>
                  <div className="col-4">{npc.resultName}</div>
                  <div className="col-4">{npc.resultRace.name}</div>
                  <div className="col-3 ">{npc.resultJob.name}</div>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      <div id="my-node">
        {/* RESULTS */}
        {showResults ? (
          <div>
            <div className="row justify-content-center">
              <div className="col text-white text-center">
                <hr />
              </div>
              <div className="col-auto text-white text-center sectionText">
                Blurb
              </div>
              <div className="col text-white text-center">
                <hr />
              </div>
            </div>
            <div className="text-white">
              {resultName} is a {resultGender.type} {resultRace.name},{" "}
              {resultGender.pronounSubject} {resultGender.collectiveNoun}{" "}
              {resultAge} years old, and works as a {resultJob.name}.
            </div>
            <div className="text-white">
              {resultGender.pronounSubject} {resultGender.collectiveNoun}{" "}
              {resultAppearance.weight} and {resultAppearance.height} for a{" "}
              {resultRace.name}, standing at{" "}
              {Math.floor(resultAppearance.heightInches / 12)}'
              {Math.floor(resultAppearance.heightInches % 12)}".{" "}
              {resultGender.pronounSubject} {resultGender.possessiveNoun}{" "}
              {resultAppearance.skinColour} coloured {resultAppearance.skinType}
              .
              {resultAppearance.hairStyle !== "Bald"
                ? " " +
                  resultGender.pronounPossessive +
                  " hair is " +
                  resultAppearance.hairColour +
                  " coloured and styled as " +
                  resultAppearance.hairStyle
                : " " +
                  resultGender.pronounSubject +
                  " " +
                  resultGender.collectiveNoun +
                  " " +
                  resultAppearance.hairStyle}
              {resultAppearance.facialHairStyle === "No Facial Hair"
                ? "."
                : ", and has " +
                  resultGender.pronounPossessive +
                  " facial hair in the style of " +
                  resultAppearance.facialHairStyle +
                  "."}{" "}
              {resultGender.pronounSubject} {resultGender.collectiveNoun}{" "}
              wearing {resultAppearance.underClothing}
              {resultAppearance.overClothing === "Nothing"
                ? "."
                : ", over which " +
                  resultGender.pronounSubject +
                  " " +
                  resultGender.collectiveNoun +
                  " wearing a " +
                  resultAppearance.overClothing +
                  "."}{" "}
              In addition, {resultGender.pronounSubject}{" "}
              {resultGender.collectiveNoun} adorned with{" "}
              {resultAppearance.accessory}.
            </div>
            <div className="text-white">{resultHook[1]}</div>
            <div className="row">
              <div className="col-lg-6">
                <div className="row justify-content-center">
                  <div className="col text-white text-center">
                    <hr />
                  </div>
                  <div className="col-auto text-white text-center sectionText">
                    General
                  </div>
                  <div className="col text-white text-center">
                    <hr />
                  </div>
                </div>
                <table className="table table-borderless">
                  <tbody>
                    <tr>
                      <td
                        className="resultAttribute text-end pe-3"
                        style={{ width: "50%" }}
                      >
                        Name&emsp;
                        {showLocks ? (
                          nameLock ? (
                            <FaLock
                              className="lock text-warning"
                              onClick={(e) => {
                                setLockData({
                                  ...lockData,
                                  nameLock: !nameLock,
                                });
                              }}
                            />
                          ) : (
                            <FaLockOpen
                              className="lock text-success"
                              onClick={(e) => {
                                setLockData({
                                  ...lockData,
                                  nameLock: !nameLock,
                                });
                              }}
                            />
                          )
                        ) : null}
                      </td>
                      <td className="resultText ps-2" style={{ width: "50%" }}>
                        <textarea
                          className="text-white"
                          type="text"
                          value={resultName}
                          style={{
                            backgroundColor: "rgb(33, 33, 33)",
                            textDecoration: "underline",
                            textDecorationColor: "#0275d8",
                            border: "none",
                            borderBottom: "none",
                          }}
                          onChange={(e) => {
                            setResultData({
                              ...resultData,
                              resultName: e.target.value,
                            });
                            setListData({
                              ...listData,
                              npcList: npcList.map((npc, index) =>
                                index === currentNPCindex
                                  ? {
                                      ...npc,
                                      resultName: e.target.value,
                                    }
                                  : npc
                              ),
                            });
                          }}
                        />
                      </td>
                    </tr>
                    <tr>
                      <td
                        className="resultAttribute text-end pe-3"
                        style={{ width: "50%" }}
                      >
                        Gender&emsp;
                        {showLocks ? (
                          genderLock ? (
                            <FaLock
                              className="lock text-warning"
                              onClick={(e) => {
                                setLockData({
                                  ...lockData,
                                  genderLock: !genderLock,
                                });
                              }}
                            />
                          ) : (
                            <FaLockOpen
                              className="lock text-success"
                              onClick={(e) => {
                                setLockData({
                                  ...lockData,
                                  genderLock: !genderLock,
                                });
                              }}
                            />
                          )
                        ) : null}
                      </td>
                      <td className="resultText ps-2" style={{ width: "50%" }}>
                        {resultGender.type}
                      </td>
                    </tr>
                    <tr>
                      <td
                        className="resultAttribute text-end pe-3"
                        style={{ width: "50%" }}
                      >
                        Race&emsp;
                        {showLocks ? (
                          raceLock ? (
                            <FaLock
                              className="lock text-warning"
                              onClick={(e) => {
                                setLockData({
                                  ...lockData,
                                  raceLock: !raceLock,
                                });
                              }}
                            />
                          ) : (
                            <FaLockOpen
                              className="lock text-success"
                              onClick={(e) => {
                                setLockData({
                                  ...lockData,
                                  raceLock: !raceLock,
                                });
                              }}
                            />
                          )
                        ) : null}
                      </td>
                      <td className="resultText ps-2" style={{ width: "50%" }}>
                        {resultRace.name}
                      </td>
                    </tr>
                    <tr>
                      <td
                        className="resultAttribute text-end pe-3"
                        style={{ width: "50%" }}
                      >
                        Age&emsp;
                        {showLocks ? (
                          ageLock ? (
                            <FaLock
                              className="lock text-warning"
                              onClick={(e) => {
                                setLockData({
                                  ...lockData,
                                  ageLock: !ageLock,
                                });
                              }}
                            />
                          ) : (
                            <FaLockOpen
                              className="lock text-success"
                              onClick={(e) => {
                                setLockData({
                                  ...lockData,
                                  ageLock: !ageLock,
                                });
                              }}
                            />
                          )
                        ) : null}
                      </td>
                      <td className="resultText ps-2" style={{ width: "50%" }}>
                        {resultAge} ({resultAgeType})
                      </td>
                    </tr>
                    <tr>
                      <td
                        className="resultAttribute text-end pe-3"
                        style={{ width: "50%" }}
                      >
                        Job&emsp;
                        {showLocks ? (
                          jobLock ? (
                            <FaLock
                              className="lock text-warning"
                              onClick={(e) => {
                                setLockData({
                                  ...lockData,
                                  jobLock: !jobLock,
                                });
                              }}
                            />
                          ) : (
                            <FaLockOpen
                              className="lock text-success"
                              onClick={(e) => {
                                setLockData({
                                  ...lockData,
                                  jobLock: !jobLock,
                                });
                              }}
                            />
                          )
                        ) : null}
                      </td>
                      <td className="resultText ps-2" style={{ width: "50%" }}>
                        {resultJob.name}
                      </td>
                    </tr>
                    {resultHook[1] !== "" ? (
                      <tr>
                        <td
                          className="resultAttribute text-end pe-3"
                          style={{ width: "50%" }}
                        >
                          Story Hook&emsp;
                          {showLocks ? (
                            hookLock ? (
                              <FaLock
                                className="lock text-warning"
                                onClick={(e) => {
                                  setLockData({
                                    ...lockData,
                                    hookLock: !hookLock,
                                  });
                                }}
                              />
                            ) : (
                              <FaLockOpen
                                className="lock text-success"
                                onClick={(e) => {
                                  setLockData({
                                    ...lockData,
                                    hookLock: !hookLock,
                                  });
                                }}
                              />
                            )
                          ) : null}
                        </td>
                        <td
                          className="resultText ps-2"
                          style={{ width: "50%" }}
                        >
                          {resultHook[0]}
                          {resultHook[1]}
                        </td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
              <div className="col-lg-6">
                {/* TRAITS */}
                <div className="row justify-content-center">
                  <div className="col text-white text-center">
                    <hr />
                  </div>
                  <div className="col-auto text-white text-center sectionText">
                    Traits
                  </div>
                  <div className="col text-white text-center">
                    <hr />
                  </div>
                </div>
                <table className="table table-borderless">
                  <tbody>
                    {resultTraits.universal.map((trait, index) => (
                      <>
                        <tr>
                          <td
                            className="resultText text-end pe-3"
                            style={{ width: "50%" }}
                          >
                            {trait.name}
                            &emsp;
                            {showLocks ? (
                              uniTraitLock[index] ? (
                                <FaLock
                                  className="lock text-warning"
                                  onClick={(e) => {
                                    setLockData({
                                      ...lockData,
                                      uniTraitLock: uniTraitLock.map(
                                        (lock, j) =>
                                          index === j ? !lock : lock
                                      ),
                                    });
                                  }}
                                />
                              ) : (
                                <FaLockOpen
                                  className="lock text-success"
                                  onClick={(e) => {
                                    setLockData({
                                      ...lockData,
                                      uniTraitLock: uniTraitLock.map(
                                        (lock, j) =>
                                          index === j ? !lock : lock
                                      ),
                                    });
                                  }}
                                />
                              )
                            ) : null}
                          </td>
                          <td
                            className="resultText ps-2 pb-0 fw-light text-white-50"
                            style={{ width: "50%" }}
                          >
                            {trait.description}
                          </td>
                        </tr>
                      </>
                    ))}
                    {/* {resultTraits.positive.map((trait, index) => (
                    <>
                      <tr>
                        <td
                          className="resultAttribute text-end pe-3"
                          style={{ width: "50%" }}
                        >
                          {index === 0 ? "Positive Traits" : null}
                          &emsp;
                          {posTraitLock[index] ? (
                            <FaLock
                              className="lock text-warning"
                              onClick={(e) => {
                                setLockData({
                                  ...lockData,
                                  posTraitLock: posTraitLock.map((lock, j) =>
                                    index === j ? !lock : lock
                                  ),
                                });
                              }}
                            />
                          ) : (
                            <FaLockOpen
                              className="lock text-success"
                              onClick={(e) => {
                                setLockData({
                                  ...lockData,
                                  posTraitLock: posTraitLock.map((lock, j) =>
                                    index === j ? !lock : lock
                                  ),
                                });
                              }}
                            />
                          )}
                        </td>
                        <td
                          className="resultText ps-2 pb-0"
                          style={{ width: "50%" }}
                        >
                          {trait.name}
                        </td>
                      </tr>
                      <tr>
                        <td
                          className="resultAttribute text-end pe-3"
                          style={{ width: "50%" }}
                        ></td>
                        <td
                          className="resultText ps-2 pt-0 fw-light text-white-50"
                          style={{ width: "50%" }}
                        >
                          {trait.description}
                        </td>
                      </tr>
                    </>
                  ))}
                  {resultTraits.neutral.map((trait, index) => (
                    <>
                      <tr>
                        <td
                          className="resultAttribute text-end pe-3"
                          style={{ width: "50%" }}
                        >
                          {index === 0 ? "Neutral Traits" : null}
                          &emsp;
                          {neuTraitLock[index] ? (
                            <FaLock
                              className="lock text-warning"
                              onClick={(e) => {
                                setLockData({
                                  ...lockData,
                                  neuTraitLock: neuTraitLock.map((lock, j) =>
                                    index === j ? !lock : lock
                                  ),
                                });
                              }}
                            />
                          ) : (
                            <FaLockOpen
                              className="lock text-success"
                              onClick={(e) => {
                                setLockData({
                                  ...lockData,
                                  neuTraitLock: neuTraitLock.map((lock, j) =>
                                    index === j ? !lock : lock
                                  ),
                                });
                              }}
                            />
                          )}
                        </td>
                        <td
                          className="resultText ps-2 pb-0"
                          style={{ width: "50%" }}
                        >
                          {trait.name}
                        </td>
                      </tr>
                      <tr>
                        <td
                          className="resultAttribute text-end pe-3"
                          style={{ width: "50%" }}
                        ></td>
                        <td
                          className="resultText ps-2 pt-0 fw-light text-white-50"
                          style={{ width: "50%" }}
                        >
                          {trait.description}
                        </td>
                      </tr>
                    </>
                  ))}
                  {resultTraits.negative.map((trait, index) => (
                    <>
                      <tr>
                        <td
                          className="resultAttribute text-end pe-3"
                          style={{ width: "50%" }}
                        >
                          {index === 0 ? "Negative Traits" : null}
                          &emsp;
                          {negTraitLock[index] ? (
                            <FaLock
                              className="lock text-warning"
                              onClick={(e) => {
                                setLockData({
                                  ...lockData,
                                  negTraitLock: negTraitLock.map((lock, j) =>
                                    index === j ? !lock : lock
                                  ),
                                });
                              }}
                            />
                          ) : (
                            <FaLockOpen
                              className="lock text-success"
                              onClick={(e) => {
                                setLockData({
                                  ...lockData,
                                  negTraitLock: negTraitLock.map((lock, j) =>
                                    index === j ? !lock : lock
                                  ),
                                });
                              }}
                            />
                          )}
                        </td>
                        <td
                          className="resultText ps-2 pb-0"
                          style={{ width: "50%" }}
                        >
                          {trait.name}
                        </td>
                      </tr>
                      <tr>
                        <td
                          className="resultAttribute text-end pe-3"
                          style={{ width: "50%" }}
                        ></td>
                        <td
                          className="resultText ps-2 pt-0 fw-light text-white-50"
                          style={{ width: "50%" }}
                        >
                          {trait.description}
                        </td>
                      </tr>
                    </>
                  ))} */}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="row">
              <div className="col-lg-6">
                {/* APPEARANCE */}

                <div className="row justify-content-center">
                  <div className="col text-white text-center">
                    <hr />
                  </div>
                  <div className="col-auto text-white text-center sectionText">
                    Appearance
                  </div>
                  <div className="col text-white text-center">
                    <hr />
                  </div>
                </div>
                <table className="table table-borderless">
                  <tbody>
                    <tr>
                      <td
                        className="resultAttribute text-end pe-3"
                        style={{ width: "50%" }}
                      >
                        {resultAppearance.skinType} Colour&emsp;
                        {showLocks ? (
                          skinColourLock ? (
                            <FaLock
                              className="lock text-warning"
                              onClick={(e) => {
                                setLockData({
                                  ...lockData,
                                  skinColourLock: !skinColourLock,
                                });
                              }}
                            />
                          ) : (
                            <FaLockOpen
                              className="lock text-success"
                              onClick={(e) => {
                                setLockData({
                                  ...lockData,
                                  skinColourLock: !skinColourLock,
                                });
                              }}
                            />
                          )
                        ) : null}
                      </td>
                      <td className="resultText ps-2" style={{ width: "50%" }}>
                        {resultAppearance.skinColour}
                      </td>
                    </tr>
                    <tr>
                      <td
                        className="resultAttribute text-end pe-3"
                        style={{ width: "50%" }}
                      >
                        Hair Style&emsp;
                        {showLocks ? (
                          hairStyleLock ? (
                            <FaLock
                              className="lock text-warning"
                              onClick={(e) => {
                                setLockData({
                                  ...lockData,
                                  hairStyleLock: !hairStyleLock,
                                });
                              }}
                            />
                          ) : (
                            <FaLockOpen
                              className="lock text-success"
                              onClick={(e) => {
                                setLockData({
                                  ...lockData,
                                  hairStyleLock: !hairStyleLock,
                                });
                              }}
                            />
                          )
                        ) : null}
                      </td>
                      <td className="resultText ps-2" style={{ width: "50%" }}>
                        {resultAppearance.hairStyle}
                      </td>
                    </tr>
                    {resultAppearance.hairColour !== "None" ? (
                      <tr>
                        <td
                          className="resultAttribute text-end pe-3"
                          style={{ width: "50%" }}
                        >
                          Hair Colour&emsp;
                          {showLocks ? (
                            hairColourLock ? (
                              <FaLock
                                className="lock text-warning"
                                onClick={(e) => {
                                  setLockData({
                                    ...lockData,
                                    hairColourLock: !hairColourLock,
                                  });
                                }}
                              />
                            ) : (
                              <FaLockOpen
                                className="lock text-success"
                                onClick={(e) => {
                                  setLockData({
                                    ...lockData,
                                    hairColourLock: !hairColourLock,
                                  });
                                }}
                              />
                            )
                          ) : null}
                        </td>
                        <td
                          className="resultText ps-2"
                          style={{ width: "50%" }}
                        >
                          {resultAppearance.hairColour}
                        </td>
                      </tr>
                    ) : null}

                    <tr>
                      <td
                        className="resultAttribute text-end pe-3"
                        style={{ width: "50%" }}
                      >
                        Facial Hair&emsp;
                        {showLocks ? (
                          facialHairLock ? (
                            <FaLock
                              className="lock text-warning"
                              onClick={(e) => {
                                setLockData({
                                  ...lockData,
                                  facialHairLock: !facialHairLock,
                                });
                              }}
                            />
                          ) : (
                            <FaLockOpen
                              className="lock text-success"
                              onClick={(e) => {
                                setLockData({
                                  ...lockData,
                                  facialHairLock: !facialHairLock,
                                });
                              }}
                            />
                          )
                        ) : null}
                      </td>
                      <td className="resultText ps-2" style={{ width: "50%" }}>
                        {resultAppearance.facialHairStyle}
                      </td>
                    </tr>
                    <tr>
                      <td
                        className="resultAttribute text-end pe-3"
                        style={{ width: "50%" }}
                      >
                        Eye Colour&emsp;
                        {showLocks ? (
                          eyeColourLock ? (
                            <FaLock
                              className="lock text-warning"
                              onClick={(e) => {
                                setLockData({
                                  ...lockData,
                                  eyeColourLock: !eyeColourLock,
                                });
                              }}
                            />
                          ) : (
                            <FaLockOpen
                              className="lock text-success"
                              onClick={(e) => {
                                setLockData({
                                  ...lockData,
                                  eyeColourLock: !eyeColourLock,
                                });
                              }}
                            />
                          )
                        ) : null}
                      </td>
                      <td className="resultText ps-2" style={{ width: "50%" }}>
                        {resultAppearance.eyeColour}
                      </td>
                    </tr>
                    <tr>
                      <td
                        className="resultAttribute text-end pe-3"
                        style={{ width: "50%" }}
                      >
                        Weight&emsp;
                        {showLocks ? (
                          weightLock ? (
                            <FaLock
                              className="lock text-warning"
                              onClick={(e) => {
                                setLockData({
                                  ...lockData,
                                  weightLock: !weightLock,
                                });
                              }}
                            />
                          ) : (
                            <FaLockOpen
                              className="lock text-success"
                              onClick={(e) => {
                                setLockData({
                                  ...lockData,
                                  weightLock: !weightLock,
                                });
                              }}
                            />
                          )
                        ) : null}
                      </td>
                      <td className="resultText ps-2" style={{ width: "50%" }}>
                        {resultAppearance.weight}
                      </td>
                    </tr>
                    <tr>
                      <td
                        className="resultAttribute text-end pe-3"
                        style={{ width: "50%" }}
                      >
                        Height&emsp;
                        {showLocks ? (
                          heightLock ? (
                            <FaLock
                              className="lock text-warning"
                              onClick={(e) => {
                                setLockData({
                                  ...lockData,
                                  heightLock: !heightLock,
                                });
                              }}
                            />
                          ) : (
                            <FaLockOpen
                              className="lock text-success"
                              onClick={(e) => {
                                setLockData({
                                  ...lockData,
                                  heightLock: !heightLock,
                                });
                              }}
                            />
                          )
                        ) : null}
                      </td>
                      <td className="resultText ps-2" style={{ width: "50%" }}>
                        {Math.floor(resultAppearance.heightInches / 12)}'
                        {Math.floor(resultAppearance.heightInches % 12)}" (
                        {resultAppearance.height})
                      </td>
                    </tr>
                    {resultAppearance.damage.map((damage, index) => (
                      <tr>
                        <td
                          className="resultAttribute text-end pe-3"
                          style={{ width: "50%" }}
                        >
                          {index === 0 ? "Body Damage" : null}
                          &emsp;
                          {showLocks ? (
                            bodyDamageLock[index] ? (
                              <FaLock
                                className="lock text-warning"
                                onClick={(e) => {
                                  setLockData({
                                    ...lockData,
                                    bodyDamageLock: bodyDamageLock.map(
                                      (lock, j) => (index === j ? !lock : lock)
                                    ),
                                  });
                                }}
                              />
                            ) : (
                              <FaLockOpen
                                className="lock text-success"
                                onClick={(e) => {
                                  setLockData({
                                    ...lockData,
                                    bodyDamageLock: bodyDamageLock.map(
                                      (lock, j) => (index === j ? !lock : lock)
                                    ),
                                  });
                                }}
                              />
                            )
                          ) : null}
                        </td>
                        <td
                          className="resultText ps-2 pb-0"
                          style={{ width: "50%" }}
                        >
                          {damage}
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td
                        className="resultAttribute text-end pe-3"
                        style={{ width: "50%" }}
                      >
                        Main Clothing&emsp;
                        {showLocks ? (
                          underClothingLock ? (
                            <FaLock
                              className="lock text-warning"
                              onClick={(e) => {
                                setLockData({
                                  ...lockData,
                                  underClothingLock: !underClothingLock,
                                });
                              }}
                            />
                          ) : (
                            <FaLockOpen
                              className="lock text-success"
                              onClick={(e) => {
                                setLockData({
                                  ...lockData,
                                  underClothingLock: !underClothingLock,
                                });
                              }}
                            />
                          )
                        ) : null}
                      </td>
                      <td className="resultText ps-2" style={{ width: "50%" }}>
                        {resultAppearance.underClothing}
                      </td>
                    </tr>
                    <tr>
                      <td
                        className="resultAttribute text-end pe-3"
                        style={{ width: "50%" }}
                      >
                        Outer Clothing&emsp;
                        {showLocks ? (
                          overClothingLock ? (
                            <FaLock
                              className="lock text-warning"
                              onClick={(e) => {
                                setLockData({
                                  ...lockData,
                                  overClothingLock: !overClothingLock,
                                });
                              }}
                            />
                          ) : (
                            <FaLockOpen
                              className="lock text-success"
                              onClick={(e) => {
                                setLockData({
                                  ...lockData,
                                  overClothingLock: !overClothingLock,
                                });
                              }}
                            />
                          )
                        ) : null}
                      </td>
                      <td className="resultText ps-2" style={{ width: "50%" }}>
                        {resultAppearance.overClothing}
                      </td>
                    </tr>
                    <tr>
                      <td
                        className="resultAttribute text-end pe-3"
                        style={{ width: "50%" }}
                      >
                        Accessory&emsp;
                        {showLocks ? (
                          accessoryLock ? (
                            <FaLock
                              className="lock text-warning"
                              onClick={(e) => {
                                setLockData({
                                  ...lockData,
                                  accessoryLock: !accessoryLock,
                                });
                              }}
                            />
                          ) : (
                            <FaLockOpen
                              className="lock text-success"
                              onClick={(e) => {
                                setLockData({
                                  ...lockData,
                                  accessoryLock: !accessoryLock,
                                });
                              }}
                            />
                          )
                        ) : null}
                      </td>
                      <td className="resultText ps-2" style={{ width: "50%" }}>
                        {resultAppearance.accessory}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="col-lg-6">
                <div className="row justify-content-center">
                  <div className="col text-white text-center">
                    <hr />
                  </div>
                  <div className="col-auto text-white text-center sectionText">
                    Voice
                  </div>
                  <div className="col text-white text-center">
                    <hr />
                  </div>
                </div>
                <table className="table table-borderless">
                  <tbody>
                    <tr>
                      <td
                        className="resultAttribute text-end pe-3"
                        style={{ width: "50%" }}
                      >
                        Voice Effort&emsp;
                        {showLocks ? (
                          voiceEffortLock ? (
                            <FaLock
                              className="lock text-warning"
                              onClick={(e) => {
                                setLockData({
                                  ...lockData,
                                  voiceEffortLock: !voiceEffortLock,
                                });
                              }}
                            />
                          ) : (
                            <FaLockOpen
                              className="lock text-success"
                              onClick={(e) => {
                                setLockData({
                                  ...lockData,
                                  voiceEffortLock: !voiceEffortLock,
                                });
                              }}
                            />
                          )
                        ) : null}
                        <br />
                        {showVoiceLinks ? (
                          <a
                            className="text-info"
                            href={voiceTypes.effort[0]}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: "none" }}
                          >
                            [Explanation]
                          </a>
                        ) : null}
                        &emsp;
                        {showLocks ? (
                          <FaLock className="lock-transparent" />
                        ) : null}
                      </td>
                      <td className="resultText ps-2" style={{ width: "50%" }}>
                        {resultVoice.effort[0]}: {resultVoice.effort[1]}
                        <br />
                        {showVoiceLinks ? (
                          <a
                            className="text-info"
                            href={resultVoice.effort[2]}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {resultVoice.effort[0]} Example
                          </a>
                        ) : null}
                      </td>
                    </tr>

                    <tr>
                      <td
                        className="resultAttribute text-end pe-3"
                        style={{ width: "50%" }}
                      >
                        Voice Location&emsp;
                        {showLocks ? (
                          voiceLocationLock ? (
                            <FaLock
                              className="lock text-warning"
                              onClick={(e) => {
                                setLockData({
                                  ...lockData,
                                  voiceLocationLock: !voiceLocationLock,
                                });
                              }}
                            />
                          ) : (
                            <FaLockOpen
                              className="lock text-success"
                              onClick={(e) => {
                                setLockData({
                                  ...lockData,
                                  voiceLocationLock: !voiceLocationLock,
                                });
                              }}
                            />
                          )
                        ) : null}
                        <br />
                        {showVoiceLinks ? (
                          <a
                            className="text-info"
                            href={voiceTypes.location[0]}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: "none" }}
                          >
                            [Explanation]
                          </a>
                        ) : null}
                        &emsp;
                        {showLocks ? (
                          <FaLock className="lock-transparent" />
                        ) : null}
                      </td>
                      <td className="resultText ps-2" style={{ width: "50%" }}>
                        {resultVoice.location}
                      </td>
                    </tr>
                    <tr>
                      <td
                        className="resultAttribute text-end pe-3"
                        style={{ width: "50%" }}
                      >
                        Voice Dryness&emsp;
                        {showLocks ? (
                          voiceDrynessLock ? (
                            <FaLock
                              className="lock text-warning"
                              onClick={(e) => {
                                setLockData({
                                  ...lockData,
                                  voiceDrynessLock: !voiceDrynessLock,
                                });
                              }}
                            />
                          ) : (
                            <FaLockOpen
                              className="lock text-success"
                              onClick={(e) => {
                                setLockData({
                                  ...lockData,
                                  voiceDrynessLock: !voiceDrynessLock,
                                });
                              }}
                            />
                          )
                        ) : null}
                        <br />
                        {showVoiceLinks ? (
                          <a
                            className="text-info"
                            href={voiceTypes.dryness[0]}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: "none" }}
                          >
                            [Explanation]
                          </a>
                        ) : null}
                        &emsp;
                        {showLocks ? (
                          <FaLock className="lock-transparent" />
                        ) : null}
                      </td>
                      <td className="resultText ps-2" style={{ width: "50%" }}>
                        {resultVoice.dryness}
                      </td>
                    </tr>
                    <tr>
                      <td
                        className="resultAttribute text-end pe-3"
                        style={{ width: "50%" }}
                      >
                        Voice Tempo&emsp;
                        {showLocks ? (
                          voiceTempoLock ? (
                            <FaLock
                              className="lock text-warning"
                              onClick={(e) => {
                                setLockData({
                                  ...lockData,
                                  voiceTempoLock: !voiceTempoLock,
                                });
                              }}
                            />
                          ) : (
                            <FaLockOpen
                              className="lock text-success"
                              onClick={(e) => {
                                setLockData({
                                  ...lockData,
                                  voiceTempoLock: !voiceTempoLock,
                                });
                              }}
                            />
                          )
                        ) : null}
                        <br />
                        {showVoiceLinks ? (
                          <a
                            className="text-info"
                            href={voiceTypes.tempo[0]}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: "none" }}
                          >
                            [Explanation]
                          </a>
                        ) : null}
                        &emsp;
                        {showLocks ? (
                          <FaLock className="lock-transparent" />
                        ) : null}
                      </td>
                      <td className="resultText ps-2" style={{ width: "50%" }}>
                        {resultVoice.tempo}
                      </td>
                    </tr>
                    <tr>
                      <td
                        className="resultAttribute text-end pe-3"
                        style={{ width: "50%" }}
                      >
                        Voice Attitude&emsp;
                        {showLocks ? (
                          voiceAttitudeLock ? (
                            <FaLock
                              className="lock text-warning"
                              onClick={(e) => {
                                setLockData({
                                  ...lockData,
                                  voiceAttitudeLock: !voiceAttitudeLock,
                                });
                              }}
                            />
                          ) : (
                            <FaLockOpen
                              className="lock text-success"
                              onClick={(e) => {
                                setLockData({
                                  ...lockData,
                                  voiceAttitudeLock: !voiceAttitudeLock,
                                });
                              }}
                            />
                          )
                        ) : null}
                        <br />
                        {showVoiceLinks ? (
                          <a
                            className="text-info"
                            href={voiceTypes.attitude[0]}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ textDecoration: "none" }}
                          >
                            [Explanation]
                          </a>
                        ) : null}
                        &emsp;
                        {showLocks ? (
                          <FaLock className="lock-transparent" />
                        ) : null}
                      </td>
                      <td className="resultText ps-2" style={{ width: "50%" }}>
                        {resultVoice.attitude}
                      </td>
                    </tr>
                    <tr>
                      <td
                        className="resultAttribute text-end pe-3"
                        style={{ width: "50%" }}
                      >
                        Voice Combined&emsp;
                        {showLocks ? (
                          <FaLock className="lock-transparent" />
                        ) : null}
                      </td>
                      <td className="resultText ps-2" style={{ width: "50%" }}>
                        {resultVoice.effort[0]}, {resultVoice.location},{" "}
                        {resultVoice.dryness}, {resultVoice.tempo},{" "}
                        {resultVoice.attitude}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : null}

        {showStatCalc ? (
          <div>
            <div className="row justify-content-center">
              <div className="col text-white text-center">
                <hr />
              </div>
              <div className="col-auto text-white text-center sectionText">
                Stat Calculation
              </div>
              <div className="col text-white text-center">
                <hr />
              </div>
            </div>

            <div className="table-responsive">
              <table class="table  table-danger table-striped">
                <thead>
                  <tr>
                    <th scope="col"></th>
                    <th scope="col">STR</th>
                    <th scope="col">DEX</th>
                    <th scope="col">CON</th>
                    <th scope="col">INT</th>
                    <th scope="col">WIS</th>
                    <th scope="col">CHA</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Base</th>
                    <td>{baseStats.STR}</td>
                    <td>{baseStats.DEX}</td>
                    <td>{baseStats.CON}</td>
                    <td>{baseStats.INT}</td>
                    <td>{baseStats.WIS}</td>
                    <td>{baseStats.CHA}</td>
                  </tr>
                  <tr>
                    <th scope="row">{resultJob.name}</th>
                    <td>
                      {resultJob.statBonuses.STR !== 0
                        ? resultJob.statBonuses.STR
                        : null}
                    </td>
                    <td>
                      {resultJob.statBonuses.DEX !== 0
                        ? resultJob.statBonuses.DEX
                        : null}
                    </td>
                    <td>
                      {resultJob.statBonuses.CON !== 0
                        ? resultJob.statBonuses.CON
                        : null}
                    </td>
                    <td>
                      {resultJob.statBonuses.INT !== 0
                        ? resultJob.statBonuses.INT
                        : null}
                    </td>
                    <td>
                      {resultJob.statBonuses.WIS !== 0
                        ? resultJob.statBonuses.WIS
                        : null}
                    </td>
                    <td>
                      {resultJob.statBonuses.CHA !== 0
                        ? resultJob.statBonuses.CHA
                        : null}
                    </td>
                  </tr>
                  {resultTraits.universal.map((trait, index) =>
                    trait.hasOwnProperty("statBonuses") ? (
                      <tr>
                        <th scope="row">{trait.name}</th>
                        <td>
                          {trait.statBonuses.STR !== 0
                            ? trait.statBonuses.STR
                            : null}
                        </td>
                        <td>
                          {trait.statBonuses.DEX !== 0
                            ? trait.statBonuses.DEX
                            : null}
                        </td>
                        <td>
                          {trait.statBonuses.CON !== 0
                            ? trait.statBonuses.CON
                            : null}
                        </td>
                        <td>
                          {trait.statBonuses.INT !== 0
                            ? trait.statBonuses.INT
                            : null}
                        </td>
                        <td>
                          {trait.statBonuses.WIS !== 0
                            ? trait.statBonuses.WIS
                            : null}
                        </td>
                        <td>
                          {trait.statBonuses.CHA !== 0
                            ? trait.statBonuses.CHA
                            : null}
                        </td>
                      </tr>
                    ) : (
                      <tr>
                        <th scope="row">{trait.name}</th>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                        <td></td>
                      </tr>
                    )
                  )}
                  <tr>
                    <th scope="row">Total</th>
                    <td>{resultStats.STR}</td>
                    <td>{resultStats.DEX}</td>
                    <td>{resultStats.CON}</td>
                    <td>{resultStats.INT}</td>
                    <td>{resultStats.WIS}</td>
                    <td>{resultStats.CHA}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-center text-danger">
              Totals may not match the sum of its parts, as stats have a lower
              cap of 2 and an upper cap of 18
            </p>
          </div>
        ) : null}

        <div className="row justify-content-center">
          <div className="col text-white text-center">
            <hr />
          </div>
          <div className="col-auto text-white text-center sectionText">
            Stat Block
          </div>
          <div className="col text-white text-center">
            <hr />
          </div>
        </div>

        <br />

        {/* STAT BLOCK */}
        {showResults ? (
          <div className="row statBlock">
            <div className="block m-auto col-sm-4 rounded shadow-lg">
              <div className="name">
                {resultName}, {resultJob.name}
              </div>
              <div className="description">
                {resultRace.size} Humanoid ({resultRace.name})
              </div>

              <div className="gradient"></div>

              <div className="red">
                <div>
                  <span className="bold red">Armor class</span>
                  <span>
                    {" "}
                    {resultStats.AC}{" "}
                    {resultJob.hasOwnProperty("armor")
                      ? "(" + resultJob.armor.name + ")"
                      : null}
                  </span>
                </div>
                <div>
                  <span className="bold red">Hit Points</span>
                  <span> {resultStats.HP}</span>
                </div>
                <div>
                  <span className="bold red">Speed</span>
                  <span>
                    {" "}
                    {resultStats.speed.walking} ft.
                    {resultStats.speed.hasOwnProperty("flying")
                      ? ", fly " + resultStats.speed.flying + " ft."
                      : null}
                  </span>
                </div>
              </div>

              <div className="gradient"></div>

              <table className="text-center tableBlock">
                <tbody>
                  <tr>
                    <th className="thBlock">STR </th>
                    <th className="thBlock">DEX </th>
                    <th className="thBlock">CON </th>
                    <th className="thBlock">INT </th>
                    <th className="thBlock">WIS </th>
                    <th className="thBlock">CHA </th>
                  </tr>
                  <tr>
                    <td className="tdBlock">
                      {resultStats.STR} (
                      {Math.floor((resultStats.STR - 10) / 2) >= 0 ? "+" : null}
                      {Math.floor((resultStats.STR - 10) / 2)})
                    </td>
                    <td className="tdBlock">
                      {resultStats.DEX} (
                      {Math.floor((resultStats.DEX - 10) / 2) >= 0 ? "+" : null}
                      {Math.floor((resultStats.DEX - 10) / 2)})
                    </td>
                    <td className="tdBlock">
                      {resultStats.CON} (
                      {Math.floor((resultStats.CON - 10) / 2) >= 0 ? "+" : null}
                      {Math.floor((resultStats.CON - 10) / 2)})
                    </td>
                    <td className="tdBlock">
                      {resultStats.INT} (
                      {Math.floor((resultStats.INT - 10) / 2) >= 0 ? "+" : null}
                      {Math.floor((resultStats.INT - 10) / 2)})
                    </td>
                    <td className="tdBlock">
                      {resultStats.WIS} (
                      {Math.floor((resultStats.WIS - 10) / 2) >= 0 ? "+" : null}
                      {Math.floor((resultStats.WIS - 10) / 2)})
                    </td>
                    <td className="tdBlock">
                      {resultStats.CHA} (
                      {Math.floor((resultStats.CHA - 10) / 2) >= 0 ? "+" : null}
                      {Math.floor((resultStats.CHA - 10) / 2)})
                    </td>
                  </tr>
                </tbody>
              </table>

              <div className="gradient"></div>

              {resultSavingThrows.length > 0 ? (
                <div>
                  <span className="bold">Saving Throws</span>
                  <span>
                    {" "}
                    {resultSavingThrows.map(
                      (save, index) =>
                        save +
                        (index < resultSavingThrows.length - 1 ? ", " : "")
                    )}
                  </span>
                </div>
              ) : null}

              {resultProficiencies.length > 0 ? (
                <div>
                  <span className="bold">Skills</span>
                  <span>
                    {" "}
                    {resultProficiencies
                      .filter((prof, index) => /\d/.test(prof))
                      .map(
                        (prof, index) =>
                          prof +
                          (index <
                          resultProficiencies.filter((prof, index) =>
                            /\d/.test(prof)
                          ).length -
                            1
                            ? ", "
                            : "")
                      )}
                  </span>
                </div>
              ) : null}

              {resultProficiencies.filter((prof, index) => !/\d/.test(prof))
                .length > 0 ? (
                <div>
                  <span className="bold">Tool Proficiencies</span>
                  <span>
                    {" "}
                    {resultProficiencies
                      .filter((prof, index) => !/\d/.test(prof))
                      .map(
                        (prof, index) =>
                          prof +
                          (index <
                          resultProficiencies.filter(
                            (prof, index) => !/\d/.test(prof)
                          ).length -
                            1
                            ? ", "
                            : "")
                      )}
                  </span>
                </div>
              ) : null}

              <div>
                <span className="bold">Senses</span>
                <span>
                  {" "}
                  {resultRace.hasOwnProperty("darkvision")
                    ? resultRace.darkvision
                    : null}
                  Passive Perception{" "}
                  {10 +
                    proficiencyBonus +
                    Math.floor((resultStats.WIS - 10) / 2)}
                </span>
              </div>
              <div>
                <span className="bold">Languages</span>
                <span> {resultRace.languages}</span>
              </div>
              <div>
                <span className="bold">Proficiency Bonus</span>
                <span> +{proficiencyBonus}</span>
              </div>
              {/* <div>
            <span className="bold">Challenge</span>
            <span> PLACEHOLDER 2 (450 XP)</span>
            </div> */}

              <div className="gradient"></div>

              {resultRace.hasOwnProperty("traits")
                ? resultRace.traits.map((trait, index) => (
                    <div>
                      <span className="bold fst-italic">{trait.name}.</span>
                      <span> {trait.description}</span>
                    </div>
                  ))
                : null}

              <div className="actions red">Actions</div>

              <div className="hr"></div>

              {/* ATTACKS */}
              <div className="attack">
                <span className="attackname">{resultJob.weapon.name}.</span>
                <span className="description">
                  {" "}
                  {resultJob.weapon.weaponType} Weapon Attack:
                </span>
                <span>
                  {proficiencyBonus +
                    Math.floor(
                      (resultStats[resultJob.weapon.damageStat] - 10) / 2
                    ) >=
                  0
                    ? "+"
                    : null}
                  {proficiencyBonus +
                    Math.floor(
                      (resultStats[resultJob.weapon.damageStat] - 10) / 2
                    )}{" "}
                  to hit, {resultJob.weapon.weaponRange}, one target.
                </span>
                <span className="description">Hit:</span>
                <span>
                  {Math.floor(
                    resultJob.weapon.avgDamage +
                      Math.floor(
                        (resultStats[resultJob.weapon.damageStat] - 10) / 2
                      )
                  ) >= 1
                    ? Math.floor(
                        resultJob.weapon.avgDamage +
                          Math.floor(
                            (resultStats[resultJob.weapon.damageStat] - 10) / 2
                          )
                      )
                    : "1"}{" "}
                  ({resultJob.weapon.damageDice}
                  {Math.floor(
                    (resultStats[resultJob.weapon.damageStat] - 10) / 2
                  ) >= 0
                    ? "+"
                    : null}
                  {Math.floor(
                    (resultStats[resultJob.weapon.damageStat] - 10) / 2
                  )}
                  ) {resultJob.weapon.damageType} damage.
                </span>
              </div>
              <br />
              {/* END OF ATTACKS */}
            </div>
          </div>
        ) : null}
      </div>
      <br />
      <div className="row justify-content-center">
        <div className="col text-white text-center">
          <hr />
        </div>
        <div className="col-auto text-white text-center sectionText">
          NPC Actions
        </div>
        <div className="col text-white text-center">
          <hr />
        </div>
      </div>
      <div className="row text-center m-2 mt-4">
        <div className="col-md mb-3">
          <label htmlFor="formFile" className="form-label text-white">
            Import NPC
          </label>
          <input
            className="form-control mx-auto"
            style={{ width: "75%" }}
            name="file"
            type="file"
            accept=".txt"
            onChange={onImport}
            id="formFile"
          />
          {importError !== "" ? (
            <p className="text-danger">{importError}</p>
          ) : null}
        </div>

        <div className="col-md mb-3">
          <button
            type="button"
            className="btn btn-primary btn-rounded px-3 py-2"
            onClick={() => {
              onExport();
              gaEventTracker("Export");
            }}
          >
            Export NPC
          </button>
        </div>
        <div className="col-md">
          <button
            type="button"
            className="btn btn-primary btn-rounded px-3 py-2"
            onClick={() => {
              onDownload();
              gaEventTracker("Download");
            }}
          >
            Download NPC as image
          </button>
          <p className="text-danger text-center mt-2">
            Consider hiding the locks and voice links using modifiers before
            Downloading the NPC
          </p>
        </div>
      </div>

      <br />

      <div className="row justify-content-center">
        <div className="col text-white text-center">
          <hr />
        </div>
        <div className="col-auto text-white text-center sectionText">
          Attribution
        </div>
        <div className="col text-white text-center">
          <hr />
        </div>
      </div>
      <table className="table table-borderless">
        <tbody>
          <tr>
            <td
              className="resultAttribute text-end pe-3"
              style={{ width: "50%" }}
            >
              D20 Icon
            </td>
            <td className="resultText ps-2" style={{ width: "50%" }}>
              <a
                href="https://www.flaticon.com/free-icons/d20"
                title="d20 icons"
                className="text-info text-break"
                target="_blank"
                rel="noopener noreferrer"
              >
                D20 icons created by Freepik - Flaticon
              </a>
            </td>
          </tr>
          <tr>
            <td
              className="resultAttribute text-end pe-3"
              style={{ width: "50%" }}
            >
              Stat Block Design
            </td>
            <td className="resultText ps-2 text-wrap" style={{ width: "50%" }}>
              <a
                href="https://jsfiddle.net/basmith7/Z2sQK/"
                className="text-info text-break"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://jsfiddle.net/basmith7/Z2sQK/
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Generator;
