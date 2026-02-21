import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

export default function Settings() {
  const router = useRouter();

  const handleLogout = async () => {
    await SecureStore.deleteItemAsync('userPin');
    router.replace('/');
  };

  const SettingItem = ({
    icon,
    label,
    onPress,
    danger = false,
  }: {
    icon: keyof typeof MaterialIcons.glyphMap;
    label: string;
    onPress?: () => void;
    danger?: boolean;
  }) => (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <MaterialIcons
        name={icon}
        size={24}
        color='#000000'
      />
      <Text
        style={[
          styles.cardText,
          danger && { color: '#000000' },
        ]}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar /* Forcer le style sombre de la barre de statut */ barStyle="dark-content" backgroundColor='#f0f0f0' />
      {/* Sticky Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
        >
          <MaterialIcons name="keyboard-arrow-left" size={40} color="#333" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Paramètres</Text>

        {/* Spacer pour centrer le titre */}
        <View style={{ width: 26 }} />
      </View>

      {/* Contenu scrollable */}
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Général</Text>

        <SettingItem icon="person" label="Profil" />
        <SettingItem icon="lock" label="Sécurité" />
        <SettingItem icon="notifications" label="Notifications" />
        <SettingItem
          icon="logout"
          label="Se déconnecter"
          onPress={handleLogout}
          danger
        />
         <Text style={{textAlign: 'center', marginTop: 20, color: '#000000'}}>Uba Orabank</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },

  /* HEADER */
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: '#f0f0f0',
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },

  /* CONTENT */
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    gap: 12,
  },

  sectionTitle: {
    fontSize: 16,
    color: 'gray',
    marginBottom: 12,
  },

  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },

  cardText: {
    marginLeft: 16,
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
});