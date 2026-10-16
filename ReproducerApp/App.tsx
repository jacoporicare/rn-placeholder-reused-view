/**
 * Reproducer: a single-line TextInput's placeholder is drawn off-centre on iOS
 * (Fabric) when its native view was last used by a multiline TextInput with a
 * lineHeight.
 *
 * Tap 1, 2 and 3 in order. The field shown by step 3 reuses the native view the
 * multiline field from step 1 left in the recycle pool, and its placeholder
 * sits below the red centre line. The reference field at the top was mounted
 * fresh and stays centred.
 *
 * @format
 */

import { useState } from 'react';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';

type Step = 'none' | 'multiline' | 'single';

function SingleLineField({ placeholder }: { placeholder: string }) {
  return (
    <View style={styles.field}>
      <TextInput style={styles.singleLine} placeholder={placeholder} />
      <View pointerEvents="none" style={styles.centreLine} />
    </View>
  );
}

function AppContent() {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<Step>('none');

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <Text style={styles.label}>Reference, mounted once:</Text>
      <SingleLineField placeholder="Search…" />

      <View style={styles.buttons}>
        <Button
          title="1. Mount multiline"
          onPress={() => setStep('multiline')}
        />
        <Button title="2. Unmount it" onPress={() => setStep('none')} />
        <Button
          title="3. Mount single-line"
          onPress={() => setStep('single')}
        />
      </View>

      {step === 'multiline' && (
        <TextInput
          multiline
          style={styles.multiline}
          placeholder="Multiline with lineHeight 34"
        />
      )}
      {step === 'single' && (
        <>
          <Text style={styles.label}>Mounted after the multiline one:</Text>
          <SingleLineField placeholder="Search…" />
        </>
      )}
    </View>
  );
}

function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    gap: 12,
    backgroundColor: 'white',
  },
  label: {
    fontSize: 13,
    color: '#666',
  },
  field: {
    height: 44,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },
  singleLine: {
    height: 42,
    paddingHorizontal: 12,
    fontSize: 17,
  },
  centreLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 20.5,
    height: 1,
    backgroundColor: 'red',
  },
  buttons: {
    gap: 4,
  },
  multiline: {
    height: 120,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    fontSize: 17,
    lineHeight: 34,
  },
});

export default App;
