import React, { useEffect, useState } from 'react';
import { Layout, List, Button, Icon } from '@ui-kitten/components';
import { StyleSheet, Text, Share, View, Alert } from 'react-native';
import { VictoryPie } from "victory-native";
import { getDatabase, ref, child, get, onValue } from "firebase/database";
const DashboardComp = ({ navigation, route }) => {
  const axios = require('axios');
  const [total, setTotal] = useState(0);
  const [items, setItems] = useState([]);
  const [owner, setOwner] = useState("");
  const [users, setUsers] = useState({});
  const [chartData, setChartData] = useState([]);

  const db = getDatabase();
  const itemRef = ref(db, `/receipts/${route?.params?.receiptId}`);
  useEffect(() => {
    onValue(itemRef, (snapshot) => {
      if (snapshot.exists()) {
        setTotal(snapshot.val().total);
        setItems(snapshot.val().products);
        setOwner(snapshot.val().owner);
        var new_users = {};
        snapshot.val().products.map(item => {
          if ("users" in item) {
            var total_qty = 0
            item.users.forEach(user => {
              total_qty += user.qty
            })
            item.users.map(user => {
              if (!(user.name in new_users)) {
                new_users[user.name] = []
              }
              new_users[user.name].push({
                product: item.name,
                price: item.price * user.qty / total_qty
              })
            })
          }
        })
        setUsers(new_users)
        var new_chart_data = []
        Object.keys(new_users).map(user => {
          var price = 0
          new_users[user].forEach(product => {
            price += product.price
          })
          new_chart_data.push({
            x: user + `\n$ ${price.toFixed(2)}`,
            y: price
          })
        })
        setChartData(new_chart_data);
      } else {
        Alert.alert("No data available");
      }
    });
  }, [])

  const colors = ["#FFBB3D", "#F05E6D", "#AAD0A1", "#E5E5C6", "#AB84EC", "#55D4F0" ]

  const renderItem = ({ item, index }) => {
    var productUser = "users" in item ? item.users.find(user => {
      return user.name === route.params.username
    }) : undefined

    return (
      <Layout style={styles.item}>
      <Layout style={{
        flex: 1,
      }}>
        <Text style={styles.text}>
          {item.name.length > 16 ? item.name.substring(0, 20) + "..." : item.name}
        </Text>
      </Layout>
      <Layout style={{
        flex: 1,
        marginLeft: 55
      }}>
        <Text style={styles.text}>
          ${item.price}
        </Text>
      </Layout>
      <Layout style={styles.itemContent}>
        <Button
          onPress={() => {
            axios.post("http://104.198.190.25:5000/deselect", {
              receipt_id: route.params.receiptId,
              product_idx: index,
              name: route.params.username
            })
            .then(function (response) {
              console.log(response);
            })
          }}
          style={styles.decButton} 
          status='danger' 
          accessoryLeft={<Icon name="minus-outline" />}/>
        <Text style={styles.text}>
          {
            productUser ? productUser.qty : 0
          }
        </Text>
        <Button 
          onPress={() => {
            axios.post("http://104.198.190.25:5000/select", {
              receipt_id: route.params.receiptId,
              product_idx: index,
              name: route.params.username
            })
            .then(function (response) {
              console.log(response);
            })
          }}
          style={styles.incButton} 
          status='danger' 
          accessoryLeft={<Icon name="plus-outline" />}
        />
      </Layout>
    </Layout>
    )
  };

  const onShare = async (receiptId) => {
    try {
      const result = await Share.share({
        message:
          `Please share this link: http://104.198.190.25:5000/redirect?receiptId=${receiptId}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  return (
    <Layout style={styles.container}>
      <Layout style={styles.graph}>
      <VictoryPie
        height={280}
        width={280}
        innerRadius={70}
        padding={{ top: 100, bottom: 100, right: 100, left: 100 }}
        colorScale={colors}
        data={chartData}
        style={{
          labels: {
            fill: '#fff',
            fontSize: 15, 
            padding: 40,
          }
        }}
      />
      <View style={{position: 'absolute', top: 80, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{
          color: '#fff',
          fontSize: 15,
          fontWeight: "bold",
        }}> 
          ${total} 
        </Text>
      </View>
      </Layout>

      <Text style={styles.cartText}>
        Cart
      </Text>

      <Layout style={styles.itemList}>
        <List
          style={styles.listContainer}
          data={items}
          renderItem={renderItem}
        />
        <Layout style={styles.buttonContainer}>
          <Button 
            style={styles.shareButton}
            onPress={() => onShare(route.params.receiptId)}  
          >
            Share
          </Button>
          <Button 
            style={styles.doneButton}
            onPress={ () => {
              navigation.navigate('Balance', {
                username: route.params.username,
                charData: chartData,
                products: users,
              })
            }}
          >
            Done
          </Button>
        </Layout>
      </Layout>
    </Layout>
  )
}

export default DashboardComp;

const styles = StyleSheet.create({
  listContainer: {
    minHeight: 350,
    maxHeight: 350,
    backgroundColor: '#fff',
    marginTop: 25,
  },
  text: {
    fontSize: 15,
    color: "#3473AA",
    fontWeight: "bold",
    marginLeft: 10,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    height: '100%',
    width: '100%',
    backgroundColor: '#3473AA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  graph: {
    height: '33%',
    justifyContent: 'center',
    alignSelf: 'center',
    backgroundColor: "#3473AA",
    paddingTop: 80,
  },
  cartText: {
    flexDirection: 'row',
    height: '7%',
    color: "#fff",
    fontSize: 35,
    alignSelf: 'flex-start',
    marginLeft: 20
  },
  itemList: {
    height: '60%',
    width: '100%',
    borderRadius: 30,
  },
  item: {
    flex: 1,
    flexDirection: 'row',
    height: 35,
    width: '100%',
    marginTop: 25,
    marginBottom: 10,
    fontSize: 8,
    borderBottomColor: '#3473AA',
    borderBottomWidth: 2,
  },
  buttonContainer: {
    flex: 1,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  shareButton: {
    width: 100,
    height: 50,
    borderRadius: 100,
    backgroundColor: '#3473AA',
    borderColor: '#3473AA',
  },
  doneButton: {
    width: 100,
    height: 50,
    borderRadius: 100,
    backgroundColor: '#FFBB3D',
    borderColor: '#FFBB3D',
  },
  decButton: {
    width: 20,
    height: 20,
    borderRadius: 20,
    backgroundColor: '#F05E6D',
    borderColor: '#F05E6D',
    marginLeft: 10,
  },
  incButton: {
    width: 10,
    height: 10,
    borderRadius: 20,
    backgroundColor: '#FFBB3D',
    borderColor: '#FFBB3D',
    marginLeft: 10,
  },
  itemContent: {
   flex: 1,
   flexDirection: 'row',
   justifyContent: 'flex-end',
   alignItems: 'center',
   marginBottom: 17,
   marginRight: 25
  }
});