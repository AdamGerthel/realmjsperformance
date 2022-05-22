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

export const objectSchema = {
  name: 'sampleObject',
  properties: {
    id: 'string',
  },
};

class App extends Component {
  state = {log: []};
  realmInstance = {};

  async componentDidMount() {
    try {
      this.realmInstance = await Realm.open({
        schema: [objectSchema],
      });

      await this.writeData('Test 1', 1);
      await this.writeData('Test 2', 100);
      await this.writeData('Test 3', 1000);
      await this.writeData('Test 4', 10000);
    } catch (error) {
      console.log(error);
    }
  }

  async writeData(name, quantity) {
    const {realmInstance} = this;

    const start = global.performance.now();
    realmInstance.write(() => {
      for (let i = 0; i < quantity; i++) {
        realmInstance.create('sampleObject', {
          id: `object-${i}`,
        });
      }
    });
    const end = global.performance.now();

    this.setState({
      log: [...this.state.log, {test: name, quantity, time: end - start}],
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
                      logEntry.test
                    }>{`${logEntry.test} (${logEntry.quantity} objects) - ${logEntry.time} ms`}</Text>
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
