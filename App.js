import React, {useState} from 'react';
import {TextInput} from 'react-native';
import {TouchableOpacity} from 'react-native';
import SInfo from 'react-native-sensitive-info';
import {SafeAreaView, StyleSheet, Text, View} from 'react-native';

const DATA_KEY = 'SOME_DATA_2';

const App = () => {
  const [value, setValue] = useState('');
  const [dataReturn, setDataReturn] = useState('');
  const [isDataSaved, setIsDataSaved] = useState(false);

  const onSaveData = async () => {
    try {
      await SInfo.setItem(DATA_KEY, value, {
        sharedPreferencesName: 'mySharedPrefs',
        keychainService: 'myKeychain',
        touchID: true, //add this key
        showModal: true, //add this key
        kSecAccessControl: 'kSecAccessControlBiometryCurrentSet', // optional - Add support for FaceID
      });
      setIsDataSaved(true);
    } catch (error) {
      console.warn(error);
    }
  };

  const onGetData = async () => {
    try {
      const protectedData = await SInfo.getItem(DATA_KEY, {
        sharedPreferencesName: 'mySharedPrefs',
        keychainService: 'myKeychain',
        touchID: true,
        showModal: true, //required (Android) - Will prompt user's fingerprint on Android
        strings: {
          // optional (Android) - You can personalize your prompt
          description: 'Custom Title ',
          header: 'Custom Description',
        },
        // required (iOS) -  A fallback string for iOS
        kSecUseOperationPrompt:
          'We need your permission to retrieve encrypted data',
      });
      setDataReturn(protectedData);
    } catch (error) {
      console.warn(error);
      console.log('error', error, error.message);
    }
  };

  const onClearAll = () => {
    setValue('');
    setDataReturn('');
    setIsDataSaved(false);
  };

  const renderVerticalSpacing = () => <View style={{height: 20}} />;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View style={{alignItems: 'center'}}>
          {!isDataSaved ? (
            <>
              <TextInput
                value={value}
                placeholder={'enter secure value here'}
                onChangeText={setValue}
              />
              {renderVerticalSpacing()}
              <TouchableOpacity onPress={onSaveData} style={styles.button}>
                <Text>Save information</Text>
              </TouchableOpacity>
            </>
          ) : (
            <Text>DATA SAVED</Text>
          )}

          {renderVerticalSpacing()}
          <TouchableOpacity onPress={onGetData} style={styles.button}>
            <Text>Get information</Text>
          </TouchableOpacity>
          {renderVerticalSpacing()}
          <Text>{`Data return: ${dataReturn}`}</Text>
          {renderVerticalSpacing()}
          <TouchableOpacity onPress={onClearAll} style={styles.button}>
            <Text>Clear All</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  button: {
    borderWidth: 1,
    borderColor: 'gray',
    padding: 20,
    borderRadius: 10,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
