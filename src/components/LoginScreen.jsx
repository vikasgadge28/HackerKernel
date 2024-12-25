import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ToastAndroid,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Icon from 'react-native-vector-icons/FontAwesome';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      ToastAndroid.show('Email and Password are required!', ToastAndroid.SHORT);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('https://reqres.in/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.token) {
          await AsyncStorage.setItem('userToken', data.token);
          navigation.replace('Home'); // Navigate to Home if login is successful
        } else {
          ToastAndroid.show('Unexpected error: No token found!', ToastAndroid.SHORT);
        }
      } else {
        const errorData = await response.json();
        ToastAndroid.show(
          errorData.error || 'Invalid email or password!',
          ToastAndroid.SHORT
        );
      }
    } catch (error) {
      ToastAndroid.show('An error occurred. Please try again!', ToastAndroid.SHORT);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkLogin = async () => {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        navigation.replace('Home');
      }
    };
    checkLogin();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: 'https://img.freepik.com/free-vector/man-working-using-laptop-flat-design_1308-102458.jpg?t=st=1735064500~exp=1735068100~hmac=172186330385f96cd44d31bf6638af29ff2fee09138bbade29f7f928fad51d8d&w=826',
        }}
        style={styles.image}
      />
      <Text style={styles.title}>Login</Text>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />
      <View style={styles.passwordContainer}>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!passwordVisible}
          style={styles.input}
          placeholderTextColor="#000"
        />
        <TouchableOpacity
          onPress={() => setPasswordVisible(!passwordVisible)}
          style={styles.iconButton}>
          <Icon
            name={passwordVisible ? 'eye' : 'eye-slash'}
            size={20}
            color="#000"
          />
        </TouchableOpacity>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>

      <Text style={styles.or}>or</Text>
      <TouchableOpacity style={styles.gmailButton}>
        <Text style={styles.gmailText}>Login with Gmail</Text>
      </TouchableOpacity>

      <Text style={styles.signupText}>
        You don't have an account?{' '}
        <TouchableOpacity>
          <Text style={styles.signupLink}>Sign Up</Text>
        </TouchableOpacity>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 14,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  input: {
    borderBottomColor: '#ddd',
    borderBottomWidth: 0.5,
    padding: 10,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: '#fff',
    width: '100%',
    color: '#000',
    fontSize: 14,
  },
  or: {
    textAlign: 'center',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  iconButton: {
    position: 'absolute',
    right: 10,
    top: 15,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  forgotPassword: {
    marginTop: 10,
    color: '#007BFF',
    fontSize: 14,
    textAlign: 'right',
  },
  signupText: {
    marginTop: 15,
    fontSize: 14,
    textAlign: 'center',
  },
  signupLink: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
  gmailButton: {
    marginTop: 20,
    backgroundColor: '#D3D3D3',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
  },
  gmailText: {
    color: '#000',
    fontSize: 16,
  },
  image: {
    width: 340,
    height: 250,
    resizeMode: 'contain',
    marginBottom: 20,
  },
});

export default LoginScreen;
