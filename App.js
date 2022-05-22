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
import * as realmSchemas from './schemas';
import sampleSaveData from './sample-save.json';

const objectsToWrite = 100;

class App extends Component {
  state = {};
  realmInstance = {};

  async componentDidMount() {
    try {
      this.realmInstance.parents = await Realm.open({
        schema: [realmSchemas.parentSchema, realmSchemas.childSchema],
        schemaVersion: realmSchemas.parentSchema.schemaVersion,
        path: 'parents.realm',
      });

      this.realmInstance.lightObjects = await Realm.open({
        schema: [realmSchemas.lightObjectSchema],
        schemaVersion: realmSchemas.lightObjectSchema.schemaVersion,
        path: 'lightObject.realm',
      });

      this.realmInstance.save = await Realm.open({
        schema: [realmSchemas.save],
        schemaVersion: realmSchemas.save.schemaVersion,
        path: 'save.realm',
      });
    } catch (error) {
      console.log(error);
    }

    await this.writeData();
  }

  async writeData() {
    let info = {};

    console.log('TCL: App -> writeData -> this.realmInstance.parents.write');
    const startParentTime = global.performance.now();
    this.realmInstance.parents.write(() => {
      for (let i = 0; i < objectsToWrite; i++) {
        let obj = {
          id: `parent${i}`,
          child: {
            id: `child${i}`,
          },
        };
        this.realmInstance.parents.create('parent', obj);
      }
    });
    const endParentTime = global.performance.now();
    info.totalParentWrite = endParentTime - startParentTime;
    info.avgParentWrite = info.totalParentWrite / objectsToWrite;

    console.log(
      'TCL: App -> writeData -> this.realmInstance.lightObjects.write',
    );
    const startLightTime = global.performance.now();
    this.realmInstance.lightObjects.write(() => {
      for (let i = 0; i < objectsToWrite; i++) {
        let obj = {
          id: `lightObject${i}`,
        };
        this.realmInstance.lightObjects.create('lightObject', obj);
      }
    });
    const endLightTime = global.performance.now();
    info.totalLightObjectWrite = endLightTime - startLightTime;
    info.avgLightObjectWrite = info.totalLightObjectWrite / objectsToWrite;

    console.log('TCL: App -> writeData -> this.realmInstance.save.write');
    const startSaveTime = global.performance.now();
    this.realmInstance.save.write(() => {
      for (let i = 0; i < objectsToWrite; i++) {
        let obj = {
          name: `save-${i}`,
          backgroundImage: '123',
          timeSpent: 123,
          timestamp: 123,
          _saveData: JSON.stringify(sampleSaveData),
        };
        this.realmInstance.save.create('Save', obj, 'all');
      }
    });
    const endSaveTime = global.performance.now();
    info.totalSaveObjectWrite = endSaveTime - startSaveTime;
    info.avgSaveObjectWrite = info.totalSaveObjectWrite / objectsToWrite;

    console.log('TCL: App -> writeData -> info', info);
    this.setState({info});
  }

  render() {
    const {info} = this.state;

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
            {!info ? (
              <Text>realm is loading...</Text>
            ) : (
              <View>
                <Text>Wrote {objectsToWrite} objects</Text>
                {Object.entries(info).map(([key, val]) => (
                  <Text key={key}>{`${key} - ${val} ms`}</Text>
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
