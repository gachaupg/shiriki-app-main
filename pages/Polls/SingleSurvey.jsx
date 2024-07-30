import {
  ActivityIndicator,
  Button,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import { useToast } from "react-native-toast-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RadioButton } from "react-native-paper";
import { BarChart } from "react-native-chart-kit";
import * as Progress from "react-native-progress";
import { CheckBox } from "react-native-elements";

import Checkbox from "expo-checkbox";
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/AntDesign";

import { FileSystem } from "expo";
import { useSelector } from "react-redux";
import axios from "axios";
import { decode } from "html-entities";
import RNPickerSelect from "react-native-picker-select";

const SingleForum = ({ route, navigation, data }) => {
  const toast = useToast();
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#F5F5F5",
      justifyContent: "center",
      alignItems: "center",
    },
    radioGroup: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-around",
      marginTop: 20,
      borderRadius: 8,
      backgroundColor: "white",
      padding: 16,
      elevation: 4,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
    radioButton: {
      flexDirection: "row",
      alignItems: "center",
    },
    radioLabel: {
      marginLeft: 8,
      fontSize: 16,
      color: "#333",
    },
  });
  const { id } = route.params; // Access the `id` parameter
  console.log("id", id);
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});
  const [value, setValue] = useState();
  const pickerSelectStyles = {
    inputIOS: {
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: "green", // Green border color
      borderRadius: 15, // Border radius of 15
      color: "black", // Text color
      paddingRight: 30, // to ensure the text is never behind the icon
    },
    inputAndroid: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 0.5,
      borderColor: "green", // Green border color
      borderRadius: 15, // Border radius of 15
      color: "black", // Text color
      paddingRight: 30, // to ensure the text is never behind the icon
    },
  };
  const selectedItem = {
    title: "Choose your gender",
  };
  // console.log('====================================');
  console.log(id);
  console.log("====================================");
  const { user } = useSelector((state) => state.auth);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);

  const [forums, setForums] = useState([]);
  console.log("====================================");
  console.log("singleSurvey", forums);
  console.log("====================================");
  async function fetchData() {
    try {
      const config = {
        headers: {
          Authorization: `Token ${user.token}`,
          "Content-Type": "application/json",
        },
      };

      const res = await axios.post(
        `https://dev.shiriki.org/api/get-single-survey/`,
        {
          survey: id,
        },
        config
      );
      const jsonArray = JSON.stringify(res.data);

      const forumsData = res.data.survey;
      const forumsArray = [forumsData];
      //   const data = forumsArray?.sort(compare);
      console.log("====================================");
      // console.log("surveys", forumsArray[0].questions[1].choices);
      console.log("====================================");

      setForums(forumsArray);
      setLoading(false);
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, [id]);

  const [isLoading, setIsLoading] = useState(false);
  const [showQuestion, setShowQuestion] = useState(false);

  const showAns = () => {
    if (showQuestion === false) {
      setShowQuestion(true);
    } else {
      setShowQuestion(false);
    }
  };

  const [current, setCurrent] = useState("");
  const [isChecked, setChecked] = useState(false);
  const [showChoice, setShowChoice] = useState(false);
  const [qId, setQid] = useState("");
  const [multSuvId, setMultSuvId] = useState("");
  const [multSuvId1, setMultSuvId1] = useState("");
  //   137.184.9.57/api/save-
  // multiple-choice/
  const [currentChoices, setCurrentChoices] = useState({});
  console.log("====================================");
  console.log("currentChoices", currentChoices);
  console.log("====================================");
  const handleChoiceSelected = async (questionId, optionId, surveyId) => {
    const config = {
      headers: {
        Authorization: `Token ${user.token}`, // Supplying token in the headers
        "Content-Type": "application/json",
      },
    };

    const payload = {
      questionId,
      optionId,
      surveyId,
    };

    console.log("Payload:", payload); // Debug payload
    console.log("Config:", config); // Debug config

    try {
      const res = await axios.post(
        "https://dev.shiriki.org/api/savemultiple-choice/",
        payload,
        config
      );
      if (res.data.code === 200) {
        console.log("Response:", res.data);
      } else {
        console.log("Response:", res.data);
      }
    } catch (error) {
      console.error("Error posting choice: error", error);
    }
  };

  const handleShowChoice1 = async (choiceId, survey_id, question_id) => {
    const questionsData = forums.reduce((acc, forum) => {
      acc.push(...forum.questions);
      return acc;
    }, []);
    console.log("hello", questionsData);

    // Check if there are questions with matching choiceId
    const matchingQuestions = questionsData.filter(
      (forum) => forum.question_type === choiceId
    );
    toast.show("Survey submitted");
    if (matchingQuestions.length > 0) {
      try {
        setIsLoading(true); // Set loading state

        const config = {
          headers: {
            Authorization: `Token ${user.token}`, // Supplying token in the headers
            "Content-Type": "application/json",
          },
        };

        const res = await axios.post(
          "https://dev.shiriki.org/api/save-text/",
          {
            selectedvalue: comment,
            surveyId: survey_id,
            questionId: question_id,
          },
          config
        );

        if (res.data.code === 200) {
          console.log("Comment added successfully!");
          toast.show("Question sent successfully");
          setComment(""); // Clear the comment state
        }
      } catch (error) {
        // Handle any errors that occur during the POST request
        console.error("Error adding Comment:", error);
        toast.error("Failed to send question");
      } finally {
        setIsLoading(false); // Reset loading state after the request is complete
      }

      matchingQuestions.forEach((question) => {
        console.log(question); // Log the matching question(s) here
      });
    } else {
      console.log("No question found for choiceId");
    }
  };

  const handleShowChoice = (choiceId) => {
    const questionsData = forums.reduce((acc, forum) => {
      acc.push(...forum.questions);
      return acc;
    }, []);

    questionsData.forEach((forum) => {
      if (forum.question_id === choiceId) {
        setShowChoice(true);
        console.log(showChoice);
        console.log("id", choiceId);
        setQid(forum.question_id);
      }
    });
  };
  const [checkedIndex, setCheckedIndex] = useState(null);
  const [checkedIndex2, setCheckedIndex2] = useState(null);
  const [checkedChoice, setCheckedChoice] = useState(null);

  const AddReplies = async (question_id, survey_id, choi) => {
    // console.log("disId", disId);
    try {
      const config = {
        headers: {
          Authorization: `Token ${user.token}`, // Supplying token in the headers
          "Content-Type": "application/json",
        },
      };
      await axios.post(
        "https://dev.shiriki.org/api/save-text/",
        {
          selectedvalue: "test",
          questionId: "7",
          surveyId: "3",
        },
        config
      ); // Pass config as the third argument to axios.post
      // If the request is successful, you can handle any additional logic here
      console.log("Comment added successfully!");
    } catch (error) {
      // Handle any errors that occur during the POST request
      console.error("Error adding Comment:", error.JSON());
    } finally {
      setIsLoading(false); // Reset loading state after the request is complete
    }
  };

  const AddQuestion1 = async (questionId, optionId, surveyId, choice) => {
    console.log("hello", questionId);
    console.log("hello", optionId);
    console.log("hello", surveyId);
    console.log("hello", choice);

    try {
      const config = {
        headers: {
          Authorization: `Token ${user.token}`, // Supplying token in the headers
          "Content-Type": "application/json",
        },
      };

      const res = await axios.post(
        "https://dev.shiriki.org/api/save-single-choice/",
        {
          questionId: questionId,
          optionId: optionId,
          surveyId: surveyId,
        },
        config
      );

      if (res.data.code === 200) {
        setCheckedIndex(choice);
        toast.show("Question answered successfully");

        // Store the data in async storage
        const savedData = {
          questionId: questionId,
          optionId: optionId,
          surveyId: surveyId,
          choice: choice,
          token: user.token,
        };
        await AsyncStorage.setItem(
          "savedQuestionData",
          JSON.stringify(savedData)
        );
        // toast.show('data')
      }

      console.log("Choice added successfully!");
    } catch (error) {
      // Handle any errors that occur during the POST request
      console.error("Error adding Comment:", error);
    } finally {
      setIsLoading(false); // Reset loading state after the request is complete
    }
  };
  const AddQuestion2 = async (questionId, optionId, surveyId, choice) => {
    console.log("hello", questionId);
    console.log("hello", optionId);
    console.log("hello", surveyId);
    console.log("hello", choice);

    try {
      const config = {
        headers: {
          Authorization: `Token ${user.token}`, // Supplying token in the headers
          "Content-Type": "application/json",
        },
      };

      const res = await axios.post(
        "https://dev.shiriki.org/api/save-multiple-choice/",
        {
          questionId: questionId,
          optionId: optionId,
          surveyId: surveyId,
        },
        config
      );

      if (res.data.code === 200) {
        setCheckedIndex(choice);
        toast.show("Choice answered successfully");

        // Store the data in async storage
        const savedData = {
          questionId: questionId,
          optionId: optionId,
          surveyId: surveyId,
          choice: choice,
          token: user.token,
        };
        await AsyncStorage.setItem(
          "savedQuestionData",
          JSON.stringify(savedData)
        );
        // toast.show('data')
      }

      console.log("Comment added successfully!");
    } catch (error) {
      // Handle any errors that occur during the POST request
      console.error("Error adding Comment:", error);
    } finally {
      setIsLoading(false); // Reset loading state after the request is complete
    }
  };
  const [savedData, setSavedData] = useState(null);
  // const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await AsyncStorage.getItem("savedQuestionData");
        if (data !== null) {
          setSavedData(JSON.parse(data));
        }
      } catch (error) {
        console.error("Error fetching data from AsyncStorage:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <ActivityIndicator style={styles.loader} size="large" color="#0000ff" />
    );
  }

  const AddQuestion3 = async (questionId, optionId, surveyId, choice) => {
    console.log("questionId", questionId);
    console.log(optionId);
    console.log(surveyId);
    console.log(choice);
    try {
      const config = {
        headers: {
          Authorization: `Token ${user.token}`, // Supplying token in the headers
          "Content-Type": "application/json",
        },
      };
      const res = await axios.post(
        "https://dev.shiriki.org/api/save-text/",
        {
          selectedvalue: choice,
          questionId: "7",
          surveyId: "3",
        },
        config
      );
      console.log("====================================");
      console.log(res.data);
      console.log("====================================");
      if ((res.data.code = 200)) {
        console.log("====================================");
        console.log("hell done");
        console.log("====================================");
        setCheckedIndex(choice);
        toast.show("Question answered successfully");
      }
      // Pass config as the third argument to axios.post
      // If the request is successful, you can handle any additional logic here
      console.log("Commentfsfsfsf added successfully!");
    } catch (error) {
      // Handle any errors that occur during the POST request
      console.error("Error adding Comment:", error.JSON());
    } finally {
      setIsLoading(false); // Reset loading state after the request is complete
    }
  };

  const [checkedIndex1, setCheckedIndex1] = useState({});

  const AddQuestion4 = async (
    questionId,
    optionId,
    ratingvalue,
    surveyId,
    topicId,
    ratingid,
    choice
  ) => {
    console.log("questionId", questionId);
    console.log(optionId);
    console.log(surveyId);
    console.log(choice);
    try {
      const config = {
        headers: {
          Authorization: `Token ${user.token}`, // Supplying token in the headers
          "Content-Type": "application/json",
        },
      };
      const res = await axios.post(
        "https://dev.shiriki.org/api/save-ratings/",
        {
          ratingvalue: "1",
          ratingid: "9",
          topicId: "2",
          subtopic: "4",
          questioncategory: "",
          surveyId: surveyId,
        },
        config
      );
      console.log("====================================");
      console.log(res.data);
      console.log("====================================");
      if ((res.data.code = 200)) {
        console.log("====================================");
        console.log("hell done");
        console.log("====================================");
        toast.show("Question answered successfully");
      }

      console.log("Commentfsfsfsf added successfully!");
    } catch (error) {
      console.error("Error adding Comment:", error.JSON());
    } finally {
      setIsLoading(false); // Reset loading state after the request is complete
    }
  };
  const [load, setLoad] = useState(false);
  const FullSurvey = async (surveyId) => {
    toast.show("Survey Submitted");
    // try {
    //   setLoad(true);
    //   const config = {
    //     headers: {
    //       Authorization: `Token ${user.token}`, // Supplying token in the headers
    //       "Content-Type": "application/json",
    //     },
    //   };
    //   const res = await axios.post(
    //     "https://dev.shiriki.org/api/sendsurvey/",
    //     {
    //       surveyId,
    //     },
    //     config
    //   );

    //   if ((res.data.code = 200)) {
    //     setLoad(false);
    //     toast.show("Survey Submitted successfully");
    //     navigation.navigate("Home");
    //   }
    //   // Pass config as the third argument to axios.post
    //   // If the request is successful, you can handle any additional logic here
    //   console.log("Commentfsfsfsf added successfully!");
    // } catch (error) {
    //   setLoad(false);
    //   toast.show(error);

    //   // Handle any errors that occur during the POST request
    //   console.error("Error adding Comment:", error.JSON());
    // } finally {
    //   setIsLoading(false); // Reset loading state after the request is complete
    // }
  };
  const question = "What's your favorite programming language?";
  const options = ["JavaScript", "Python"];
  const [results, setResults] = useState(Array(options.length).fill(0));
  const [selectedOption, setSelectedOption] = useState(null);

  const handleVote = (index) => {
    const newResults = [...results];
    newResults[index] += 1;
    setResults(newResults);
    setSelectedOption(index);
  };

  const totalVotes = results.reduce((a, b) => a + b, 0);

  return (
    <ScrollView className="p-1 mt-5 mb-7">
      {loading ? (
        <Text>Loading...</Text>
      ) : (
        <View className="bg-white rounded-lg">
          {forums.map((survey) => {
            return (
              <View
                key={survey.survey_id}
                style={{
                  padding: 4,
                  flex: 1,
                  marginTop: 10,
                  justifyContent: "center",
                }}
              >
                {/* {survey.length==0?(<Text>jjj</Text>):<Text>none</Text>} */}
                <View className="flex mt-5 flex-row gap-5 items-center">
                  <TouchableOpacity onPress={() => navigation.navigate("Home")}>
                    <Icon name="arrowleft" size={30} />
                  </TouchableOpacity>
                  <Text
                    className="capitalize font-bold"
                    style={{ fontSize: 19, color: "green" }}
                  >
                    {decode(survey.name.replace(/<[^>]+>/g, ""))}{" "}
                  </Text>
                </View>

                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: 10,
                  }}
                >
                  <Text
                    className="italic"
                    style={{ color: "grey", fontSize: 13, marginTop: 10 }}
                  >
                    {survey.institution}
                  </Text>

                  <Text
                    className="italic"
                    style={{ color: "red", fontSize: 12 }}
                  >
                    End date : {new Date(survey.end_date).toLocaleDateString()}
                  </Text>
                </View>
                <Text
                  style={{
                    padding: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                    textAlign: "justify",
                  }}
                >
                  {decode(survey.description.replace(/<[^>]+>/g, ""))}
                </Text>
                <View>
                  <Text className="text-red-500 mt-2 font-bold underline">
                    Participate i the survey
                  </Text>
                </View>
                <View
                  className=" border bg-white border-slate-300 p-2 mt-5 rounded-lg"
                                  >
                  <Text style={styles.question}>{question}</Text>
                  {options.map((option, index) => (
                    <View key={index} style={styles.optionContainer}>
                      <CheckBox
                        title={option}
                        checked={selectedOption === index}
                        onPress={() => handleVote(index)}
                        checkedIcon="dot-circle-o"
                        uncheckedIcon="circle-o"
                        disabled={selectedOption !== null}
                        containerStyle={styles.checkBox}
                      />
                      <Text style={styles.result}>
                        {results[index]} votes (
                        {((results[index] / totalVotes) * 100 || 0).toFixed(1)}
                        %)
                      </Text>
                      <Progress.Bar
                        progress={results[index] / totalVotes || 0}
                        width={Dimensions.get("window").width - 40}
                        height={10}
                        color="#3b5998"
                        style={styles.progressBar}
                      />
                    </View>
                  ))}
                </View>
                {survey.questions.map((question) => {
                  return (
                    <View
                      className=" flex flex-col gap-1 mt-5"
                      key={question.question_id}
                    >
                      <View
                        className=" border border-slate-300"
                        style={{
                          width: 383,
                          paddingRight: 20,
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 20,
                          backgroundColor: "white",
                          padding: 5,
                          borderRadius: 5,
                        }}
                      >
                        <View className="flex flex-column">
                          <View
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              width: 270,
                            }}
                          >
                            <Text style={{ marginRight: 10 }}>
                              {question.question_id}.{")"}
                            </Text>
                            <View
                              style={{ display: "flex", flexDirection: "row" }}
                              className="flex flex-row"
                            >
                              <Text className="text-slate-700">
                                {decode(
                                  question.question
                                    .replace(/<[^>]+>/g, "")
                                    .toUpperCase()
                                    .charAt(0) +
                                    question.question
                                      .replace(/<[^>]+>/g, "")
                                      .slice(1)
                                )}
                              </Text>

                              <Text>?</Text>
                            </View>
                          </View>

                          {question.choices.map((choice, index) => {
                            return (
                              <View
                                key={index}
                                style={{
                                  display: "flex",
                                  // gap: 10,
                                  justifyContent: "flex-start",
                                  flexDirection: "row",
                                  alignItems: "center",

                                  // padding: 10,
                                  borderRadius: 6,
                                }}
                                className="flex justify-start flex-row"
                              >
                                {question.question_type ===
                                  "Single-Choice Questions" && (
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                      gap: 10,
                                      padding: 10,
                                    }}
                                  >
                                    <View
                                      style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        // padding: 5,
                                        // gap: 16,
                                      }}
                                      className="flex flex-row items-center  justify-between gap-8"
                                    >
                                      <Checkbox
                                        className=" m-2 "
                                        style={styles.checkbox}
                                        value={choice.choice === checkedIndex}
                                        onValueChange={() => {
                                          setCheckedIndex(choice.choice);

                                          AddQuestion1(
                                            choice.question_id,
                                            survey.survey_id,
                                            choice.choice_id,
                                            choice.choice
                                          );
                                        }}
                                      />
                                    </View>
                                    <Text className="mb-3">
                                      {" "}
                                      {choice.choice}
                                    </Text>
                                  </View>
                                )}
                              </View>
                            );
                          })}

                          {question.choices.map((choice) => {
                            return (
                              <View key={choice.id}>
                                {question.question_type ===
                                  "Rating scale questions" && (
                                  <View>
                                    <View>
                                      <Text
                                        style={{
                                          textTransform: "capitalize",
                                          color: "green",
                                        }}
                                        className="text-green-700 pt-4 capitalize"
                                      >
                                        {decode(
                                          choice.name.replace(/<[^>]+>/g, "")
                                        )}
                                      </Text>
                                      {choice.sub_topics.map((topic) => (
                                        <View
                                          style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            flexDirection: "column",
                                          }}
                                          key={topic.id}
                                          className="flex flex-col items-start justify-between ml-5"
                                        >
                                          <View
                                            style={{
                                              height: 1,
                                              width: 400,
                                            }}
                                            className="bg-slate-300"
                                          ></View>
                                          <Text className="text-red-500 capitalize">
                                            {decode(
                                              topic.name.replace(/<[^>]+>/g, "")
                                            )}
                                          </Text>
                                          <View
                                            style={{
                                              display: "flex",
                                              flexDirection: "column",
                                              gap: 7,
                                            }}
                                            className="flex flex-col gap-3"
                                          >
                                            {/* Title row */}
                                            <View className="flex flex-row items-center ml-7 justify-between">
                                              <Text className="text-green-600">
                                                Strongly Disagree
                                              </Text>

                                              <Text className="text-red-600">
                                                Agree
                                              </Text>
                                              <Text className="text-blue-800">
                                                Strongly Agree
                                              </Text>
                                            </View>
                                            {topic.choices.map(
                                              (choice, index) => (
                                                <View
                                                  key={index}
                                                  className="flex flex-row items-center justify-between"
                                                >
                                                  <Text className="pt-3">
                                                    {choice.name.replace(
                                                      /<[^>]+>/g,
                                                      ""
                                                    )}
                                                    {choice.optionId}
                                                  </Text>
                                                  <Text>:</Text>
                                                  {[1, 2, 3, 4, 5].map(
                                                    (boxIndex) => (
                                                      <View
                                                        className="ml-3"
                                                        key={boxIndex}
                                                      >
                                                        <Checkbox
                                                          className="m-2"
                                                          style={
                                                            styles.checkbox
                                                          }
                                                          value={
                                                            checkedIndex1[
                                                              `${choice.range_id}-${boxIndex}`
                                                            ] || false
                                                          }
                                                          onValueChange={() => {
                                                            setCheckedIndex1(
                                                              (prevState) => {
                                                                // Ensure only one checkbox is selected per row
                                                                const updatedState =
                                                                  Object.keys(
                                                                    prevState
                                                                  )
                                                                    .filter(
                                                                      (key) =>
                                                                        !key.startsWith(
                                                                          `${choice.range_id}-`
                                                                        )
                                                                    )
                                                                    .reduce(
                                                                      (
                                                                        obj,
                                                                        key
                                                                      ) => {
                                                                        obj[
                                                                          key
                                                                        ] =
                                                                          prevState[
                                                                            key
                                                                          ];
                                                                        return obj;
                                                                      },
                                                                      {}
                                                                    );
                                                                return {
                                                                  ...updatedState,
                                                                  [`${choice.range_id}-${boxIndex}`]:
                                                                    !prevState[
                                                                      `${choice.range_id}-${boxIndex}`
                                                                    ],
                                                                };
                                                              }
                                                            );
                                                            AddQuestion4(
                                                              choice.id,
                                                              choice.range_id,
                                                              topic.id,
                                                              (subtopic = "4"),
                                                              (questioncategory =
                                                                ""),
                                                              survey.surveyId
                                                            );
                                                          }}
                                                        />
                                                      </View>
                                                    )
                                                  )}
                                                </View>
                                              )
                                            )}
                                          </View>
                                        </View>
                                      ))}
                                    </View>
                                  </View>
                                )}
                              </View>
                            );
                          })}

                          <View
                            style={{
                              display: "flex",
                              gap: 10,
                              justifyContent: "flex-start",
                              flexDirection: "row",
                            }}
                            className="flex w-full justify-start flex-row"
                          >
                            {question.question_type === "Text Areas" && (
                              <View className="">
                                <Text>Answer the survey question</Text>
                                <View>
                                  <TextInput
                                    placeholder="Type your answer"
                                    style={{
                                      width: 360,
                                      // borderColor: "green",
                                      // borderWidth: 1,
                                      // borderRadius: 6,
                                      height: 40,
                                      marginBottom: 10,
                                      marginTop: 10,
                                    }}
                                    className="border border-slate-300  rounded-lg  h-39"
                                    multiline
                                    onChangeText={(text) => setComment(text)}
                                    value={comment} // Add value prop to bind the input field to the comment state
                                  />
                                </View>
                                <View className="mt-3">
                                  <TouchableOpacity
                                    className="border  p-1 rounded border-green-100"
                                    onPress={() =>
                                      handleShowChoice1(
                                        question.question_type,
                                        survey.survey_id,
                                        question.question_id,
                                        setComment("")
                                      )
                                    }
                                  >
                                    <Text className="text-center">send</Text>
                                  </TouchableOpacity>
                                  {/* <Button
                                    
                                    color="red"
                                    title={isLoading ? "Submitting" : "Send"}
                                  /> */}
                                </View>
                              </View>
                            )}
                          </View>

                          {question.question_type === "Select" && (
                            <View
                              style={{ width: 350 }}
                              className="border flex items-center border-slate-200 p-2"
                            >
                              <Text>Select the choices</Text>
                              <RNPickerSelect
                                pickerProps={{
                                  accessibilityLabel: selectedItem.title,
                                }}
                                style={pickerSelectStyles}
                                onValueChange={(value) => {
                                  const selectedChoice = question.choices.find(
                                    (choice) => choice.choice === value
                                  );
                                  const choiceData = {
                                    question_id: question.question_id,
                                    survey_id: survey.survey_id,
                                    choice_id: selectedChoice.choice_id,
                                    choice: selectedChoice.choice,
                                  };

                                  AddQuestion3(
                                    question.question_id,
                                    survey.survey_id,
                                    choiceData.choice
                                  );
                                }}
                                items={question.choices.map((choice) => ({
                                  label: choice.choice,
                                  value: choice.choice,
                                }))}
                              />
                            </View>
                          )}

                          {question.choices.map((choice, index) => {
                            return (
                              <View
                                key={index}
                                style={{
                                  display: "flex",
                                  gap: 10,
                                  justifyContent: "flex-start",
                                  flexDirection: "row",
                                  alignItems: "center",

                                  padding: 10,
                                  borderRadius: 6,
                                }}
                                className="flex justify-start flex-row"
                              >
                                {question.question_type ===
                                  "Multiple-Choice Questions" && (
                                  <View
                                    style={{
                                      flexDirection: "row",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                      gap: 10,
                                    }}
                                  >
                                    <View
                                      style={{
                                        display: "flex",
                                        flexDirection: "row",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        padding: 5,
                                        gap: 16,
                                      }}
                                      className="flex flex-row items-center  justify-between gap-8"
                                    >
                                      <Checkbox
                                        className=" m-2 0"
                                        style={styles.checkbox}
                                        value={choice.choice === checkedIndex}
                                        onValueChange={() => {
                                          setCheckedIndex(choice.choice);

                                          AddQuestion2(
                                            choice.question_id,
                                            survey.survey_id,
                                            choice.choice_id,
                                            choice.choice
                                          );
                                        }}
                                      />
                                    </View>
                                    <Text className="mb-3">
                                      {" "}
                                      {choice.choice}
                                    </Text>
                                  </View>
                                )}
                              </View>
                            );
                          })}
                        </View>
                      </View>

                      {question.choices.map((choice, index) => {
                        return (
                          <View
                            key={index}
                            style={{
                              display: "flex",
                              gap: 10,
                              justifyContent: "flex-start",
                              flexDirection: "row",
                            }}
                            className="flex justify-start flex-row"
                          ></View>
                        );
                      })}
                    </View>
                  );
                })}
                <View style={{ width: 370 }} className="mt-8 mb-8 ">
                  <TouchableOpacity
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "green",
                      padding: 5,
                      borderRadius: 10,
                    }}
                    className="flex text-center items-center justify-center bg-green-700 rounded-lg p-2"
                    onPress={() => {
                      FullSurvey(survey.survey_id);
                      navigation.navigate("Home");
                    }}
                  >
                    <Text style={{ color: "white" }} className="text-white">
                      {load ? "Submitting..." : "Submit the survey"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
};

export default SingleForum;

const styles = StyleSheet.create({
  logoContainer: {
    height: 55,
    width: 55,
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 27.5,
    overflow: "hidden",
  },
  logo: {
    height: 55,
    width: 55,
    resizeMode: "contain",
  },
  container: {
    justifyContent: "center",
    backgroundColor: "#ecf0f1",
  },
  video: {
    alignSelf: "center",
    width: 320,
    height: 200,
  },
  btn: {
    height: 30,
  },
  input: {
    width: "80%",
    height: 40,
    borderColor: "green",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    height: 30,
    borderColor: "green",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
  },
  input1: {
    width: "70%",
    height: 30,
    borderColor: "green",
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    backgroundColor: "green",
    borderRadius: 6,
    height: 30,
    marginTop: 15,
  },
  button: {
    backgroundColor: "green",
    padding: 4,
    width: 43,
    borderRadius: 5,
  },
  container: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  question: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  result: {
    marginLeft: 10,
  },
  container: {
    flex: 1,
    padding: 20,
  },
  question: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  optionContainer: {
    marginBottom: 20,
    alignItems: "center",
  },
  result: {
    marginTop: 10,
    marginBottom: 10,
  },
});
