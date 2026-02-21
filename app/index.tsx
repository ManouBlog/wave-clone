import { useEffect } from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import { useRouter } from 'expo-router'

export default function Index() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(protected)/pinCode')
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/logo_wave.jpg')} style={{ width: 150, height: 150 }} />
      <Text style={styles.text}>Wave</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:"white"
  },
  text: {
    marginTop: 20,
    fontSize: 63,
    fontWeight: 'bold',
    marginHorizontal:-35,
  }
})
