import React, {Component} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  StatusBar,
  Text,
  View,
} from 'react-native';
import {Header, Colors} from 'react-native/Libraries/NewAppScreen';
import Realm from 'realm';

const uuid = (): TUuid => {
  let dt = new Date().getTime()

  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (dt + Math.random() * 16) % 16 | 0
    dt = Math.floor(dt / 16)
    return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16)
  })

  return uuid
}

export const simpleObjectSchema = {
  name: 'simpleSampleObject',
  properties: {
    id: 'string',
  },
};

export const complexObjectChildSchema = {
  name: 'complexSampleChildObject',
  properties: {
    childList: 'string[]'
  },
};

export const complexObjectSchema = {
  name: 'complexSampleObject',
  properties: {
    id: 'string',
    list: 'string[]',
    children: `${complexObjectChildSchema.name}[]`
  },
};

class SimpleObject {
  id = uuid()
}

class ComplexObject {
  id = uuid()
  list = Array(1000).fill(uuid())
  children = Array(1000).fill(new ComplexObjectChild())
}

class ComplexObjectChild {
  childList = Array(1000).fill(uuid())
}

class App extends Component {
  state = {log: []};
  realmInstance = {};

  async componentDidMount() {
    try {
      this.realmInstance = await Realm.open({
        schema: [simpleObjectSchema],
      });

      await this.writeData('Test 1', 'simpleSampleObject', 1, new SimpleObject());
      await this.writeData('Test 2', 'simpleSampleObject', 100, new SimpleObject());
      await this.writeData('Test 3', 'simpleSampleObject', 1000, new SimpleObject());
      await this.writeData('Test 4', 'simpleSampleObject', 10000, new SimpleObject());
      await this.writeData('Test 5', 'complexSampleObject', 1, new ComplexObject());
      await this.writeData('Test 5', 'complexSampleObject', 100, new ComplexObject());
      await this.writeData('Test 5', 'complexSampleObject', 1000, new ComplexObject());
      await this.writeData('Test 5', 'complexSampleObject', 10000, new ComplexObject());
    } catch (error) {
      console.log(error);
    }
  }

  async writeData(name, schema, quantity, data = {}) {
    const {realmInstance} = this;

    const start = global.performance.now();

    realmInstance.write(() => {
      for (let i = 0; i < quantity; i++) {
        realmInstance.create(schema, data);
      }
    });

    const end = global.performance.now();

    this.setState({
      log: [...this.state.log, {id: uuid(), schema, quantity, time: end - start}],
    });
  }

  render() {
    const {log} = this.state;

    return (
      <>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <ScrollView
            contentInsetAdjustmentBehavior="automatic"
            style={styles.scrollView}>
            <Header />
          </ScrollView>
          <View style={styles.container}>
            {log.length === 0 ? (
              <Text>realm is loading...</Text>
            ) : (
              <View>
                {log.map(logEntry => (
                  <Text
                    key={
                      logEntry.id
                    }>{`${logEntry.schema} (${logEntry.quantity} objects) - ${logEntry.time.toFixed(4)} ms`}</Text>
                ))}
              </View>
            )}
          </View>
        </SafeAreaView>
      </>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  container: {
    padding: 15,
  },
});

export default App;
