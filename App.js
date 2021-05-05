import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { Video, AVPlaybackStatus } from 'expo-av';

export default function App() {

  const video = useRef(null); // Importante mantener siempre una referencia del video.
  const [status, setStatus] = useState({});
  const [urlVideo, setUrlVideo] = useState('');


  /**
   * Obtencion de url del video de VIMEO para ser inyectado en el componente.
   * 
   * Usando el Effect dentro de la inyeccion del componente aprovechamos y buscamos la URL del video.
   * Tambien pueden usar la API de VIMEO si gustan (no se si es posible).
   */
  useEffect(()=>{
    const VIMEO_ID = '545670775'; // EL ID del video en vimeo
    fetch(`https://player.vimeo.com/video/${VIMEO_ID}/config`)
          .then(res => res.json())
          .then(res => {
            const urlVideo = res.request.files.hls.cdns[res.request.files.hls.default_cdn].url

            // Una vez que tenemos la url publica pues ya resta cambiar mi estado para inyectarlo en el componente
            setUrlVideo(() => urlVideo)
          });
  }, [])

  return (
    <View style={styles.container}>
      <Video
        ref={video}
        style={styles.video}
        source={{
          // Esta es la URL directa del video de vimeo.
          uri: urlVideo,
        }}
        useNativeControls
        resizeMode="contain"
        isLooping
        onPlaybackStatusUpdate={status => setStatus(() => status)}
      />
      <Button
        title={status.isPlaying ? 'Pause' : 'Play'}
        onPress={() => {
          if (status.isPlaying) {
            video.current.pauseAsync()
          } else {
            video.current.playAsync()
            // Aqui esta la magia. Una vez teniendo la referencia podemos invocar al FullScreenPlayer directamente.
            video.current.presentFullscreenPlayer()
          }
        }}
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    alignSelf: 'center',
    width: 320,
    height: 200,
  }
});
