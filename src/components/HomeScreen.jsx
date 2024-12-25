import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ToastAndroid,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({navigation}) => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  const accessories = [
    {
      id: '1',
      name: 'Bluetooth Headset',
      available: 'In Stock',
      price: '$29.99',
      image: 'https://cdn-icons-png.freepik.com/256/1554/1554363.png',
    },
    {
      id: '2',
      name: 'Smartwatch',
      available: 'Out of Stock',
      price: '$59.99',
      image: 'https://cdn11.bigcommerce.com/s-10c6f/images/stencil/1280x1280/products/58356/85040/FS46092__41401.1606332969.jpg?c=2',
    },
    {
      id: '3',
      name: 'Wireless Mouse',
      available: 'In Stock',
      price: '$19.99',
      image: 'https://cdn-icons-png.freepik.com/256/4163/4163092.png',
    },
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts(searchQuery);
  }, [searchQuery, products]);

  // Load products from local storage
  const loadProducts = async () => {
    try {
      const storedProducts = await AsyncStorage.getItem('products');
      if (storedProducts) {
        setProducts(JSON.parse(storedProducts));
      }
    } catch (error) {
      ToastAndroid.show('Failed to load products!', ToastAndroid.SHORT);
    }
  };

  // Save products to local storage
  const saveProducts = async updatedProducts => {
    try {
      await AsyncStorage.setItem('products', JSON.stringify(updatedProducts));
      setProducts(updatedProducts);
    } catch (error) {
      ToastAndroid.show('Failed to save products!', ToastAndroid.SHORT);
    }
  };

  // Add Product
  const addProduct = () => {
    navigation.navigate('AddProduct', {
      onAdd: newProduct => {
        if (products.some(product => product.name === newProduct.name)) {
          ToastAndroid.show('Product already exists!', ToastAndroid.SHORT);
          return;
        }

        const updatedProducts = [...products, newProduct];
        saveProducts(updatedProducts);
        ToastAndroid.show('Product added successfully!', ToastAndroid.SHORT);
      },
    });
  };

  // Delete Product
  const deleteProduct = name => {
    const updatedProducts = products.filter(product => product.name !== name);
    saveProducts(updatedProducts);
    ToastAndroid.show('Product deleted successfully!', ToastAndroid.SHORT);
  };

  // Filter products based on search query
  const filterProducts = query => {
    if (query === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.name.toLowerCase().includes(query.toLowerCase()),
      );
      setFilteredProducts(filtered);
    }
  };

  // Logout Functionality
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      navigation.replace('Login');
      ToastAndroid.show('Logged out successfully!', ToastAndroid.SHORT);
    } catch (error) {
      ToastAndroid.show('Failed to logout!', ToastAndroid.SHORT);
    }
  };

  return (
    <View style={styles.container}>
      {/* Logout Button */}
      <View style={styles.header}>
        <Text style={styles.homeText}>Home</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

    <View style={styles.container2}>
      <TextInput
        placeholder="Search Products..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchBar}
        placeholderTextColor="#000"
      />

      {/* Horizontal Scroll for Products */}
      <Text style={styles.sectionTitle}>Products</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {filteredProducts.length === 0 ? (
          <Text style={styles.noProductText}>No Product Found</Text>
        ) : (
          filteredProducts.map(item => (
            <View key={item.name} style={styles.productItem}>
              <View>
                <Image source={{uri: item.image}} style={styles.productImage} />
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productPrice}>${item.price}</Text>
              </View>
              <TouchableOpacity
                onPress={() => deleteProduct(item.name)}
                style={styles.deleteButton}>
                <Image
                  source={{
                    uri: 'https://cdn-icons-png.flaticon.com/512/3405/3405244.png',
                  }}
                  style={styles.deleteIcon}
                />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      {/* Horizontal Scroll for Accessories */}
      <Text style={styles.sectionTitle}>Accessories</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {accessories.map(item => (
          <View key={item.id} style={styles.productItem}>
            <Image source={{uri: item.image}} style={styles.productImage} />
            <Text style={styles.productName}>{item.name}</Text>
            <Text style={styles.productPrice}>{item.price}</Text>
            <Text style={styles.productStock}>{item.available}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity style={styles.addButton} onPress={addProduct}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff',},
  container2: { padding:16},
  logoutButton: {
    alignSelf: 'flex-end',
    backgroundColor: '#ff6b6b',
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#213D77', // Dark blue
    paddingVertical: 12,
    paddingHorizontal: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4, 
    marginBottom: 20
  },

  homeText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  logoutButton: {
    padding: 8,
  },
  logoutText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },

  logoutText: {color: '#fff', fontWeight: 'bold'},
  searchBar: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 8,
  },
  noProductText: {
    textAlign: 'center',
    fontSize: 18,
    marginTop: 20,
  },
  productItem: {
    marginRight: 16,
    padding: 8,

    backgroundColor: '#F2F2F2',
    borderRadius: 8,
    alignItems: 'center',
    width: 180,
    height: 200,
  },
  productImage: {
    width: 150,
    height: 120,
    borderRadius: 10,
    marginBottom: 8,
    position: 'relative',
  },
  productName: {fontSize: 14, fontWeight: 'bold'},
  productPrice: {fontSize: 12, color: '#888'},
  productStock: {fontSize: 12, marginTop: 4},
  deleteButton: {
    padding: 5,
    borderRadius: 8,
    right: 20,
    marginTop: 15,
    position: 'absolute',
    marginBottom: 50,
    backgroundColor: '#fff',
  },
  deleteIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  addButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#007bff',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {fontSize: 24, color: '#fff'},
});
