/* eslint-disable react-native/no-inline-styles */
import React, { useRef, useState } from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import DuoDragDrop, {
  DuoDragDropRef,
  Word,
  Placeholder,
  Lines,
  DuoAnimatedStyleWorklet,
} from "@jamsch/react-native-duo-drag-drop";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { withSpring, withTiming } from "react-native-reanimated";

const customAnimatedStyle: DuoAnimatedStyleWorklet = (style, isGestureActive) => {
  "worklet";
  // Scale the word when the gesture is active
  style.transform.push({
    scale: withTiming(isGestureActive ? 1.5 : 1, { duration: 250 }),
  });
  style.opacity = withTiming(isGestureActive ? 0.8 : 1, { duration: 250 });
  style.top = withTiming(isGestureActive ? -10 : 0, { duration: 250 });

  // Apply a spring when the word moves to it's destination
  if (!isGestureActive) {
    style.transform[0].translateX = withSpring(style.transform[0].translateX);
    style.transform[1].translateY = withSpring(style.transform[1].translateY);
  }

  return style;
};

export default function App() {
  const [rtl, setRtl] = useState(false);
  const [gradeWords, setGradeWords] = useState<boolean[]>([]);
  const [gesturedDisabled, setGesturesDisabled] = useState(false);
  const [answeredWords, setAnsweredWords] = useState<string[]>([]);
  const [shouldUseCustomWorket, setShouldUseCustomWorket] = useState(false);
  const duoDragDropRef = useRef<DuoDragDropRef>(null);

  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.dragDropContainer}>
        <DuoDragDrop
          ref={duoDragDropRef}
          words={["Juan", "She", "apples", "today", "with", "eats", "her", "another"]}
          wordHeight={45}
          wordGap={4}
          gesturesDisabled={gesturedDisabled}
          rtl={rtl}
          wordBankOffsetY={20}
          wordBankAlignment="center"
          extraData={gradeWords}
          animatedStyleWorklet={shouldUseCustomWorket ? customAnimatedStyle : undefined}
          renderWord={(_word, index) => (
            <Word
              containerStyle={
                typeof gradeWords?.[index] === "boolean" && {
                  backgroundColor: gradeWords?.[index] ? "green" : "red",
                  borderColor: gradeWords?.[index] ? "green" : "red",
                }
              }
              textStyle={{
                color: typeof gradeWords?.[index] === "boolean" ? "white" : "black",
              }}
            />
          )}
          renderPlaceholder={({ style }) => <Placeholder style={[style, { borderRadius: 5 }]} />}
          renderLines={(props) => (
            <Lines {...props} containerStyle={{ backgroundColor: "transparent" }} lineStyle={{ borderColor: "#CCC" }} />
          )}
        />
      </View>
      <View style={{ margin: 10 }}>
        <Button
          title="Get answered words"
          onPress={() => setAnsweredWords(duoDragDropRef.current?.getAnsweredWords() || [])}
        />
        {answeredWords.length > 0 && (
          <View style={{ marginTop: 10 }}>
            <Text>{answeredWords.join(", ")}</Text>
          </View>
        )}
        <View style={{ marginTop: 10 }}>
          <Button
            title="Grade words"
            onPress={() => {
              if (gradeWords.length > 0) {
                setGradeWords([]);
              } else {
                setGradeWords([true, false, true, false, false, true, false, false]);
              }
            }}
          />
        </View>
        <View style={{ marginTop: 10 }}>
          <Button title={`Gestures disabled: ${gesturedDisabled}`} onPress={() => setGesturesDisabled((s) => !s)} />
        </View>
        <View style={{ marginTop: 10 }}>
          <Button
            title={`Use custom animations: ${shouldUseCustomWorket}`}
            onPress={() => setShouldUseCustomWorket((s) => !s)}
          />
        </View>
        <View style={{ marginTop: 10 }}>
          <Button title={`Right-To-Left: ${rtl}`} onPress={() => setRtl((s) => !s)} />
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  dragDropContainer: {
    margin: 20,
    minHeight: 300,
  },
});
