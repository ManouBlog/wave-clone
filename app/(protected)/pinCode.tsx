import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { CodeField, Cursor , useBlurOnFulfill,
  useClearByFocusCell} from 'react-native-confirmation-code-field';

const CELL_COUNT = 4;
const PIN_CORRECT = '1234';

export default function PinLogin() {

  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [value, setValue] = useState('');
  const [attempts, setAttempts] = useState(0);

   const ref = useBlurOnFulfill({value, cellCount: CELL_COUNT});
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({value,setValue});
  const MAX_ATTEMPTS = 3;

  const handlePinComplete = useCallback(async (pin: string) => {
    if (attempts >= MAX_ATTEMPTS) {
      Alert.alert(
        'Trop de tentatives',
        'Vous avez dépassé le nombre d’essais autorisés.\nRéessayez plus tard.',
        [{ text: 'OK' }]
      );
      return;
    }

    if (pin === PIN_CORRECT) {
      try {
        await SecureStore.setItemAsync('userPin', pin);
        setAttempts(0);
        router.replace('/(protected)/home');
      } catch (error) {
        console.error('Erreur SecureStore:', error);
        Alert.alert('Erreur', 'Impossible de sauvegarder le PIN');
      }
    } else {
      setAttempts((prev) => prev + 1);
      Alert.alert(
        'Code incorrect',
        `Le code saisi est erroné.\nTentatives restantes : ${MAX_ATTEMPTS - attempts - 1}`,
        [{ text: 'OK' }]
      );
      setValue('');
    }
  }, [attempts, router]);

  const handleNumberPress = useCallback(
    (num: number) => {
      if (value.length >= CELL_COUNT) return;

      const newValue = value + num;
      setValue(newValue);

      if (newValue.length === CELL_COUNT) {
        handlePinComplete(newValue);
      }
    },
    [value, handlePinComplete]
  );

  const handleBackspace = useCallback(() => {
    setValue((prev) => prev.slice(0, -1));
  }, []);

const renderCell = useCallback(
  ({ index, symbol, isFocused }: { 
    index: number; 
    symbol: string | null; 
    isFocused: boolean; 
  }) => (
    <View
      key={index}
      style={[
        styles.cell,
        isFocused && styles.focusCell,
        symbol && styles.cellFilled,
      ]}
    >
      <Text
        onLayout={getCellOnLayoutHandler(index)}
        style={[styles.cellText, symbol && styles.cellTextFilled]}
      >
        {isFocused ? <Cursor /> : null}
      </Text>
    </View>
  ),
  [getCellOnLayoutHandler]
);

  return (
      <LinearGradient colors={['#ffffff', '#ffffff']} style={styles.gradient}>
        <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
          <Image source={require('../../assets/images/logo_wave.jpg')} style={{ width: 150, height: 150 }} />
        </View>

        {/* Code Field */}
        <View style={styles.pinContainer}>
          <CodeField
          ref={ref}
          {...props}
            value={value}
            onChangeText={setValue} 
            cellCount={CELL_COUNT}
            rootStyle={styles.codeFieldRoot}
            keyboardType="number-pad"
            textContentType="oneTimeCode"
            autoFocus={false}
            renderCell={renderCell}
          />
        </View>

        {/* Clavier numérique */}
        <View style={[styles.keyboard, { paddingBottom: insets.bottom + 16 }]}>
          {[[1, 2, 3], [4, 5, 6], [7, 8, 9]].map((row, rowIndex) => (
            <View key={rowIndex} style={styles.keyboardRow}>
              {row.map((num) => (
                <TouchableOpacity
                  key={num}
                  style={styles.key}
                  onPress={() => handleNumberPress(num)}
                  activeOpacity={0.75}
                >
                  <Text style={styles.keyText}>{num}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ))}

          <View style={styles.keyboardRow}>
            <View style={styles.keyPlaceholder} />
            <TouchableOpacity
              style={styles.key}
              onPress={() => handleNumberPress(0)}
              activeOpacity={0.75}
            >
              <Text style={styles.keyText}>0</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.keyBackspace}
              onPress={handleBackspace}
              activeOpacity={0.75}
            >
              <MaterialIcons name="backspace" size={32} color="#000000" />
            </TouchableOpacity>
          </View>
           {/* Lien mot de passe oublié */}
        <TouchableOpacity
          style={styles.forgotContainer}
          activeOpacity={0.7}
          onPress={() => Alert.alert('Récupération', 'Contactez le support ou réinitialisez via votre compte.')}
        >
          <Text style={styles.forgotText}>Code oublié ?</Text>
        </TouchableOpacity>
        </View>       
      </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  gradient: {
    flex: 1,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  backButton: {
    position: 'absolute',
    left: 20,
    top: 16,
    padding: 8,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#000000',
    marginTop: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(0, 0, 0, 0.85)',
    marginTop: 8,
  },
  pinContainer: {
    marginVertical: 20,
  },
  codeFieldRoot: {
    width: '100%',
    justifyContent: 'center',
  },

  focusCell: {
    borderColor: '#ffffff',
    backgroundColor: 'rgba(186, 186, 186, 0.18)',
  },

  cellTextFilled: {
    color: '#000000', // indigo-600 ou votre couleur principale
  },
   cell: {
    width: 18,
    height: 18,
    borderRadius: 10,    
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 15,
    backgroundColor: '#91dff793', // bleu très clair par défaut
  },
  cellFilled: {
    backgroundColor: '#0bb3e6cb',  // bleu sombre lorsque rempli
  },
  cellText: {
    color: 'white',
    fontSize: 24,
    textAlign: 'center',
  },
  keyboard: {
    justifyContent: 'flex-end',
  },
  keyboardRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  key: {
    flex: 1,
    height: 78,
    marginHorizontal: 8,
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyText: {
    fontSize: 30,
    fontWeight: '400',
    color: '#000000',
  },
  keyPlaceholder: {
    flex: 1,
    marginHorizontal: 8,
  },
  keyBackspace: {
    flex: 1,
    height: 78,
    marginHorizontal: 8,
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  forgotContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  forgotText: {
    color: '#1dc8fe',
    fontSize: 16,
    fontWeight: '500',
  },
});