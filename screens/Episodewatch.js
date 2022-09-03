import { View, Text, ActivityIndicator,StyleSheet, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { Video } from 'expo-av';
import * as ScreenOrientation from 'expo-screen-orientation';
import { getAnimeVideoLink } from '../utils/data';
import {Dimensions} from 'react-native';
import themeStyles from "../config/styles";
import Ionicons from '@expo/vector-icons/Ionicons';


const Episodewatch = ({route}) => {
  const [videoUrl, setVideoUrl] = useState('');
  const [Referer, setReferer] = useState('');
  const [animeDetails, setAnimeDetails] = useState([]);
  const [episodeLists, setepisodeList] = useState([]);
  const [videoId, setVideoId] = useState(route.params.id);
  const [videoStatus, setvideoStatus] = useState(true);
  const videoRef = useRef(null);

  function setOrientation() {
    if (Dimensions.get('window').height > Dimensions.get('window').width) {
      //Device is in portrait mode, rotate to landscape mode.
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.LANDSCAPE);
    }
    else {
      //Device is in landscape mode, rotate to portrait mode.
      ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT);
    }
  }

  useEffect(()=>{
    let isCancelled = false;
    async function getVideoUrl(){
      const VideoData = await getAnimeVideoLink(videoId);
      setVideoUrl(VideoData.sources[0].url);
      setReferer(VideoData.headers.Referer);
      setAnimeDetails(route.params.animeDetails)
      setepisodeList(route.params.episodeLists)
      setvideoStatus(false)
    }
    if(!isCancelled){
      getVideoUrl();
    }
    return ()=>{
      isCancelled = true
    }
  }, [videoId, videoStatus])

  function handleEpisode(id)
  {
    setVideoId(id)
    setvideoStatus(true)
  }

  return (
    <View style={{flex: 1}}>
     { videoStatus ?  (
            <View style={styles.contianer}>
                <ActivityIndicator size="large" color={themeStyles.colors.accentColor} />
            </View>
            ) : 
            (
            <>
            <Video
              source={{ uri: videoUrl, headers: {"Referer": Referer,"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:101.0) Gecko/20100101 Firefox/101.0"} }}
              ref={videoRef}
              rate={1.0}
              volume={1.0}
              isMuted={false}
              resizeMode="contain"
              shouldPlay
              onFullscreenUpdate={setOrientation}
              style={{ width: "100%", height: 238 }}
              useNativeControls
              onError={(e)=>{
                console.log(e)
              }}
              />
              <View style={{paddingHorizontal: 10, flex: 1, backgroundColor: "#000"}}>
          
              <View style={{flex: 1, height: 200}}>
                  <FlatList
                    style={{flex: 1}}
                    data={episodeLists}
                    renderItem={({item})=>(
                      <TouchableOpacity style={styles.episodeTitle} onPress={()=> handleEpisode(item.id)}>
                          <Text style={{fontSize: 22, fontFamily: "lob-bold", color: "#fff"}}>{item.number}</Text>
                      </TouchableOpacity>
                    )}
                    keyExtractor={(item)=>item.number}
                    numColumns={4}
                    showsVerticalScrollIndicator={false}
                    ListHeaderComponent={
                    <>
                      <View style={{paddingTop: 20}}>
                        <Text style={{fontFamily: 'pop-bold', color: "#fff",paddingBottom: 5, fontSize: 22, color: themeStyles.colors.accentColor}}>{animeDetails.title}</Text>
                        <Text style={{fontFamily: 'pop-bold', color: "#fff",paddingBottom: 5}}>Description</Text>
                        <Text style={styles.description}>{animeDetails.description}</Text>
                        <Text style={{fontFamily: 'pop-bold', color: "#fff", paddingBottom: 10}}>Geners</Text>
                        <View style={{fontFamily: 'pop-regular', color: "#fff", flexDirection: "row", flexWrap: 'wrap'}}>{(animeDetails.genres?.map((item)=>(
                          <View key={`${item}1`} style={styles.genersContainer}>
                            <Text key={item} style={styles.geners}>{item}</Text>
                          </View>
                        )))}</View>
                        <View style={{flexDirection: 'row', flexWrap: "wrap", marginTop: 10}}>
                          <Text style={{fontFamily: 'pop-bold', color: "#fff", paddingBottom: 10}}>Status:</Text>
                          <Text style={{fontFamily: 'pop-regular', color: themeStyles.colors.accentColor, paddingHorizontal: 10}}>{animeDetails.status}</Text>
                          <Text style={{fontFamily: 'pop-bold', color: "#fff", paddingBottom: 10}}>Release Date:</Text>
                          <Text style={{fontFamily: 'pop-regular', color: themeStyles.colors.accentColor, paddingHorizontal: 10}}>{animeDetails.releaseDate}</Text>
                          <Text style={{fontFamily: 'pop-bold', color: "#fff", paddingBottom: 10}}>Sub Or Dub:</Text>
                          <Text style={{fontFamily: 'pop-regular', color: themeStyles.colors.accentColor, paddingHorizontal: 10}}>{animeDetails.subOrDub.toUpperCase()}</Text>
                          <Text style={{fontFamily: 'pop-bold', color: "#fff", paddingBottom: 10}}>Anime type:</Text>
                          <Text style={{fontFamily: 'pop-regular', color: themeStyles.colors.accentColor, paddingHorizontal: 10}}>{animeDetails.type}</Text>
                        </View>
                      </View>
                      <View style={{flexDirection: "row", alignItems: "center", marginVertical: 10}}>
                          <Ionicons  name="list-outline" size={25} color={themeStyles.colors.accentColor} />
                          <Text style={{
                            fontFamily: "pop-bold",color: "#fff", alignItems: "center",paddingHorizontal: 5, fontSize: 18
                          }}>Episode List</Text>
                      </View>
                    </>
                  }
                  />
              </View>
          </View>
          </>
            )
          }
    </View>
  )
}


const styles = StyleSheet.create({
  contianer:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: "#000"
  },
  description:{
    fontFamily: "pop-regular",
    color: '#fff',
    marginBottom: 10

  },
  genersContainer:{
    justifyContent: "center",
    alignItems: 'center',
    height: 30,
    paddingHorizontal: 8,
    borderRadius: 5,
    backgroundColor: themeStyles.colors.accentColor,
    marginHorizontal: 5,
    marginBottom: 8,
  },
  geners:{
    color: '#000',
    fontFamily: 'pop-medium',
  },
  AnimeTitle: {
    color: "#fff",
    fontSize: 20,
    position: "absolute",
    bottom: 20,
    marginHorizontal: 10,
    width: "60%",
    fontFamily: "pop-medium"
  },
  episodeTitle:{
    borderWidth: 2,
    borderColor: "#fff",
    padding: 3,
    margin: 5,
    width: 90,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
})

export default Episodewatch