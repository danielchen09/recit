import React, { useState } from 'react';
import { Layout, Button, List, Icon } from '@ui-kitten/components';
import { Alert, StyleSheet, Text } from 'react-native';
import { StackActions } from '@react-navigation/native';
import { head } from 'rambda';

const BalanceComp = ({ navigation, route }) => {
  const popAction = StackActions.pop(1);
  const colors = ["#FFBB3D", "#F05E6D", "#AAD0A1", "#E5E5C6", "#AB84EC", "#55D4F0" ]

  const renderUserItem = ({ item, index }) => {
    return (
      <Layout style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 20,
        marginVertical: 10,
      }}>
        <Text style={{
          fontWeight: 'bold',
          color: '#3473AA',
          fontSize: 15
        }}>
          {item.product}
        </Text>
        <Text style={{
          color: '#3473AA',
          fontSize: 13,
          fontWeight: 'bold'
        }}>
          ${item.price.toFixed(2)}
        </Text>
      </Layout>
    )
  };

  const renderItem = ({ item, index }) => {
    return (
      <Layout style={styles.userCard}>
        <Layout style={{
          backgroundColor: colors[index],
          borderColor: colors[index],
          borderRadius: 100,
          height: 50,
          width: 50,
          alignItems:'center',
          justifyContent: 'center',
        }}>
          <Text style={{
            color: "#fff",
            fontSize: 20,
            fontWeight: 'bold'
          }}>
            {item.x.charAt(0).toUpperCase()}
          </Text>
        </Layout>
        <Text style={{
          marginLeft: 15,
          fontSize: 15,
          fontWeight: 'bold',
          color: "#3473AA"
        }}>
          {item.x.charAt(0).toUpperCase() + item.x.split("\n")[0].slice(1)}
        </Text>
        <Text style={{
          marginLeft: 15,
          fontSize: 15,
          fontWeight: 'bold',
          color: "#3473AA"
        }}>
          ${item.y.toFixed(2)}
        </Text>
      </Layout>
    )
  }

  const filtered = route.params.charData.filter(user => {
    return user.x.split("\n")[0].trim() == route.params.username.trim()
  })

  return (
    <Layout style={styles.container}>
      <Layout style={styles.header}>
        <Button
          onPress={() => {
            navigation.dispatch(popAction);
          }}
          size="large"
          style={styles.prevButton}
          accessoryLeft={<Icon name='arrow-back'/>}
        />
        <Text style={styles.balanceText}>
          Balance
        </Text>
        <Button
          onPress={() => {}}
          disabled
          size="large"
          style={{
            flex: 1,
            borderRadius: 30,
            backgroundColor: 'transparent',
            borderColor: 'transparent',
          }}
        />
      </Layout>

      <Layout style={styles.content}>
        <List
          style={styles.listContainer}
          data={route.params.charData.filter(user => {
            return user.x.split("\n")[0].trim() != route.params.username.trim()
          })}
          renderItem={renderItem}
        />
        <Layout style={styles.personalContainer}>
          <Layout style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginHorizontal: 10,
            marginVertical: 10,
            backgroundColor: 'transparent'
          }}>
            <Layout style={{
              backgroundColor: '#F05E6D',
              borderColor: '#F05E6D',
              borderRadius: 100,
              height: 50,
              width: 50,
              alignItems:'center',
              justifyContent: 'center',
            }}>
              <Text style={{
                color: "#fff",
                fontSize: 20,
                fontWeight: 'bold'
              }}>
                {route.params.username.charAt(0).toUpperCase()}
              </Text>
            </Layout>
            <Text style={{
              marginLeft: 80,
              fontSize: 24,
              color: '#F05E6D',
              fontWeight: 'bold'
            }}>
              {route.params.username.charAt(0).toUpperCase() + route.params.username.slice(1)}
            </Text>
          </Layout>
          <List
            style={styles.productContainer}
            data={route.params.products[route.params.username]}
            renderItem={renderUserItem}
          />
          <Layout style={{
            flexDirection:'row',
            justifyContent: 'flex-end',
            marginVertical: 15,
            marginHorizontal: 10,
          }}>
            <Text style={{
              fontSize: 20,
              fontWeight: 'bold',
              color: "#3473AA"
            }}>
              Total:
              {
                filtered.length == 1 ? ` $${filtered[0].y.toFixed(2)}` : ` $0.00`
              }
            </Text>
          </Layout>
        </Layout>
        <Layout style={{
          flexDirection: 'row',
          justifyContent: 'center',
          backgroundColor: '#3473AA',
          marginTop: 30,
        }}>
          <Button
            onPress={() => {}}
            style={{
              borderRadius: 20,
              width: 300,
              backgroundColor: '#3473AA',
              borderColor: '#fff'
            }}
          >
            Pay
          </Button>
        </Layout>
      </Layout>
    </Layout>
  )
};

export default BalanceComp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent:'flex-start',
  },
  balanceText: {
    fontSize: 25,
    color: "#fff",
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#3473AA',
    paddingTop: 20
  },
  content: {
    flex: 6,
    backgroundColor: '#3473AA'
  },
  prevButton: {
    flex: 1,
    borderRadius: 30,
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
  listContainer: {
    minHeight: 330,
    maxHeight: 330,
    backgroundColor: '#3473AA',
    marginBottom: 10,
  },
  productContainer: {
    minHeight: 100,
    maxHeight: 100,
    backgroundColor: '#fff'
  },
  personalContainer: {
    flexDirection: 'column',
    height: 230,
    width: 330,
    backgroundColor: "#fff",
    borderRadius: 20,
    alignSelf: 'center',
  },
  userCard: {
    flexDirection: 'row',
    marginVertical: 15,
    height: 70,
    borderRadius: 20,
    backgroundColor: '#fff',
    marginHorizontal: 25,
    alignItems: 'center',
    justifyContent: 'space-around'
  }
});