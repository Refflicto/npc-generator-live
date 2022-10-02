import React, { useState, useEffect } from "react";
// import axios from "axios";
import "../statBlock.css";

import genders from "../lists/genders.json";
import names from "../lists/names.json";
import races from "../lists/races.json";
import jobs from "../lists/jobs.json";
import traits from "../lists/traits.json";

import { FaChevronLeft } from "react-icons/fa";

const Generator = () => {
  const NULL_GENDER = {
    type: "None",
  };

  const [listData, setListData] = useState({
    genderList: genders,
    nameList: names,
    raceList: races.sort(function (a, b) {
      return a.name > b.name ? 1 : b.name > a.name ? -1 : 0;
    }),
    jobsList: jobs.sort(function (a, b) {
      return a.name > b.name ? 1 : b.name > a.name ? -1 : 0;
    }),
    traitsList: traits,
  });
  const { genderList, nameList, raceList, jobsList, traitsList } = listData;

  const [modifierData, setModifierData] = useState({
    allowedAges: {
      child: false,
      adult: true,
      elderly: true,
    },
    proficiencyBonus: 2,
    traitAmount: {
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
  });
  const {
    allowedAges,
    proficiencyBonus,
    traitAmount,
    powerLevel,
    powerDescription,
    powerVariance,
  } = modifierData;

  const [resultData, setResultData] = useState({
    resultGender: {},
    resultName: "",
    resultRace: {},
    resultAge: -1,
    resultAgeType: "",
    resultJob: {},
    resultHook: "",
    resultTraits: {
      positive: [],
      neutral: [],
      negative: [],
    },
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
    resultStats,
    showResults,
  } = resultData;

  useEffect(() => {
    onGenerate();
  }, []);

  const onGenerate = () => {
    // console.log(powerLevel);
    // Create arrays based off preferences
    // GENERATE GENDER
    let generatedGender = {};
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

    // GENERATE NAME
    var arrayNames = [];
    if (
      generatedGender.type === "Male" ||
      generatedGender.type === "Non-Binary" ||
      generatedGender.type === "None"
    ) {
      arrayNames = [...arrayNames, ...names.maleNames];
    }
    if (
      generatedGender.type === "Female" ||
      generatedGender.type === "Non-Binary" ||
      generatedGender.type === "None"
    ) {
      arrayNames = [...arrayNames, ...names.femaleNames];
    }
    const generatedName =
      arrayNames[Math.floor(Math.random() * (arrayNames.length - 1))] +
      " " +
      names.surnames[Math.floor(Math.random() * (names.surnames.length - 1))];

    // GENERATE RACE
    let generatedRace = {};
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

    // GENERATE AGE
    const elderlyAge = Math.floor(generatedRace.lifespan * 0.75);
    let ageFloor = 1;
    let ageRoof = generatedRace.lifespan;
    let generatedAge = -1;
    let generatedAgeType = "";

    // console.log("elderlyAge: " + elderlyAge);
    // console.log("matureAge: " + generatedRace.matureAge);

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

      // console.log(ageFloor);
      // console.log(ageRoof);

      generatedAge = Math.floor(
        Math.random() * (ageRoof - ageFloor) + ageFloor
      );
    }

    if (generatedAge < generatedRace.matureAge) {
      generatedAgeType = "Child";
    } else if (generatedAge >= elderlyAge) {
      generatedAgeType = "Elderly";
    } else {
      generatedAgeType = "Adult";
    }

    // GENERATE JOB
    let generatedJob = jobsList[0];

    if (generatedAge >= generatedRace.matureAge) {
      const selectedJobs = jobsList.filter((job) => job.defaultCheckbox);
      if (selectedJobs.length !== 0) {
        generatedJob =
          selectedJobs[
            Math.floor(Math.random() * (selectedJobs.length - 1) + 0.5)
          ];
      }
    }

    // GENERATE TRAITS
    // console.log(traitsList);
    let positiveList = traitsList.positive;
    let neutralList = traitsList.neutral;
    let negativeList = traitsList.negative;

    // GENERATE POSITIVE TRAITS
    let generatedPosTraits = [];
    let num = -1;

    if (traitAmount.positive > 0) {
      for (
        let i = 0;
        i < traitAmount.positive && positiveList.length > 0;
        i++
      ) {
        // random number for positive array
        num = Math.floor(Math.random() * (positiveList.length - 1) + 0.5);
        // add trait to generated positive list
        generatedPosTraits.push(positiveList[num]);
        // if trait has conflicts, remove from other arrays
        if (positiveList[num].hasOwnProperty("conflicts")) {
          for (let j = 0; j < positiveList[num].conflicts.length; j++) {
            positiveList = positiveList.filter(
              (trait, index) => trait.name !== positiveList[num].conflicts[j]
            );
            neutralList = neutralList.filter(
              (trait, index) => trait.name !== positiveList[num].conflicts[j]
            );
            negativeList = negativeList.filter(
              (trait, index) => trait.name !== positiveList[num].conflicts[j]
            );
          }
        }
        // remove trait from original positive list
        positiveList = positiveList.filter((item, index) => index !== num);
      }
    }

    // GENERATE NEUTRAL TRAITS
    // TODO ADD CONFLICT LOGIC
    let generatedNeuTraits = [];
    num = -1;

    if (traitAmount.neutral > 0) {
      for (let i = 0; i < traitAmount.neutral && neutralList.length > 0; i++) {
        num = Math.floor(Math.random() * (neutralList.length - 1) + 0.5);
        generatedNeuTraits.push(neutralList[num]);
        if (neutralList[num].hasOwnProperty("conflicts")) {
          for (let j = 0; j < neutralList[num].conflicts; j++) {
            neutralList = neutralList.filter(
              (trait, index) => trait.name !== neutralList[num].conflicts[j]
            );
            negativeList = negativeList.filter(
              (trait, index) => trait.name !== neutralList[num].conflicts[j]
            );
          }
        }
        neutralList = neutralList.filter((item, index) => index !== num);
      }
    }

    // GENERATE NEGATIVE TRAITS
    // TODO ADD CONFLICT LOGIC
    let generatedNegTraits = [];
    num = -1;

    if (traitAmount.negative > 0) {
      for (
        let i = 0;
        i < traitAmount.negative && negativeList.length > 0;
        i++
      ) {
        num = Math.floor(Math.random() * (negativeList.length - 1) + 0.5);
        generatedNegTraits.push(negativeList[num]);
        if (negativeList[num].hasOwnProperty("conflicts")) {
          for (let j = 0; j < negativeList[num].conflicts; j++) {
            negativeList = negativeList.filter(
              (trait, index) => trait.name !== negativeList[num].conflicts[j]
            );
          }
        }
        negativeList = negativeList.filter((item, index) => index !== num);
      }
    }

    // GENERATE HOOK
    let generatedHook = "";

    let hookList = generatedJob.hooks;
    // console.log(hookList);
    // add hooks from traits
    for (let i = 0; i < generatedPosTraits.length; i++) {
      if (generatedPosTraits[i].hasOwnProperty("hooks")) {
        hookList = hookList.concat(generatedPosTraits[i].hooks);
      }
    }
    for (let i = 0; i < generatedNeuTraits.length; i++) {
      if (generatedNeuTraits[i].hasOwnProperty("hooks")) {
        hookList = hookList.concat(generatedNeuTraits[i].hooks);
      }
    }
    for (let i = 0; i < generatedNegTraits.length; i++) {
      if (generatedNegTraits[i].hasOwnProperty("hooks")) {
        hookList = hookList.concat(generatedNegTraits[i].hooks);
      }
    }
    // console.log(hookList);

    generatedHook =
      hookList[Math.floor(Math.random() * (hookList.length - 1) + 0.5)];

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

    // add job bonuses
    generatedSTR += generatedJob.statBonuses.STR;
    generatedDEX += generatedJob.statBonuses.DEX;
    generatedCON += generatedJob.statBonuses.CON;
    generatedINT += generatedJob.statBonuses.INT;
    generatedWIS += generatedJob.statBonuses.WIS;
    generatedCHA += generatedJob.statBonuses.CHA;

    // add trait bonuses
    for (let i = 0; i < generatedPosTraits.length; i++) {
      if (generatedPosTraits[i].hasOwnProperty("statBonuses")) {
        generatedSTR += generatedPosTraits[i].statBonuses.STR;
        generatedDEX += generatedPosTraits[i].statBonuses.DEX;
        generatedCON += generatedPosTraits[i].statBonuses.CON;
        generatedINT += generatedPosTraits[i].statBonuses.INT;
        generatedWIS += generatedPosTraits[i].statBonuses.WIS;
        generatedCHA += generatedPosTraits[i].statBonuses.CHA;
      }
    }

    for (let i = 0; i < generatedNeuTraits.length; i++) {
      if (generatedNeuTraits[i].hasOwnProperty("statBonuses")) {
        generatedSTR += generatedNeuTraits[i].statBonuses.STR;
        generatedDEX += generatedNeuTraits[i].statBonuses.DEX;
        generatedCON += generatedNeuTraits[i].statBonuses.CON;
        generatedINT += generatedNeuTraits[i].statBonuses.INT;
        generatedWIS += generatedNeuTraits[i].statBonuses.WIS;
        generatedCHA += generatedNeuTraits[i].statBonuses.CHA;
      }
    }

    for (let i = 0; i < generatedNegTraits.length; i++) {
      if (generatedNegTraits[i].hasOwnProperty("statBonuses")) {
        generatedSTR += generatedNegTraits[i].statBonuses.STR;
        generatedDEX += generatedNegTraits[i].statBonuses.DEX;
        generatedCON += generatedNegTraits[i].statBonuses.CON;
        generatedINT += generatedNegTraits[i].statBonuses.INT;
        generatedWIS += generatedNegTraits[i].statBonuses.WIS;
        generatedCHA += generatedNegTraits[i].statBonuses.CHA;
      }
    }

    // cap stats
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

    // SET DATA
    setResultData({
      ...resultData,
      resultGender: generatedGender,
      resultName: generatedName,
      resultAge: generatedAge,
      resultAgeType: generatedAgeType,
      resultRace: generatedRace,
      resultJob: generatedJob,
      resultHook: generatedHook,
      resultTraits: {
        positive: generatedPosTraits,
        neutral: generatedNeuTraits,
        negative: generatedNegTraits,
      },
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
      showResults: true,
    });
  };

  return (
    <div className="mb-4">
      {/* 1ST GENERATE BUTTON */}
      <div className="text-center m-2">
        <button
          type="button"
          className="btn btn-success btn-rounded px-3 py-2"
          onClick={onGenerate}
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
                  nameList: names,
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
                            job.index === 0
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
            <div className="card-header text-center">Amount of Traits</div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item modifier-body text-white">
                <div className="form-floating my-2 w-50 m-auto">
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
                ) : null}
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
                    defaultValue={powerLevel}
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
                    defaultValue={powerVariance}
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
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 2ND GENERATE BUTTON */}
      <div className="text-center m-2">
        <button
          type="button"
          className="btn btn-success btn-rounded px-3 py-2"
          onClick={onGenerate}
        >
          Generate
        </button>
      </div>

      {/* RESULTS */}
      {showResults ? (
        <div>
          <table className="table table-borderless">
            <tbody>
              <tr>
                <td
                  className="resultAttribute text-end pe-3"
                  style={{ width: "50%" }}
                >
                  Name
                </td>
                <td className="resultText ps-2" style={{ width: "50%" }}>
                  {resultName}
                </td>
              </tr>
              <tr>
                <td
                  className="resultAttribute text-end pe-3"
                  style={{ width: "50%" }}
                >
                  Gender
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
                  Race
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
                  Age
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
                  Job
                </td>
                <td className="resultText ps-2" style={{ width: "50%" }}>
                  {resultJob.name}
                </td>
              </tr>
              {resultTraits.positive.map((trait, index) => (
                <>
                  <tr>
                    <td
                      className="resultAttribute text-end pe-3"
                      style={{ width: "50%" }}
                    >
                      {index === 0 ? "Positive Traits" : null}
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
              <tr>
                <td
                  className="resultAttribute text-end pe-3"
                  style={{ width: "50%" }}
                >
                  Story Hook
                </td>
                <td className="resultText ps-2" style={{ width: "50%" }}>
                  {resultHook}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : null}

      <br />

      {/* STAT BLOCK */}
      {showResults ? (
        <div className="row">
          <div className="block m-auto col-sm-4">
            <div className="name">{resultName}</div>
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
                    {resultStats.STR} ({Math.floor((resultStats.STR - 10) / 2)})
                  </td>
                  <td className="tdBlock">
                    {resultStats.DEX} ({Math.floor((resultStats.DEX - 10) / 2)})
                  </td>
                  <td className="tdBlock">
                    {resultStats.CON} ({Math.floor((resultStats.CON - 10) / 2)})
                  </td>
                  <td className="tdBlock">
                    {resultStats.INT} ({Math.floor((resultStats.INT - 10) / 2)})
                  </td>
                  <td className="tdBlock">
                    {resultStats.WIS} ({Math.floor((resultStats.WIS - 10) / 2)})
                  </td>
                  <td className="tdBlock">
                    {resultStats.CHA} ({Math.floor((resultStats.CHA - 10) / 2)})
                  </td>
                </tr>
              </tbody>
            </table>

            <div className="gradient"></div>

            <div>
              <span className="bold">Senses</span>
              <span>
                {" "}
                {resultRace.hasOwnProperty("darkvision")
                  ? resultRace.darkvision
                  : null}
                passive perception{" "}
                {10 + proficiencyBonus + Math.floor((resultStats.WIS - 10) / 2)}
              </span>
            </div>
            <div>
              <span className="bold">Languages</span>
              <span> {resultRace.languages}</span>
            </div>
            {/* <div>
            <span className="bold">Challenge</span>
            <span> PLACEHOLDER 2 (450 XP)</span>
            </div> */}

            <div className="gradient"></div>

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
            {/* END OF ATTACKS */}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Generator;
