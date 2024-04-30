import {
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
} from "react-native";
import { useToast } from "react-native-toast-notifications";

import Checkbox from "expo-checkbox";
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
import React, { useEffect, useState } from "react";
import Icon from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/FontAwesome";
import Ionicons1 from "react-native-vector-icons/Ionicons";
import Ionicons2 from "react-native-vector-icons/Feather";
import Ionicons3 from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons4 from "react-native-vector-icons/Entypo";
import { FileSystem } from "expo";
import { useSelector } from "react-redux";
import axios from "axios";
import { decode } from "html-entities";
import RNPickerSelect from "react-native-picker-select";

const SingleForum = ({ route,navigation }) => {
  const toast = useToast();

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

  const { id } = route.params;
  // console.log('====================================');
  console.log(id);
  console.log("====================================");
  const { user } = useSelector((state) => state.auth);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);

  const [forums, setForums] = useState([]);
  // console.log("====================================");
  // console.log("singleSurvey", forums);
  // console.log("====================================");
  useEffect(() => {
    async function fetchData() {
      try {
        const token = user.token;
        // console.log("token", token);
        const config = {
          headers: {
            Authorization: `Token ${user.token}`,
            "Content-Type": "application/json",
          },
        };

        const res = await axios.get(
          `http://137.184.9.57/api/get-surveys/`,
          config
        );
        const forumsData = res.data.surveys;

        const filteredForum = forumsData.filter(
          (forum) => id === forum.survey_id
        );
        setForums(filteredForum);
        setLoading(false);
      } catch (error) {
        console.log("error", error);
        setLoading(false);
      }
    }
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
  const handleChoiceSelected = async (questionId, choice, id, id1, id2) => {
    setCurrentChoices({
      ...currentChoices,
      [questionId]: choice,
    });

    console.log("hello", id);
    console.log("helloww", id1);
    console.log("hello", id2);

    try {
      setIsLoading(true); // Set loading state

      const config = {
        headers: {
          Authorization: `Token ${user.token}`, // Supplying token in the headers
          "Content-Type": "application/json",
        },
      };

      const res = await axios.post(
        "http://137.184.9.57/api/save-multiple-choice/",
        {
          questionId: id2,
          optionId: id,
          surveyId: id1,
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
          "http://137.184.9.57/api/save-text/",
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
        "http://137.184.9.57/api/save-text/",
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
    console.log(questionId);
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
        "http://137.184.9.57/api/save-single-choice/",
        {
          questionId: questionId,
          optionId: optionId,
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
        "http://137.184.9.57/api/save-text/",
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
        "http://137.184.9.57/api/save-ratings/",
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
  const [load, setLoad] = useState(false);
  const FullSurvey = async (surveyId) => {
    try {
      setLoad(true);
      const config = {
        headers: {
          Authorization: `Token ${user.token}`, // Supplying token in the headers
          "Content-Type": "application/json",
        },
      };
      const res = await axios.post(
        "http://137.184.9.57/api/send-survey/",
        {
          surveyId,
        },
        config
      );

      if ((res.data.code = 200)) {
        setLoad(false);
        toast.show("Survey Submitted successfully");
        navigation.navigate("Home");
      }
      // Pass config as the third argument to axios.post
      // If the request is successful, you can handle any additional logic here
      console.log("Commentfsfsfsf added successfully!");
    } catch (error) {
      setLoad(false);
      toast.show(error);

      // Handle any errors that occur during the POST request
      console.error("Error adding Comment:", error.JSON());
    } finally {
      setIsLoading(false); // Reset loading state after the request is complete
    }
  };
  return (
    <ScrollView>
      {loading? (
        <Text>Loading...</Text>
      ):(
        <View>
{forums.map((survey) => {
        return (
          <View
            style={{
              padding: 10,
              flex: 1,
              marginTop: 10,
              justifyContent: "center",
            }}
          >
            <Text className="capitalize" style={{ fontSize: 19, color: "red" }}>
              {decode(survey.name.replace(/<[^>]+>/g, ""))}{" "}
            </Text>
            <Text
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                textAlign: "end",
                width: 370,
              }}
            >
              {decode(survey.description.replace(/<[^>]+>/g, ""))}
            </Text>

            <View
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text style={{ color: "grey", fontSize: 13, marginTop: 10 }}>
                {survey.institution}
              </Text>

              <Text style={{ color: "green", fontSize: 12 }}>
                End date : {new Date(survey.end_date).toLocaleDateString()}
              </Text>
            </View>
            <Text className="mt-4">Surveys</Text>
            {survey.questions.map((question) => {
              return (
                <View>
                  <View className="flex flex-row justify-between items-center gap-3">
                    <View className="flex flex-row w-48">
                      <Text className="mr-3">
                        {question.question_id}.{")"}
                      </Text>
                      <View className="flex flex-row  ">
                        <Text className="text-red-400">
                          {decode(
                            question.question
                              .replace(/<[^>]+>/g, "")
                              .toUpperCase()
                              .charAt(0) +
                              question.question.replace(/<[^>]+>/g, "").slice(1)
                          )}
                        </Text>

                        <Text>?</Text>
                      </View>
                    </View>
                    <TouchableOpacity
                      onPress={() => {
                        handleShowChoice(question.question_id);
                        setShowChoice(true);
                      }}
                      className="flex items-center pt-1 rounded-lg bg-green-800 text-white w-24 h-8  text-center"
                    >
                      <Text className=" text-white  text-center mb-2 h-8">
                        choices
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View>
                    {qId === question.question_id && (
                      <ScrollView>
                        <View className="flex justify-start flex-row">
                          {question.question_type === "Select" && (
                            <View className="flex flex-row items-center justify-between">
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
                        </View>

                        {question.choices.map((choice, index) => {
                          return (
                            <View
                              key={index}
                              className="flex justify-start flex-row    "
                            >
                              {question.question_type ===
                                "Single-Choice Questions" && (
                                <View
                                  style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <View className="flex flex-row items-center justify-between gap-8">
                                    {/* {checkedIndex ===null?( */}
                                    <Checkbox
                                      className=" m-2"
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
                                    {/* //   ):(
                                //  <Text>Question already answered</Text>
                                //   )} */}
                                  </View>
                                  <Text> {choice.choice}</Text>
                                </View>
                              )}
                            </View>
                          );
                        })}
                        {question.choices.map((choice) => {
                          return (
                            <View className="flex justify-start flex-row    ">
                              {question.question_type ===
                                "Rating scale questions" && (
                                <View className="flex flex-row items- justify-between">
                                  <View style={styles.section}>
                                    <Text className="text-green-700 pt-4 capitalize">
                                      {decode(
                                        choice.name.replace(/<[^>]+>/g, "")
                                      )}
                                    </Text>
                                    {choice.sub_topics.map((topic) => (
                                      <View
                                        key={topic.id}
                                        className="flex flex-col items-start justify-between"
                                      >
                                        <View
                                          style={{
                                            height: 1,
                                            width: 400,
                                            backgroundColor: "black",
                                          }}
                                          className=""
                                        ></View>
                                        <Text className="text-red-500 capitalize">
                                          {decode(
                                            topic.name.replace(/<[^>]+>/g, "")
                                          )}
                                        </Text>
                                        <View className="flex flex-col gap-3">
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
                                                        style={styles.checkbox}
                                                        value={
                                                          checkedIndex1[
                                                            `${choice.range_id}-${boxIndex}`
                                                          ] || false
                                                        } // Default to false if state is not initialized yet
                                                        onValueChange={() => {
                                                          setCheckedIndex1(
                                                            (prevState) => ({
                                                              ...prevState,
                                                              [`${choice.range_id}-${boxIndex}`]:
                                                                !prevState[
                                                                  `${choice.range_id}-${boxIndex}`
                                                                ],
                                                            })
                                                          );
                                                          AddQuestion4(
                                                            choice.id,
                                                            choice.range_id,
                                                            topic.id,
                                                            (subtopic = "4"),
                                                            (questioncategory =
                                                              ""),
                                                            survey.surveyId
                                                          ); // Perform any actions needed
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
                        <View className="flex w-full justify-start flex-row">
                          {question.question_type === "Text Areas" && (
                            <View className="">
                              <Text>Answer the question</Text>
                              <View>
                                <TextInput
                                  style={{ width: 360 }}
                                  className="border border-green-700  rounded-lg  h-32"
                                  multiline
                                  onChangeText={(text) => setComment(text)}
                                  value={comment} // Add value prop to bind the input field to the comment state
                                />
                              </View>
                              <View className="mt-3">
                                <Button
                                  onPress={() =>
                                    handleShowChoice1(
                                      question.question_type,
                                      survey.survey_id,
                                      question.question_id,
                                      setComment("")
                                    )
                                  }
                                  color="green"
                                  title={isLoading ? "Submitting" : "Send"}
                                />
                              </View>
                            </View>
                          )}
                        </View>
                        {question.choices.map((choice, index) => {
                          return (
                            <View
                              key={index}
                              className="flex justify-start flex-row"
                            ></View>
                          );
                        })}
                        {/* {question.choices.map((choice, index) => {
                          return (
                            <View
                              key={index}
                              className="flex justify-start flex-row"
                            >
                              {question.question_type ===
                                "Multiple-Choice Questions" && (
                                <View className="flex flex-row items-center justify-between">
                                  <RadioButtonGroup
                                    containerStyle={{ marginBottom: 10 }}
                                    selected={current === choice.value}
                                    onSelected={(value) => setCurrent(value)}
                                    radioBackground="green"
                                  >
                                    <RadioButtonItem
                                      value={choice.value}
                                      label={
                                        <Text style={{ color: "black" }}>
                                          {choice.choice}
                                        </Text>
                                      }
                                    />
                                  </RadioButtonGroup>
                                </View>
                              )}
                            </View>
                          ); */}
                        {/* })} */}
                        {question.choices.map((choice1, index, id) => {
                          return (
                            <View
                              key={index}
                              className="flex justify-start flex-row"
                            >
                              {question.question_type ===
                                "Multiple-Choice Questions" && (
                                <View
                                  key={index}
                                  className="flex justify-start flex-row"
                                >
                                  <View className="flex flex-row items-center justify-between">
                                    <RadioButtonGroup
                                      containerStyle={{ marginBottom: 10 }}
                                      selected={currentChoices[index]}
                                      onSelected={(choice, id, id1, id2) =>
                                        handleChoiceSelected(
                                          index,
                                          choice,
                                          (id = choice1.choice_id),

                                          // id2="choice1.question_id"
                                          (id1 = survey.survey_id),
                                          (id2 = choice1.question_id)
                                        )
                                      }
                                      radioBackground="green"
                                    >
                                      <RadioButtonItem
                                        value
                                        label={
                                          <Text style={{ color: "black" }}>
                                            {choice1.choice}
                                          </Text>
                                        }
                                      />
                                    </RadioButtonGroup>
                                  </View>
                                </View>
                              )}
                            </View>
                          );
                        })}
                      </ScrollView>
                    )}
                  </View>
                </View>
              );
            })}
            <View style={{ width: 370 }} className="mt-8 ">
              <TouchableOpacity
                className="flex text-center items-center justify-center bg-green-700 rounded-lg p-2 "
                onPress={() => {
                  FullSurvey(survey.survey_id);
                  
                }}
                
              >
                <Text className="text-white">
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
});
